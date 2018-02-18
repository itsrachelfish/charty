const d3=require('d3');
class SmoothChart{
    constructor(elem, opts={}){

        if(typeof elem === 'string'){
            elem  = document.querySelector(elem);
        }
        if(!elem){
            return new Error('unable to create chart: No element found');
        }

        opts = Object.assign({
            width     : elem.width,
            height    : elem.height,
            ticks     : 40,
            className : 'smoothchart',
            interval:1000
        }, opts);


        //create a dom element for the svg
        const svg = d3.select(elem).select(function() {
            const _svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            _svg.setAttribute('class', opts.className);
            return this.appendChild(_svg);
        }).attr("width", opts.width)
          .attr("height", opts.height);

        const margin = {top: 20, right: 20, bottom: 20, left: 40};
        const width  = +svg.attr("width") - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;
        const g      = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var random = d3.randomNormal(.5, .2),
            data = d3.range(opts.ticks).map(random);


        const xScale = d3.scaleLinear()
                  .domain([1, opts.ticks - 2])
                  .range([0, width]);

        const yScale = d3.scaleLinear()
                  .domain([0, 1])
                  .range([height, 0]);

        const line = d3.area()
                  .curve(d3.curveBasis)
                  .x(function(d, i) { return xScale(i); })
                  .y1(function(d, i) { return yScale(d); })
                  .y0(function(d, i) { return height; });

        //clipping mask around the path
        const  clippingMask = g
                  .append("defs")
                  .append("clipPath")
                  .attr("id", "clip")
                  .append("rect")
                  .attr("width", width)
                  .attr("height", height);
            
        //draw the x axis
        const xAxis = g
                  .append("g")
                  .attr("class", "axis axis--x")
                  .attr("transform", "translate(0," + yScale(0) + ")")
                  .call(d3.axisBottom(xScale));

        //draw the y axis
        const yAxis = g
                  .append("g")
                  .attr("class", "axis axis--y")
                  .call(d3.axisLeft(yScale));


        let path = g
                .append("g")
                .attr("clip-path", "url(#clip)")
                .append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line);

        add();
//            path.transition()
//            .duration(1000)
//            .ease(d3.easeLinear)
//            .on("start", tick);

        //this.tick = tick.bind(g.select('g path.line').node());

        function tick() {
            

            yScale.domain([d3.min(data), d3.max(data)]);

            d3.select(this)
                .attr("d", line)
                .attr("transform", null);

            // Slide it to the left.
            d3.active(this)
                .attr("transform", "translate(" + xScale(0) + ",0)");

            yAxis
               .call(d3.axisLeft(yScale));


            // Pop the old data point off the front.
            

        }

        function add(point){
            let change = random()-.5;
            let newVal=data[data.length-1] + change;
            //console.log(newVal)
            if(point===undefined){
                point=newVal;
            }

            data.push(point);
            console.log(data)
            path
                .transition()
                .duration(opts.interval)
                .ease(d3.easeLinear)
                .on("start", tick);
            data.shift();
        }

        this.add=add;
        return null;
        //return console.log(opts);

    }
    
}

module.exports = SmoothChart;
