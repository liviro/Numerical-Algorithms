// initializing global variables...
var h, k, t, table;

// function that determines original position of string (initial condition)
function init(x){
	if(x <= .5 && x >= 0){
		return x;
	}
	if(x >= .5 && x <= 1){
		return 1-x;
	}
}

// function that gets the border condition of the string (fixed 0)
function border(x){
	return 0;
}

// main solver method. 
// h = x-width, k = t-width, t = max. t
function solver(initCond, boundCond, hIn, kIn, tIn){
	h = hIn;
	k = kIn;
	t = tIn;
	var xIntervals = 1+1/h;
	var tIntervals = 1+t/k;
	table = new Array(tIntervals);
	// table creation & border condition population
	for(var i = 0; i < tIntervals; i++) {
		table[i] = new Array(xIntervals);
		table[i][0] = border(i);
		table[i][xIntervals-1] = border(i);
  	}
  	// initial condition population
  	for(var j = 0; j < xIntervals; j++){
  		table[0][j] = initCond(j*h);
  	}
  	var rho = (k*k)/(h*h);

  	// set values for first time step
  	for(var pos = 1; pos < xIntervals-1; pos++){
  		table[1][pos] = rho/2*(initCond((pos+1)*h)+initCond((pos-1)*h))+(1-rho)*initCond(pos*h);
  	}

  	// set values for all following time steps
  	for(var time = 2; time < tIntervals; time++){
  		for(var pos = 1; pos < xIntervals-1; pos++){
  			table[time][pos] = rho*table[time-1][pos+1]+2*(1-rho)*table[time-1][pos]+rho*table[time-1][pos-1]-table[time-2][pos];
  		}
  	}

	// prepare the table for graphing: need both x-position and y-position now
	for(var time = 0; time < tIntervals; time++){
		for(var pos = 0; pos < xIntervals; pos++){
			table[time][pos] = [pos*h, table[time][pos]];
		}
	}

	// hack needed for redrawing
	var circles = svg.selectAll('circle').remove()

	// insert the points into graph
	circles = svg.selectAll('circle')
		.data(table[0])
	    .enter()
	    .append('circle');

	// set their appropriate attributes (x & y position, radius, CSS class)
	circles.attr('cx', function(d){return scaleX(d[0]);})
	  .attr('cy', function(d){return scaleY(d[1]);})
	  .attr('r', 3)
	  .attr('class', 'point');
}

// set up the canvas and axis:
var width = 500,
    height = 300;

var padding = 30;

var scaleY = d3.scale.linear()
	.domain([-0.5, 0.5])
	.range([height - padding, padding]);

var scaleX = d3.scale.linear()
	.domain([0, 1])
	.range([padding, width - padding]);


var svg = d3.select("#canvas").append("svg")
    .attr("width", width)
    .attr("height", height);

var axisX = svg.append("g")
	.attr("class", "axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(d3.svg.axis()
		.scale(scaleX)
		.orient("bottom")
    	.ticks(5));

var axisY = svg.append("g")
	.attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(d3.svg.axis()
		.scale(scaleY)
		.orient("left")
    	.ticks(5));

// functions that deals with the slider (changing the y-position of the points)
function changeT(time){
	var tTransf = (time/k).toFixed(0);
	var points = d3.selectAll('.point')
		.attr("cy", function(d, i){
			return scaleY(table[tTransf][i][1]);
		})
			
}

// function that redoes the graph when new values are entered
function redraw(){
	// getting the inputs
	hIn = ($('input[name=hInput]').val() === '') ? h : parseFloat($('input[name=hInput]').val());
	kIn = ($('input[name=kInput]').val() === '') ? k : parseFloat($('input[name=kInput]').val());
	tIn = ($('input[name=tInput]').val() === '') ? t : parseFloat($('input[name=tInput]').val());

	// check for validity of inputs
	if(((1/hIn) % 1 !== 0) || (tIn/kIn) % 1 !== 0){
		$('.error').removeClass('hide');
		return;
	}
	else{
		if(! $('.error').hasClass('hide')){
			$('.error').addClass('hide');
		}
	}

	// get the new table
	solver(init, border, hIn, kIn, tIn);
	
	// also need to update slider
	$('#tselect').slider("option", "max", t)
		.slider('option', 'step', k)
		.slider('option', 'value',0);
}


// on pageload
$(document).ready(function(){

	// initially solve for some values
	solver(init, border, 0.05, 0.01, 2)

	// initialize the slider
    $("#tselect").slider({
        max: t,
        min: 0,
        step: k,
        value: 0,
        slide: function(ev, ui){
        	changeT(ui.value);

        	$('#tvalue').text('t = '+ui.value);
        }

    })
});
