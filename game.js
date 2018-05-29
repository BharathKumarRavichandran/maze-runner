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

var health=160;//Initial Health
var mouseX=50;
var mouseY=100;
var oldMouseX=100;
var oldMouseY=300; 
var oldHeroX=100;
var oldHeroY=300;
var heroX=mouseX;
var heroY=mouseY;
var hitmanX;
var hitmanY;
var radius=30;//Character's radius
var score=0;//score of the character
var level=1;//Hacker mode level>=1---Basic mode level=0
var nWalls=6;//Number of walls to be generated initially
var nHitman=3;//Number of Hitman generated initially
var speed=3;//speed at which the obstacles approach the character
var heroVelocity=3;
var obstacleDist=90;
var nTwoWalls=0;

var enter=false;
var mouseDown=false;
var hasTwoWalls=false;
var wallDist = 130;
var collision=false; 
var pause=false;
var quit=false;
var gameOver=false;

var obstacleArray = new Array();
var twoWall = new Array();
var hitmanArray = new Array();

var x;
var y;
var side;
var orient;
var breadth=50;
var length;
var twoWallLength = 500;
var i=0;
var j=0;
var k=0;
var p=0;
var q=2;
var rand;
var time=0;
var inc=0.05;
var heroWidth= 50;
var heroHeight= 70;
var hitmanWidth=50;
var hitmanHeight=70;

var hero = new Image();
var hitmanImage = new Image();

hero.src = "assets/hero.jpg";
hitmanImage.src = "assets/hitman.png";

var bgAudio1 = new Audio("audio/Surreal-Chase_Looping.mp3");
var bgAudio2 = new Audio("audio/Puzzle-Game_Looping.mp3");
var hit = new Audio("audio/hit.wav");
var dead = new Audio("audio/dead.wav");

bgAudio1.loop = true;
bgAudio2.loop = true;

if(level==0){//For Basic mode
	speed=3;
}
else{//For Hacker mode
	speed=1.3;
}

document.onmousemove = readMouseMove;

document.addEventListener("keydown",function(event){

	if(event.keyCode==13){//enter keyCode
		enter=true;
	}

	if(event.keyCode == 82){// R keyCode
		stopAudio(dead);
		window.location.reload();
	}

	if(event.keyCode==80&&enter==true){//p pause/resume
        if(pause==false){
        	pause=true;
        }
        else{
        	pause=false;	
        	animation();
        }
       	if((quit==true&&pause==true)&&(enter==true)){
        	initialise();
			quit=false;
			pauseGameDraw();
       	}
    }

    if(event.keyCode==81&&enter==true){//q quit
        quit=true;
    }

},false);

canvas.addEventListener("mousedown",function(event){
	mouseX = event.clientX-243;
	mouseY = event.clientY-126;
	if(((mouseX>=heroX)&&(mouseX<heroX+heroWidth))&&((mouseY>=heroY)&&(mouseY<heroY+heroHeight))){
		mouseDown=true;
	}
},false);

function stopAudio(audio) {    //Function to stop audio the current audio from playing
    audio.pause();
    audio.currentTime = 0;
}

function circleRectangleCollision(circle,rect,side){

	//Calculating distances between centres of circle and rectangle
	var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    //Testing collision at points other than corners
    if(distX>(rect.w/2 + circle.r)){
    	return false; 
    	
    }
    if(distY>(rect.h/2 + circle.r)){
    	return false;
    }
   if(distX<=(rect.w/2)){
    	console.log("hey1");
    	return true;
    	
    } 
   	if(distY<=(rect.h/2)){
   		    console.log("hey2");
   			return true;
   	}

   	//Testing for collision at corner points 
   	var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return(dx*dx+dy*dy<=(circle.r*circle.r));	
}

