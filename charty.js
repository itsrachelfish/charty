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
/*
[
    { index: '5111256',
      mean: '1',
      volume: 1816,
      buckets:
       { '90-100': 2,
         '20-30': 3,
         '10-20': 1,
         '4-5': 2,
         '3-4': 3,
         '2-3': 9,
         '1-2': 22,
         '0.6-0.7': 2,
         '0.5-0.6': 173,
         '0.4-0.5': 11,
         '0.3-0.4': 287,
         '0.2-0.3': 274,
         '0.1-0.2': 835,
         '0-0.1': 192 } },
    { index: '5111262',
      mean: '1',
      volume: 1731,
      buckets:
       { '50-60': 1,
         '30-40': 3,
         '20-30': 1,
         '10-20': 1,
         '4-5': 1,
         '3-4': 5,
         '2-3': 9,
         '1-2': 36,
         '0.6-0.7': 2,
         '0.5-0.6': 173,
         '0.4-0.5': 11,
         '0.3-0.4': 286,
         '0.2-0.3': 274,
         '0.1-0.2': 835,
         '0-0.1': 93 } }
 ]

 "{
 "above": {
 "90-100": [],
 "80-90": [],
 "70-80": [],
 "60-70": [],
 "50-60": [],
 "40-50": [],
 "30-40": [],
 "20-30": [],
 "10-20": [],
 "5-10": [],
 "4-5": [],
 "3-4": [],
 "2-3": [],
 "1-2": [],
 "0.9-1": [],
 "0.8-0.9": [],
 "0.7-0.8": [],
 "0.6-0.7": [],
 "0.5-0.6": [],
 "0.4-0.5": [],
 "0.3-0.4": [],
 "0.2-0.3": [],
 "0.1-0.2": [],
 "0-0.1": []
 },
 "below": {
 "90-100": [],
 "80-90": [],
 "70-80": [],
 "60-70": [],
 "50-60": [],
 "40-50": [],
 "30-40": [],
 "20-30": [],
 "10-20": [],
 "5-10": [],
 "4-5": [],
 "3-4": [],
 "2-3": [],
 "1-2": [],
 "0.9-1": [],
 "0.8-0.9": [],
 "0.7-0.8": [],
 "0.6-0.7": [],
 "0.5-0.6": [],
 "0.4-0.5": [],
 "0.3-0.4": [],
 "0.2-0.3": [],
 "0.1-0.2": [], 
 "0-0.1": []
 }
 }"
 */

let buckets = [
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
].reduce((acc, bucket)=>{
    let bucketName = `${bucket.min}-${bucket.max}`;
    acc.above[bucketName] = [];
    acc.below[bucketName] = [];
    return  acc;
}, {
    above:{},
    below:{}
});


