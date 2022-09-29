/////// READING THE JSON FILE
//Lasso_1562457217806528514_nolimpio.json
//
d3.json("LASSO_1563573550027460608_nolimpio.json").then(function(graph){

    var nodeByID = {};
  
    graph.nodes.forEach(function(n) {
        nodeByID[n.id] = n;//saves in a dictionary id of nodes containing the node
        //n.filtered = false; 
        n.time = new Date(n.time);
        dataArray.push(n.time);
    });
  
    
     // to save the times on links
    c=0;
    graph.links.forEach(function(l) {
        l.id = c;
        c = c+1;
        l.time =  new Date(nodeByID[l.target].time);// the time is added to the link to use this with the time filter radius slider
        //l.sourceId = nodeByID[l.source].id;//.toString();//in each link is adding the surce and target level
        //l.targetId = nodeByID[l.target].id;//.toString();
        //l.filtered = false;
    });


    //////FOR time filtering
  
//    nodos.forEach( (ob) => { //era links
//        ob.time = new Date(ob.time); // saving the dates in a date format 
//
//            dataArray.push(ob.time);
//
//    });

    ///////////////////////////////////////////////////////////
    minglobal = d3.min(dataArray);
    maxglobal = d3.max(dataArray); 
    console.log(minglobal);
    console.log(maxglobal);
  
    
    // Store keeps all  nodes and links
    grafo = $.extend(true, {}, graph); //OJO ************************************************************************
    
    nodos=[...grafo.nodes];
    enlaces=[...grafo.links];

    
    //store = $.extend(true, {}, graph); // store its a copy of graph
    
    // This is the update function (and create graph plot)
    //update();
  
 
    
      // two different ways TO create scales for node colors
      ramp = d3.scaleLinear().domain([minglobal,maxglobal]).range([highColor,lowColor]); // invertido el color de los nodos
      // var colorScale2 = d3.scaleSequential(d3.interpolateViridis).domain([minVal,maxVal]);
      //var colorScale2 = d3.scaleSequential([highColor,lowColor]).domain([minVal,maxVal]);
      addhcolorbar("#bar", ramp); //
      //addcolorbar("#bar", timescale);
      //////////////////////////////////////////////////////////
      
      createarrows();
      createTimeSlider(minglobal,maxglobal);
      //the lines below were used in the first version of time filter
      /*times = d3.scaleTime()
      .domain([minVal, maxVal])
      .ticks(1000)
      .filter(time => nodos.some(d => contains(d, time))); // creating a scale with 1000 ticks containng  the times of the dataset
  */
 return 1;
     // doUpdate(); // this is for the radius slicer  and create the filter
  });//.then(r=>createarrows()).then(r=>createTimeSlider());//.then(createTimeSlider());
 /////// END READING THE JSON FILE

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");



var g = svg.append("g");
    //.attr("class", "everything"); /// no uso al parecer

var link = g.append("g").selectAll(".line"),
    node = g.append("g").selectAll(".circle");


var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-30))//-30 is the default

    //.force("x", d3.forceX())// no expansion  in disjoint graphs
    //.force("y", d3.forceY())// no expansion
    //.on("tick", ticked)//  // esto le quito
    .force("center", d3.forceCenter(width / 2, height / 2)); //con este se centra y todos los nodos se ex[anden]
    //.force('collide',d3.forceCollide().radius(30).iterations(2));;


/////////add zoom capabilities 
    var zoom_handler = d3.zoom()
        .scaleExtent([min_zoom,max_zoom])
        .on("zoom", zoom_actions); // zoom_actions updateChart

    zoom_handler(svg); 

    //Zoom functions 
    /*function zoom_actions(e){
        g.attr("transform", e.transform)
    };*/

    function zoom_actions({transform}){
        g.attr("transform", transform)
        
        scaleFactor = transform.k;
        translation = [transform.x,transform.y];
        
        ticked();
        
    };


//
let i = 0;
//OJO AL PARECER TENGO REPETIDOS VARIOS ENLACES
////////// BEGIN DO UPDATE
//function doUpdate() {
//  
//  if (i >= times.length) {
//    i = 0;
//  }
//  
//  filter_time(times[i++]); // times is an array so with i i will navegate within these values
//  //setTimeout(doUpdate, 100);//500 this is to run the function every so often (MAYBE useful for the play button)
//}
////////// END DO UPDATE

//For time filtering
////////// BEGIN contains function
contains = (d, timeslider) => d.time <= timeslider; // returns true if the time of a element is <= that the time in array times
////////// END contains function


