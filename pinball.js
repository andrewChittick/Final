//pinball.js
//Andrew Chittick
//10/8/19
//PINBALLL!!!!!!!!!!!
///////////////////////////////////////////////////////////////////////
//TODO:
//plunger motion, followed by ball motion/gravity/collision
//
///////////////////////////////////////////////////////////////////////
//Global variables/constants
//
//
//canvas variables
var canvas; //600 x 600  board is 40,40
var con;
var down = false;
var left = false;
var right = false;

//
//plunger variables
var plungerHeight = 465;
//var leftX = 245;
//var leftY = 515;
var leftDeg = 30;
var rightDeg = 150;
//var rightX = 305;
//var rightY = 515;
var gravity = .1;
var dampen = .3;
var ballX = 480;
var ballY = 440;
var ballRadius = 20;
var dx = 0;
var dy = 0;

 K_LEFT = 37; K_RIGHT = 39; K_DOWN = 40; K_A = 65; K_S = 83; K_D = 68;
//end vars
///////////////////////////////////////////////////////////////////////
//
//

//
//gets the con(text)
//checks for mouse up and mouse down
//
function init(){
	canvas = document.getElementById("surface");
	if (canvas.getContext){
		con = canvas.getContext('2d');
		border();
		//game loop
		setInterval(gameLoop, 30);
	}
}
var collision = false;
function drawBall(){
	con.beginPath();
		con.fillStyle = "red";
		con.arc(ballX, ballY, ballRadius, 0, 2*Math.PI);
		con.closePath();
	con.fill();

  collision = false;
  dy += gravity;

  var theta = (Math.atan(dy/dx) - 1.57) *10;

  for (var i = 0; i < 31; i++, theta++){
    var circumX = ballX + ballRadius * Math.cos(theta/10);
    var circumY = ballY + ballRadius * Math.sin(theta/10);
    checkCircleCollisions(circumX, circumY, theta/10);
  }


  //for (var i=0; i<628; i+=10){}
  checkVerticalCollisions();
  checkHorizontalCollisions();

  //add force
  ballX += dx;
  ballY += dy;
}
function checkHorizontalCollisions(){
	//check collision
  //plunger
  if (ballX >= 455 && ballX<= 505){
    if (ballY + ballRadius >= plungerHeight-5){
      if (dy>0){
        //dy = -dy;
        //console.log("plunger");
        collision = true;
        //ballY = plungerHeight - ballRadius;
        //console.log(collision);
        dy=0;
      }
      if (plungerUp){
        dy-=5;
        //ballY+=dy;
      }
    }
  }
}
function checkVerticalCollisions(){
  //left outer wall
  if (ballX-ballRadius <= 100 && ballY >= 250){dx=-dx * .9}
  //ball chute wall
  if (ballY >= 300){
    if (ballX + ballRadius >= 450){
      dx = -dx * .9;
    }
  }
  //right outer wall
  if (ballX+ballRadius >= 500 && ballY >= 250){dx=-dx * .9}
  //if (ballX+ballRadius >= 450 && ballX < 450){dx=-dx}
}
function checkCircleCollisions(circumX, circumY, theta){
  var force = Math.sqrt(dx*dx + dy*dy);
  //dampen
  force = force * .9;
  //roof
  //(x-h)^2 + (y-k)^2 = 205^2
  //(y-250)(y-250) = 205^2 -(ballX-300)^2
  //y^2 - 500y + 250^2 =
  //y (y - 500) = 205^2 - 250^2 - (ballX-300)^2
  //y-250)^2 =
  //var x = r cos t;
  var roofTheta = Math.acos((circumX-300)/205);
  //console.log(roofTheta);
  //console.log(Math.sin(Math.PI/2));
  var roofY = 250-(205 * Math.sin(roofTheta));
  //var roofY = 250 - (205 * )
  //var roofY = -20475 - ((ballX-300) * (ballX-300));
  //console.log(roofY);
  if (circumY <= roofY+5){
    dx = - (Math.cos(theta)) * force;
    dy = - (Math.sin(theta)) * force;
  }

  //ramps
  if (ballY + ballRadius >= 440){
    if (ballY - ballRadius > 480 && ballX + ballRadius <= 455){
      dy = 5;
      //console.log("oop");
    }

    //left ramp
    else if (ballX-ballRadius < 175){
      if (circumY >= (440 - (.5 *(95 - circumX)))){
        dx = -(Math.cos(theta)) * force;
        dy = - (Math.sin(theta)) * force;
        //console.log("left ramp");
      }
    }
    //right ramp
    else if (ballX+ballRadius > 375 && ballX + ballRadius < 455 && circumY >= (440 + (.5 *(455 - circumX)))){
      dx = - (Math.cos(theta)) * force;
      dy = - (Math.sin(theta)) * force;
      //console.log("right ramp");
    }
  }

  //left paddle



  //right wall inner
  //right wall outer
  //left wall
  //bottom walls
  //paddles
  //too low = bad
  /*
	if (ballY >= 560 || ballY <= 40){
		dy = -dy;
	}
  */
}

var plungerUp = false;

function gameLoop(){
	con.clearRect(40,40,520,520);
	setBounds();
	setPaddles();
	setPlunger();
	drawBall();
	//check for key presses
	document.onkeydown = updateKeys;
	document.onkeyup = clearKeys;
	//handle key presses
	//pluger
	if (down){
		if (plungerHeight < 555){plungerHeight++}
	}
	else {
		if (plungerHeight > 465){
      plungerHeight-=7;
      plungerUp = true;
    }
    else{
      plungerUp = false;
    }
	}
	//left paddle
	if (left){
    if (leftDeg > -30){
      leftDeg-=3;
    }
	}
  else if (leftDeg <30){
    leftDeg++;
  }
	//right paddle
	if (right){
    if (rightDeg < 210){
      rightDeg+=3;
    }
	}
  else if (rightDeg > 150){
    rightDeg--;
  }
}

