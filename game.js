/* game.js

This code handles the game elements and interactions on game.html. 
Most of your work will be here!
*/

/***INITIALIZING VARIABLES AND OBJECTS***/
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 40;
var high, level = 1;

var sound = document.getElementById("myAudio");
sound.play();

const saveKey = "highscore"; //save key for local storage
var scoreStr = localStorage.getItem(saveKey);
console.log("scoreStr" + scoreStr);
if (scoreStr == null){
  high = 0;
}else{
  high = parseInt(scoreStr);
}
document.getElementById('high').textContent= "Highscore : "+ high.toString();



var count = 0;
var speed = 16;
var snake = {
  x: 160,
  y: 160,
  x_step: grid, //snake velocity. moves one grid length every frame in either the x or y direction
  y_step: 0,
  cells: [],  //an array that keeps track of all grids the snake body occupies
  currentLength: 4, //current length of the snake. grows when eating an apple. 
  color: "yellow"
};
/* TO DO: create apple object below */
var apple = {
  x: 80,
  y: 80,
}

/***MAIN FUNCTIONS***/

/* start the game */
requestAnimationFrame(snakeSquadLoop);

/* Listen to keyboard events to move the snake */
document.addEventListener('keydown', function(e) {
  // prevent snake from backtracking on itself by checking that it's 
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  // left arrow key
  if (e.which === 37 && snake.x_step === 0) {
    snake.x_step = -grid;
    snake.y_step = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.y_step === 0) {
    snake.y_step = -grid;
    snake.x_step = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.x_step === 0) {
    snake.x_step = grid;
    snake.y_step = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.y_step === 0) {
    snake.y_step = grid;
    snake.x_step = 0;
  }
});


/***HELPER FUNCTIONS***/

/*snakeSquadLoop: This is the main code that is run each time the game loops*/
function snakeSquadLoop() {
  requestAnimationFrame(snakeSquadLoop);
  // if count < speed, then keep looping. Don't animate until you get to the 16th frame. This controls the speed of the animation.
  if (count < speed) {
    count++;
    return;
  }
  //Otherwise, it's time to animate. 
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);
  /*TO DO:which functions do we need to run for this game to work, and in what order?*/
  calculateSnakeMove();
  drawSnake();
  drawApple();
  scoreBoard();
  if (snakeTouchesApple()) {
    lengthenSnakeByOne();
    randomlyGenerateApple();
    speedUp();
  }
  if (checkCrashItself()) {
    endGame();
  }
}

function calculateSnakeMove(){
  // move snake by its velocity
  snake.x += snake.x_step;
  snake.y += snake.y_step;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  
  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.currentLength) {
    snake.cells.pop();
  }
}

/*drawApple
uses context functions to fill the cell at apple.x and apple.y with apple.color 
*/
function drawApple(){
  /* TO DO */
  //
  context.drawImage(document.getElementById('apple'),0, 0, 200, 200, apple.x, apple.y, grid, grid);
}


/*drawSnake
For each cell of the snake, fill in the grid at the location (cell.x, cell.y) with the snake.color 
If the cell is the first cell in the array, use the drawCellWithBitmoji function to draw that cell as the user's bitmoji 
*/
function drawSnake(){
  /* TO DO */
  drawCellWithBitmoji(snake.cells[0])
  
  var i;
  for(i=1;i<snake.cells.length; i++){
    context.fillStyle = snake.color;
    context.fillRect(snake.cells[i].x, snake.cells[i].y, grid, grid);

    context.strokeStyle = "black";
    context.lineWidth  = 5;
    context.strokeRect(snake.cells[i].x, snake.cells[i].y, grid, grid);
  }
}

/*drawCellWithBitmoji
Takes a cell (with an x and y property) and fills the cell with a bitmoji instead of a square
*/
function drawCellWithBitmoji(cell){
  var avatar_url = localStorage.getItem('avatarurl');
  document.getElementById('avatar').src = avatar_url;
  context.drawImage(document.getElementById('avatar'),0, 0, 200, 200, cell.x, cell.y, grid, grid);
}