////////// BEGIN FILTER
function filter_time(timeslider) {
    
    nodos = grafo.nodes.filter((d) => contains(d, timeslider));
    enlaces = grafo.links.filter((d) => contains(d, timeslider));
    //nodos  
    //enlaces
   
    // filtering the do an update
    update();
  }
////////// END FILTER



/////////////// BEGIN UPDATE
function update() {
 
    //	UPDATE
	node = node.data(nodos, function(d) { return d.id;});
    link = link.data(enlaces,function(e) { return e.id;}); //, function(d) { return d.id;});

    //	EXIT
	node.exit().remove();
    link.exit().remove();
    
    //	ENTER
    var newNode = node.enter().append("circle")
    .attr("class", "nodes")
    .attr("r",  forceProperties.collide.radius)//radius 5 radiusnode
    .attr("fill", nodeColour)
    .style("stroke","black")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
    )//HERE for highlight
    .on("mouseenter", (evt, d) => {fade(0.1,d);})
    .on("mouseleave",(evt, d) => {fade(1,d);});
      
      svg.append("defs").append("marker")//arrow
      .join("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 19)
      .attr("refY", 0)
      .attr("markerWidth", 2)
      .attr("markerHeight", 2)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", 'black') //color
      .attr("d", 'M0,-5L10,0L0,5');


   var newLink = link.enter().append("line")
		.attr("class", "links")
        .attr("stroke-width", function(d) { return 2.5; })
        .style("stroke", d => linkColour(d.type_tw))
        .style("stroke-opacity",stroke_opacity)
        .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);//arrow  d => `url(${new URL(`#arrow-${d.type}`, location)})`)
        // ojo ese {d.type}

	//	ENTER + UPDATE
	node = node.merge(newNode);
    link = link.merge(newLink);

    //	Titles in objects   
    node.append("title")
    .text(function(d) { return "id: " + d.id + "\n" + "name: " + d.name + "\n" + "username: " + d.username + "\n" + "date: " + d.time + "\n" + "text: " + d.text; });
    // .text('<b>hola</b>');

    link.append("title")
    .text(function(d) { return "source: " + d.source + "\n" + "target: " + d.target + "\n" + "type: " + d.type_tw + "\n"});
    ///////////////////////////////////////////////////////////////
    //	update simulation nodes, links, and alpha

    //nodoscp = [...nodos];
    //enlacescp = [...enlaces];

    simulation
    .nodes(nodos) // grafo.nodes //nodos //con grafo.nodos conservan la posicion como si tuviera ya el grafo completo --ojo que con eso tambien debo poner.id en source y target
    .on("tick", ticked);  //con nodos nuevamente van apareciendo como de la nada

    simulation.force("link") 
    .links(enlaces); // grafo.links  //enlaces

    simulation.alpha(1).alphaTarget(0).restart();
    ////////////////////////////////////////////////////////
//aqui antes node color
/////////////////////////////////////////////////////////////////
/// antes lo de zoom estuvo aqui

///antes lo del fade y get neig estuvo aqui

/////////////////////////////////////////////////////


   /* function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    };*/

} 
  /////////////// END UPDATE

function linkColour(type_tw){
    if(type_tw == "quoted"){//chaned from quoted_id
        return (qtcolorlink);  
    }   else {
        return (rplycolorlink); 
    } 
}

function nodeColour(d){
    return (ramp(d.time)); 
}


function getNeighbors(node) {
    return enlaces.reduce(function (neighbors, link) {
        if (link.target.id === node.id) {
          neighbors.push(link.source.id)
        } else if (link.source.id === node.id) {
          neighbors.push(link.target.id)
        }
        return neighbors
      },
      [node.id]
    )
  }

  function fade(opacity,d) {

    var neigs = getNeighbors(d);
   
    node.style('stroke-opacity', function (o) {
      
      const thisOpacity = neigs.includes(o.id) ? 1 : opacity;
      this.setAttribute('fill-opacity', thisOpacity);
      return thisOpacity;})
    link.style('stroke-opacity', o => (o.source.id === d.id || o.target.id === d.id ? 1 : opacity));
  }

function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    
function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
}
    
function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
}

 /*function ticked() { //ORIGINAL
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
} //esto le quito redunda
*/
function ticked() { //no sale al abrir a aplicacions
    link
        .attr("x1", function(d) { return translation[0] + scaleFactor*d.source.x; })
        .attr("y1", function(d) { return translation[1] + scaleFactor*d.source.y; })
        .attr("x2", function(d) { return translation[0] + scaleFactor*d.target.x; })
        .attr("y2", function(d) { return translation[1] + scaleFactor*d.target.y; });

    node
        .attr("cx", function(d) { return translation[0] + scaleFactor*d.x; })
        .attr("cy", function(d) { return translation[1] + scaleFactor*d.y; });
}

