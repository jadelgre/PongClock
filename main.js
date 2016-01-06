/*The MIT License (MIT)

Copyright (c) 2016 Jacob Adelgren

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.*/

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

// clock values
var displayHour;
var displayMinute;
var date;

// variables that indicate whether a paddle needs to miss
var hourHasChanged = false;
var minuteHasChanged = false;

var initialize_canvas = function() {
	canvas = document.getElementById("game");
	canvas.style.backgroundColor = gameBackgroundColor;
	canvas.width = canvasWidth;
	canvas.height = canvasWidth;
	context = canvas.getContext('2d');
};
	
var pongBall = {
	dx: -10,
	dy: -1,
	rad: 10,
	x: canvasWidth / 2,
	y: canvasHeight / 2
};

var leftPaddle = { 
	height: 100,
	width: 10,
	x: 20,
	y: canvasHeight / 2
};

var rightPaddle = {
	x: canvasWidth - 20,
	height: 100,
	width: 10,
	y: canvasHeight / 2
};

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

	// draw the clock at the top of the screen	
	context.fillStyle = "white";
	context.font = '12pt Arial';
	context.fillText(this.displayHour, canvasWidth / 2 - canvasWidth / 20, canvasHeight / 20);
	context.fillText(this.displayMinute, canvasWidth / 2 + canvasWidth / 20, canvasHeight / 20);
}

var update = function () {

	if(pongBall.x < canvasWidth - (canvasWidth / 4) && pongBall.dx < 0) { // if the ball is moving left
		variance = pongBall.rad;
		if(hourHasChanged) {
			variance *= 4;
		}
		
		if(pongBall.y <= leftPaddle.y) {
			leftPaddle.y -= (leftPaddle.y - pongBall.y) / variance;
		} else {
			leftPaddle.y += (pongBall.y - leftPaddle.y) / variance;
		}
	} else if (pongBall.x > (canvasWidth / 4) && pongBall.dx > 0) {
		if(minuteHasChanged) {
			variance += 4;
		}

		if(pongBall.y <= rightPaddle.y) {
			rightPaddle.y -= (rightPaddle.y - pongBall.y) / variance;
		} else {
			rightPaddle.y += (pongBall.y - rightPaddle.y) / variance;
		}
	}

	// make sure the left paddle does not go off screen
	if(leftPaddle.y - (leftPaddle.height / 2) <= 0) leftPaddle.y = leftPaddle.height / 2;
	if(leftPaddle.y + (leftPaddle.height / 2) >= canvasHeight) leftPaddle.y = canvasHeight - (leftPaddle.height / 2);
	// make sure the right paddle does not go off screen 
	if(rightPaddle.y - (rightPaddle.height / 2) <= 0) rightPaddle.y = rightPaddle.height / 2;
	if(rightPaddle.y + (rightPaddle.height / 2) >= canvasHeight) rightPaddle.y = canvasHeight - (rightPaddle.height / 2);

	// move ball
	pongBall.x += pongBall.dx;
	pongBall.y += pongBall.dy;
	// check for collision
	if( pongBall.x + pongBall.rad >= canvasWidth ) { // collision with right wall
		if(minuteHasChanged) {
			minuteHasChanged = false;
			incrementMinuteCounter(); // increase the score to correspond with the time
		} else {
			console.log('ball hit right wall when it should not have');
		}
		pongBall.dx = -pongBall.dx;
	} else if ( pongBall.x - pongBall.rad <= 0 ) {// collision with left wall
		if(hourHasChanged) {
			hourHasChanged = false;
		} else {
			console.log('ball hit left wall when it should not have');
		}
		pongBall.dx = -pongBall.dx;
	// check to see if the center of the ball hits the right paddle
	} else if ( pongBall.x + pongBall.rad >= rightPaddle.x // 
				&& pongBall.y >= rightPaddle.y-rightPaddle.height/2 // below top edge of paddle 
				&& pongBall.y <= rightPaddle.y+rightPaddle.height/2) { // above bottom edge of paddle 
		pongBall.dx = -pongBall.dx;
	// check to see if the center of the ball hits the left paddle
	} else if (pongBall.x - pongBall.rad <= leftPaddle.x+leftPaddle.width 
				&& pongBall.y < leftPaddle.y + leftPaddle.height/2
				&& pongBall.y > leftPaddle.y - leftPaddle.height/2) {
		pongBall.dx = -pongBall.dx;
	}

	// check for ball collision with the top and bottom
	if( pongBall.y + pongBall.rad >= canvasHeight || pongBall.y - pongBall.rad <= 0 ) pongBall.dy = -pongBall.dy;
	// redraw all elements
	draw();
}

var clockCycle = function() {
	var time = new Date();
	var minutes = time.getMinutes();
	var seconds = time.getSeconds()

	if(hourHasChanged) {
		minuteHasChanged = false;
	}

	if(seconds == 0) {
		if(minutes == 0) {
			// if seconds == 0 and minutes == 0 then it's the top of the hour
			hourHasChanged = true;
		} else {
			// else it's just the start of a new minute
			minuteHasChanged = true;
		}
	}
}

var incrementMinuteCounter = function() {
	displayMinute = Number(displayMinute) + 1;
	// add leading zero if less than 10
	displayMinute = (displayMinute<10?'0':'') + displayMinute;
}

var incrementHourCounter = function() {
	displayHour = Number(displayHour) + 1;
	displayHour = displayHour % 12 || 12;
}

window.onload = function() {
	initialize_canvas();
	this.date = new Date();

	// intialize the values displayed by the clock
	this.displayMinute = (date.getMinutes()<10?'0':'') + date.getMinutes();
	this.displayHour = date.getHours() % 12 || 12;

	setInterval(update, 1000 / fps );
	setInterval(clockCycle, 1000); // run every second
}

