const Gdax  = require('gdax');

/*
Keys ():
- GDAX:PRICE
 Sorted set scored by timestamp. Value is ETH-USD
- GDAX:DEPTH
 Sorted set scored by timestamp. Value is JSON depth object

 */
function init(store){
    console.log('starting');
    const publicClient = new Gdax.PublicClient();

    let price   = null;
    let buckets = null;
    let totalAvailable = null;
    pollPrices();
    pollDepth();

    setInterval(()=>{
        if(price !== null && buckets!==null&& totalAvailable!==null){
            const now=Date.now();
            store.multi([
                ['ZADD', 'GDAX:PRICE', now, price],
                ['ZADD', 'GDAX:DEPTH', now, JSON.stringify(buckets)],
                ['ZADD', 'GDAX:STATS', now, JSON.stringify({
                    index: now,
                    mean: price,
                    volume: totalAvailable,
                    buckets
                })]
            ]).exec();
            //console.log({
            //    date: Date.now(),
            //    buckets
            //});
        }
    }, 1000);

    function pollPrices(){
        let startTime = Date.now();
        publicClient.getProductTicker('ETH-USD', function(err, res, data){
            if(data && data.price){
                //if(parseFloat(data.price)!==price)console.log(data.price);
                price = parseFloat(data.price);
                store.zadd('GDAX:PRICE', Date.now(), price);
            }
            let done = Date.now();
            let elapsed = done - startTime;
            let waitTime = 1000 - elapsed;
            if(waitTime > 0){
                //console.log('waiting...', waitTime);
                setTimeout(pollPrices, waitTime);
            }
            else{
                pollPrices();
            }
        });
    }


    function pollDepth(){
        if(price === undefined){
            return setTimeout(()=>{
                pollDepth();
            }, 500);
        }
        let startTime = Date.now();
        publicClient.getProductOrderBook('ETH-USD', { level: 2 }, (err, res, data={bids:[], asks:[]})=>{
            const {bids, asks} = data;
            const min=parseFloat(bids[bids.length-1]);
            const max=parseFloat(asks[asks.length-1]);
            const newBuckets = {};
            let newAvailable = 0;
            for(let cv=min;cv<=max+.1;cv+=.1){
                let bucketPrice=Math.floor(cv*10)/10;
                let bucketName = `${(bucketPrice).toFixed(2)}-${(bucketPrice+0.1).toFixed(2)}`;
                newBuckets[bucketName] = 0;
            }
            //console.log(min, max, newBuckets);
            
            [...bids, ...asks].map((order)=>{
                let [order_price, amount, orders] = order;
                order_price = parseFloat(order_price);
                amount = parseFloat(amount);

                if(order_price>price){
                    let bucketPrice=Math.floor(order_price * 10)/10;
                    let bucketName = `${bucketPrice.toFixed(2)}-${(bucketPrice+0.1).toFixed(2)}`;
                    if(newBuckets[bucketName]===undefined){
                        console.error(`${bucketName}, missing?`,min, max);
                        newBuckets[bucketName]=0;
                    }
                    //newBuckets[bucketName]=newBuckets[bucketName]||0;
                    newBuckets[bucketName]+= amount;
                    newAvailable+=amount;
                } else {
                    let bucketPrice = Math.ceil(order_price*10)/10;
                    let bucketName  = `${bucketPrice.toFixed(2)}-${(bucketPrice+0.1).toFixed(2)}`;
                    //newBuckets[bucketName]=newBuckets[bucketName]||0;
                    if(newBuckets[bucketName]===undefined){
                        console.error(`${bucketName} , missing`, newBuckets);
                        newBuckets[bucketName]=0;
                    }

                    newBuckets[bucketName]+= amount;
                    newAvailable+=amount;
                }
            });
            buckets        = newBuckets;
            totalAvailable = newAvailable;
            let done = Date.now();
            let elapsed = done - startTime;
            let waitTime = 1000 - elapsed;
            if(waitTime > 0){
                setTimeout(pollDepth, waitTime);
            }
            else{
                pollDepth();
            }


        });
    }

}


module.exports = init;