// BEGIN RESTORE
function restore() {
    nodos = [...grafo.nodes];
    enlaces = [...grafo.links];
    
} // END RESTORE




/////////////// BEGIN COMPLETE
function complete() {
 
    //	UPDATE
	node = node.data(grafo.nodes, function(d) { return d.id;});
    link = link.data(grafo.links,function(e) { return e.id;}); //, function(d) { return d.id;});

    //	EXIT
	node.exit().remove();
    link.exit().remove();
    
    //	ENTER
    var newNode = node.enter().append("circle")
    .attr("class", "nodes")
    .attr("r",  forceProperties.collide.radius)//radius 5 radiusnode
    .attr("fill", nodeColour)
    .style("stroke","black")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
    )//HERE for highlight
    .on("mouseenter", (evt, d) => {fade(0.1,d);})
    .on("mouseleave",(evt, d) => {fade(1,d);});
      
      svg.append("defs").append("marker")//arrow
      .join("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 19)
      .attr("refY", 0)
      .attr("markerWidth", 2)
      .attr("markerHeight", 2)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", 'black') //color
      .attr("d", 'M0,-5L10,0L0,5');


   var newLink = link.enter().append("line")
		.attr("class", "links")
        .attr("stroke-width", function(d) { return 2.5; })
        .style("stroke", d => linkColour(d.type_tw))
        .style("stroke-opacity",stroke_opacity)
        .attr("marker-end", d => `url(${new URL(`#arrow-${d.type}`, location)})`);//arrow  d => `url(${new URL(`#arrow-${d.type}`, location)})`)
        // ojo ese {d.type}

        
    
	//	ENTER + UPDATE
	node = node.merge(newNode);
    link = link.merge(newLink);

    //	Titles in objects   
    node.append("title")
    .text(function(d) { return "id: " + d.id + "\n" + "name: " + d.name + "\n" + "username: " + d.username + "\n" + "date: " + d.time + "\n" + "text: " + d.text; });
    // .text('<b>hola</b>');

    link.append("title")
    .text(function(d) { return "source: " + d.source + "\n" + "target: " + d.target + "\n" + "type: " + d.type_tw + "\n" + "graph_id: " + d.graphid; });
    ///////////////////////////////////////////////////////////////
    //	update simulation nodes, links, and alpha

    //nodoscp = [...nodos];
    //enlacescp = [...enlaces];

    simulation
    .nodes(grafo.nodes) // grafo.nodes //nodos //con grafo.nodos conservan la posicion como si tuviera ya el grafo completo --ojo que con eso tambien debo poner.id en source y target
    .on("tick", ticked);  //con nodos nuevamente van apareciendo como de la nada

    simulation.force("link") 
    .links(grafo.links ); // grafo.links  //enlaces

    simulation.alpha(1).alphaTarget(0).restart();
} 

function updateForces() {
    // get each force by name and update the properties
    /*simulation.force("center")
        .x(width * forceProperties.center.x)
        .y(height * forceProperties.center.y);*/
    simulation.force("charge",d3.forceManyBody()
        .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
        .distanceMin(forceProperties.charge.distanceMin)
        .distanceMax(forceProperties.charge.distanceMax));     
    simulation.force("collide", d3.forceCollide()
    .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
    .radius(forceProperties.collide.radius)
    .iterations(forceProperties.collide.iterations));
   /*  simulation.force("forceX")
        .strength(forceProperties.forceX.strength * forceProperties.forceX.enabled)
        .x(width * forceProperties.forceX.x);
    simulation.force("forceY")
        .strength(forceProperties.forceY.strength * forceProperties.forceY.enabled)
        .y(height * forceProperties.forceY.y); */
    simulation.force("link",d3.forceLink()
        .id(function(d) {return d.id;})
        .distance(forceProperties.link.distance)
        .iterations(forceProperties.link.iterations)
        .links(forceProperties.link.enabled ? enlaces : []));

    // updates ignored until this is run
    // restarts the simulation (important if simulation has already slowed down)
    simulation.alpha(1).restart();
}
// update the display based on the forces (but not positions)
function updateDisplay() {
    node
        .attr("r", forceProperties.collide.radius)
        //.attr("stroke", forceProperties.charge.strength > 0 ? "blue" : "red")
        //.attr("stroke-width", forceProperties.charge.enabled==false ? 0 : Math.abs(forceProperties.charge.strength)/15);
        ;
    link
    //    .attr("stroke-width", forceProperties.link.enabled ? 1 : .5)
        .attr("opacity", forceProperties.link.enabled ? 1 : 0);
}
// convenience function to update everything (run after UI input)
function updateAll() {
    updateForces();
    updateDisplay();
}




