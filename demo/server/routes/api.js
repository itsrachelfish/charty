var express = require('express');
var router = express.Router();
var redis 
/* GET api crud. */
var store = require('../store.js');
/* GET home page. */
router.get('/price', function(req, res, next) {
    store.zrevrange('GDAX:PRICE', 0, 0, function(err, val){
        console.log(val[0])
        res.status(200).send(val[0]);
    });
});

module.exports = router;
