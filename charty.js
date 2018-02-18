const maxGasPrice = d3.max(blocks, (block) => block.mean);
const maxPendingTransactions = d3.max(blocks, (block) => block.volume);

var scale =
{
    x: d3.scaleLinear().domain([0, 10]).range([0, 1000]),

    line:
    {
        y: d3.scaleLinear().domain([-maxGasPrice, maxGasPrice * 2]).range([400, 0])
    },

    area:
    {
        y: d3.scaleLinear().domain([-maxPendingTransactions, maxPendingTransactions * 2]).range([400, 0])
    }
};

var lineGenerator = d3.line().curve(d3.curveCatmullRom.alpha(1))
.x(function(d, i) {
    return scale.x(i);
})
.y(function(d) {
    return scale.line.y(d);
});

var areaGenerator = d3.area().curve(d3.curveCatmullRom.alpha(1))
.x(function(d, i) {
    return scale.x(i);
})
.y0(function(d) {
    return scale.area.y(d.low);
})
.y1(function(d) {
    return scale.area.y(d.high);
});

// Loop through buckets
//let buckets = {};

//blocks is from sample data

//single object
//{above,below}
debugger;
let allBuckets = [
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
].map();

let buckets = blocks.map((block)=>{
    let mean = parseFloat(block.mean);
    block.partionedBucket = Object.keys(block.buckets).reduce((acc, bucketName)=>{
        let [min, max] = bucketName.split('-').map((v)=>parseInt(v,10));
        if(min < mean && max < mean){
            acc.below[bucketName] = block.buckets[bucketName];
        }
        else{
            acc.above[bucketName] = block.buckets[bucketName];;
        }
        return acc;
    }, {above:{}, below:{}});
    return block;
});

// console.log(buckets)
// debugger;
// Generate dataset for each unique bucket

// Determine which buckets are above / below the mean
// Apply colors based on that

// Dynamically generate path / group elements

// Math for above the mean
// low = mean * (maxPendingTransactions / maxGasPrice)
// high = low + numberOfTransactions

// Math for below the mean
// high = mean * (maxPendingTransactions / maxGasPrice)
// low = high - numberOfTransactions


// Generate sample buy data
var areaBuy = areaGenerator(blocks.map((block) =>
{
    var thingy = maxPendingTransactions / maxGasPrice;
    return {'low': block.mean * thingy, 'high': block.mean * thingy * 1.2}
}));

var areaBuy2 = areaGenerator(blocks.map((block) =>
{
    var thingy = maxPendingTransactions / maxGasPrice;

    return {'low': block.mean * thingy, 'high': block.mean * thingy * 1.4}
}));

var areaSell = areaGenerator(blocks.map((block) =>
{
    var thingy = maxPendingTransactions / maxGasPrice;
    return {'high': block.mean * thingy, 'low': block.mean * thingy * 0.8}
}));

var areaSell2 = areaGenerator(blocks.map((block) =>
{
    var thingy = maxPendingTransactions / maxGasPrice;
    return {'high': block.mean * thingy, 'low': block.mean * thingy * 0.6}
}));

var line = lineGenerator(blocks.map((block) => block.mean));

d3.select('.buy1').append('path').attr('d', areaBuy);
d3.select('.buy2').append('path').attr('d', areaBuy2);
d3.select('.sell1').append('path').attr('d', areaSell);
d3.select('.sell2').append('path').attr('d', areaSell2);
d3.select('.line').attr('d', line);