function setBounds(){
	leftWall = new wall(95, 250, 95, 560);
	rightOut = new wall(505, 250, 505, 560);
	rightIn = new wall(455, 300, 455, 560);
	//removeCenterLine = new wall(275, 0, 275, 600);

	bottomLeft = new wall(95, 440, 175, 480);
	bottomRight = new wall(455, 440, 375, 480);
	//removebottom = new wall(95, 440, 455, 440);
	//remoooooove = new wall(175, 480, 375, 480);

	/*draw top
	con.beginPath();
	con.moveTo(95, 180);
	con.bezierCurveTo(95, 10, 505, 10, 505, 180);
	con.stroke();
  */
  //draw roof
  con.beginPath();
  con.arc(300, 250, 205, Math.PI, 0);
  //con.closePath();
  con.stroke();
}
//
//
function wall(fromX, fromY, toX, toY){
	con.beginPath();
		con.lineWidth = "10";
		con.strokeStyle= "black";
		con.moveTo(fromX, fromY);
		con.lineTo(toX, toY);
		con.stroke();
	con.closePath();
}
function setPlunger(){
	con.beginPath();
		con.strokeStyle= "black";
		con.moveTo(455, plungerHeight);
		con.lineTo(505, plungerHeight);
		con.stroke();
	con.closePath();
	con.beginPath();
		con.strokeStyle= "black";
		con.moveTo(480, plungerHeight);
		con.lineTo(480, 560);
		con.stroke();
	con.closePath();
}
function setPaddles(){
	//left paddle
	var leftX = 78.26 * Math.cos(leftDeg*Math.PI /180) + 175;
	var leftY = 78.26 * Math.sin(leftDeg*Math.PI /180) + 480;
	con.beginPath();
		con.strokeStyle= "orange";
		con.moveTo(175, 480);
		con.lineTo(leftX, leftY);
		con.stroke();
	con.closePath();

	//right paddle
	var rightX = 78.26 * Math.cos(rightDeg*Math.PI /180) + 375;
	var rightY = 78.26 * Math.sin(rightDeg*Math.PI /180) + 480;
	con.beginPath();
		con.strokeStyle= "orange";
		con.moveTo(375, 480);
		con.lineTo(rightX, rightY);
		con.stroke();
	con.closePath();
}
function updateKeys(e){
	currentKey = e.keyCode;
	if (currentKey == K_DOWN || currentKey == K_S){
		down = true;
    plungerUp = false;
	}
	else if (currentKey == K_LEFT || currentKey == K_A){
		left = true;
	}
	else if (currentKey == K_RIGHT || currentKey == K_D){
		right = true;
	}
}
function clearKeys(e){
	currentKey = e.keyCode;
	if (currentKey == K_DOWN){
		down = false;
	}
	else if (currentKey == K_LEFT){
		left = false;
	}
	else if (currentKey == K_RIGHT){
		right = false;
	}
}
//a rainbow gradiant border
//with title
//
function border(){
	//make gradients for border
	var ro = con.createLinearGradient(0,0,600,0);
	ro.addColorStop(0, "red");
	ro.addColorStop(1, "orange");

	var oy = con.createLinearGradient(0,0,0,600);
	oy.addColorStop(0, "orange");
	oy.addColorStop(1, "yellow");

	var yg = con.createLinearGradient(0,0,600,0);
	yg.addColorStop(0, "green");
	yg.addColorStop(1, "yellow");

	var gb = con.createLinearGradient(0,0,0,600);
	gb.addColorStop(0, "blue");
	gb.addColorStop(1, "green");

	var bi = con.createLinearGradient(0,0,560,0);
	bi.addColorStop(0, "blue");
	bi.addColorStop(1, "indigo");

	var iv = con.createLinearGradient(0,0,0,560);
	iv.addColorStop(0, "indigo");
	iv.addColorStop(1, "violet");

	var vr = con.createLinearGradient(0,0,560,0);
	vr.addColorStop(0, "red");
	vr.addColorStop(1, "violet");

	var or = con.createLinearGradient(0,0,0,560);
	or.addColorStop(0, "orange");
	or.addColorStop(1, "red");

	//draw frame
	//
	//top
	con.fillStyle = ro;
	con.fillRect(0, 0, 600, 20);
	//right
	con.fillStyle = oy;
	con.fillRect(580, 0, 20, 600);
	//bottom
	con.fillStyle = yg;
	con.fillRect(20, 580, 600, 20);
	//left
	con.fillStyle = gb;
	con.fillRect(0, 20, 20, 580);
	//inner top
	con.fillStyle = bi;
	con.fillRect(20, 20, 560, 20);
	//inner right
	con.fillStyle = iv;
	con.fillRect(560, 20, 20, 560);
	//inner bottom
	con.fillStyle = vr;
	con.fillRect(20, 560, 560, 20);
	//inner left
	con.fillStyle = or;
	con.fillRect(20, 40, 20, 520);

	//draw title
	con.font = "30px Arial";
	con.fillStyle = "white";
	con.fillText("Pinball", 240, 30);
	//draw me
	con.font = "20px Arial";
	con.fillText("Andrew Chittick", 230, 595);
}
