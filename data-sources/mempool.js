// File for getting data from the mempool

const request = require('superagent');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');



module.exports =  function(store){
    console.log('Logging mempool');
    getMempoolData();

    // Update mempool data once a minute
    setInterval(function(){
        getMempoolData();
    }, 60 * 1000);

    //const redis = require("redis");
    //const redisClient = redis.createClient();

    // Buckets that mempool gas prices will be chunked into
    const buckets =
    [
        {'min': 90,  'max': 100},
        {'min': 80,  'max': 90},
        {'min': 70,  'max': 80},
        {'min': 60,  'max': 70},
        {'min': 50,  'max': 60},
        {'min': 40,  'max': 50},
        {'min': 30,  'max': 40},
        {'min': 20,  'max': 30},
        {'min': 10,  'max': 20},
        {'min': 5,   'max': 10},
        {'min': 4,   'max': 5},
        {'min': 3,   'max': 4},
        {'min': 2,   'max': 3},
        {'min': 1,   'max': 2},
        {'min': 0.9, 'max': 1},
        {'min': 0.8, 'max': 0.9},
        {'min': 0.7, 'max': 0.8},
        {'min': 0.6, 'max': 0.7},
        {'min': 0.5, 'max': 0.6},
        {'min': 0.4, 'max': 0.5},
        {'min': 0.3, 'max': 0.4},
        {'min': 0.2, 'max': 0.3},
        {'min': 0.1, 'max': 0.2},
        {'min': 0,   'max': 0.1},
    ];

    function whichBucket(gasPrice)
    {
        for(const bucket of buckets)
        {
            if(gasPrice >= bucket.min && gasPrice <= bucket.max)
            {
                return bucket;
            }
        }

        return false;
    }

    function getMempoolData()
    {
        console.log("[Mempool] Fetching data from Eth Gas Station...");

        request.get('https://ethgasstation.info/').end((error, response) =>
        {
            const $ = cheerio.load(response.text);
            const standardGasPrice = $('.tile_stats_count').eq(1).find('.count').text();

            request.get('https://ethgasstation.info/txPoolReport.php').end((error, response) =>
            {
                const $ = cheerio.load(response.text);
                const blockNumber = $('.x_title span').text();

                cheerioTableparser($);
                const mempool = $(".x_content table").parsetable();
                const stats =
                {
                    'index'   : blockNumber,
                    'mean'    : standardGasPrice,
                    'volume'  : 0,
                    'buckets' : {}
                };

                console.log("[Mempool] Block #" + blockNumber);

                for(var i = mempool[0].length - 1; i > 0; i--)
                {
                    // ETH Gas Station returns the total in the pool at or above specific gradiations, so we have to subtract the total from the current value
                    const priceCount = parseInt(mempool[3][i]) - stats.volume;

                    if(priceCount > 0)
                    {
                        const bucket = whichBucket(mempool[0][i]);
                        stats.buckets[`${bucket.min}-${bucket.max}`] = priceCount;
                        stats.volume += priceCount;
                    }
                }

                store.zadd('MEMPOOL:STATS', stats.index, JSON.stringify(stats), function(err){console.log(err)});
                //console.log(stats);
            });
        });
    }
};
