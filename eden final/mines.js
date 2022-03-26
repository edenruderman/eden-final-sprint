"use strict";
var gBoard;
var gLevel;
var gInterval;
var totalSeconds = 0;
var gSeconds = 0;
var gSoundOn = false;
var gScore;
var gHighScore;
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};
var gLives;
const MINE = "💣";
const FLAG = "🇯🇵";
var gMines;
var gCount;
function init(SIZE = 4, MINES = 2) {
  // score = 0;
  clearInterval(gInterval);
  totalSeconds = 0;
  document.getElementById("count_up_timer").innerHTML = "00:00:00";
  gSoundOn = false;
  gLevel = { SIZE: SIZE, MINES: MINES };
  gMines = MINES;
  console.log(gMines);
  gCount = 0;
  document.querySelector(".modal").classList.add("hidden");
  document.querySelector(".overlay").classList.add("hidden");
  gLives = 3;
  getLife();
  gGame.isOn = false;
  gBoard = createMat(SIZE, MINES);
  console.log(gBoard);
  printMat(gBoard, ".table");
}

function implementMines() {
  setRandomMines(gMines);
  setMinesNegsCount();
}

function createMat(SIZE) {
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board[i] = [];
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
  return board;
}

function setMinesNegsCount() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard.isMine) continue;
      var minesCount = findMinesNegs(gBoard, i, j);
      if (!minesCount) minesCount = 0;
      gBoard[i][j].minesAroundCount = minesCount;
    }
  }
  return gBoard;
}

function findMinesNegs(board, cellI, cellJ) {
  var count = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i > board.length - 1) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j > board[i].length - 1) continue;
      if (board[i][j].isMine) count++;
    }
  }
  return count;
}
function cellClicked(elCell, i, j) {
  // score++;
  var currCell = gBoard[i][j];
  if (!gGame.isOn) {
    gGame.isOn = true;
    currCell.innerHTML = 0;
    gInterval = setInterval(countUpTimer, 1000);
    implementMines();
    return;
  }

  if (currCell.isMine) {
    gLives--;

    document.querySelector(".lives h1").innerHTML = `LIVES LEFT:${gLives} ❤️‍🩹`;
    console.log(gLives);
    elCell.innerHTML = MINE;
    checkDefeat();
  }

  if (currCell.minesAroundCount && !currCell.isMine) {
    currCell.isShown = true;
    elCell.innerHTML = currCell.minesAroundCount;
  }
  if (!currCell.minesAroundCount && !currCell.isMine) {
    elCell.innerHTML = 0;
    revealNegs(gBoard, i, j);
  }
}
function setRandomMines(MINES) {
  for (var i = 0; i < MINES; i++) {
    setRandomMine(gBoard);
  }
}

function setRandomMine(board) {
  var randNum =
    board[getRandomInt(0, board.length - 1)][getRandomInt(0, board.length - 1)];
  randNum.isMine = true;
  randNum.innerText = MINE;
}

function getLife() {
  var lives = document.querySelector(".lives h1");
  lives.innerHTML = `LIVES LEFT:${gLives} ❤️‍🔥`;
}

function checkDefeat() {
  if (!gLives) gameOver(" DEFEAT 🤯");
}
function gameOver(msg) {
  var smile = document.querySelector(" .btn");
  smile.innerHTML = msg;
  gGame.isOn = false;
  document.querySelector(".modal").classList.remove("hidden");
  document.querySelector(".overlay").classList.remove("hidden");
}
function checkVictory() {
  if (gCount === gLevel.MINES) gameOver("VICTORY! 😃");
}

function cellRightClicked(elCell, i, j) {
  gBoard[i][j].isMarked = true;
  console.log(gBoard[i][j]);
  elCell.innerHTML = FLAG;
  if (gBoard[i][j].isMarked && gBoard[i][j].isMine) {
    gCount++;
    checkVictory();
  }
}

window.addEventListener(
  "contextmenu",
  function (e) {
    e.preventDefault();
  },
  false
);
function makeExplode(elCell) {
  elCell.innerHTML = MINE;
}
function play() {
  var audio = new Audio("Extra Life.mp4");
  if (!gSoundOn) {
    audio.play();
    gSoundOn = true;
  } else {
    stop();
    audio.stop();
  }
}
function stop() {
  if (gSoundOn) {
    audio.stop();
  }
}

function countUpTimer() {
  ++totalSeconds;
  var hour = Math.floor(totalSeconds / 3600);
  var minute = Math.floor((totalSeconds - hour * 3600) / 60);
  var seconds = totalSeconds - (hour * 3600 + minute * 60);
  document.getElementById("count_up_timer").innerHTML =
    hour + ":" + minute + ":" + seconds;
}
// function revealNegs(elCell,cellI,cellJ){
//   for(var i=cellI-1;i<=cellI+1;i++){
//   for(var j=cellJ-1;j<=cellJ+1;++){
//     if(gBoard[i][j].isMine)innerHTML

// }
function checkHighScore() {
  gHighScore = localStorage.getItem("highscore");
  if (gHighScore !== null) {
    if (gScore < gHighScore) {
      localStorage.setItem("highscore", gScore);
    }
  } else {
    localStorage.setItem("highscore", gScore);
  }
}
function updateHighScore() {
  document.querySelector(".best-score").innerHTML =
    localStorage.getItem("highscore");
}
function revealNegs(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    for (var j = cellJ; j <= cellJ + 1; j++) {
      gBoard[i][j].isShown = true;
      gBoard[i][j].innerHTML = gBoard[i][j].minesAroundCount;
    }
  }
}
