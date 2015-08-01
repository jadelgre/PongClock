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

var pong_paddle = function(width, height, xpos) {
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
		context.clearRect(this.x, this.y,this.width,this.height); // draw a rectangle over the current one to clear it
	};
	
	this.draw = function() {
		context.fillStyle = "white";
		context.beginPath();
		context.rect(this.x,this.y,this.width,this.height);
		context.closePath();
		context.fill();
	}
}

var pong_ball = function(width, height) {
	this.x = width / 2;
	this.y = width / 2;
	this.dx = width / 100;
	this.dy = width / 100;
	this.height = 50; // width / 200;
	this.width = 50; // width / 200;
	this.update = function() {
		this.clear();
		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	};
	this.clear = function() { 
		context.clearRect(this.x, this.y,this.width,this.height); // draw a rectangle over the current one to clear it
	};

	this.draw = function() {
		context.fillStyle = "white";
		context.beginPath();
		context.rect(this.x,this.y,this.width,this.height);
		context.closePath();
		context.fill();
	}

}

var update = function() {
	leftPaddle.update();
	rightPaddle.update();
	ball.update();
}

window.onload = function() {
	// get the canvas and context for drawing graphics
	canvas = document.getElementById("game");
	canvas.style.backgroundColor = background;
	context = canvas.getContext( '2d' ); 
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	// instantiate the game components
	leftPaddle = new pong_paddle(canvasWidth, canvasHeight, canvasWidth / 20);
	rightPaddle = new pong_paddle(canvasWidth, canvasHeight, canvasWidth - (canvasWidth / 20));
	ball = new pong_ball(canvasWidth, canvasHeight);
	setInterval( update, 1000 / fps );
}
