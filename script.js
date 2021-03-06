//------------GLOBAL VARS-------------------
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var TRACK_WIDTH = 300;
var MAX_X_OFFSET = 200;
var SCROLL_SPEED;
var SPEED_INCREASE = 5;
var TRACK_VARIATION;
var TRACK_VARIATION_INCREASE = 25;
var REFRESH_RATE = 30;
var OBSTACLE_FREQUENCY = 300;
var NUM_PROFS = 32;
var DIF_CHANGE = 10000;
var LEVEL = 1;
var WIN_LEVEL = 5;
var SECONDS;


//-----------GENERAL SET UP----------------
var context;
var leftKeyDown, rightKeyDown;

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.context = this.canvas.getContext("2d");
    context = this.context;
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, REFRESH_RATE);
    this.levelUpInterval = setInterval(levelUp, DIF_CHANGE);
    this.timeInterval = setInterval(secondPassed, 1000);
    SECONDS = 0;
    LEVEL = 1;
    SCROLL_SPEED = 5;
    TRACK_VARIATION = 100;
  },
  clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
    clearInterval(this.levelUpInterval);
    clearInterval(this.timeInterval);
  },
  pause : function() {
    this.stop();
  },
  resume: function() {
    this.interval = setInterval(updateGameArea, REFRESH_RATE);
    this.levelUpInterval = setInterval(levelUp, DIF_CHANGE);
    this.timeInterval = setInterval(secondPassed, 1000);
  }
};

var canvas = myGameArea.canvas;

function preload(){
  car = loadImage('images/black-white-racecar.png');
}

function startGame() {
  myGameArea.start();
  $("#level span").text(LEVEL.toString());
  $("#time span").text(SECONDS.toString() + " seconds");
  myVehicle = new vehicle(30, 60, "img/car.png", CANVAS_WIDTH/2 - 15, CANVAS_HEIGHT - 100, 10, 10);

  myTrack = new track(TRACK_WIDTH, 5, "white");
}

function updateGameArea() {
  myGameArea.clear();

  //make canvas background green
  context.fillStyle = "green";
  context.fillRect(0, 0, canvas.width, canvas.height);

  //update track
  myTrack.update();

  //update vehicle
  myVehicle.update();

  //check to see if vehicle is off track; if so, end game
  if(!myTrack.contains(myVehicle.x, myVehicle.y, myVehicle.width, myVehicle.height)){
    endGame();
  }

  //check to see if vehicle hit obstacle; if so, end game
  $.each(myTrack.obstacles, function(){
    if(this.intersects(myVehicle.x, myVehicle.y, myVehicle.width, myVehicle.height)){
      endGame();
    }
  });
}

function endGame() {
  myGameArea.stop();
  $("#msg").html("<h1>GAME OVER</h1><h2>You survived " + SECONDS.toString() + " seconds.<h2><button id='startOver'>Play Again</button>");
  $("#startOver").on("click", function(){
    location.reload();
  });
}

function levelUp() {
  LEVEL++;
  if (LEVEL == WIN_LEVEL) {
    myGameArea.pause();
    $("#msg").html("<h1>YOU REACHED PALLET TOWN</h1><h2>Keep playing to see how long you can survive.<h2><button id='resume'>Continue</button>");
    $("#resume").on("click", function(){
      myGameArea.resume();
    });
  }
  SCROLL_SPEED += SPEED_INCREASE;
  TRACK_VARIATION += TRACK_VARIATION_INCREASE;

  $("#level span").text(LEVEL.toString());
}

function secondPassed() {
  SECONDS++;
  $("#time span").text(SECONDS.toString() + " seconds");
}

//--------------VEHICLE------------------
var myVehicle;

