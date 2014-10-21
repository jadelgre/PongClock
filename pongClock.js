function clock() {
	// Determine the canvas by its html element
	var canvas = document.getElementById("game");
	// Determine the size by the size of the canvas
	this.width = canvas.width;
	this.height = canvas.height;
	this.context = canvas.getContext("2d");
	this.context.fillStyle = "white";
	
	date = new Date();
	
	this.hourPaddle = new paddle( 5, 0 );
	this.hourPaddle.y = this.height/2 - this.hourPaddle.height/2;
	this.hourPaddle.score = date.getHours();
    this.minutePaddle = new paddle(this.width - 5 - 2, 0);
	this.minutePaddle.y = this.height/2 - this.minutePaddle.height/2;
	this.minutePaddle.score = date.getMinutes();
    
    this.ball = new ball();
    this.ball.x = this.width/2;
    this.ball.y = this.height/2;
    this.ball.dy =  Math.floor(Math.random()*12 - 6);
    this.ball.dx = 7 - Math.abs(this.ball.dy);    
	
	this.hourDisplay = new display(this.width*4/9, 25);
	this.minuteDisplay = new display(this.width*5/9, 25);
}

// Draw the game area
clock.prototype.draw = function() {
	// Draw the area rectangle to fit the size of the html element area
	this.context.clearRect(0,0, this.width, this.height );
    //this.context.fillRect(0,0, this.width, this.height  );
	// Draw the paddles
    this.hourPaddle.draw(this.context);
    this.minutePaddle.draw(this.context);
    
    this.ball.draw(this.context);
	
	this.hourDisplay.draw(this.context);
	this.minuteDisplay.draw(this.context);
};

clock.prototype.update = function() {
    if (this.paused ) return;
    this.ball.update();
	this.hourDisplay.value = this.hourPaddle.score;
	this.minuteDisplay.value = this.minutePaddle.score;
	date = new Date();
	
	if( this.ball.dy == 0 ) this.ball.dy =  Math.floor(Math.random()*12 - 6);
	
	if( this.hourDisplay.value > 12 ) this.hourDisplay.value -= 12;
	//if( this.minuteDisplay.value == 60 ){
	//	this.hourDisplay.value += 1;
	//	this.minuteDisplay.value = 0;
	//}
	
	if( this.minuteDisplay.value < date.getMinutes()  && date.getMinutes() < 60){
		this.minutePaddle.move(this.ball, this.minutePaddle);
		this.hourPaddle.moveSlow(this.ball, this.hourPaddle);
	} else if (  this.minuteDisplay.value == 59 && date.getMinutes() == 60) {
		this.minutePaddle.moveSlow(this.ball, this.minutePaddle);
		this.hourPaddle.move(this.ball, this.hourPaddle);
	}else {	
		this.minutePaddle.move(this.ball, this.minutePaddle);
		this.hourPaddle.move(this.ball, this.hourPaddle);
	}
    if (this.ball.dx > 0) {
        if (this.minutePaddle.x <= this.ball.x + this.ball.width &&
                this.minutePaddle.x > this.ball.x - this.ball.dx + this.ball.width) {
            var collisionDiff = this.ball.x + this.ball.width - this.minutePaddle.x;
            var k = collisionDiff/this.ball.dx;
            var y = this.ball.dy*k + (this.ball.y - this.ball.dy);
            if (y >= this.minutePaddle.y && y + this.ball.height <= this.minutePaddle.y + this.minutePaddle.height) {
                // collides with right paddle
                this.ball.x = this.minutePaddle.x - this.ball.width;
                this.ball.y = Math.floor(this.ball.y - this.ball.dy + this.ball.dy*k);
                this.ball.dx = -this.ball.dx;
            }
        }
		else if ( this.ball.x >= this.width) this.score(this.hourPaddle);
    } else {
		if( this.ball.x <= 0 ) this.score(this.minutePaddle);
        if (this.hourPaddle.x + this.hourPaddle.width >= this.ball.x) {
            var collisionDiff = this.hourPaddle.x + this.hourPaddle.width - this.ball.x;
            var k = collisionDiff/-this.ball.dx;
            var y = this.ball.dy*k + (this.ball.y - this.ball.dy);
            if (y >= this.hourPaddle.y && y + this.ball.height <= this.hourPaddle.y + this.hourPaddle.height) {
                // collides with the left paddle
                this.ball.x = this.hourPaddle.x + this.hourPaddle.width;
                this.ball.y = Math.floor(this.ball.y - this.ball.dy + this.ball.dy*k);
                this.ball.dx = -this.ball.dx;
            }
        }
    }	
    
    if (this.ball.x > this.width || this.ball.x + this.ball.width < 0) {
        this.ball.dx = -this.ball.dx;
    } else if (this.ball.y > this.height || this.ball.y + this.ball.height < 0) {
        this.ball.dy = -this.ball.dy;
    }
};

clock.prototype.score = function(p) {
	p.score++;
	var player = p == this.hourPaddle ? 0 : 1;
	
	this.ball.x = this.width/2;
	this.ball.y = this.height/2
	
	this.ball.dy = Math.floor(Math.random()*12 - 6 );
	this.ball.dx = 7 - Math.abs(this.ball.dy);
	if ( player == 1)  this.ball.dx *= -1;
};

function display(x,y) {
	this.x =x;
	this.y = y;
	this.value = 0;
}

display.prototype.draw = function( p ){
	p.fillText( this.value, this.x, this.y );
};

// Initialize
var clock = new clock();
var date;// = new Date();
//var minutes = date.getMinutes();
//var hours = date.getHours();

function paddle( x, y ) {
	this.x = x;
	this.y = y;
	this.width = 2;
	this.height = 28;
	this.score = 0;
}

paddle.prototype.move = function(b,p) {
var canvas = document.getElementById("game");
	var difference = b.y - this.y;
	if( this.x > canvas.width / 2 && b.dx > 0 ) this.y += (difference - this.height/2) / b.dx ;
	else if ( this.x < canvas.width /2 && b.dx < 0 ) this.y -= (difference - this.height/2) / b.dx;
	//if( this.x > canvas.width / 2 ) this.y = b.y - this.height / 2;
	//else if ( this.x < canvas.width / 2 && b.dx < 0 ) this.y = b.y;
}
paddle.prototype.moveSlow = function(b,p) {
var canvas = document.getElementById("game");
	var difference = b.y - this.y;
	if( this.x > canvas.width / 2 && b.dx > 0 ) this.y += (difference - this.height/2) / 100 ;
	else if ( this.x < canvas.width /2 && b.dx < 0 ) this.y -= (difference - this.height/2) /100;
	//if( this.x > canvas.width / 2 ) this.y = b.y - this.height / 2;
	//else if ( this.x < canvas.width / 2 && b.dx < 0 ) this.y = b.y;
}
	

paddle.prototype.draw = function( p ) {
	p.fillRect( this.x, this.y, this.width, this.height );
};

function ball() {
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.width = 4;
    this.height = 4;
}

ball.prototype.draw = function( p ) {
    p.fillRect(this.x,this.y,this.width, this.height);
};

ball.prototype.update = function() {
	this.x += this.dx;
	this.y += this.dy;
	}

function main() {
	clock.update();
	clock.draw();
	setTimeout( main,  33 );
}

main();