var stage, w, h, loader, level, time;
var keys = {};
var activeplayer = 1;
var enemies =  [];
var floorplan = [];
var holes = [];
var ladders = [];
var level = 1;
var ninja, gameover, treasure, bg, block;
var p1, p2;
p1 = {};
p2 = {};
p1.score = 0;
p2.score = 0;
var p1Display, p2Display, hud;
/*
Util functions
*/

$(document).ready(function() {
  start();
});

function start() {
  canvas = document.getElementById("testCanvas");

  //DOMElement creation
  form = document.getElementById("myform");
  $('#myform').css('display', 'block');
  formDOMElement = new createjs.DOMElement(form);
  //move it's rotation center at the center of the form
  formDOMElement.regX = form.offsetWidth*0.5;
  formDOMElement.regY = form.offsetHeight*0.5;
  //move the form above the screen
  formDOMElement.x = canvas.width * 0.5;
  formDOMElement.y = - 200;

  stage = new createjs.Stage(canvas);

  formDOMElement.x = stage.canvas.width * 0.5;
  formDOMElement.y = - 200;
  //add the formDOMElement to the display list
  stage.addChild(formDOMElement);
  createjs.Ticker.setFPS(24);
  createjs.Ticker.addEventListener("tick", stage);



  //Apply a tween to the form
  createjs.Tween.get(formDOMElement).to({x:stage.canvas.width/2, y:150, rotation:720},2000, createjs.Ease.cubicOut);

  // stage.addChild(formDOMElement);
}