let blocks = [
    { index: '5111256',
      mean: '1',
      volume: 1816,
      buckets:
      { '90-100': 2,
        '20-30': 3,
        '10-20': 1,
        '4-5': 2,
        '3-4': 3,
        '2-3': 9,
        '1-2': 22,
        '0.6-0.7': 2,
        '0.5-0.6': 173,
        '0.4-0.5': 11,
        '0.3-0.4': 287,
        '0.2-0.3': 274,
        '0.1-0.2': 835,
        '0-0.1': 192 } },
    { index: '5111262',
      mean: '1',
      volume: 1731,
      buckets:
      { '50-60': 1,
        '30-40': 3,
        '20-30': 1,
        '10-20': 1,
        '4-5': 1,
        '3-4': 5,
        '2-3': 9,
        '1-2': 36,
        '0.6-0.7': 2,
        '0.5-0.6': 173,
        '0.4-0.5': 11,
        '0.3-0.4': 286,
        '0.2-0.3': 274,
        '0.1-0.2': 835,
        '0-0.1': 93 } },
    { index: '5111269',
      mean: '3',
      volume: 1792,
      buckets:
      { '90-100': 2,
        '40-50': 1,
        '30-40': 3,
        '20-30': 7,
        '10-20': 2,
        '4-5': 1,
        '3-4': 18,
        '2-3': 5,
        '1-2': 16,
        '0.6-0.7': 2,
        '0.5-0.6': 173,
        '0.4-0.5': 11,
        '0.3-0.4': 285,
        '0.2-0.3': 273,
        '0.1-0.2': 832,
        '0-0.1': 161 } },
    { index: '5111270',
      mean: '3',
      volume: 1931,
      buckets:
      { '90-100': 6,
        '70-80': 1,
        '60-70': 1,
        '50-60': 4,
        '40-50': 3,
        '30-40': 40,
        '20-30': 22,
        '10-20': 8,
        '5-10': 1,
        '4-5': 3,
        '3-4': 21,
        '2-3': 11,
        '1-2': 38,
        '0.6-0.7': 3,
        '0.5-0.6': 173,
        '0.4-0.5': 11,
        '0.3-0.4': 285,
        '0.2-0.3': 273,
        '0.1-0.2': 832,
        '0-0.1': 165 } },
    { index: '5111282',
      mean: '1',
      volume: 1831,
      buckets:
      { '50-60': 2,
        '40-50': 1,
        '20-30': 1,
        '10-20': 1,
        '4-5': 1,
        '3-4': 17,
        '2-3': 6,
        '1-2': 13,
        '0.6-0.7': 3,
        '0.5-0.6': 173,
        '0.4-0.5': 11,
        '0.3-0.4': 285,
        '0.2-0.3': 273,
        '0.1-0.2': 832,
        '0-0.1': 211 } },
    { index: '5111297',
      mean: '3',
      volume: 1533,
      buckets:
      { '30-40': 1,
        '20-30': 2,
        '10-20': 1,
        '4-5': 1,
        '3-4': 9,
        '2-3': 5,
        '1-2': 22,
        '0.6-0.7': 2,
        '0.5-0.6': 165,
        '0.4-0.5': 11,
        '0.3-0.4': 280,
        '0.2-0.3': 366,
        '0.1-0.2': 495,
        '0-0.1': 172 } },
    { index: '5111300',
      mean: '1',
      volume: 1628,
      buckets:
      { '90-100': 3,
        '50-60': 1,
        '40-50': 3,
        '30-40': 20,
        '20-30': 20,
        '10-20': 2,
        '5-10': 2,
        '4-5': 6,
        '3-4': 10,
        '2-3': 6,
        '1-2': 21,
        '0.6-0.7': 2,
        '0.5-0.6': 165,
        '0.4-0.5': 11,
        '0.3-0.4': 280,
        '0.2-0.3': 366,
        '0.1-0.2': 495,
        '0-0.1': 192 } },
    { index: '5111304',
      mean: '1',
      volume: 1633,
      buckets:
      { '20-30': 3,
        '10-20': 1,
        '4-5': 1,
        '3-4': 44,
        '2-3': 8,
        '1-2': 29,
        '0.6-0.7': 2,
        '0.5-0.6': 165,
        '0.4-0.5': 11,
        '0.3-0.4': 280,
        '0.2-0.3': 366,
        '0.1-0.2': 495,
        '0-0.1': 228 } },
    { index: '5111308',
      mean: '2',
      volume: 1760,
      buckets:
      { '90-100': 12,
        '60-70': 1,
        '50-60': 6,
        '40-50': 2,
        '30-40': 9,
        '20-30': 21,
        '10-20': 2,
        '5-10': 5,
        '4-5': 4,
        '3-4': 47,
        '2-3': 12,
        '1-2': 41,
        '0.6-0.7': 2,
        '0.5-0.6': 165,
        '0.4-0.5': 11,
        '0.3-0.4': 280,
        '0.2-0.3': 366,
        '0.1-0.2': 496,
        '0-0.1': 243 } },
    { index: '5111311',
      mean: '2',
      volume: 1706,
      buckets:
      { '40-50': 1,
        '30-40': 1,
        '20-30': 3,
        '10-20': 1,
        '5-10': 2,
        '4-5': 1,
        '3-4': 43,
        '2-3': 6,
        '1-2': 50,
        '0.6-0.7': 2,
        '0.5-0.6': 165,
        '0.4-0.5': 11,
        '0.3-0.4': 280,
        '0.2-0.3': 366,
        '0.1-0.2': 506,
        '0-0.1': 261 } }
];

blocks.forEach((block)=>{
    let currentBucket;
    let bucketRange = (key)=> key.split('-').map((v)=>parseInt(v,10));
    let mean = parseFloat(block.mean);
    for(currentBucket in buckets.below){
        let [min , max] = bucketRange(currentBucket);
        if(block.buckets[currentBucket] !== undefined && mean >= max){
            buckets.below[currentBucket].push(block.buckets[currentBucket]);
        } else{
            buckets.below[currentBucket].push(null);
        }
    }
    for(currentBucket in buckets.above){
        let [min , max] = bucketRange(currentBucket);
        if(block.buckets[currentBucket] !== undefined && mean < min){
            buckets.above[currentBucket].push(block.buckets[currentBucket]);
        } else {
            buckets.above[currentBucket].push(null);
        }
    }
    return block;
});


//in: [{block},{block}]
//out:[[above],[below]]


/*
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
 */

// console.log(buckets)
// debugger;
// Generate dataset for each unique bucket

// Determine which buckets are above / below the mean
// Apply colors based on that

// Dynamically generate path / group elements


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