function readMouseMove(e){
	if((pause==false&&gameOver==false)&&(enter==true)&&(mouseDown==true)){
		mouseX = e.clientX-243;
		mouseY = e.clientY-126;
		if(level==0){//For Basic mode
			if(mouseX<0){
				heroX=0;
			}
			if(mouseX+heroWidth>canvasWidth){
				heroX=canvasWidth-heroWidth;
			}
			if(mouseY<0){
				heroY=0;
			}
			if(mouseY+heroHeight>canvasHeight){
				heroY=canvasHeight-heroHeight;
			}
			if(oldMouseX<mouseX||oldMouseY!=mouseY){
				scoreUpdate();
			}
		}
		else{//For Hacker mode
			if(heroX<0){
				heroX=0;
			}
			if(heroX+heroWidth>canvasWidth){
				heroX=canvasWidth-heroWidth;
			}
			if(heroY<0){
				heroY=0;
			}
			if(heroY+heroHeight>canvasHeight){
				heroY=canvasHeight-heroHeight;
			}
			if(oldHeroX<heroX||oldHeroY!=heroY){
				scoreUpdate();
			}
		}
		if(mouseX>oldMouseX){
			q=2;
			if(p<2){
				p++;
			}
			else{
				p=0;
			}
		}
		if(mouseX<oldMouseX){
			q=1;
			if(p<2){
				p++;
			}
			else{
				p=0;
			}
		}
		if(mouseY>oldMouseY){
			q=0;
			if(p<2){
				p++;
			}
			else{
				p=0;
			}
		}
		if(mouseY<oldMouseY){
			q=3;
			if(p<2){
				p++;
			}
			else{
				p=0;
			}
		}
		if(level!=0){
			if(mouseX>heroX){
			heroX+=heroVelocity;
			}
			if(mouseX<heroX){
				heroX-=heroVelocity;
			}
			if(mouseY>heroY){
				heroY+=heroVelocity;

			}
			if(mouseY<heroY){
				heroY-=heroVelocity;
			}
		}
	
		oldMouseX=mouseX;
		oldMouseY=mouseY;
		oldHeroX=heroX;
		oldHeroY=heroY;
		drawCharacter();
	}
}

function obstacle(x,y,breadth,length,side,hasTwoWalls){
	this.x=x;
	this.y=y;
	this.breadth = breadth;
	this.length = length;
	this.side = side;
	this.hasTwoWalls = hasTwoWalls;

	this.update = function(){
		if(this.x<-breadth){
			this.x=canvasWidth;
			if(this.side=="north"){
				this.length=280+Math.random()*140;
				if(this.hasTwoWalls==true){
					this.hasTwoWalls==false;
					nTwoWalls--;
				}
			}
			else{
				this.length=500;
				this.y=240+Math.random()*100;
			}
		}
		else if(this.hasTwoWalls==true&&this.side=="north"){
			nTwoWalls++;
			ctx.fillStyle = "#ff1744";
			ctx.fillRect(this.x,this.y+this.length+wallDist,this.breadth,twoWallLength);
		}
	}

	this.heroWallCollide = function(){
		//Checking for normal walls
		if(((mouseX+heroWidth>=this.x)&&(mouseX<=this.x+this.breadth))&&((mouseY<=this.y+this.length)&&(this.side=="north"))){
			gameOver=true;
			hit.play();
		}
		if(((mouseX+heroWidth>=this.x)&&(mouseX<=this.x+this.breadth))&&((mouseY+heroHeight>=this.y)&&(this.side=="south"))){
			gameOver=true;
			hit.play();
		}

		//Checking for extra wall in a Two wall system
		if(this.hasTwoWalls==true){
			if(((mouseX+heroWidth>=this.x)&&(mouseX<=this.x+this.breadth))&&((mouseY+heroHeight>=this.y+this.length+wallDist))){
				gameOver=true;
				hit.play();
			}
		}
	}
}

function hitman(x,y,side,orient){
	this.x = x;
	this.y = y;
	this.side = side;
	this.orient = orient;
}

function obstaclePosition(i){
	x = canvasWidth-190*i;
	x+=250;
	hasTwoWalls=false;
	if(i%2==0){
		side="north";
		y=0;
		length = 270+Math.random()*100;
	}
	else{
		side="south";
		y=240+Math.random()*100;
		length=500;
	}
	obstacleArray.push(new obstacle(x,y,breadth,length,side,hasTwoWalls)); 
}

