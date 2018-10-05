//------------CONSTANTS-------------------
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var TRACK_WIDTH = 300;
var MAX_X_OFFSET = 200;
var SCROLL_SPEED = 30;
var REFRESH_RATE = 30;


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
  },
  clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
  }
};

var canvas = myGameArea.canvas;

function preload(){
  car = loadImage('images/black-white-racecar.png');
}

function startGame() {
  myGameArea.start();
<<<<<<< HEAD


  vehicle = new vehicle(20, 20, "blue", CANVAS_WIDTH/2 - 10, CANVAS_HEIGHT/2 + 10, 10, 10);
=======
  vehicle = new vehicle(20, 20, "blue", CANVAS_WIDTH/2 - 10, CANVAS_HEIGHT - 100, 10, 10);
>>>>>>> 0abd6441dc144518e7b878b53642ae88bd84b0df
  track = new track(TRACK_WIDTH, 5, "white");
}

function updateGameArea() {
  myGameArea.clear();

  //make canvas background green
  context.fillStyle = "green";
  context.fillRect(0, 0, canvas.width, canvas.height);

  //update track
  track.update();

  //update vehicle
  vehicle.update();

  //check to see if vehicle is off track; if so, end game
  if(!track.contains(vehicle.x, vehicle.y, vehicle.width, vehicle.height)){
    endGame();
  }
}

function endGame() {
  myGameArea.stop();
  alert("You lost :(");
}


//--------------VEHICLE------------------
var vehicle;


function vehicle(width, height, color, x, y, speedV, speedH) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedV = speedV;
  this.speedH = speedH;

  //function to draw vehicle
<<<<<<< HEAD
  this.update = function () {
=======
  this.update = function(){
    //move vehicle
    var newX = this.x;
    if(leftKeyDown){
      newX -= vehicle.speedH;
    }
    if(rightKeyDown){
      newX += vehicle.speedH;
    }
    vehicle.moveTo(newX, vehicle.y);

>>>>>>> 0abd6441dc144518e7b878b53642ae88bd84b0df
    context.fillStyle = color;
    context.fillRect(this.x, this.y, this.width, this.height);
  };

// function vehicle(width, height, color, x, y, speedV, speedH) {
//   this.width = width;
//   this.height = height;
//   this.x = x;
//   this.y = y; 
//   this.speedV = speedV;
//   this.speedH = speedH;

//   //function to draw vehicle
//   this.update = function(){
//     context.fillStyle = color;
//     context.fillRect(this.x, this.y, this.width, this.height);
//   };

  //functions to determine if car can move to new location (x, y)
  this.canMoveToX = function(x) {
    return x >= 0 && (x + vehicle.width) <= CANVAS_WIDTH;
  };
  this.canMoveToY = function(y) {
    return y >= 0 && (y+ vehicle.height) <= CANVAS_HEIGHT;
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
var track;

function track(width, lineHeight, color) {
  this.width = width;
  this.lineHeight = lineHeight;
  this.color = color;

  //function to draw track
  this.update = function() {
    this.scroll(SCROLL_SPEED);

    $.each(this.lines, function(){
        this.update();
    })
  };

  //initialize lines
  this.lines = [];
  initTrackLines(this, CANVAS_HEIGHT/this.lineHeight, this.width, CANVAS_HEIGHT - this.lineHeight, this.lineHeight, this.color);

  //function to scroll the track down by y pixels
  this.scroll = function(y){
    //figure out how many lines to add/remove
    var n = Math.abs(Math.round(y/track.lineHeight));
      
    //remove track lines from bottom (the track lines at end of array are at bottom of screen)
    for(var i = 0; i < n; i++) {
      track.lines.shift();
    }

    //update y value on all lines
    $.each(track.lines, function(){
      this.y += y;
    });

    //add new lines
    initTrackLines(track, n, track.width, track.lines[track.lines.length-1].y - track.lineHeight, track.lineHeight, track.color);
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
function initTrackLines(track, numLines, width, initialY, lineHeight, color) {
  var xOffset;
  var y = initialY;

  for (var i = 0; i < numLines; i++) {
    //check if we need to set a new xOffsetGoal
    if(goalProgressCounter == cyclesPerGoal) {
      oldXOffsetGoal = xOffsetGoal;
      goalProgressCounter = 0;

      //make sure that the xOffsetGoal isn't too big
      do {
        xOffsetGoal += Math.random()*100 - 50;
      }
      while (xOffsetGoal > MAX_X_OFFSET || xOffsetGoal < -MAX_X_OFFSET);
    }

    //calculate the xOffset for this new line based on the xOffsetGoal
    //and how close we are to reaching it
    xOffset = oldXOffsetGoal + goalProgressCounter*(xOffsetGoal-oldXOffsetGoal)/cyclesPerGoal;

    //add the lines
    track.lines.push(new trackLine(xOffset, width, y, lineHeight, color));
    
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

//-----------------RUNNING GAME-------------------
$(document).ready(function() {

  startGame();

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
    var newX = vehicle.x;
    var newY = vehicle.y;

    switch(e.which){
      case 37: // left
        leftKeyDown = false;
      break;

      case 39: // right
        rightKeyDown = false;
      break;

      default: return; // exit this handler for other keys
    }
    e.preventDefault();
  });
  
});