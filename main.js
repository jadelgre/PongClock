// Jacob Adelgren 2015
// variables for game objects
var leftPaddle;
var rightPaddle;
var ball;
// configuration values
var canvas;
var fps = 30;
var context; 
var canvasHeight = 500;
var canvasWidth = 500;
var gameBackgroundColor = "black";

var initialize_canvas = function() {
	canvas = document.getElementById("game");
	canvas.style.backgroundColor = gameBackgroundColor;
	canvas.width = canvasWidth;
	canvas.height = canvasWidth;
	context = canvas.getContext('2d');
} 
	
var pongBall = {
	dx: -10,
	dy: -1,
	rad: 10,
	x: canvasWidth / 2,
	y: canvasHeight / 2
}

var leftPaddle = { 
	height: 100,
	width: 10,
	x: 20,
	y: canvasHeight / 2
}

var rightPaddle = {
	x: canvasWidth - 20,
	height: 100,
	width: 10,
	y: canvasHeight / 2
}

var draw = function () {
	// clear the board
	context.clearRect(0,0,canvasWidth, canvasHeight);
	// initialize graphics properties
	context.beginPath();
	context.strokeStyle = "white";
	// draw paddles and ball
	context.rect(leftPaddle.x, leftPaddle.y-leftPaddle.height/2, leftPaddle.width, leftPaddle.height);
	context.stroke();
	context.closePath();
	context.fill();	
	// draw right paddle
	context.rect(rightPaddle.x, rightPaddle.y-rightPaddle.height/2, rightPaddle.width, rightPaddle.height);
	context.stroke();
	context.closePath();
	context.fill();
	// draw ball
	context.beginPath();
	context.arc(pongBall.x,pongBall.y,10,0,2*Math.PI);
	context.stroke();
	context.closePath();
	context.fill();
	// draw dashed line
	lineHeight = canvasHeight / 20;
	lineWidth = canvasWidth / 75;
	for(var i = 0; i < canvasHeight; i += 2*lineHeight) {
		context.rect(canvasWidth / 2 - lineWidth / 2, i, lineWidth, lineHeight);
		context.fill();
	}
	// draw clock 
	this.date = new Date();
	this.hour = this.date.getHours();
	this.minute = this.date.getMinutes();
	context.fillStyle = "white";
	context.font = '12pt Arial';
	context.fillText(this.hour%12, canvasWidth / 2 - canvasWidth / 20, canvasHeight / 20);
	context.fillText(this.minute, canvasWidth / 2 + canvasWidth / 20, canvasHeight / 20);
}

var update = function () {
	// update left paddle

	// update right paddle
	if( rightPaddle.y + rightPaddle.height / 2 + pongBall.dy < canvasHeight && rightPaddle.y - rightPaddle.height / 2 + pongBall.dy > 0 ) {
		rightPaddle.y += pongBall.dy; 
	}
	
	if( leftPaddle.y + leftPaddle.height / 2 + pongBall.dy < canvasHeight && leftPaddle.y - leftPaddle.height / 2 + pongBall.dy > 0 ) {
		leftPaddle.y += pongBall.dy;
	}

	// move ball
	pongBall.x += pongBall.dx;
	pongBall.y += pongBall.dy;
	// check for collision
	if( pongBall.x + pongBall.rad >= canvasWidth // collision with right wall
	|| pongBall.x - pongBall.rad <= 0 // collision with left wall
	|| pongBall.x + pongBall.rad >= rightPaddle.x 
	|| (pongBall.x - pongBall.rad <= leftPaddle.x+leftPaddle.width 
		&& pongBall.y < leftPaddle.y + leftPaddle.height/2
		&& pongBall.y > leftPaddle.y - leftPaddle.height/2)) pongBall.dx = -pongBall.dx;
	// check for ball collision with the top and bottom
	if( pongBall.y + pongBall.rad >= canvasHeight || pongBall.y - pongBall.rad <= 0 ) pongBall.dy = -pongBall.dy;
	// redraw all elements
	draw();
}

window.onload = function() {
	initialize_canvas();
	setInterval(update, 1000 / fps );
}