function hitmanPosition(i){
	//hitmanArray.push(new hitman(x,y,side,orient));
}

for(i=0;i<nWalls;i++){
	obstaclePosition(i);
}

for(i=0;i<nHitman;i++){
	//hitmanPosition(i);
}

function drawTitleCard(){
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.fillStyle = "violet";
	ctx.font = "bold italic 50px Trebuchet MS";
	ctx.fillText("Maze Runner",380,120);
	ctx.fillStyle = "red";
	ctx.font = "23px Trebuchet MS";
	ctx.fillText("WARNING: Don't ever dare to touch the walls",315,200);
	ctx.fillStyle = "yellow";
	ctx.font = "bold 27px Trebuchet MS";
	ctx.fillText("Click on the character at first ",340,270);
	ctx.fillText("then move the cursor to move the character",250,320);
	ctx.fillStyle = "white";
	ctx.font = "bold 30px Trebuchet MS";
	ctx.fillText("Press ENTER to start the game!",330,390);
}

function drawCharacter(){
	ctx.clearRect(0,0,canvasWidth,canvasHeight);
	if(level==0){
		heroX=mouseX;
		heroY=mouseY;
	}
	ctx.drawImage(hero,48*p,72*q,48,72,heroX,heroY,heroWidth,heroHeight);
}

function drawObstacles(x,y,breadth,length){
	ctx.fillStyle = "#ff1744";
	ctx.fillRect(x,y,breadth,length);
}

function obstaclesUpdate(){
	if(nTwoWalls==0){
		rand = Math.random();
		if(rand<=0.2){
			k=0;
		}
		else if(rand>0.2&&rand<0.6){
			k=2;
		}
		else{
			k=4;
		}
		obstacleArray[k].hasTwoWalls=true;
		obstacleArray[k].length=50+Math.random()*100;
	}
	for(j=0;j<nWalls;j++){
		obstacleArray[j].update();
		if(level==0){
			obstacleArray[j].heroWallCollide();
		}
		drawObstacles(obstacleArray[j].x,obstacleArray[j].y,obstacleArray[j].breadth,obstacleArray[j].length);
		obstacleArray[j].x-=speed;
	}
}

function scoreUpdate(){
	time+=inc;
	score=Math.round(speed*time);
}

function scoreDraw(){	
	ctx.fillStyle = "white";
	ctx.font = "25px bold Trebuchet MS";
	ctx.fillText("Score : "+score,canvasWidth-canvasWidth*0.12,canvasHeight-canvasHeight*0.05);
	ctx.fillStyle = "#ff1744";
}	

function healthmeterDraw(){	
	ctx.fillStyle = "white";
	ctx.fillRect(0.05*canvasWidth,0.9*canvasHeight,170,25);
	ctx.fillStyle = "black";
	ctx.fillRect(0.05*canvasWidth+5,0.9*canvasHeight+5,160,15);
	ctx.fillStyle = "red";
	ctx.fillRect(0.05*canvasWidth+5,0.9*canvasHeight+5,health,15);
}

function levelDraw(){
	ctx.fillStyle = "white";
	ctx.font = "25px bold Trebuchet MS";
	ctx.fillText("Level : "+level,0.9*canvasWidth,0.07*canvasHeight);
}

function levelUpdate(){
	if(score>500){
		level=2;
		speed=1.6;
		heroVelocity=3.3;
	}
	else if(score>1000){
		level=3;
		speed=2;
		heroVelocity=3.6;
	}
	else if(score>1500){
		level=4;
		speed=2.3;
		heroVelocity=3.9;
	}
	else if(score>2000){
		level=5;
		speed=2.7;
		heroVelocity=4.2;
	}	
	else if(score>2500){
		gameCompleteDraw();
	}
}

function initialise(){
	drawCharacter();
	obstaclesUpdate();
	scoreDraw();
	healthmeterDraw();
	levelDraw();
	levelUpdate();
}

