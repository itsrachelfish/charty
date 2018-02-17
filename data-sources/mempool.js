// File for getting data from the mempool
const request = require('superagent');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');

request.get('https://ethgasstation.info/txPoolReport.php').end((error, response) =>
{
    const $ = cheerio.load(response.text);
    const blockNumber = $('.x_title span').text();

    cheerioTableparser($);
    const mempool = $(".x_content table").parsetable();
    const stats = [];
    let total = 0;

    console.log("Block #" + blockNumber);

    for(var i = mempool[0].length - 1; i > 0; i--)
    {
        // ETH Gas Station returns the total in the pool at or above specific gradiations, so we have to subtract the total from the current value
        const priceCount = parseInt(mempool[3][i]) - total;

        if(priceCount > 0)
        {
            stats.push({'gasPrice': mempool[0][i], 'count': priceCount});
            total += priceCount;
        }
    }

    console.log({'block': blockNumber, 'totalPending': total, 'mempool': stats});
});
