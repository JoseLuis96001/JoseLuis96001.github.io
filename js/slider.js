function createTimeSlider(startDate,endDate) {
    var formatDateIntoYear = d3.timeFormat("%Y");
    var formatDateIntoMonth = d3.timeFormat("%d %b %Y");
    var formatDate = d3.timeFormat("%H:%M:%S");

    //var startDate= minglobal;//new Date("2022-08-26T23:08:54Z"); //new Date("2004-11-01"),
    //var endDate= maxglobal; //new Date("2022-08-30T23:00:00Z"); //new Date("2017-04-01")


    var margin = {top:0, right:30, bottom:0, left:30},
        sliwidth = 373 -margin.left - margin.right,
        sliheight = 150 - margin.top - margin.bottom;

    var svg_sld = d3.select("#slider")
        .append("svg")
        .attr("width", 375) //width + margin.left + margin.right
        .attr("height", sliheight);
        
    var x = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, sliwidth])
        .clamp(true);

    /* var x = d3.scaleTime()//scaleUtc before
        .domain([ d3.timeDay.floor(minglobal) , d3.timeDay.ceil(maxglobal) ])
        .range([30, width ])
        .clamp(true);*/

    var slider = svg_sld.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + sliheight / 2 + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
    .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            //.on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function(event) { moving_radio(x.invert(event.x)); }));

    slider.insert("g", ".track-overlay")
        .attr("class", "tickss")
        .attr("transform", "translate(0," + 18 + ")")
    .selectAll("text")
        .data(x.ticks(10))
        .enter()
        .append("text")
        .attr("x", x)
        .attr("y", 10)
        .attr("text-anchor", "middle")
        //.text(function(d) { return formatDateIntoMonth(d); });

    var label = slider.append("text")  
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", "translate(0," + (-25) + ")");
        //.attr("transform", function(d) {
        //    return "rotate(-65)" 
        //    });;

    var label2 = slider.append("text")  
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .style("font", "10px Arial")
        .text(formatDateIntoMonth(startDate))
        .attr("transform", "translate(0," + (-40) + ")");

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    function moving_radio(h) {
        handle.attr("cx", x(h));
        
        label
        .attr("x", x(h))
        .text(formatDate(h));

        label2
        .attr("x", x(h))
        .text(formatDateIntoMonth(h));
    //svg_sld.style("background-color", d3.hsl(h/1000000, 0.8, 0.8));
    //console.log("h ",h);
        filter_time(h);
};

}