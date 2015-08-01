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
	this.y = height / 2 - this.height / 2;
	this.dy = height / 100;
	this.update = function() { 
		// clear the current paddle, update y position, and redraw it
		var next_position
		var next_ball_pos = ball.y + ball.dy;
		if( ball.dy > 0 ){ // if the ball is going downwards
			next_position = this.y + this.height + ball.dy;
			if( next_position > next_ball_pos + ball.height) next_position = -999; // if the paddle is outrunning the ball
		} else {
			next_position = this.y + ball.dy;
			if( next_position < next_ball_pos) next_position = -999;
		}
		if( next_position >= 0 && next_position <= canvasHeight ) { // if it's within the bounds of the canvas
			this.clear(); 
			this.y += ball.dy;
		}
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
	this.dy = -width / 100;
	this.height = width / 100;
	this.width = width / 100;
	this.update = function() {
		this.clear();
		this.x += this.dx;
		this.y += this.dy;
		// check for collision with top or bottom bound of canvas
		if( this.y + this.height > canvasHeight || this.y - this.height < 0 ) {
			this.dy = -this.dy; // change the ball's vertical direction if it's going off the top or the bottom 
		// check for collision with the right paddle
		} 
		if( this.x + this.width > canvasWidth || this.x - this.width < 0 ) {
			this.dx = -this.dx; // make the ball bounce off horizontal walls for debug	
		} else if( this.x + this.width >= rightPaddle.x
			&& this.y >= rightPaddle.y
			&& this.y < rightPaddle.y + rightPaddle.height) {
			this.dx = -this.dx;
		// check for collision with the left paddle
		} else if( this.x - this.width <= leftPaddle.x
			&& this.y >= leftPaddle.y
			&& this.y < leftPaddle.y + leftPaddle.height) {
			this.dx = -this.dx;
		} else this.draw();
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

// draws dashed line down the middle of the screen
var line = function() {
	this.height = 20;
	this.width = 5;
	this.next_height = 0;
	this.middle = canvasWidth / 2 - this.width / 2;
	this.update = function() {
		for( this.next_height; this.next_height < canvasHeight; this.next_height += this.height*2) {
			context.fillStyle = "white";
			context.beginPath();
			context.rect(this.middle, this.next_height, this.width, this.height);
			context.closePath();
			context.fill();
		}
	};
}

var update = function() {
	ball.update();
	leftPaddle.update();
	rightPaddle.update();
	line.update();
}

window.onload = function() {
	// get the canvas and context for drawing graphics
	canvas = document.getElementById("game");
	canvas.style.backgroundColor = background;
	canvas.width = 500; // window.innerWidth;
	canvas.height = 500; // window.innerHeight;
	context = canvas.getContext( '2d' ); 
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	// instantiate the game components
	leftPaddle = new pong_paddle(canvasWidth, canvasHeight, canvasWidth / 20);
	leftPaddle.draw();
	rightPaddle = new pong_paddle(canvasWidth, canvasHeight, canvasWidth - (canvasWidth / 20));
	rightPaddle.draw();
	ball = new pong_ball(canvasWidth, canvasHeight);
	line = new line();
	setInterval( update, 1000 / fps );
}
