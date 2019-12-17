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

//user input variables
K_LEFT = 37; K_RIGHT = 39; K_DOWN = 40; K_A = 65; K_S = 83; K_D = 68;
var down = false;
var left = false;
var right = false;

//plunger variables
var plungerHeight = 465;
//paddle variables
var leftDeg = 30;
var rightDeg = 150;

//ball/motion variables
var ballX = 480;
var ballY = 440;
var ballRadius = 20;
var dx = 0;
var dy = 0;
var force = 0;
var gravity = -.3;
var dampen = .97;

//end vars
///////////////////////////////////////////////////////////////////////
//
//

//
//gets the con(text)
//runs the game loop
function init(){
	canvas = document.getElementById("surface");
	if (canvas.getContext){
		con = canvas.getContext('2d');
		border();
		//game loop
    console.log("ramp: " + (Math.atan(-.5)+Math.PI));
    console.log("right roof " + Math.atan2(-(45-250),(300-505)));
    console.log("left roof " + (Math.atan2(-(250-45),(95-300))+Math.PI*2));
		setInterval(gameLoop, 20);
	}
}

function drawBall(){
	con.beginPath();
		con.fillStyle = "red";
		con.arc(ballX, ballY, ballRadius, 0, 2*Math.PI);
		con.closePath();
	con.fill();

  //get force and direction
  force = Math.sqrt(dx*dx + dy*dy);
  /*
  var theta = Math.atan2(-dy,dx) *10;
  if (theta < 0){theta+=Math.PI*20}
  console.log("THETA: " + theta);
	*/

  //check collisions
  var collision = false;
  //check circular collisions
	collision = checkCircle();
	function checkCircle(){
		var dir = Math.atan2(dy,dx);
		//dir -= Math.PI/2;
		if (dir < 0){
			dir = Math.PI;
		}
		else{
			dir = 0;
		}
		//console.log("dir " + dir);
		//var dir = 0;
		for (var i = 0; i<Math.PI; i+=.1){
			if (checkCircleCollisions(ballX +ballRadius* Math.cos(dir +i), ballY + ballRadius * Math.sin(dir +i), dir +i)){
				//collision =true;
				//console.log("circ");
				//break;
				//return true;
				//ballX += dx;
				//ballY -= dy;
				//var odx = dx;
				/*var ody = dy;
				if (checkCircle()){
					ballX -= odx/2;
					ballY += ody/2;
					checkCircle();
				}
				*/
				return true;
			}
		}
		return false;
	}
	//if ()
  /*
  for (var i = -16; i < 17; i++){
    var circumX = ballX + ballRadius * Math.cos((theta +i)/10);
    var circumY = ballY + ballRadius * Math.sin((theta +i)/10);
    if (checkCircleCollisions(circumX, circumY, (theta +i)/10)){
      collision = true;
      console.log("circle");
      break;
    }
  }
  */
  //check flat collisions
  checkVerticalCollisions();
  checkHorizontalCollisions();
  /*
  if (collision == false){
    console.log("huh");
    collision = checkVerticalCollisions();
  }
  if (!collision){
    if (checkHorizontalCollisions()){
      //console.log("horizontal");
    }
  }
  else {
    console.log("vertical");
  }
  */

  //apply gravity, dampen and move
  dy += gravity;
  //dampen
  if (collision){
		console.log("DAMPEN");
    dx = dampen * dx;
    dy = dampen * dy;
  }

  ballX += dx;
  ballY -= dy;

  while (ballY - ballRadius  <= 250-(205 * Math.sin(Math.acos((ballX-300)/205)))){
		//ballX -= dx;
		console.log("while");
		ballY += 1;
	}

	//ballY -= gravity;
  //move
  //console.log("ballX " +ballX);
  //console.log("ballY " +ballY);

  //game over
  if (ballY > 520 && ballX < 455){
    ballX = 480;
    ballY = 440;
    dx = 0;
    dy = 0;
  }
}
//needs fixed
function checkHorizontalCollisions(){
	//check collision
  var plung = false
  //plunger
  if (ballX >= 455 && ballX<= 505){
    if (ballY + ballRadius >= plungerHeight-5){
      if (dy<0){
        //console.log("dyyyyyyyy");
        dy=0;
        if (ballY + ballRadius > plungerHeight - 5){
          //console.log("ballYYYYYYYY");
          ballY--;
        }
        plung = true;
      }
      if (plungerUp){
        //console.log("plungUP");
        dy+=27 * ((plungerHeight - 465)/100);
        plung = true;
      }
    }
  }
  return plung;
}
function checkVerticalCollisions(){
  //left outer wall
  if (ballX-ballRadius - force <= 100 && ballY >= 250){
    if (dx < 0){
      dx=-dx;
      if (ballX-ballRadius < 100){
        ballX = 100+ballRadius;
      }
      console.log("lO");
      return true;
    }
  }
  /*ball chute wall
  if (ballY >= 300){
    if (ballX + ballRadius + force > 450 && ballX - ballRadius < 450){
      dx = -dx;
      //console.log("bb");
      return true;
    }
  }
  */
  //right outer wall
  if (ballX+ballRadius > 500 && ballY >= 250){
    dx=-dx;
    console.log("rO");
    return true;
  }
  return false;
}
function checkCircleCollisions(circumX, circumY, theta){

  var roofTheta = Math.acos((circumX-300 + Math.cos(theta))/205);
  var roofY = 250-(205 * Math.sin(roofTheta));
  //check roof collision
  if (circumY -force*Math.sin(theta) <= roofY){

    var xo = Math.cos(roofTheta -.1);
    var yo = Math.sin(roofTheta -.1);

    var xt = Math.cos(roofTheta +.1);
    var yt = Math.sin(roofTheta +.1);

    var roofTangent = Math.atan2((yt - yo), (xt - xo));
    if (roofTangent < 0){
			roofTangent+=Math.PI*2;
			if (roofTangent >= (5* Math.PI) /4 ){
				console.log("half");
				rootTangent -= Math.PI/2;
			}
		}


    console.log("rt " + roofTangent);
		//if (theta > Math.PI){theta += Math.PI*2}
    console.log("theta " + theta);
    var collisionAngle =(roofTangent+theta);

    console.log("theta-rt " + collisionAngle);

    dy =  (Math.sin(collisionAngle)) * force;
    console.log("dy " + dy);
    dx = (Math.cos(collisionAngle)) * force;

    console.log("dx " +dx);
    console.log("cX " +circumX+"cY " +circumY);

    return true;
  }

  //check ramps  FIX
  if (ballY + ballRadius >= 440){

//absolute value???

    //left ramp
    if (ballX-ballRadius < 175){
      if (circumY + force*Math.sin(theta)  >= (440 - (.5 *(95 - circumX))-3 )){
        var collisionAngle = theta - 2.679;
        dx =  (Math.abs(Math.cos(collisionAngle)) * force);
        dy =  ((Math.sin(collisionAngle)) * force);
        //if (dy>0){dy=-dy}
        console.log("left ramp");
        return true;
      }
    }
    //right ramp
    else if (ballX+ballRadius > 375 && ballX + ballRadius < 455 && circumY + force *Math.sin(theta)>= (440 + (.5 *(455 - circumX))-3 )){
      var collisionAngle = theta - .46;
      dx = - Math.abs(Math.cos(collisionAngle)) * force;
      dy =  ((Math.sin(collisionAngle)) * force);
      //if (dy>0){dy=-dy}
      console.log("right ramp " + dy);
      return true;
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
  return false;
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
  //vertical bounds
	leftWall = new line(95, 250, 95, 560);
	rightOut = new line(505, 250, 505, 560);
	rightIn = new line(455, 300, 455, 560);
	//ramps
	bottomLeft = new line(95, 440, 175, 480);
	bottomRight = new line(455, 440, 375, 480);
  //draw roof
  con.beginPath();
  con.arc(300, 250, 205, Math.PI, 0);
  con.lineWidth = "10";
  con.stroke();

  //draws a line
  function line(fromX, fromY, toX, toY){
    con.beginPath();
    con.lineWidth = "10";
    con.strokeStyle= "black";
    con.moveTo(fromX, fromY);
    con.lineTo(toX, toY);
    con.stroke();
    con.closePath();
  }
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
