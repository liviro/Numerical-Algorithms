// initializing global variables...
var h, k, t, table, errorTable;

// function that determines original temperature at position x
function init(x){
	return Math.sin(x*Math.PI);
}

function border(t){
	return 0;
}

// function that gets the exact temperature for a certain position & time
function trueValue(time, position){
	return Math.exp(-(Math.pow(Math.PI,2)*time))*Math.sin(Math.PI*position);
}

// function that gets the error for a certain time
function getError(time){
	var tTransf = (time/k).toFixed(0);
	var xIntervals = 1+1/h;
	var exact = [];
	var estimated = [];
	for(var i = 0; i < xIntervals; i++){
		exact.push(trueValue(tTransf,i*h));
		estimated.push(table[tTransf][i][1]);
	}
	var error = 0;
	for(var j = 0; j < xIntervals; j++){
		error += exact[j];
		error -= estimated[j];
	}
	error /= xIntervals;
	return error;
}

// function that populates the error table
function populateErrorTable(){
	errorTable = [];
	for(var i = 0; i < 1+t/k; i++){
		errorTable.push(getError(i*k));
	}
}

// main solver method. 
// h = x-width, k = t-width, t = max. time
function solver(initCond, hIn, kIn, tIn, boundLeft, boundRight){
	h = hIn;
	k = kIn;
	t = tIn;
	var xIntervals = 1+1/h;
	var tIntervals = 1+t/k;
	table = new Array(tIntervals);
	// table creation & border condition population
	for(var i = 0; i < tIntervals; i++) {
		table[i] = new Array(xIntervals);
		table[i][0] = boundLeft(i);
		table[i][xIntervals-1] = boundRight(i);
  	}
  	// initial condition population
  	for(var j = 0; j < xIntervals; j++){
  		table[0][j] = initCond(j*h);
  	}

  	var rho = k/(h*h);

  	// set values for all following time steps
  	for(var time = 1; time < tIntervals; time++){
  		for(var pos = 1; pos < xIntervals-1; pos++){
  			table[time][pos] = rho*table[time-1][pos+1]+(1-2*rho)*table[time-1][pos]+rho*table[time-1][pos-1];
  		}
  	}

	// prepare the table for graphing
	for(var time = 0; time < tIntervals; time++){
		for(var pos = 0; pos < xIntervals; pos++){
			table[time][pos] = [pos*h, table[time][pos]];
		}
	}

	// set the error table up
	populateErrorTable();

	// hack needed for redrawing
	var circles = svg.selectAll('circle').remove()

	// insert circles into graph
	circles = svg.selectAll('circle')
		.data(table[0])
	    .enter()
	    .append('circle');

	// set the attributes (x& temperature position, radius, CSS class, color)
	circles.attr('cx', function(d){return scaleX(d[0]);})
	  .attr('cy', function(d){return scaleY(d[1]);})
	  .attr('r', 5)
	  .attr('class', 'point')
	  .style('fill', function(d){return scaleColor(d[1]);});
}

// set up the canvas, axis, and coloring:
var width = 500,
    height = 300;

var padding = 30;

var scaleY = d3.scale.linear()
	.domain([0, 1])
	.range([height - padding, padding]);

var scaleX = d3.scale.linear()
	.domain([0, 1])
	.range([padding, width - padding]);

var scaleColor = d3.scale.linear()
	.domain([0,1])
	.range(['blue', 'red']);

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



// functions that deals with the slider (change the temperature and color)
function changeT(time){
	var tTransf = (time/k).toFixed(0);
	var points = d3.selectAll('.point')
		.attr("cy", function(d, i){
			return scaleY(table[tTransf][i][1]);
		})
		.style('fill', function(d,i){
			return scaleColor(table[tTransf][i][1]);
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

	table = [];
	solver(init, hIn, kIn, tIn, border, border);
	 
	// also need to update slider
	$('#tselect').slider("option", "max", t)
		.slider('option', 'step', k);
}


// on pageload
$(document).ready(function(){

	// initially solve for some values h = x-width, k = t-width, t = max. t,
	solver(init, 0.1, 0.005, 1, border, border)

	// initialize the slider
    $("#tselect").slider({
        max: t,
        min: 0,
        step: k,
        value: 0,
        slide: function(ev, ui){
        	changeT(ui.value);

        	$('#tvalue').text('t = '+ui.value);

        	$('#error').text('error = '+errorTable[(ui.value/k).toFixed(0)]);
        }

    })
});
