// BEGIN   addHcolorbar
// create  color bar
function addhcolorbar(selector_id, colorscale) {
    //d3.min(data) , d3.max(data) 
    var legendheight = 80,//200
    legendwidth = 350,
    margin = {top: 5, right: 0, bottom: 10, left: 30};
d3.select('#bar').selectAll('svg').remove();
var canvas = d3.select(selector_id)
  .style("height", legendheight + "px")
  .style("width", legendwidth + "px")
  .style("position", "relative")
  .append("canvas")
  .attr("height", 1)
  .attr("width", legendwidth - margin.left - margin.right)
  .style("height", (legendheight - margin.top - margin.bottom) + "px")
  .style("width", (legendwidth - margin.left - margin.right) + "px")
  //.style("border", "1px solid #000")
  .style("position", "absolute")
  .style("top", (margin.top) + "px")
  .style("left", (margin.left) + "px")
  .node();

var ctx = canvas.getContext("2d");

var legendscale = d3.scaleLinear()
  .range([30, legendwidth])
  .domain(colorscale.domain());

  
var xt = d3.scaleTime()//scaleUtc before
.domain([ d3.timeDay.floor(minglobal) , d3.timeDay.floor(maxglobal) ])
.range([30, legendwidth ])



// image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
var image = ctx.createImageData(legendwidth, 1); //creates a new, blank ImageData object with the specified dimensions. All of the pixels in the new object are transparent black.
/*d3.range(legendheight).forEach(function(i) {
  var c = d3.rgb(colorscale(legendscale.invert(i)));
  image.data[4*i] = c.r;
  image.data[4*i + 1] = c.g;
  image.data[4*i + 2] = c.b;
  image.data[4*i + 3] = 255;
});*/
ctx.putImageData(image, 0, 0); //put back onto the canvas in x y coordinates (0,0) position

// A simpler way to do the above, but possibly slower. keep in mind the legend width is stretched because the width attr of the canvas is 1
// See http://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas

d3.range(legendwidth).forEach(function(i) {
  ctx.fillStyle = colorscale(legendscale.invert(i));
  ctx.fillRect(i,0,1,1);  //(x, y, width, height)
});

const formatTIme = d3.timeFormat("%b %d, %Y" ); //const formatTIme = d3.timeFormat("%B %d, %Y %H:%M"); 
var legendaxis = d3.axisBottom()
  .scale(xt)//legendscale
  .tickSize(6)
  //.tickValues([d3.min(data),d3.max(data)]);
  .ticks(8) //8
  .tickFormat(function(d) { return formatTIme(d);});
  //.tickFormat(function(d) { return d.getFullYear()+"-"+d.getMonth().toString().padStart(2,"0"); });
  //.tickFormat(function(d) { return d.getFullYear()+"-"+(d.getMonth()+1).toString().padStart(2,"0")+"-"+d.getDate().toString().padStart(2,"0")+" "+d.getHours().toString().padStart(2,"0")+":"+d.getMinutes().toString().padStart(2,"0")+":"+d.getSeconds().toString().padStart(2,"0"); });

var svg = d3.select(selector_id)
  .append("svg")
  .attr("height", (150) + "px")
  .attr("width", (legendwidth+50) + "px")//legendwidth
  .style("position", "absolute")
  .style("left", "0px")
  .style("top", "0px");

svg
  .append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + 0 + "," + (legendheight+3) + ")")//(legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
  .call(legendaxis)
  .selectAll("text")	
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", function(d) {
      return "rotate(-65)" 
      });;
};// END addhcolorbar


/////////////////////////////////////////////////////////////////////////////

// BEGIN   addcolorbar
// create  color bar
function addcolorbar(selector_id, colorscale) {
    //d3.min(data) , d3.max(data) 
    var legendheight = 300,//200
          legendwidth = 80,
          margin = {top: 10, right: 60, bottom: 10, left: 2};
      d3.select('#bar').selectAll('svg').remove();
      var canvas = d3.select(selector_id)
        .style("height", legendheight + "px")
        .style("width", legendwidth + "px")
        .style("position", "relative")
        .append("canvas")
        .attr("height", legendheight - margin.top - margin.bottom)
        .attr("width", 1)
        .style("height", (legendheight - margin.top - margin.bottom) + "px")
        .style("width", (legendwidth - margin.left - margin.right) + "px")
        //.style("border", "1px solid #000")
        .style("position", "absolute")
        .style("top", (margin.top) + "px")
        .style("left", (margin.left) + "px")
        .node();
    
      var ctx = canvas.getContext("2d");
    
      var legendscale = d3.scaleLinear()
        .range([1, legendheight - margin.top - margin.bottom])
        .domain(colorscale.domain());
  
        
      var xt = d3.scaleTime()//scaleUtc
      .domain([ d3.timeDay.floor(minglobal) , d3.timeDay.floor(maxglobal) ])
      .range([1, legendheight - margin.top - margin.bottom])
  
      
    
      // image data hackery based on http://bl.ocks.org/mbostock/048d21cf747371b11884f75ad896e5a5
      var image = ctx.createImageData(1, legendheight); //creates a new, blank ImageData object with the specified dimensions. All of the pixels in the new object are transparent black.
      /*d3.range(legendheight).forEach(function(i) {
        var c = d3.rgb(colorscale(legendscale.invert(i)));
        image.data[4*i] = c.r;
        image.data[4*i + 1] = c.g;
        image.data[4*i + 2] = c.b;
        image.data[4*i + 3] = 255;
      });*/
      ctx.putImageData(image, 0, 0); //put back onto the canvas in x y coordinates (0,0) position
    
      // A simpler way to do the above, but possibly slower. keep in mind the legend width is stretched because the width attr of the canvas is 1
      // See http://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas
      
      d3.range(legendheight).forEach(function(i) {
        ctx.fillStyle = colorscale(legendscale.invert(i));
        ctx.fillRect(0,i,1,1);  //(x, y, width, height)
      });
      
      const formatTIme = d3.timeFormat("%B %d, %Y %H:%M"); 
      var legendaxis = d3.axisRight()
        .scale(xt)//legendscale
        .tickSize(6)
        //.tickValues([d3.min(data),d3.max(data)]);
        .ticks(8) //8
        .tickFormat(function(d) { return formatTIme(d);});
        //.tickFormat(function(d) { return d.getFullYear()+"-"+d.getMonth().toString().padStart(2,"0"); });
        //.tickFormat(function(d) { return d.getFullYear()+"-"+(d.getMonth()+1).toString().padStart(2,"0")+"-"+d.getDate().toString().padStart(2,"0")+" "+d.getHours().toString().padStart(2,"0")+":"+d.getMinutes().toString().padStart(2,"0")+":"+d.getSeconds().toString().padStart(2,"0"); });
  
      var svg = d3.select(selector_id)
        .append("svg")
        .attr("height", (legendheight) + "px")
        .attr("width", (150) + "px")//legendwidth
        .style("position", "absolute")
        .style("left", "0px")
        .style("top", "0px");
    
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (legendwidth - margin.left - margin.right + 3) + "," + (margin.top) + ")")
        .call(legendaxis);
    };// END addcolorbar