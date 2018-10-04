//------------CONSTANTS-------------------
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var TRACK_WIDTH = 300;

//-----------GENERAL SET UP----------------
var context;
var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.context = this.canvas.getContext("2d");
    context = this.context;
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 10);
  },
  clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

var canvas = myGameArea.canvas;

function startGame() {
  myGameArea.start();
  vehicle = new vehicle(20, 20, "blue", 0, 0, 10, 10);
  track = new track(TRACK_WIDTH, 5, "white");
}

function updateGameArea() {
  myGameArea.clear();

  //make canvas background green
  context.fillStyle = "green";
  context.fillRect(0, 0, canvas.width, canvas.height);

  //draw track
  track.update();

  //update vehicle
  vehicle.update();
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
  this.update = function(){
    context.fillStyle = color;
    context.fillRect(this.x, this.y, this.width, this.height);
  };

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

  //move vehicle to new location (x, y)
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

  this.update = function() {
    $.each(this.lines, function(){
        this.update();
    })
  };

  //initialize lines
  this.lines = [];

  var xOffsetGoal = 0;
  var lastXOffsetGoal = 0;
  var xOffset = 0;
  var cyclesPerGoal = 30*this.lineHeight;
  for (var y = 0; y < CANVAS_HEIGHT; y += this.lineHeight) {
    if(y%cyclesPerGoal == 0) {
      lastXOffsetGoal = xOffsetGoal;
      xOffsetGoal += Math.random()*100 - 50;
      console.log("old goal, new goal: " + lastXOffsetGoal + ", " + xOffsetGoal);
    }
    xOffset = lastXOffsetGoal + (y%cyclesPerGoal + 1)*(xOffsetGoal-lastXOffsetGoal)/cyclesPerGoal;
    console.log("xOffset: " + xOffset);
    this.lines.push(new trackLine(xOffset, this.width, y, this.lineHeight, this.color = color));
  }
}

function trackLine(xCenterOffset, width, y, height, color) {
  this.height = height;
  this.y = y;
  this.xCenterOffset = xCenterOffset;
  this.width = width;
  this.x = (CANVAS_WIDTH/2) + this.xCenterOffset - (this.width/2);
  
  this.update = function() {
    context.fillStyle = color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

//-----------------RUNNING GAME-------------------
$(document).ready(function() {

  startGame();

  //move car when arrow keys are pressed
  var up, down, left, right;
  $(document).on("keydown", function(e) {
    var newX = vehicle.x;
    var newY = vehicle.y;

    switch(e.which){
      case 37: // left
        left = true;
      break;

      case 38: // up
        up = true;
      break;

      case 39: // right
        right = true;
      break;

      case 40: // down
        down = true;
      break;

      default: return; // exit this handler for other keys
    }

    if(up){
      newY -= vehicle.speedV;
    }
    if(down){
      newY += vehicle.speedV;
    }
    if(left){
      newX -= vehicle.speedH;
    }
    if(right){
      newX += vehicle.speedH;
    }

    vehicle.moveTo(newX, newY);
    e.preventDefault();
  });

  $(document).on("keyup", function(e) {
    var newX = vehicle.x;
    var newY = vehicle.y;

    switch(e.which){
      case 37: // left
        left = false;
      break;

      case 38: // up
        up = false;
      break;

      case 39: // right
        right = false;
      break;

      case 40: // down
        down = false;
      break;

      default: return; // exit this handler for other keys
    }
    e.preventDefault();
  });
  
});