/*snakeTouchesApple
checks if any cell in the snake is at the same x and y location of the apple
returns true (the snake is eating the apple) or false (the snake is not eating the apple)
*/
function snakeTouchesApple(){
  /* TO DO */
  if(snake.cells[0].x ==apple.x && snake.cells[0].y==apple.y){
    return true;
  }
  return false;
}

/*lengthenSnakeByOne
increments the currentLength property of the snake object by one to show that the snake has eaten an apple
*/
function lengthenSnakeByOne(){
  //var soundFlag = true;
  snake.currentLength = snake.currentLength + 1;
  
  // if(soundFlag){
  //   sound.pause();
  //   sound.currentTime = 0;
  //   sound.play();
  //   soundFlag = false;
  // }
}

function scoreBoard(){
  //context.font = '10px serif';
  //context.fillText("Score: "+snake.currentLength-3, 0, 0);
  console.log(high);
  if(snake.currentLength-4 > high){
    high = snake.currentLength-4;
    localStorage.setItem(saveKey, high);
    document.getElementById('high').textContent = "Highscore : "+ high.toString();
  }
  document.getElementById('score').textContent = "Score : "+ (snake.currentLength-4).toString();
}
function speedUp(){
  
  if ((snake.currentLength-4)%4==0 && speed>2)
  {
    level += 1
    document.getElementById('level').textContent = "Level : "+ level.toString();
    speed -= 2;
  }
}
/*randomlyGenerateApple
uses getRandomInt to generate a new x and y location for the apple within the grid
this function does not draw the apple itself, it only stores the new locations in the apple object
*/
function randomlyGenerateApple(){
  apple.x = getRandomInt(0, 15) * grid;
  apple.y = getRandomInt(0, 15) * grid;
}

/*checkCrashItself
checks if any cell in the snake is at the same x and y location of the any other cell of the snake
returns true (the snake crashed into itself) or false (the snake is not crashing) 
*/
function checkCrashItself(){
  var i, j;
  
  for(i = 0; i < snake.cells.length; ++i){
    for(j = i+1; j < snake.cells.length; ++j){
      if(snake.cells[i].x ==snake.cells[j].x && snake.cells[i].y == snake.cells[j].y){
        return true;
      }
    } 
  }
  return false;
}

var allowedTime = 200;
var startX = 0;
var startY = 0;

document.addEventListener('touchstart', function(e){
    var touch = e.changedTouches[0]
    startX = touch.pageX
    startY = touch.pageY
    var startTime = new Date().getTime()
    e.preventDefault()
}, false)

document.addEventListener('touchmove', function(e){
    e.preventDefault()
}, false)

document.addEventListener('touchend', function(e){
    var touch = e.changedTouches[0]
    var distX = touch.pageX - startX
    var distY = touch.pageY - startY

    if (Math.abs(distX) > Math.abs(distY)) {
      if (distX > 0 && snake.dx === 0) {
        snake.x_step = grid;
        snake.y_step = 0;
      }
      else if (distX < 0 && snake.dx === 0) {
        snake.x_step = -grid;
        snake.y_step = 0;
      }
    } else {
      if (distY > 0 && snake.dy === 0) {
        snake.y_step = grid;
        snake.x_step = 0;
      }
      else if (distY < 0 && snake.dy === 0) {
        snake.y_step = -grid;
        snake.x_step = 0;
      }
    }
    e.preventDefault();

}, false)


function muteAudio(){
  if (sound.muted){ 
   sound.muted = false;
   //document.getElementById("MyElement").classList.remove("fas fa-volume-mute");
   //document.getElementById("MyElement").classList.add("fas fa-volume-up");
  }
  else{ 
   //document.getElementById("MyElement").classList.remove("fas fa-volume-up");
   //document.getElementById("MyElement").classList.add("fas fa-volume-mute");
   sound.muted = true;
  }
}

/*endGame
displays an alert and reloads the page
*/
function endGame(){
  window.location.href="endgame.html";
  //document.location.reload();
}

/*getRandomInt
takes a mininum and maximum integer
returns a whole number randomly in that range, inclusive of the mininum and maximum
see https://stackoverflow.com/a/1527820/2124254
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
