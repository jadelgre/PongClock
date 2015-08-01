var canvas;
var context;

paddle = function(width, height) {
	this.width = width;
	this.height = height;
	this.x = 0;
	this.y = 0;
	this.dy = 0;
	this.dx = 0;
	this.update = function() {
		this.x += this.dx;
		this.y += this.dy;
	};
}



window.onload = function() {
	canvas = document.getElementById("game");
	context = canvas.getContext( '2d' ); 
	width = canvas.width / 25;
	height = canvas.height / 10;
	test = new paddle(width, height);
	console.log(test)
}
