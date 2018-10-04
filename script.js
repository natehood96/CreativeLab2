var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 10);
  },
  clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

var vehicle;
var speed = 10;

function startGame() {
  myGameArea.start();
  vehicle = new component(20, 20, "blue", 0, 0);
}

function updateGameArea() {
  myGameArea.clear();
  vehicle.update();
}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y; 
  this.update = function(){
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

$(document).ready(function() {

  startGame();

  $(document).on("keydown", function(e) {
    console.log("keydown");
    switch(e.which){
      case 37: // left
        vehicle.x -= speed;
      break;

      case 38: // up
        vehicle.y -= speed;
      break;

      case 39: // right
        vehicle.x += speed;
      break;

      case 40: // down
        vehicle.y += speed;
      break;

      default: return; // exit this handler for other keys
    }

    console.log("Vehicle Location: " + vehicle.x + ", " + vehicle.y);
    e.preventDefault();
  });
  
});