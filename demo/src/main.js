const request     = require('superagent');
const SmoothChart = require('./smooth.js');

const smoothChart = new SmoothChart('#demo', {
    "width"  : 1200,
    "height" : 300,
    "ticks"  : 40,
    "interval":1000
});


setInterval(function(){
    request
        .get('/api/price')
        .then(function(res) {
            if(res.status=200){
                let price = parseFloat(res.text)
                smoothChart.add(price);
            }
            // res.body, res.headers, res.status
        })
        .catch(function(err) {
            // err.message, err.response
        });
},1000);