function subfunc(){
  stage.removeAllEventListeners();
  $('#myform').css('display', 'none');
  p1.playername = $('#p1name').val();
  p2.playername = $('#p2name').val();
  $('#rules').css('display', 'none');
  init();
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resetAll(){
	activeplayer = 1;
	enemies = [];
  holes = [];
  floorplan = [];
  ladders = [];
	level = 1;
  p1.score = 0;
  p2.score = 0;
  time = 999;
}


function init() {
	stage = new createjs.Stage("testCanvas");
  w = stage.canvas.width;
  h = stage.canvas.height;

  images = [
		{src: "ninja.png", id: "ninja"},
		{src: "zombie.png", id: "enemy1"},
		{src: "gameover.jpg", id: "gameover"},
		{src: "p2ready.jpg", id:"player2"},
		{src: "chest.png", id:"chest"},
    {src: "ladder2.png", id:"ladder"},
    {src: "floor.png", id:"floor"},
    {src: "brick.png", id:"brick"},
    {src: "blank.png", id:"blank"},
    {src: "1.txt", id:"level1"},
    {src: "2.txt", id:"level2"},
    {src: "3.txt", id:"level3"},
    {src: "win.jpg", id:"win"},
    {src: "results.png", id:"results"}
	];

  loader = new createjs.LoadQueue(false);
  loader.addEventListener("complete", handleComplete);
  loader.loadManifest(images, true, "img/");

  this.document.onkeydown = keydown;
  this.document.onkeyup = keyup;
}

function handleComplete() {
  newLevel();
  // results();
  // nextPlayer();
  // pinit();
  stage.addChild(ninja);
  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", tick);
}
//
// function pinit(){
//   stage = new createjs.Stage("testCanvas");
//   var winimage = new createjs.Bitmap(loader.getResult("first"));
//   stage.addChild(winimage);
// }

function enemy() {
var spriteSheet2 = new createjs.SpriteSheet({
	framerate: 30,
	"images": [loader.getResult("enemy1")],
	"frames": {"height": 64, "width": 64, "regX": 32, "regY": 64},
	// define run animation
	"animations": {
		"run": [0, 9, "run", .25]
	}
});
createjs.SpriteSheetUtils.addFlippedFrames(spriteSheet2, true, false, false);
var sprite = new createjs.Sprite(spriteSheet2, "run");
sprite.direction = "left";
return sprite;
}

function hero(){
  var spriteSheet = new createjs.SpriteSheet({
    framerate: 30,
    "images": [loader.getResult("ninja")],
    "frames": {"height": 77, "width": 50, "regX": 25, "regY": 77},
    // define two animations, run and jump
    "animations": {
      "run": [16, 23, "run", .25],
      "jump": [36, 39, "run", .1],
      "climb": [4, 7, "climb", .1]
    }
  });
  createjs.SpriteSheetUtils.addFlippedFrames(spriteSheet, true, false, false);
  ninja = new createjs.Sprite(spriteSheet, "run");
  ninja.y = 16;
  ninja.x = 5;
  ninja.falling = false;
  ninja.climbing = false;
  ninja.direction = "right";
  ninja.jumpTime = 0;
}

function asset(assetType, assetHeight, assetWidth, assetX, assetY){
  var spriteSheetT = new createjs.SpriteSheet({
    framerate:30,
    "images": [loader.getResult(assetType)],
    "frames": {"height" : assetHeight, "width": assetWidth, "regX": assetWidth/2 , "regY": 0},
    "animations": {
      "idle": [0, 0, "idle", 1]
    }
  });
  var result = new createjs.Sprite(spriteSheetT, "idle");
  result.y = assetY;
  result.x = assetX;
  return result;
}

function textField(datText, xCoord, yCoord, alignment){
  var messageField;
  messageField = new createjs.Text(datText, "bold 24px Arial", "#000000");
  messageField.maxWidth = 1000;
  messageField.textAlign = alignment;
  messageField.textBaseline = "top";
  messageField.x = xCoord;
  messageField.y = yCoord;
  messageField.regX = 0;
  messageField.regY = 0;
  stage.addChild(messageField);
  return messageField;
}

function newLevel(lvlname){
  switch (level) {
    case 1:
    createLevel('img/1.txt');
      break;
    case 2:
    createLevel('img/2.txt');
      break;
    case 3:
    createLevel('img/3.txt');
      break;
    default:
    createLevel(lvlname);
  }
}

function createLevel(lvlname){
  p1Display = new textField(p1.playername + '\rScore: ' + p1.score, 0, 10, 'left');
  p2Display = new textField(p2.playername + '\rScore: ' + p2.score, stage.canvas.width, 10, 'right');
  time = 999;
  hud = new textField('Time:\r' + time, stage.canvas.width/2, 10, 'center');
  bg = new createjs.Shape();
  bg.graphics.beginBitmapFill(loader.getResult("brick")).drawRect(0, 0, w, h);
  stage.addChild(bg);
  treasure = new asset('chest', 32, 80, 900, 625);
  treasure.regY = 16;
  stage.addChild(treasure, p1Display, p2Display, hud);
  hero();
  var wc = 1;
  var hc = 1;
  ladders = [];
  floorplan = [];
  enemies = [];
  holes = [];
  $.get(lvlname, function(data) {
    var txtout = data;
    for (var i in txtout) {
      if (txtout[i] == '.'){
        block = new asset('floor', 16, 32, wc*32 - 16, (hc*128));
        stage.addChild(block);
        wc++;
        floorplan.push(block);
      } else if (txtout[i] == ',') {
        hc++;
        wc = 1;
      } else if (txtout[i] == '~') {
        block = new asset('ladder', 128, 64, wc*32 - 16, (hc*128));
        stage.addChild(block);
        floorplan.push(block);
        ladders.push(block);
        wc++;
      } else if (txtout[i] == '|') {
        block = new asset('blank', 16, 32, wc*32 - 16, (hc*128));
        holes.push(block);
        wc++;
      } else if (txtout[i] == 'z'){
        var zombie = new enemy();
        zombie.x = wc*32 -16;
        zombie.y = hc*128;
        enemies.push(zombie);
        stage.addChild(zombie);
        block = new asset('floor', 16, 32, wc*32 - 16, (hc*128));
        stage.addChild(block);
        wc++;
        floorplan.push(block);
        // console.log("zombie");
      }
    }
  });
}

  function ninjaJump() {
		if(ninja.direction == "right"){
			ninja.gotoAndPlay("jump");
			ninja.jumpTime = 76;
		}
  	else {
  		ninja.gotoAndPlay("jump_h");
			ninja.jumpTime = 76;
  	}
  }

	function jumpMovement(){
		if (ninja.jumpTime > 38) {
			ninja.y -= 2;
		} else {
			ninja.y += 2;
		}
	}

  function ninjaClimbDown(){
    var climbable = 0;
    for (var i = 0; i < ladders.length; i++) {
      if ((Math.abs(ninja.x - ladders[i].x) <= 10) && (Math.abs(ninja.y - ladders[i].y) <= 10)) {
        climbable += 1;
      }
    }
    if (ninja.climbing == true && ninja.falling == true) {
      climbable++;
    }
    if(climbable > 0 && ninja.jumpTime == 0){
      ninja.y += 2;
      if (ninja.climbing == false){
      ninja.gotoAndPlay('climb');
      }
      ninja.climbing = true;
    }
  }

  function ninjaClimbUp(){
    var climbable = 0;
    for (var i = 0; i < ladders.length; i++) {
      if ((Math.abs(ninja.x - ladders[i].x) <= 10) && (Math.abs(ninja.y - ladders[i].y) == 128)){
        climbable += 1;
      }
    }
    if (ninja.climbing == true && ninja.falling == true) {
      climbable++;
    }
    if(climbable > 0 && ninja.y >= 130 && ninja.jumpTime == 0){
      ninja.y -= 2;
      if (ninja.climbing == false){
      ninja.gotoAndPlay('climb');
      }
      ninja.climbing = true;
    }
}

  function ninjaFall(){
    var grounded = 0;
    ninja.falling = false;
    for (var i = 0; i < floorplan.length; i++) {
      if ((Math.abs(ninja.x - floorplan[i].x) <= 24) && (Math.abs(ninja.y - floorplan[i].y) <= 1)) {
        grounded += 1;
      }
    }
    if(grounded == 0){
      if (ninja.climbing == false) {
        ninja.y +=2;
      }
      ninja.falling = true;
    }

  }


	function gravityCheck(){
    if (ninja.y > 750){
      gameOverMan();
    }
		if (ninja.jumpTime == 0) {
      ninjaFall();
		}
		else if (ninja.jumpTime > 1) {
				jumpMovement();
				ninja.jumpTime--;
		} else if (ninja.direction == 'left') {
			jumpMovement();
			ninja.jumpTime--;
			ninja.gotoAndPlay('run_h');
		} else {
			jumpMovement();
			ninja.jumpTime--;
			ninja.gotoAndPlay('run');
		}
	}

  function ninjaRight(){
    if (ninja.x < w - 15 && ninja.climbing == false){
    ninja.x += 1.5;
    }
		if (ninja.direction == "left" && ninja.jumpTime == 0 && ninja.climbing == false) {
			ninja.gotoAndPlay("run");
			ninja.direction = "right";
		} else if (ninja.climbing == true && ninja.falling == true) {
      ninja.gotoAndPlay("run");
			ninja.direction = "right";
      ninja.climbing = false;
      ninja.x += 1.5;
		} else if (ninja.climbing == true){
      ninja.gotoAndPlay("run");
			ninja.direction = "right";
      ninja.climbing = false;
      ninja.x += 1.5;
      ninja.falling = true;
    }


  }

  function ninjaLeft(){
    if (ninja.x > 15 && ninja.climbing == false){
    ninja.x -= 1.5;
    }

		if (ninja.direction == "right" && ninja.jumpTime == 0 && ninja.climbing == false) {
			ninja.gotoAndPlay("run_h");
			ninja.direction = "left";
		} else if (ninja.climbing == true && ninja.falling == true) {
      ninja.gotoAndPlay("run_h");
			ninja.direction = "left";
      ninja.climbing = false;
      ninja.x -= 1.5;
    } else if (ninja.climbing == true){
      ninja.gotoAndPlay("run");
			ninja.direction = "right";
      ninja.climbing = false;
      ninja.x += 1.5;
      ninja.falling = true;
    }
  }

	function enemyMovement(){
    for (var j in holes){
      for (var i in enemies){
        if ((Math.abs(enemies[i].x - holes[j].x) <= 16) && (Math.abs(enemies[i].y - holes[j].y) <= 50) && enemies[i].direction == 'left') {
          enemies[i].direction = 'right';
          enemies[i].gotoAndPlay('run_h');
        } else if ((Math.abs(enemies[i].x - holes[j].x) <= 16) && (Math.abs(enemies[i].y - holes[j].y) <= 50) && enemies[i].direction == 'right') {
          enemies[i].direction = 'left';
          enemies[i].gotoAndPlay('run');
        }
      }
    }


		for (var i in enemies) {
					if (enemies[i].x < 32 && enemies[i].direction == 'left') {
						enemies[i].x++;
						enemies[i].direction = 'right';
						enemies[i].gotoAndPlay('run_h');
					} else if (enemies[i].x > w - 32 && enemies[i].direction == 'right') {
						enemies[i].x--;
						enemies[i].gotoAndPlay('run');
						enemies[i].direction = 'left';
					} else if (enemies[i].direction == 'left'){
						enemies[i].x--;
					} else {
						enemies[i].x++;
					}
		}
	}

  function keydown(event) {
      keys[event.keyCode] = true;
  }

  function keyup(event) {
      delete keys[event.keyCode];
  }

	function keyInput(){
		if(keys[39] || keys[68]){ninjaRight();}
		if(keys[37] || keys[65]){ninjaLeft();}
		if(keys[16]){if (ninja.jumpTime == 0 && ninja.falling == false) {ninjaJump();}}
    if(keys[40] || keys[83]){ninjaClimbDown();}
    if(keys[87] || keys[38]){ninjaClimbUp();}
	}

/*
Collision detection and game condition functions are all below
detectCollison() checks for a collision between the ninja object and enemy objects
by calculating the absolute value of the difference between their x and y coordinates
if the values are both lower than a certain pixel threshold, a collision is triggered
which stops the ticker (animation engine) then calls the gameOverMan method
*/
	function detectCollison() {
		if (Math.abs(ninja.x - treasure.x) <= 5){
			if(Math.abs(ninja.y - treasure.y) <= 16){
				createjs.Ticker.removeAllEventListeners(); //stop the ticker
				nextLevel();
			}
		} else {
			for (var i = 0; i < enemies.length; i++) {
				if (Math.abs(ninja.x - enemies[i].x) <= 20){
					if (Math.abs(ninja.y - enemies[i].y) <= 38){
							createjs.Ticker.removeAllEventListeners(); //stop the ticker
							gameOverMan();
					}
				}
			}
		}

	}
 /*
 gameOverMan is a function which checks the active player variable to see which player is playing,
 if it's player 1, it removes all the objects on the canvas and calls the nextPlayer method.  If player 2
 is playing, it loads the game over screen.
 */
	function gameOverMan() {
    stage.removeAllChildren();
    stage.removeAllEventListeners();
    createjs.Ticker.removeAllEventListeners();
		if (activeplayer == 1) {
			nextPlayer();
		} else if(activeplayer == 2){
      results();
		}
	}

//resets the canvas object, loads the 2nd player ready screen, sets the active player value to 2 and calls init
	function nextPlayer(){
		stage = new createjs.Stage("testCanvas");
		var p2image = new createjs.Bitmap(loader.getResult("player2"));
		stage.addChild(p2image);
		level = 1;
		activeplayer = 2;
		window.setTimeout(init, 2000);
	}

	function nextLevel(){
    if(level == 3){
      updateScore();
      youWin();
    } else {
      updateScore()
      level++;
  		init();
    }
	}

	function changePlayer(){
		activeplayer = 2;
	}

  function updateScore(){
    if (activeplayer == 1) {
      p1.score += parseInt(time);
    } else {
      p2.score += parseInt(time);
    }
  }
  function youWin(){
    stage = new createjs.Stage("testCanvas");
    var winimage = new createjs.Bitmap(loader.getResult("win"));
    stage.addChild(winimage);
    if (activeplayer == 1) {
      window.setTimeout(nextPlayer, 4000);
    } else {
      results();
    }
  }

  function timer() {
    if (time >= 0) {
        time-= .1;
    } else {
      time = 0;
    }
    hud.text = 'Time:\r' + parseInt(time);
  }

  function results(){
    var resultsText, textBox, goText, paText;
    stage = new createjs.Stage("testCanvas");
    var resultsImage = new createjs.Bitmap(loader.getResult("results"));
    if (p1.score > p2.score) {
      resultsText = p1.playername + ' wins!';
    } else if (p2.score > p1.score){
      resultsText = p2.playername + ' wins!';
    } else {
      resultsText = 'It was a draw!';
    }
    resetAll();
    goText = new textField('Game Over', 40, 120, 'left')
    goText.color = '#bad94a';
    textBox = new textField(resultsText, 40, 220, 'left');
    textBox.color = '#bad94a';
    paText = new textField('Click Here to Play Again', 40, 320, 'left')
    paText.color = '#bad94a';
    paText.addEventListener("click", init);
    stage.addChild(resultsImage, goText, textBox, paText);

  }
/*
This is the most important function, it is basically the entire animation engine.
easel allows for the creation of a ticket event object, which basically calls this
tick function on every animation frame, so every function below gets called on every single frame
This allows me to easily handle movement, physics, and collision detection on every single frame.
*/

  function tick(event) {
    stage.setChildIndex(ninja,stage.getNumChildren()-1); //put ninja object in the foreground
		keyInput();
    detectCollison();
		enemyMovement();
		gravityCheck();
    timer();
  	stage.update(event);
  }
