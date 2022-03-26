function printMat(mat, selector) {
  var strHTML = `<table height=390px width=790px table-layout:fixed border= 8><tbody>`;
  for (var i = 0; i < mat.length; i++) {
    strHTML += `<tr>`;
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var cellContent;
      if (!cell.isShown) cellContent = "";
      else cellContent = cell.isMine ? MINE : cell.minesAroundCount;
      var className = `cell cell-${i}-${j};`;
      strHTML += `<td width=180px class=" ${className}" oncontextmenu="cellRightClicked(this,${i},${j})" onclick="cellClicked(this,${i},${j})" > ${cellContent}</n /td>`;
    }
    strHTML += `</tr>`;
  }
  strHTML += `</tbody></table>`;
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
  elCell.innerHTML = value;
  return elCell;
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomEmptyPos() {
  var emptyPositions = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var pos = { i, j };
      if (isCellEmpty(pos)) {
        emptyPositions.push(pos);
      }
    }
  }
  var randIdx = getRandomInt(0, emptyPositions.length);
  var randPos = emptyPositions[randIdx];

  return randPos;
}
function isCellEmpty(pos) {
  var cell = gBoard[pos.i][pos.j];

  return cell === EMPTY;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
function getEmptyCells() {
  var emptyCells = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      var cell = gBoard[i][j];
      if (!cell.isMine) emptyCells.push({ i, j });
    }
  }
  if (emptyCells === []) return null;
  return emptyCells;
}
