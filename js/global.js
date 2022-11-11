//document.getElementById("customRange1").max = times.length;
var radiusnode=5;

//	data stores
var grafo, store;
var nodos, enlaces;
var dic_adj={};

var times;
var minglobal; //min datetime in the dataset
var maxglobal; //max datetime in the dataset

 
var ramp ; // create a scale for a color gradient
// var colorScale2 ;

var dataArray = []; // contains the times to get the older and more recient times

var qtcolorlink = "#377eb8"; // color for quotes (light blue)
var rplycolorlink = "#ff7f00"; //color for replies (orange)
var stroke_opacity = 1;//0.4 try to solve later // links opacity

// for node color scale
var lowColor = '#e5f5e0'; //light green
var highColor = '#00441b'; //dark green

///////For  zoom
var min_zoom = 0.2;
var max_zoom = 7;
var scaleFactor = 1; //SEC ZOOM
var translation = [0,0];//SEC ZOOM


 /////////////////////////////////////////////
 var forceProperties = {
    center: {
        x: 0.5,
        y: 0.5
    },
    charge: {
        enabled: true,
        strength: -30,
        distanceMin: 1,
        distanceMax: 2000
    },
    collide: {
        enabled: true,
        strength: .7,
        iterations: 1,
        radius: 5
    },
    forceX: {
        enabled: false,
        strength: .1,
        x: .5
    },
    forceY: {
        enabled: false,
        strength: .1,
        y: .5
    },
    link: {
        enabled: true,
        distance: 30,
        iterations: 1
    }
};



