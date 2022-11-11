/////// READING THE JSON FILE
//Lasso_1562457217806528514_nolimpio.json
//LASSO_1563573550027460608_nolimpio.json
var origin = '1562457217806528514';

d3.json("Lasso_1562457217806528514_nolimpio.json").then(function(graph){

    var nodeByID = {};
  
    graph.nodes.forEach(function(n) {
        nodeByID[n.id] = n;//saves in a dictionary id of nodes containing the node
        //n.filtered = false; 
        n.time = new Date(n.time);
        dataArray.push(n.time);


        dic_adj[n.id] = [];
        //console.log(dic_adj); 
    });
    


     // save the times on links
    c=0;
    graph.links.forEach(function(l) {
        l.id = c;
        c = c+1;
        l.time =  new Date(nodeByID[l.target].time);// the time is added to the link to use this with the time filter radius slider

        addEdge(l.source, l.target);
    });
   

    ///////////////////////////////////////////////////////////
    minglobal = d3.min(dataArray);
    maxglobal = d3.max(dataArray); 
    console.log(minglobal);
    console.log(maxglobal);
  
    
    // Store keeps all  nodes and links
    grafo = $.extend(true, {}, graph); 
    //console.log(grafo);
    nodos=[...grafo.nodes];
    enlaces=[...grafo.links];

        
      // two different ways TO create scales for node colors
      ramp = d3.scaleLinear().domain([minglobal,maxglobal]).range([highColor,lowColor]); // invertido el color de los nodos

      addhcolorbar("#bar", ramp); //


      createarrows();
      createTimeSlider(minglobal,maxglobal);

  });
 /////// END READING THE JSON FILE



 // Javascript program to check if there is exist a path between two vertices
// of a graph.
// Function to add an edge into the graph
function addEdge(v,w)
{
    
   dic_adj[v].push(w);
    
    
}
 

function cleanPath(path){
    A = [...path];
    var real_path = [];
    var el = A.pop();
    real_path.push(el);
    var count = 0;
    while (A.length != 0)
    {
    el = A.pop();
    
    for(let i = 0; i < dic_adj[el].length; i++)
            {

                if (dic_adj[el][i] == real_path[count])
                {
                    count = count + 1 ;
                    real_path.push(el);
                };
            };   

        };
    return real_path;

}



function isReachable(s,d)
{
 
        let dic_visited = {};
    
        grafo.nodes.forEach(function(n) {
            dic_visited[n.id] = false;
        });


        // Create a stack for DFS
        let stack = [];
  
        // Mark the current node as visited and enqueue it
        dic_visited[s] = true;
        stack.push(s);
        let path =[];
        while (stack.length != 0)
        {
            // Dequeue a vertex from queue and print it

            n = stack.pop();
            path.push(n); 
            
            if(n == d){

                rpath = cleanPath(path);
                
                return (rpath);
            }

            for(let i = 0; i < dic_adj[n].length; i++)
            {
                if (dic_visited[dic_adj[n][i]] == false)
                {
                    stack.push(dic_adj[n][i]);
                    //path.push(dic_adj[n][i]);
                    dic_visited[dic_adj[n][i]] = true;
                }
            }             
        }
  
        // If DFS is complete without visited d
        return ([]);
}

 

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");



var g = svg.append("g");
    

var link = g.append("g").selectAll(".line"),
    node = g.append("g").selectAll(".circle");


var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-30))//-30 is the default
    .force("center", d3.forceCenter(width / 2, height / 2)); //con este se centra y todos los nodos se ex[anden]
    


/////////add zoom capabilities 
    var zoom_handler = d3.zoom()
        .scaleExtent([min_zoom,max_zoom])
        .on("zoom", zoom_actions); // zoom_actions updateChart

    zoom_handler(svg); 


    function zoom_actions({transform}){
        g.attr("transform", transform)
        
        scaleFactor = transform.k;
        translation = [transform.x,transform.y];
        
        ticked();
        
    };


//
let i = 0;


//For time filtering
////////// BEGIN contains function
contains = (d, timeslider) => d.time <= timeslider; // returns true if the time of a element is <= that the time in array times
////////// END contains function


////////// BEGIN FILTER
function filter_time(timeslider) {
    
    nodos = grafo.nodes.filter((d) => contains(d, timeslider));
    enlaces = grafo.links.filter((d) => contains(d, timeslider));

   
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
    .text(function(d) { 
        
        if (d.source == "[object Object]") {
            return "source: " + d.source.id + "\n" + "target: " + d.target.id + "\n" + "type: " + d.type_tw ;
        } ;   
        return "source: " + d.source + "\n" + "target: " + d.target + "\n" + "type: " + d.type_tw ;
    });
    ///////////////////////////////////////////////////////////////


    simulation
    .nodes(nodos) // grafo.nodes //nodos //con grafo.nodos conservan la posicion como si tuviera ya el grafo completo --ojo que con eso tambien debo poner.id en source y target
    .on("tick", ticked);  //con nodos nuevamente van apareciendo como de la nada

    simulation.force("link") 
    .links(enlaces); // grafo.links  //enlaces

    simulation.alpha(1).alphaTarget(0).restart();
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
    var path =isReachable(origin,d.id); 
    
    var neigs = getNeighbors(d);
    

    if (path.length != 0){
        node.style('stroke-opacity', function (o) {
            const thisOpacity = path.includes(o.id) ? 1 : opacity;
            this.setAttribute('fill-opacity', thisOpacity);
            return thisOpacity;});

        
        link.style('stroke-opacity', o => ( path.includes(o.source.id) &&  path.includes(o.target.id) ? 1 : opacity));

    } else{
        node.style('stroke-opacity', function (o) {
            const thisOpacity = neigs.includes(o.id) ? 1 : opacity;
            this.setAttribute('fill-opacity', thisOpacity);
            return thisOpacity;});
        link.style('stroke-opacity', o => (o.source.id === d.id || o.target.id === d.id ? 1 : opacity));
    }


  } // END FADE

  function nlinkopacity(o,path,opacity){
    path.forEach(function(el){
        
        if (o.source.id === el || o.target.id === el){
            
            return 1;
        } else {
        return opacity;
    }
    });
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


function ticked() { 
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

    simulation
    .nodes(grafo.nodes) // grafo.nodes //nodos //con grafo.nodos conservan la posicion como si tuviera ya el grafo completo --ojo que con eso tambien debo poner.id en source y target
    .on("tick", ticked);  //con nodos nuevamente van apareciendo como de la nada

    simulation.force("link") 
    .links(grafo.links ); // grafo.links  //enlaces

    simulation.alpha(1).alphaTarget(0).restart();
} 

function updateForces() {
    simulation.force("charge",d3.forceManyBody()
        .strength(forceProperties.charge.strength * forceProperties.charge.enabled)
        .distanceMin(forceProperties.charge.distanceMin)
        .distanceMax(forceProperties.charge.distanceMax));     
    simulation.force("collide", d3.forceCollide()
    .strength(forceProperties.collide.strength * forceProperties.collide.enabled)
    .radius(forceProperties.collide.radius)
    .iterations(forceProperties.collide.iterations));
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
        ;
    link
    
        .attr("opacity", forceProperties.link.enabled ? 1 : 0);
}
// convenience function to update everything (run after UI input)
function updateAll() {
    updateForces();
    updateDisplay();
}




