var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var canvasWidth = canvas.getAttribute("width");
var canvasHeight = canvas.getAttribute("height");
var w1 = (screenWidth/2) - screenWidth*0.1;;
var w2 = screenWidth*0.14;
document.getElementById("title").style.marginLeft = w1+"px";//Aligning title in the centre by manipulating margin-left property
canvas.style.marginLeft = w2+"px";//Aligning canvas in the centre by manipulating margin-left property

var mouseX=100;
var mouseY=300; 

var obstacleArray = new Array();

document.addEventListener("keydown",function(event){

	if(event.keyCode == 82){// R keyCode
		window.location.reload();
	}

},false);

function stopAudio(audio) {    //Function to stop audio the current audio from playing
    audio.pause();
    audio.currentTime = 0;
}

document.onmousemove = readMouseMove;

function readMouseMove(e){
	mouseX = e.clientX-208;
	mouseY = e.clientY-126;
	drawCharacter();
}

function obstacle(x,y,breadth,length){
	this.x=x;
	this.y=y;
	this.breadth = breadth;
	this.length = length;

	this.update = function(){

	}

	this.collide = function(){

	}
}

function obstaclePosition(i){
	var x = canvasWidth+i*200;
	var y = 100;
	obstacleArray.push(new obstacle(x,y)); 
}

for(var i=0;i<4;i++){
	obstaclePosition(i);
}

function drawCharacter(){
	ctx.clearRect(0,0,canvasWidth,canvasHeight);
	ctx.beginPath();
	ctx.fillStyle = "green";
	ctx.arc(mouseX,mouseY,30,0,2*Math.PI);
	ctx.fill();	
}

function drawObstacles(x,y,breadth,length){
	ctx.fillStyle = "#ff1744";
	ctx.fillRect(x,y,breadth,length);
}

function animation(){

	drawCharacter();
	for(var j=0;j<4;j++){
		obstacleArray[j].update();
		obstacleArray[j].collide();
		drawObstacles(obstacleArray[j].x,obstacleArray[j].y,obstacleArray[j].breadth,obstacleArray[j].length);
		obstacleArray[j].x-=1;
	}

	requestAnimationFrame(animation);
}

animation();