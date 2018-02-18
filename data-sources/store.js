const redis = require('redis');

const dbConfig =  {
    port : process.env.REDIS_PORT || 6379,
    host : process.env.REDIS_HOST || 'localhost',
    db   : process.env.DB         || 3
};

const db = redis.createClient(dbConfig);

db.on("error", function (error){
    console.log("[Redis] Error: ", error);
});

/*redisClient.select(1, function()
                   {
    getMempoolData();

    // Update mempool data once a minute
    setInterval(function()
                {
        getMempoolData();
    }, 60 * 1000);
});

*/
module.exports = db;