function vehicle(width, height, img, x, y, speedV, speedH) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedV = speedV;
  this.speedH = speedH;
  this.image = new Image();
  this.image.src = img;

  //function to draw vehicle
  this.update = function () {
    //move vehicle
    var newX = this.x;
    if(leftKeyDown){
      newX -= myVehicle.speedH;
    }
    if(rightKeyDown){
      newX += myVehicle.speedH;
    }
    myVehicle.moveTo(newX, myVehicle.y);

    context.drawImage(this.image, 
      this.x, 
      this.y,
      this.width, this.height);
  };

  //functions to determine if car can move to new location (x, y)
  this.canMoveToX = function(x) {
    return x >= 0 && (x + myVehicle.width) <= CANVAS_WIDTH;
  };
  this.canMoveToY = function(y) {
    return y >= 0 && (y+ myVehicle.height) <= CANVAS_HEIGHT;
  };
  this.canMoveTo = function(x, y){
    return this.canMoveToX(x) && this.canMoveToY(y);
  };

  //move vehicle to new location (x, y) if that location is accessible
  //if the location isn't accessible, move as much as possible
  this.moveTo = function(x, y) {
    while (!this.canMoveToX(x) && x != this.x){
      x += (x < this.x) ? 1 : -1;
    }

    while (!this.canMoveToY(y) && y != this.y){
      y += (y < this.y) ? 1 : -1;
    }

    this.x = x;
    this.y = y;
  }
}

//-------------------TRACK------------------------
var myTrack;

function track(width, lineHeight, color) {
  this.width = width;
  this.lineHeight = lineHeight;
  this.color = color;

  //function to update track
  this.update = function() {
    this.scroll(SCROLL_SPEED);
    this.addObstacles(OBSTACLE_FREQUENCY);

    $.each(this.lines, function(){
        this.update();
    });

    $.each(this.obstacles, function(){
        this.update();
    });
  };

  //initialize lines
  this.lines = [];
  initTrackLines(this, CANVAS_HEIGHT/this.lineHeight, this.width, CANVAS_HEIGHT - this.lineHeight, this.lineHeight, this.color);

  //obstacles
  this.obstacles = [];
  this.obstacle = function(x, y, w, h, img){
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.image = new Image();
    this.image.src = img;

    this.update = function(){
      context.drawImage(this.image, 
        this.x, 
        this.y,
        this.width, this.height);
    }

    this.intersects = function(x, y, w, h){
      var topLeft = isWithinRect(this.x, this.y, x, y, w, h);
      var topRight = isWithinRect(this.x + this.width, this.y, x, y, w, h);
      var bottomLeft = isWithinRect(this.x, this.y + this.height, x, y, w, h);
      var bottomRight = isWithinRect(this.x + this.width, this.y + this.height, x, y, w, h);

      return topLeft || topRight || bottomLeft || bottomRight;

      //note - this will have errors if the obstacle is bigger than the object
    }
  }
  
  this.addObstacles = function(obsFreq) {
    //add a new obstacle if the most recent one has moved far enough down the screen
    if (myTrack.obstacles.length == 0 || myTrack.obstacles[0].y > obsFreq) {
      //calculate x location for new obstacle
      var lineWidth = myTrack.lines[myTrack.lines.length - 1].width
      var lineCenterX = myTrack.lines[myTrack.lines.length - 1].x + lineWidth/2;
      var obsCenterX = lineCenterX + Math.random()*lineWidth*0.7 - lineWidth*0.7/2
      var obsWidth = 25;

      //pick a random image
      var imgNum = Math.round(Math.random()*(NUM_PROFS-1));

      myTrack.obstacles.unshift(new this.obstacle(obsCenterX - obsWidth/2, 0, obsWidth, 32, "img/profs/" + imgNum.toString() + ".jpg"));
    }
  }
  
  //function to scroll the track down by y pixels
  this.scroll = function(y){
    //figure out how many lines to add/remove
    var n = Math.abs(Math.round(y/myTrack.lineHeight));
      
    //remove track lines from bottom (the track lines at end of array are at bottom of screen)
    for(var i = 0; i < n; i++) {
      myTrack.lines.shift();
    }

    //update y value on all lines
    $.each(myTrack.lines, function(){
      this.y += y;
    });

    //add new lines
    initTrackLines(myTrack, n, myTrack.width, myTrack.lines[myTrack.lines.length-1].y - myTrack.lineHeight, myTrack.lineHeight, myTrack.color);

    //move obstacles down the track
    $.each(myTrack.obstacles, function(){
      this.y += y;
    });

    //remove obstacles that are past the bottom of the canvas
    while (myTrack.obstacles.length > 0 && myTrack.obstacles[myTrack.obstacles.length - 1].y > CANVAS_HEIGHT){
      myTrack.obstacles.pop();
    }
  }

  //function to determine if a point is on track
  this.contains = function(x, y, w, h){
    //figure out which track line is at this y
    var i = this.lines.length - Math.round(y/this.lineHeight - 0.5) - 1;

    //loop through all track lines that are within range of the object
    for (var j = 0; this.lines[i - j].y <= y + h; j++){
      var left = isWithinRect(x, y + j*lineHeight, this.lines[i - j].x, this.lines[i - j].y, this.lines[i - j].width, this.lines[i - j].height);
      var right = isWithinRect(x + w, y + j*lineHeight, this.lines[i - j].x, this.lines[i - j].y, this.lines[i - j].width, this.lines[i - j].height);
      
      if (!left || !right) {
        return false;
      }
    }

    //if we made it here, we're good!
    return true;
  }

}

