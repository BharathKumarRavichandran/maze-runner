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
var animVariable=0;
var heroWidth= 50;
var heroHeight= 70;
var hitmanWidth=65;
var hitmanHeight=90;
var projectileWidth=30;
var projectileHeight=30;
var heroX=mouseX;
var heroY=mouseY;
var hitmanX;
var hitmanY;
var heroProjectileX=heroX+heroWidth;
var heroProjectileY=heroY+heroHeight/2;
var hitmanProjectileX;
var hitmanProjectileY;
var radius=30;//Character's radius
var score=0;//score of the character
var scoreHit=0;//score to track killing of hitmen
var level=1;//Hacker mode level>=1---Basic mode level=0
var nWalls=6;//Number of walls to be generated initially
var nHitman=6;//Number of Hitman generated initially
var nCurrentHitman=0;//Currently, number of hitman active
var speed=3;//speed at which the obstacles approach the character
var heroVelocity=3;
var heroShot=0;
var hitmanShot=0;
var heroLifeShot=8;
var hitmanLifeShot=1;
var hitmanVelocity=1.2;
var projectileVelocity=4;
var heroProjDir="right";
var hitmanProjDir="right";
var obstacleDist=190; 
var nTwoWalls=0;

var enter=false;
var space=false;
var spaceListen=false;
var mouseDown=false;
var hasTwoWalls=false;
var wallDist = 130;
var collision=false; 
var active=false;
var allowed=false;
var heroFire=false;
var heroFireAllowed=true;
var hitmanFire=false;
var hitmanFireAllowed=true;
var hitmanProjectileHit=false;
var pause=false;
var quit=false;
var gameOver=false;
var gameComplete=false;

var obstacleArray = new Array();
var twoWall = new Array();
var hitmanArray = new Array();
var heroAnimVariable = new Array();
var levelUpdated = new Array();

var x;
var x1;
var y;
var side;//stores north or south
var orient;//orientation of hitman
var direction;
var n;//n order of hitman
var n1;
var n2;
var breadth=50;//Breadth of wall obstacle 
var length;//Length of wall obstacle
var twoWallLength = 500;
var i=0;
var j=0;
var k=0;
var p=0;
var q=2;
var k=0;
var l=0;
var rand;
var time=0;
var inc=0.1;

var hero = new Image();
var hitmanImage = new Image();
var heroProjectile = new Image();
var hitmenProjectile = new Image();

hero.src = "assets/hero.jpg";
hitmanImage.src = "assets/hitman.png";
heroProjectile.src = "assets/heroProjectile1.png";
hitmenProjectile.src = "assets/hitmenProjectile1.png";

var bgAudio1 = new Audio("audio/Surreal-Chase_Looping.mp3");
var bgAudio2 = new Audio("audio/Puzzle-Game_Looping.mp3");
var hit = new Audio("audio/hit.wav");
var dead = new Audio("audio/gameOver.mp3");

bgAudio1.loop = true;
bgAudio2.loop = true;

if(level==0){//For Basic mode
	speed=3;
	inc=0.05;
}
else{//For Hacker mode
	speed=1.3;
	inc=0.1;
}

for(i=0;i<4;i++){
	heroAnimVariable[i]=0;
}

for(i=2;i<6;i++){
	levelUpdated[i]=false;
}

document.onmousemove = readMouseMove;

