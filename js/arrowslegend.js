function createarrows() {
var markerBoxWidth = 10,
markerBoxHeight = 10,
refX = markerBoxWidth / 2,
refY = markerBoxHeight / 2,
markerWidth = markerBoxWidth / 2,
markerHeight = markerBoxHeight / 2
arrowPoints = [[0, 0], [0, 10], [10, 5]];


var svg2 = d3.select("#leg").append("svg")
    .attr("width", 300)
    .attr("height", 90);//70
  yleg = 
    // Reply Arrow
    svg2
    .append('defs')
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
    .attr('refX', refX)
    .attr('refY', refY)
    .attr('markerWidth', markerBoxWidth)
    .attr('markerHeight', markerBoxHeight)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', d3.line()(arrowPoints))
    .attr('stroke', 'black');

    var right = svg2.append("line")
    .attr("x1", 100)
    .attr("y1", 30)
    .attr("x2", 130)
    .attr("y2", 30)
    .attr("stroke-width", 4)
    .style("stroke-opacity",stroke_opacity)
    .attr("stroke", rplycolorlink);

    svg2
    .append('path')
    .attr('d', d3.line()([ [100, 30], [130, 30] ]))
    .attr('stroke', rplycolorlink)
    .style("stroke-opacity",stroke_opacity)
    //.attr('marker-start', 'url(#arrow)')
    .attr('marker-end', 'url(#arrow)')
    .attr('fill', 'none');

    svg2.append("text").attr("x", 150).attr("y", 30).text("Reply").style("font-size", "15px").attr("alignment-baseline","middle")
    ////////////////////////////////////
    // Quote Arrow

    svg2
    .append('defs')
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
    .attr('refX', refX)
    .attr('refY', refY)
    .attr('markerWidth', markerBoxWidth)
    .attr('markerHeight', markerBoxHeight)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', d3.line()(arrowPoints))
    .attr('stroke', 'black');

    var right = svg2.append("line")
    .attr("x1", 100)
    .attr("y1", 60)
    .attr("x2", 130)
    .attr("y2", 60)
    .attr("stroke-width", 4)
    .style("stroke-opacity",stroke_opacity)
    .attr("stroke", qtcolorlink);

    svg2
    .append('path')
    .attr('d', d3.line()([ [100, 60], [130, 60] ]))
    .attr('stroke', qtcolorlink)
    .style("stroke-opacity",stroke_opacity)
    //.attr('marker-start', 'url(#arrow)')
    .attr('marker-end', 'url(#arrow)')
    .attr('fill', 'none');

    svg2.append("text").attr("x", 150).attr("y", 60).text("Quote").style("font-size", "15px").attr("alignment-baseline","middle")

    return 2;

  }