//variables used by initTrackLines to create smooth random track movement
var xOffsetGoal = 0;
var oldXOffsetGoal = xOffsetGoal;
var cyclesPerGoal = 25;
var goalProgressCounter = cyclesPerGoal;

//function to create the lines of the track
function initTrackLines(myTrack, numLines, width, initialY, lineHeight, color) {
  var xOffset;
  var y = initialY;

  for (var i = 0; i < numLines; i++) {
    //check if we need to set a new xOffsetGoal
    if(goalProgressCounter == cyclesPerGoal) {
      oldXOffsetGoal = xOffsetGoal;
      goalProgressCounter = 0;

      //make sure that the xOffsetGoal isn't too big
      do {
        xOffsetGoal += Math.random()*TRACK_VARIATION - TRACK_VARIATION/2;
      }
      while (xOffsetGoal > MAX_X_OFFSET || xOffsetGoal < -MAX_X_OFFSET);
    }

    //calculate the xOffset for this new line based on the xOffsetGoal
    //and how close we are to reaching it
    xOffset = oldXOffsetGoal + goalProgressCounter*(xOffsetGoal-oldXOffsetGoal)/cyclesPerGoal;

    //add the lines
    myTrack.lines.push(new trackLine(xOffset, width, y, lineHeight, color));
    
    //iterate the necessary variables
    goalProgressCounter++;
    y -= lineHeight;
  }
}

function trackLine(xCenterOffset, width, y, height, color) {
  this.height = height;
  this.y = y;
  this.xCenterOffset = xCenterOffset;
  this.width = width;

  //calculate x -- xCenterOffset tells us how far off center the line should be
  this.x = (CANVAS_WIDTH/2) + this.xCenterOffset - (this.width/2);
  
  //function to draw track line
  this.update = function() {
    context.fillStyle = color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

//------------------HELPERS-----------------------
function isWithinRect(x, y, rx, ry, rw, rh) {
  return x >= rx && y >= ry && x <= (rx + rw) && y <= (ry + rh);
}

//-----------------DOM INTERACTION-------------------
$(document).ready(function() {

  $("#startBtn").on("click", function(){
    $("#instructions").hide();
    $("#stats").show();
    startGame();
  });

  //move car when arrow keys are pressed
  $(document).on("keydown", function(e) {

    switch(e.which){
      case 37: // left
        leftKeyDown = true;
      break;

      case 39: // right
        rightKeyDown = true;
      break;

      default: return; // exit this handler for other keys
    }

    e.preventDefault();
  });

  $(document).on("keyup", function(e) {
    var newX = myVehicle.x;
    var newY = myVehicle.y;

    switch(e.which){
      case 37: // left
        leftKeyDown = false;
      break;

      case 39: // right
        rightKeyDown = false;
      break;

      case 80: //P - pause
        myGameArea.pause();
      break;

      case 82: //R - resume
        myGameArea.resume();
      break;

      default: return; // exit this handler for other keys
    }
    e.preventDefault();
  });
  
});