function pauseGameDraw(){//Function which draws the card placed on game pause
	ctx.fillStyle = "#000000";
	ctx.globalAlpha = 0.6;
	ctx.fillRect(canvasWidth-canvasWidth*0.73,canvasHeight-canvasHeight*0.8,500,300);
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#FF0000";
	ctx.font = "40px Trebuchet MS";
	ctx.fillText("GAME PAUSED",canvasWidth-canvasWidth*0.62,canvasHeight-canvasHeight*0.65);
	ctx.font = "30px Trebuchet MS";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Press P to resume",canvasWidth-canvasWidth*0.62,canvasHeight-canvasHeight*0.52);
	ctx.fillText("Press R to restart",canvasWidth-canvasWidth*0.62,canvasHeight-canvasHeight*0.40);
}

function quitGameDraw(){//Function which draws the card placed on game quit
	ctx.fillStyle = "#000000";
	ctx.globalAlpha = 0.6;
	ctx.fillRect(canvasWidth-canvasWidth*0.73,canvasHeight-canvasHeight*0.8,500,300);
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#FF0000";
	ctx.font = "40px Trebuchet MS";
	ctx.fillText("Are you sure to Quit?",canvasWidth-canvasWidth*0.67,canvasHeight-canvasHeight*0.65);
	ctx.font = "30px Trebuchet MS";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Press P to resume",canvasWidth-canvasWidth*0.62,canvasHeight-canvasHeight*0.52);
	ctx.fillText("Press R to restart",canvasWidth-canvasWidth*0.62,canvasHeight-canvasHeight*0.40);
}

function gameOverDraw(){//end screen to draw on canvas when the game is over
	ctx.fillStyle = "#000000";
	ctx.globalAlpha = 0.6;
	ctx.fillRect(canvasWidth-canvasWidth*0.73,canvasHeight-canvasHeight*0.8,500,300);
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#FF0000";
	ctx.font = "40px Trebuchet MS";
	ctx.fillText("GAME OVER",canvasWidth-canvasWidth*0.61,canvasHeight-canvasHeight*0.65);
	ctx.font = "30px Trebuchet MS";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Score : "+score,canvasWidth-canvasWidth*0.58,canvasHeight-canvasHeight*0.53);
	ctx.fillText("Press R to restart",canvasWidth-canvasWidth*0.63,canvasHeight-canvasHeight*0.40);
}

function gameCompleteDraw(){//end screen to draw on canvas when the game is over
	ctx.fillStyle = "#000000";
	ctx.globalAlpha = 0.6;
	ctx.fillRect(canvasWidth-canvasWidth*0.73,canvasHeight-canvasHeight*0.8,500,300);
	ctx.globalAlpha = 1;
	ctx.fillStyle = "green";
	ctx.font = "40px Trebuchet MS";
	ctx.fillText("GAME COMPLETED",canvasWidth-canvasWidth*0.65,canvasHeight-canvasHeight*0.65);
	ctx.font = "30px Trebuchet MS";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Score : "+score,canvasWidth-canvasWidth*0.58,canvasHeight-canvasHeight*0.53);
	ctx.fillText("Press R to restart",canvasWidth-canvasWidth*0.63,canvasHeight-canvasHeight*0.40);
}


function animation(){

	if(enter==true){
		if(level==0){
			bgAudio1.play();
		}
		else{
			bgAudio2.play();
		}
		initialise();

		if(pause==true){
			pauseGameDraw();
			return;
		}
		if(quit==true){
			pause=true;
			quitGameDraw();
			return;
		}
		if(gameOver==true){//Gameover condition checking
			health=0;
			healthmeterDraw();
			if(level==0){
				stopAudio(bgAudio1);
			}
			else{
				stopAudio(bgAudio2);
			}
			dead.play();
			gameOverDraw();
			return;
		}
		if(score>2500){
			if(level==0){
				stopAudio(bgAudio1);
			}
			else{
				stopAudio(bgAudio2);
			}
			gameCompleteDraw();
			return;
		}
	}	
	requestAnimationFrame(animation);
}

drawTitleCard();
animation();