document.addEventListener("keydown",function(event){

	if(event.keyCode==13){//enter keyCode
		enter=true;
	}

	if(event.keyCode==68){//d keycode
		if(heroFireAllowed==true){	
			heroFireAllowed=false;
			heroFire=true;
			heroProjDir="right";
			heroProjectileX=heroX+heroWidth;
			heroProjectileY=heroY+heroHeight/2;
		}	
	}

	if(event.keyCode==65){//a keycode
		if(heroFireAllowed==true){	
			heroFireAllowed=false;
			heroFire=true;
			heroProjDir="left";
			heroProjectileX=heroX;
			heroProjectileY=heroY+heroHeight/2;
		}	
	}

	if(event.keyCode==87){//w keycode
		if(heroFireAllowed==true){	
			heroFireAllowed=false;
			heroFire=true;
			heroProjDir="up";
			heroProjectileX=heroX+heroWidth/2;
			heroProjectileY=heroY;
		}	
	}

	if(event.keyCode==83){//s keycode
		if(heroFireAllowed==true){	
			heroFireAllowed=false;
			heroFire=true;
			heroProjDir="down";
			heroProjectileX=heroX+heroWidth/2;
			heroProjectileY=heroY+heroHeight;
		}	
	}

	if(event.keyCode==32){//space keyCode
		if(spaceListen==true){
			spaceListen=false;
			animation();
		}
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
       	if((quit==true&&pause==true)&&((enter==true)&&(spaceListen==false))){
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
	mouseX = event.clientX-w2;
	mouseY = event.clientY-canvas.offsetTop;
	if(((mouseX>=heroX)&&(mouseX<heroX+heroWidth))&&((mouseY>=heroY)&&(mouseY<heroY+heroHeight))){
		mouseDown=true;
	}
},false);

if(level>0){
	canvas.addEventListener("click",function(event){
		
		if(heroFireAllowed==true){	
			heroFireAllowed=false;
			heroFire=true;

			if(q==0){
				heroProjDir="down";
				heroProjectileX=heroX+heroWidth/2;
				heroProjectileY=heroY+heroHeight;
			}
			else if(q==1){
				heroProjDir="left";
				heroProjectileX=heroX;
				heroProjectileY=heroY+heroHeight/2;
			}
			else if(q==2){
				heroProjDir="right";
				heroProjectileX=heroX+heroWidth;
				heroProjectileY=heroY+heroHeight/2;
			}
			else if(q==3){
				heroProjDir="up";
				heroProjectileX=heroX+heroWidth/2;
				heroProjectileY=heroY;
			}
		}	

	},false);
}	

function stopAudio(audio) {    //Function to stop audio the current audio from playing
    audio.pause();
    audio.currentTime = 0;
}

function readMouseMove(e){
	if((pause==false&&gameOver==false)&&((enter==true)&&(mouseDown==true))&&((gameComplete==false)&&(spaceListen==false))){
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
			if(heroAnimVariable[0]%6==0){//hitman frame rate control condn
				scoreUpdate();
				if(p<2){
					p++;
				}
				else{
					p=0;
				}
			}	
		}

		if(mouseX<oldMouseX){
			q=1;
			if(heroAnimVariable[1]%6==0){//hitman frame rate control condn
				scoreUpdate();
				if(p<2){
					p++;
				}
				else{
					p=0;
				}
			}	
		}
		if(mouseY>oldMouseY){
			q=0;
			if(heroAnimVariable[2]%6==0){//hitman frame rate control condn
				scoreUpdate();
				if(p<2){
					p++;
				}
				else{
					p=0;
				}
			}	
		}
		if(mouseY<oldMouseY){
			q=3;
			if(heroAnimVariable[3]%6==0){//hitman frame rate control condn
				scoreUpdate();
				if(p<2){
					p++;
				}
				else{
					p=0;
				}
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
		for(i=0;i<4;i++){//To control the hero frame rate
			heroAnimVariable[i]++;
		}
		drawCharacter();
	}
}

function characterWallCollide(charX,charY,charWidth,charHeight,wallX,wallY,wallSide,wallLength,wallBreadth,hasTwoWalls,char,n2){
		//Checking for normal walls(right side)
		if(((charX+charWidth>=wallX)&&(charX<=wallX))&&((charY<=wallY+wallLength)&&(wallSide=="north"))){
			if(charY-(wallY+wallLength)!=0){
				if(char=="hero"){
					charX = wallX-charWidth;
				}
				if(char=="heroProjectile"){
					heroFire=false;
					heroFireAllowed=true;
				}
				if(char=="hitmanProjectile"){
					return true;
				}
				if(char=="hitman"){
					hitmanArray[n2].changeX=false;
					hitmanArray[n2].direction="left";
					if(hitmanArray[n2].orient=="vertical"){
						hitmanArray[n2].direction="up";
					}
				}
			}
		}

		if(((charX+charWidth>=wallX)&&(charX<=wallX))&&((charY+charHeight>=wallY)&&(wallSide=="south"))){
			if(charY+charHeight-wallY!=0){
				if(char=="hero"){
					charX = wallX-charWidth;
				}
				if(char=="heroProjectile"){
					heroFire=false;
					heroFireAllowed=true;
				}
				if(char=="hitmanProjectile"){
					return true;
				}
				if(char=="hitman"){
					hitmanArray[n2].direction="left";
					hitmanArray[n2].changeX=false;
					if(hitmanArray[n2].orient=="vertical"){
						hitmanArray[n2].direction="up";
					}
				}
			}
		}
		
		//Checking for normal walls(left side)
		if(((charX-(wallX+wallBreadth)<0)&&(charX>wallX))&&((charY<=wallY+wallLength)&&(wallSide=="north"))){
			if(charY-(wallY+wallLength)!=0){
				if(char=="hero"){
					charX = wallX+wallBreadth+2;
				}
				if(char=="heroProjectile"){
					heroFire=false;
					heroFireAllowed=true;
				}
				if(char=="hitmanProjectile"){
					return true;
				}
				if(char=="hitman"){
					hitmanArray[n2].direction="right";
					hitmanArray[n2].changeX=false;
					if(hitmanArray[n2].orient=="vertical"){
						hitmanArray[n2].direction="up";
					}
				}
			}	
		}
		if(((charX-(wallX+wallBreadth)<0)&&(charX>wallX))&&((charY+charHeight>=wallY)&&(wallSide=="south"))){
			if(charY+charHeight-wallY!=0){
				if(char=="hero"){
					charX = wallX+wallBreadth+2;
				}
				if(char=="heroProjectile"){
					heroFire=false;
					heroFireAllowed=true;
				}
				if(char=="hitmanProjectile"){
					return true;
				}
				if(char=="hitman"){
					hitmanArray[n2].direction="right";
					hitmanArray[n2].changeX=false;
					if(hitmanArray[n2].orient=="vertical"){
						hitmanArray[n2].direction="up";
					}
				}
			}	
		}

		//Checking for normal walls(top and bottom side)
		if(((charX+charWidth>=wallX)&&(charX<=wallX+wallBreadth))&&((charY-(wallY+wallLength)==0)&&(wallSide=="north"))){//North wall's bottom condn
			if(char=="hero"){
				charY = wallY+wallLength;
			}
			if(char=="heroProjectile"){
				heroFire=false;
				heroFireAllowed=true;
			}
			if(char=="hitmanProjectile"){
				return true;
			}
			if(char=="hitman"){
				hitmanArray[n2].direction="down";
			}
		}
		if(((charX+charWidth>=wallX)&&(charX<=wallX+wallBreadth))&&((charY+charHeight-wallY==0)&&(wallSide=="south"))){//South wall's top condn
			if(char=="hero"){
				charY = wallY-charHeight;
			}
			if(char=="heroProjectile"){
				heroFire=false;
				heroFireAllowed=true;
			}
			if(char=="hitmanProjectile"){
				return true;
			}
			if(char=="hitman"){
				hitmanArray[n2].direction="up";
			}
		}

		//Checking for extra wall in a Two wall system
		if(hasTwoWalls==true){
			if(((charX+charWidth>=wallX)&&(charX<=wallX))&&((charY+charHeight>=wallY+wallLength+wallDist))){
				if(charY+charHeight-wallY!=0){
					if(char=="hero"){
						charX = wallX-charWidth;
					}
					if(char=="heroProjectile"){
						heroFire=false;
						heroFireAllowed=true;
					}
					if(char=="hitmanProjectile"){
						return true;
					}
					if(char=="hitman"){
						hitmanArray[n2].direction="left";
						hitmanArray[n2].changeX=false;
						if(hitmanArray[n2].orient=="vertical"){
						hitmanArray[n2].direction="up";
					}
					}
				}
			}
			if(((charX-(wallX+wallBreadth)<0)&&(charX>wallX))&&((charY+charHeight>=wallY+wallLength+wallDist))){
				if(char=="hero"){
					charX = wallX+wallBreadth+2;	
				}
				if(char=="heroProjectile"){
					heroFire=false;
					heroFireAllowed=true;
				}
				if(char=="hitmanProjectile"){
					return true;
				}
				if(char=="hitman"){
					hitmanArray[n2].direction="right";
					hitmanArray[n2].changeX=false;
					if(hitmanArray[n2].orient=="vertical"){
						hitmanArray[n2].direction="up";
					}
				}
			}
		}
		if(char=="hero"){
			heroX=charX;
			heroY=charY
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

	this.heroWallCollide = function(){//for level 0 -- Basic mode
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

	this.heroWallCollide1 = function(){//For level>0 -- Hacker mode
		characterWallCollide(heroX,heroY,heroWidth,heroHeight,this.x,this.y,this.side,this.length,this.breadth,this.hasTwoWalls,"hero",0);
	}

	this.hitmanWallCollide = function(){
		for(i=0;i<nHitman;i++){
			characterWallCollide(hitmanArray[i].x,hitmanArray[i].y,hitmanWidth,hitmanHeight,this.x,this.y,this.side,this.length,this.breadth,this.hasTwoWalls,"hitman",hitmanArray[i].n);
		}
	}

	this.heroProjectileWallCollide = function(){
		characterWallCollide(heroProjectileX,heroProjectileY,projectileWidth,projectileHeight,this.x,this.y,this.side,this.length,this.breadth,this.hasTwoWalls,"heroProjectile",0);
	}

	this.hitmanProjectileWallCollide = function(hitmanProjectileX,hitmanProjectileY){
		hitmanProjectileHit = characterWallCollide(hitmanProjectileX,hitmanProjectileY,projectileWidth,projectileHeight,this.x,this.y,this.side,this.length,this.breadth,this.hasTwoWalls,"hitmanProjectile",0);
		return hitmanProjectileHit;
	}

	this.heroWallSqueeze = function(){
		//Checking for normal walls(right side squeeze)
		if(((heroX+heroWidth>=this.x)&&((heroX<=this.x)&&heroX<=0))&&((heroY<=this.y+this.length)&&(this.side=="north"))){
			gameOver=true;
		}

		if(((heroX+heroWidth>=this.x)&&((heroX<=this.x)&&heroX<=0))&&((heroY+heroHeight>=this.y)&&(this.side=="south"))){
			gameOver=true;
		}

		//Checking for extra wall in a Two wall system(right side squeeze)
		if(this.hasTwoWalls==true){
			if(((heroX+heroWidth>=this.x)&&((heroX<=this.x)&&heroX<=0))&&((heroY+heroHeight>=this.y+this.length+wallDist))){
				gameOver=true;
			}
		}	
	}
}

function hitman(x,y,side,orient,direction,active,allowed,k,l,n,hitmanFire,hitmanFireAllowed,hitmanProjectileX,hitmanProjectileY,hitmanShot,animVariable){
	this.x = x;
	this.y = y;
	this.side = side;
	this.orient = orient;
	this.direction = direction;
	this.active = active;
	this.allowed=allowed;
	this.k=k;
	this.l=l;
	this.n=n;
	this.hitmanFire=hitmanFire;
	this.hitmanFireAllowed=hitmanFireAllowed;
	this.hitmanProjectileX=hitmanProjectileX;
	this.hitmanProjectileY=hitmanProjectileY;
	this.hitmanShot=hitmanShot;
	this.animVariable=animVariable;
	this.changeX=true;

	if(this.n<(nWalls-1)){
		n1=this.n+1;
	}
	else if(this.n==(nWalls-1)){
		n1=0;
	}

	this.update = function(){

		this.changeX=true;

		if(this.hitmanFire==false&&this.hitmanFireAllowed==true){
			
			if(this.l==2){
				this.hitmanProjDir="down";
				this.hitmanProjectileX=this.x+hitmanWidth/2-15;
				this.hitmanProjectileY=this.y+hitmanHeight;
			}
			else if(this.l==1){
				this.hitmanProjDir="left";
				this.hitmanProjectileX=this.x;
				this.hitmanProjectileY=this.y+hitmanHeight/2;
			}
			else if(this.l==3){
				this.hitmanProjDir="right";
				this.hitmanProjectileX=this.x+hitmanWidth;
				this.hitmanProjectileY=this.y+hitmanHeight/2;
			}
			else if(this.l==0){
				this.hitmanProjDir="up";
				this.hitmanProjectileX=this.x+hitmanWidth/2-15;
				this.hitmanProjectileY=this.y;
			}
		}	

		if(this.animVariable<6){//To control the hitman frame rate
			this.animVariable++;
		}
		else{
			this.animVariable=0;
		}

		if(this.x<-hitmanWidth+25){//If hitman goes less than x=0 coordinate
			//Setting X-coordinate by checking two wall condns
			if(obstacleArray[n1].hasTwoWalls==true){
				this.x=obstacleArray[n].x+obstacleArray[n].breadth+(Math.random()*((obstacleDist/2)-hitmanWidth+20));
			}
			else{
				this.x=obstacleArray[n].x+obstacleArray[n].breadth+(Math.random()*(obstacleDist-hitmanWidth));
			}

			if(this.side=="north"){
				this.side="south";
				y=0.53*canvasHeight+Math.random()*100;
			}
			else{
				this.side="north";
				y=0.05*canvasHeight+Math.random()*100;	
			}

			if(this.active==false&&this.allowed==true){
				this.active=true;
			}
		}

		//Hitman Animation
		if((this.animVariable%6)==0){//To control the hitman frame rate
			if(this.k<9){
				this.k++;
			}
			else{
				this.k=0;
			}
		}


		if(this.y<=0){//If hitman goes out - less than y=0
			this.direction="down";
		}

		if(this.y+hitmanHeight>=canvasHeight){//If hitman goes out - more than canvasHeight
			this.direction="up";
		}

		if(this.orient=="horizontal"){
			if(this.direction=="right"){//direction right
				this.x+=hitmanVelocity;
				this.l=3;
				if((this.x+hitmanWidth>=obstacleArray[n1].x)&&((this.side==obstacleArray[n1].side)||(obstacleArray[n1].hasTwoWalls==true))){
					this.direction="left";
					this.changeX=false;
				}

				for(i=0;i<nWalls;i++){
					x1=obstacleArray[i].x;
					if((this.x+hitmanWidth>=x1)&&(this.x<x1)){
						if(obstacleArray[i].hasTwoWalls==true){
								this.direction="left";
								this.changeX=false;
						}
						else{
							if(this.side==obstacleArray[i].side){
								this.direction="left";
								this.changeX=false;
							}
						}
					}
				}
			}
			
			else{//direction left
				this.x-=hitmanVelocity;
				this.l=1;
				if(this.x<=obstacleArray[n].x+obstacleArray[n].breadth){
					this.direction="right";
					this.changeX=false;
				}

				for(i=0;i<nWalls;i++){
					x1=obstacleArray[i].x;
					if(((this.x-x1+obstacleArray[i].breadth<1)&&(this.x+hitmanWidth>x1+obstacleArray[i].breadth))){
						if(obstacleArray[i].hasTwoWalls==true){						
							this.direction="right";
							this.changeX=false;
						}
						else{
							if(this.side==obstacleArray[i].side){						
								this.direction="right";
								this.changeX=false;
							}
						}
					}
				}
			}	
		}
		else{//vertical orient 
			if(this.direction=="up"){//direction up
				this.y-=hitmanVelocity;
				this.l=0;
			}
			else{//direction down
				this.y+=hitmanVelocity;
				this.l=2;
			}

			if(this.direction=="up"){
				if((this.y-(obstacleArray[n1].y+obstacleArray[n1].length)<0.5)&&(obstacleArray[n1].side=="north")){
					this.direction="down";
				}
			}
			else{
				if(((obstacleArray[n1].y)-(this.y+hitmanHeight)<0.5)&&(obstacleArray[n1].side=="south")){
					this.direction="up";
				}
			}
		}

	}

	this.heroApproachHitman = function(){

		if(this.allowed==true&&this.active==true){

			if(this.x-heroX<200&&this.x-heroX>0){

				if(this.y-heroY>0){
					this.orient="vertical";
					this.direction="up";
				}
				else if(heroY-this.y>0){
					this.orient="vertical";
					this.direction="down";
				}

				this.update();

				for(rand=0;rand<nWalls;rand++){
					obstacleArray[rand].hitmanWallCollide();
				}

				if(this.changeX==true){
					this.l=1;
					this.x-=1;
				}

				if((this.x-heroX<100&&this.x-heroX>0)||(Math.abs(this.y-heroY)<100)){
					if(this.hitmanFire==false&&this.hitmanFireAllowed==true){	
						this.hitmanFire=true;
						this.hitmanFireAllowed=false;
						if(this.x-heroX>Math.abs(heroY-this.y)){
							this.hitmanProjDir="left";
						}
						else{
							if(heroY-this.y>0){
								this.hitmanProjDir="down";
							}	
							else{
								this.hitmanProjDir="up";
							}
						}
					}	
				}

			}

			if(heroX-this.x<200&&heroX-this.x>0){

				if(this.y-heroY>0){
					this.orient="vertical";
					this.direction="up";
				}
				else if(heroY-this.y>0){
					this.orient="vertical";
					this.direction="down";
				}

				this.update();

				for(rand=0;rand<nWalls;rand++){
					obstacleArray[rand].hitmanWallCollide();
				}

				if(this.changeX==true){
					this.l=3;
					this.x+=1;
				}


				if((heroX-this.x<100&&heroX-this.x>0)||(Math.abs(this.y-heroY)<100)){
					if(this.hitmanFire==false&&this.hitmanFireAllowed==true){
						this.hitmanFire=true;
						this.hitmanFireAllowed=false;
						if(heroX-this.x>Math.abs(heroY-this.y)){
							this.hitmanProjDir="right";
						}	
						else{
							if(heroY-this.y>0){
								this.hitmanProjDir="down";
							}	
							else{
								this.hitmanProjDir="up";
							}
						}
					}
				}		
			}
		}	

	}

	this.hitmanProjectileHeroHit = function(){//Condition to check if the hitman's projectile hits the hero
	
		if(this.hitmanProjectileX+projectileWidth/2>=heroX&&this.hitmanProjectileX+projectileWidth/2<=heroX+heroWidth){
			if(this.hitmanProjectileY+projectileHeight/2>=heroY&&this.hitmanProjectileY+projectileHeight/2<=heroY+heroHeight){
				this.hitmanFire=false;
				this.hitmanFireAllowed=true;
				heroShot++;
				health-=10;
			}
		}
	}
}

function obstaclePosition(i){
	x = canvasWidth-obstacleDist*i;
	x+=250;
	hasTwoWalls=false;
	if(i%2==0){
		side="north";
		y=0;
		length = 240+Math.random()*100;
	}
	else{
		side="south";
		y=240+Math.random()*100;
		length=500;
	}
	obstacleArray.push(new obstacle(x,y,breadth,length,side,hasTwoWalls)); 
}

function hitmanPosition(i){
	animVariable=0;
	n=i;
	hitmanShot=0;

	hitmanFire=false;
	hitmanFireAllowed=true;

	if(n==0||n==2||n==5){
		allowed=true;
		active=true;
		nCurrentHitman++;
	}
	else{
		active=false;
		allowed=false;
	}

	if(i<(nWalls-1)&&obstacleArray[i+1].hasTwoWalls==true){
		x=obstacleArray[i].x+obstacleArray[i].breadth+(Math.random()*((obstacleDist/2)-hitmanWidth));
	}
	else if(i==(nWalls-1)&&(obstacleArray[0].hasTwoWalls==true)){
		x=obstacleArray[i].x+obstacleArray[i].breadth+(Math.random()*((obstacleDist/2)-hitmanWidth));
	}
	else{
		x=obstacleArray[i].x+obstacleArray[i].breadth+(Math.random()*(obstacleDist-hitmanWidth));
	}
	if(obstacleArray[i].side=="north"){//For north side hitman
		side="north";
		y=0.05*canvasHeight+Math.random()*150;
		if(obstacleArray[i].hasTwoWalls==true){//If it has two wall,hitman can be at both north/south side
			if(Math.random()>0.5){//For north side hitman
				side="north";
				y=0.05*canvasHeight+Math.random()*150;
			}
			else{//For north side hitman
				side="south";
				y=0.53*canvasHeight+Math.random()*180;
			}
		}
	}
	else{//For south side hitman
		side="south";
		y=0.53*canvasHeight+Math.random()*180;
	}

	if(Math.random()>0.6){
		orient="horizontal";
		direction="right";
		l=3;
	}
	else{
		orient="vertical";
		direction="up";
		l=0;
	}

	if(l==2){
		direction="down";
		hitmanProjectileX=x+hitmanWidth/2-15;
		hitmanProjectileY=y+hitmanHeight;
	}
	else if(l==1){
		direction="left";
		hitmanProjectileX=x;
		hitmanProjectileY=y+hitmanHeight/2;
	}
	else if(l==3){
		direction="right";
		hitmanProjectileX=x+hitmanWidth;
		hitmanProjectileY=y+hitmanHeight/2;
	}
	else if(l==0){
		direction="up";
		hitmanProjectileX=x+hitmanWidth/2-15;
		hitmanProjectileY=y;
	}

	hitmanArray.push(new hitman(x,y,side,orient,direction,active,allowed,k,l,n,hitmanFire,hitmanFireAllowed,hitmanProjectileX,hitmanProjectileY,hitmanShot,animVariable));
}

for(i=0;i<nWalls;i++){
	obstaclePosition(i);
}

if(level!=0){
	for(i=0;i<nHitman;i++){
		hitmanPosition(i);
	}
}	

function drawTitleCard(){
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.fillStyle = "violet";
	ctx.font = "bold italic 50px Trebuchet MS";
	ctx.fillText("Maze Runner",380,120);
	ctx.fillStyle = "red";
	ctx.font = "23px Trebuchet MS";
	if(level==0){
		ctx.fillText("WARNING: Don't ever dare to touch the walls!",315,200);
	}	
	else{
		ctx.fillText("WARNING: Don't ever go near the skeletons!",315,190);
		ctx.fillText("They are known for their weird behaviour",325,225);
		ctx.fillText("and fast bomb throwing skills",385,260);
		ctx.fillText("Kill skeletons to get increase in score",335,295);
	}
	ctx.fillStyle = "yellow";
	ctx.font = "bold 27px Trebuchet MS";
	if(level==0){
		ctx.fillText("Click on the character at first",340,270);
		ctx.fillText("then move the cursor to move the character",250,320);
	}
	else{
		ctx.fillText("Click on the character at first to move",290,380);
		ctx.fillText("and click mouse or use WASD to throw special bombs",200,420);
		ctx.fillText("NOTE: You can throw only one bomb at a time",240,460);
	}	
	ctx.fillStyle = "white";
	ctx.font = "bold 30px Trebuchet MS";
	if(level==0){
		ctx.fillText("Press ENTER to start the game!",330,390);	
	}
	else{
		ctx.fillText("Press ENTER to start the game!",330,560);
	}
	ctx.fillStyle = "orange";
	ctx.font = "bold 25px Trebuchet MS";
	ctx.fillText("Pause/Resume : P",877,50);
	ctx.fillText("Quit : Q",995,90);
	ctx.fillText("Restart : R",960,130);
	ctx.fillStyle = "white";
	ctx.fillText("CONTROLS",960,420);
	ctx.fillStyle = "green";
	ctx.fillText("Shoot Up : W",940,460);
	ctx.fillText("Shoot Down : S",907,500);
	ctx.fillText("Shoot Right : D",912,540);
	ctx.fillText("Shoot Left : A",925,580);


}

function drawCharacter(){
	ctx.clearRect(0,0,canvasWidth,canvasHeight);
	if(level==0){
		heroX=mouseX;
		heroY=mouseY;
	}
	ctx.drawImage(hero,48*p,72*q,48,72,heroX,heroY,heroWidth,heroHeight);
	if(heroFire==true&&heroFireAllowed==false){
		drawHeroProjectile();
	}
}

function drawObstacles(x,y,breadth,length){
	ctx.fillStyle = "#ff1744";
	ctx.fillRect(x,y,breadth,length);
}

function drawHitman(x,y,active,k,l){
	if(active==true){
		ctx.drawImage(hitmanImage,64*k,64*l,64,64,x,y,hitmanWidth,hitmanHeight);
	}
}

function drawHeroProjectile(){
	ctx.drawImage(heroProjectile,heroProjectileX,heroProjectileY,projectileWidth,projectileHeight);
}

function drawHitmanProjectile(hitmanProjectileX,hitmanProjectileY,active,allowed,hitmanFire,hitmanFireAllowed){
	if((hitmanFire==true&&hitmanFireAllowed==false)&&((active==true)&&(allowed==true))){
		ctx.drawImage(hitmenProjectile,hitmanProjectileX,hitmanProjectileY,projectileWidth,projectileHeight);
	}
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
		else{
			obstacleArray[j].heroWallCollide1();
			obstacleArray[j].heroWallSqueeze();
			obstacleArray[j].hitmanWallCollide();
			if(heroFire==true&&heroFireAllowed==false){
				obstacleArray[j].heroProjectileWallCollide();
			}
			for(i=0;i<nHitman;i++){//hitman projectile collision with hero,walls check condition
				if((hitmanArray[i].active==true)&&((hitmanArray[i].hitmanFire==true)&&(hitmanArray[i].hitmanFireAllowed==false))){
					hitmanArray[i].hitmanProjectileHeroHit();
					hitmanProjectileHit=obstacleArray[j].hitmanProjectileWallCollide(hitmanArray[i].hitmanProjectileX,hitmanArray[i].hitmanProjectileY);
					if(hitmanProjectileHit==true){
						hitmanArray[i].hitmanFire=false;
						hitmanArray[i].hitmanFireAllowed=true;
					}
				}
			}
		}
		drawObstacles(obstacleArray[j].x,obstacleArray[j].y,obstacleArray[j].breadth,obstacleArray[j].length);
		obstacleArray[j].x-=speed;
	}
}

function hitmanUpdate(){
	for(j=0;j<nHitman;j++){
		hitmanArray[j].heroApproachHitman();
		hitmanArray[j].update();
		drawHitman(hitmanArray[j].x,hitmanArray[j].y,hitmanArray[j].active,hitmanArray[j].k,hitmanArray[j].l);
		if((hitmanArray[j].hitmanFire==true&&hitmanArray[j].hitmanFireAllowed==false)&&((hitmanArray[j].active==true)&&(hitmanArray[j].allowed==true))){
			drawHitmanProjectile(hitmanArray[j].hitmanProjectileX,hitmanArray[j].hitmanProjectileY,hitmanArray[j].active,hitmanArray[j].allowed,hitmanArray[j].hitmanFire,hitmanArray[j].hitmanFireAllowed);
		}
		hitmanArray[j].x-=speed;
	}

}

function heroProjectileUpdate(){
	if(heroFire==true){
		heroProjectileX-=speed;

		if(heroProjDir=="right"){
			heroProjectileX+=projectileVelocity;
		}
		else if(heroProjDir=="left"){
			heroProjectileX-=projectileVelocity;
		}
		else if(heroProjDir=="up"){
			heroProjectileY-=projectileVelocity;
		}
		else if(heroProjDir=="down"){
			heroProjectileY+=projectileVelocity;
		}

		if(heroProjectileX<=0||heroProjectileX>=canvasWidth||heroProjectileY<=0||heroProjectileY>=canvasHeight){
			heroFire=false;
			heroFireAllowed=true;
		}

		for(i=0;i<nHitman;i++){
			if(hitmanArray[i].active==true){
				if(((heroProjectileX+projectileWidth/2>=hitmanArray[i].x)&&(heroProjectileX+projectileWidth/2<=hitmanArray[i].x+hitmanWidth))&&((heroProjectileY+projectileHeight/2>=hitmanArray[i].y)&&(heroProjectileY+projectileHeight/2<=hitmanArray[i].y+hitmanHeight))){
					hitmanArray[i].hitmanShot++;
					if(hitmanArray[i].hitmanShot>=hitmanLifeShot){
						hitmanArray[i].active=false;
						heroFire=false;
						heroFireAllowed=true;
						scoreHit+=10;
						scoreUpdate();
					}
				}
			}
		}
	}
}

function hitmanProjectileUpdate(n){
	if(hitmanArray[n].hitmanFire==true&&hitmanArray[n].hitmanFireAllowed==false){
		hitmanArray[n].hitmanProjectileX-=speed;

		if(hitmanArray[n].hitmanProjDir=="right"){
			hitmanArray[n].hitmanProjectileX+=projectileVelocity;
		}
		else if(hitmanArray[n].hitmanProjDir=="left"){
			hitmanArray[n].hitmanProjectileX-=projectileVelocity;
		}
		else if(hitmanArray[n].hitmanProjDir=="up"){
			hitmanArray[n].hitmanProjectileY-=projectileVelocity;
		}
		else if(hitmanArray[n].hitmanProjDir=="down"){
			hitmanArray[n].hitmanProjectileY+=projectileVelocity;
		}

		if(hitmanArray[n].hitmanProjectileX<=0||hitmanArray[n].hitmanProjectileX>=canvasWidth||hitmanArray[n].hitmanProjectileY<=0||hitmanArray[n].hitmanProjectileY>=canvasHeight){
			hitmanArray[n].hitmanFire=false;
			hitmanArray[n].hitmanFireAllowed=true;
		}
	}	
}

function scoreUpdate(){
	time+=inc;
	score=Math.round(speed*time)+scoreHit;
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
	ctx.fillStyle = "green";
	if(health<120){
		ctx.fillStyle = "orange";
	}	
	if(health<70){
		ctx.fillStyle = "red";
	}
	ctx.fillRect(0.05*canvasWidth+5,0.9*canvasHeight+5,health,15);
}

function levelDraw(){
	ctx.fillStyle = "white";
	ctx.font = "25px bold Trebuchet MS";
	ctx.fillText("Level : "+level,0.9*canvasWidth,0.07*canvasHeight);
}

function levelUpdate(){
	if(score>100&&levelUpdated[2]==false){
		spaceListen=true;
		level=2;
		speed=1.6;
		heroVelocity=3.6;
		hitmanArray[1].active=true;
		hitmanArray[1].active=true;
		levelUpdated[2]=true;
	}
	else if(score>180&&levelUpdated[3]==false){
		spaceListen=true;
		level=3;
		speed=2;
		heroVelocity=3.9;
		hitmanArray[3].active=true;
		hitmanArray[3].active=true;
		levelUpdated[3]=true;
	}
	else if(score>300&&levelUpdated[4]==false){
		spaceListen=true;
		level=4;
		speed=2.1;
		heroVelocity=4.3;
		hitmanArray[4].active=true;
		hitmanArray[4].active=true;
		levelUpdated[4]=true;
	}
	else if(score>400&&levelUpdated[5]==false){
		spaceListen=true;
		level=5;
		speed=2.4;
		heroVelocity=5;
		levelUpdated[5]=true;
	}	
	else if(score>=500||gameComplete==true){
		gameComplete=true;
		gameCompleteDraw();
	}
}

function initialise(){
	drawCharacter();
	obstaclesUpdate();
	scoreDraw();
	healthmeterDraw();
	if(level!=0){
		hitmanUpdate();
		heroProjectileUpdate();	
		for(j=0;j<nHitman;j++){
			if(hitmanArray[j].active==true&&hitmanArray[j].allowed==true){
				if(hitmanArray[j].hitmanFire==true&&hitmanArray[j].hitmanFireAllowed==false){
					hitmanProjectileUpdate(hitmanArray[j].n);
				}
			}
		}
		levelDraw();
		levelUpdate();
	}
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

function levelUpgradeDraw(){//end screen to draw on canvas when the game is over
	ctx.fillStyle = "#000000";
	ctx.globalAlpha = 0.6;
	ctx.fillRect(canvasWidth-canvasWidth*0.73,canvasHeight-canvasHeight*0.8,500,300);
	ctx.globalAlpha = 1;
	ctx.fillStyle = "green";
	ctx.font = "40px Trebuchet MS";
	ctx.fillText("LEVEL "+level+" COMPLETED",canvasWidth-canvasWidth*0.65,canvasHeight-canvasHeight*0.65);
	ctx.font = "30px Trebuchet MS";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText("Score : "+score,canvasWidth-canvasWidth*0.58,canvasHeight-canvasHeight*0.53);
	ctx.fillText("Press Space to continue",canvasWidth-canvasWidth*0.63,canvasHeight-canvasHeight*0.40);
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

		if(spaceListen==true){
			levelUpgradeDraw();
			return;
		}

		if(quit==true){
			pause=true;
			quitGameDraw();
			return;
		}
		if(gameOver==true||health==0){//Gameover condition checking
			health=0;
			gameOver=true;
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
		if(score>=500||gameComplete==true){
			gameComplete=true;
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