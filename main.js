// Jacob Adelgren 2015
// 
var canvas;
var context;
var background = "black";
var fps = 30;
// variables for game objects
var leftPaddle;
var rightPaddle;
var ball;

var paddle = function(width, height, xpos) {
	this.width = width / 30;
	this.height = height / 5;
	this.x = xpos;
	this.y = height / 2;
	this.dy = height / 100;
	this.update = function() { // clear the current paddle, update y position, and redraw it
		this.clear(); 
		this.y += this.dy;
		this.draw();
	};
	
	this.clear = function() {
		//context.fillStyle = background; // set the fill style to the current background color
		context.clearRect(this.x, this.y,this.width,this.height); // draw a rectangle over the current one to clear it
		//context.fill();
	};
	
	this.draw = function() {
		context.fillStyle = "yellow";
		context.beginPath();
		context.rect(this.x,this.y,this.width,this.height);
		context.closePath();
		context.fill();
	}
}

var update = function() {
	leftPaddle.update();
}

window.onload = function() {
	canvas = document.getElementById("game");
	canvas.style.backgroundColor = background;
	context = canvas.getContext( '2d' ); 
	width = canvas.width;
	height = canvas.height;
	leftPaddle = new paddle(width, height, width / 20);
	setInterval( update, 1000 / fps );
	console.log(test)
}
