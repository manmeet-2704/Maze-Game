function createBlankMaze() {

  var rowIndex, colIndex;

  var table = document.createElement("table");
  var tbody = document.createElement("tbody");

  for (rowIndex = 1; rowIndex <= mazeHeight; rowIndex++) {

    var row = document.createElement("tr");

    for (colIndex = 1; colIndex <= mazeWidth; colIndex++) {

      var col = document.createElement("td");
      if (rowIndex == 1 && colIndex == 1) {

        col.style.backgroundColor = "rgb(0,0,0)";
        col.setAttribute("type", "start");

      } else if (rowIndex == mazeHeight && colIndex == mazeWidth) {

        col.style.backgroundColor = "rgb(0,255,0)";
        col.setAttribute("type", "finish");

      } else {

        col.style.backgroundColor = "rgb(0,0,0)";

      }
      col.setAttribute("id", "cell_" + rowIndex + "_" + colIndex);

      row.appendChild(col);

    }

    tbody.appendChild(row);

  }

  table.appendChild(tbody);

  document.getElementById("maze_container").appendChild(table);

}
let toggle=0;
var mazeWidth = 20;
var mazeHeight;
var h;
let box = document.getElementById('box');
let left = 380;
let up = 170;
let row = 1,
  col = 1;
let i = 1,
  j = 1;
var ans = 0;
var minSteps = Number.MAX_VALUE;
let temp = 0;
var visited;
var path = "";
var minPath = "";

function setMazeSize(size) {
  mazeWidth = parseInt(size);
  mazeHeight = mazeWidth;
  h = 500 / mazeWidth;
  box.style.height = h + "px";
  box.style.width = h + "px";
  visited = new Array(mazeWidth);
  let form = document.getElementById('frm');
  form.style.display = "none";
  document.querySelector('img').style.display = "block";
  document.querySelector('#soln').style.display = "flex";
  init();
  creatematrix();
  solve(mazeWidth, 1, 1, temp, path);
}

function creatematrix() {
  for (var k = 0; k < visited.length; k++) visited[k] = new Array(mazeWidth).fill(1);
}

function init() {

  createBlankMaze();

  paint();

}


function paint() {

  var player;
  var startAtRow = 1;
  var startAtCol = 1;

  var currentCell;
  addRoute(startAtRow, startAtCol, false, "rgb(0, 0, 0)");

  for (n = 1; n < (mazeWidth * mazeHeight) - 1; n++) {

    var currentCell = document.getElementById("cell_" + startAtRow + "_" + startAtCol);

    if (currentCell.getAttribute("occupied") == "true") {

      addRoute(startAtRow, startAtCol, true, "rgb(0,0, 0)");

    }

    if (startAtCol == mazeWidth) {

      startAtRow++;
      startAtCol = 1;

    } else {

      startAtCol++;

    }

  }

}

function addRoute(startAtRow, startAtCol, createDetour, backgroundColorRoute) {

  var validExits = ["right", "bottom", "left", "top"];

  var remainingExits = {
    "right": mazeWidth,
    "bottom": mazeHeight,
    "left": 0,
    "top": 0
  };

  var nextExits = [];

  var lastCells = [];

  var rowIndex = startAtRow;

  var colIndex = startAtCol;

  var currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);

  var exit;

  var lastExit;

  var exitIndex;

  var loop = 0;

  var loopFuse = 0;

  var maxLoops = 3 * mazeWidth * mazeHeight;

  var nextPossibleCell;

  while (loop < ((mazeWidth * mazeHeight) - 1)) {

    loopFuse++;

    if (loopFuse >= maxLoops) {
      break;
    }

    nextExits = [];

    for (i = 0; i < validExits.length; i++) {

      switch (validExits[i]) {

        case "right":
          nextPossibleCell = document.getElementById("cell_" + rowIndex + "_" + (colIndex + 1));
          break;

        case "left":
          nextPossibleCell = document.getElementById("cell_" + rowIndex + "_" + (colIndex - 1));
          break;

        case "bottom":
          nextPossibleCell = document.getElementById("cell_" + (rowIndex + 1) + "_" + colIndex);
          break;

        case "top":
          nextPossibleCell = document.getElementById("cell_" + (rowIndex - 1) + "_" + colIndex);
          break;

      }

      if (nextPossibleCell != null) {

        if (nextPossibleCell.getAttribute("occupied") != "true") {

          for (t = 0; t < remainingExits[validExits[i]]; t++) {

            nextExits.push(validExits[i]);

          }

        }

      }

    }

    if (nextExits.length == 0) {

      if (createDetour == true) {

        return false;


      } else {

        lastCells.splice(lastCells.length - 1, 1);
        rowIndex = lastCells[lastCells.length - 1][0];
        colIndex = lastCells[lastCells.length - 1][1];
        currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);

        continue;

      }

    }

    exitIndex = Math.floor(Math.random() * Math.floor(nextExits.length));

    exit = nextExits[exitIndex];

    if (createDetour == false) {

      currentCell.style["border-" + exit] = "none";

    } else {

      if (!(exit == "right" && colIndex == mazeWidth - 1 && rowIndex == mazeHeight) &&
        !(exit == "bottom" && colIndex == mazeWidth && rowIndex == mazeHeight - 1)) {

        currentCell.style["border-" + exit] = "none";

      }
    }

    switch (exit) {

      case "right":

        colIndex = colIndex + 1;
        remainingExits.left++;
        remainingExits.right--;
        break;

      case "bottom":

        rowIndex = rowIndex + 1;
        remainingExits.top++;
        remainingExits.bottom--;
        break;

      case "left":

        colIndex = colIndex - 1;
        remainingExits.left--;
        remainingExits.right++;
        break;

      case "top":

        rowIndex = rowIndex - 1;
        remainingExits.top--;
        remainingExits.bottom++;
        break;

    }

    lastCells.push([rowIndex, colIndex]);

    currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);

    switch (exit) {

      case "right":

        currentCell.style["border-left"] = "none";
        break;

      case "bottom":

        currentCell.style["border-top"] = "none";
        break;

      case "left":

        currentCell.style["border-right"] = "none";
        break;

      case "top":

        currentCell.style["border-bottom"] = "none";
        break;

    }

    if (rowIndex == mazeHeight && colIndex == mazeWidth) {

      break;

    }
    currentCell.setAttribute("occupied", "true");

    lastExit = exit;

    loop++;
  }
}

function solve(n, i, j, temp, path) {
  if (i == n && j == n) {
    if (temp < minSteps) {
      minSteps = temp;
      minPath = path;
    }
    return;
  }
  let cell = document.getElementById("cell_" + i + "_" + j);
  if (i < n && j < n) {
    if (visited[i - 1][j - 1] == 0) return;
    visited[i - 1][j - 1] = 0;
    if (cell.style.borderTop != "" && i > 1) {
      solve(n, i - 1, j, temp + 1, path + 'u')
    }
    if (cell.style.borderBottom != "" && i < n) solve(n, i + 1, j, temp + 1, path + 'd');
    if (cell.style.borderLeft != "" && j > 1) solve(n, i, j - 1, temp + 1, path + 'l');
    if (cell.style.borderRight != "" && j < n) solve(n, i, j + 1, temp + 1, path + 'r');
    visited[i - 1][j - 1] = 1;
  } else if (i == n) {
    if (visited[i - 1][j - 1] == 0) return;
    visited[i - 1][j - 1] = 0;
    if (cell.style.borderRight != "")
      solve(n, i, j + 1, temp + 1, path + 'r');
    if (cell.style.borderTop != "")
      solve(n, i - 1, j, temp + 1, path + 'u');
    visited[i - 1][j - 1] = 1;
  } else if (j == n) {
    if (visited[i - 1][j - 1] == 0) return;
    visited[i - 1][j - 1] = 0;
    if (cell.style.borderLeft != "")
      solve(n, i, j - 1, temp + 1, path + 'l');
    if (cell.style.borderBottom != "")
      solve(n, i + 1, j, temp + 1, path + 'd');
    visited[i - 1][j - 1] = 1;

  }
}

function visualize() {
  let row = 1,
    col = 1,
    path = minPath;
  for (var i = 0; i < path.length; i++) {
    let cell = document.getElementById("cell_" + row + "_" + col);
    cell.innerHTML = toggle%2?"":path[i];
    cell.style.backgroundColor = toggle%2?"black":"red";
    if (path[i] == 'r') {
      col++;
    } else if (path[i] == 'l') col--;
    else if (path[i] == 'd') row++;
    else row--;
  }
  toggle++;
}
document.addEventListener("keydown", event => {
  let currentCell = document.getElementById("cell_" + row + "_" + col);
  if (event.keyCode == 39) {
    if (currentCell.style.borderRight != "") {
      left += h;
      box.style.left = left + "px";
      col++;
      ans++;
    }
  } else if (event.keyCode == 37) {
    if (currentCell.style.borderLeftWidth != "") {
      left -= h;
      box.style.left = left + "px";
      col--;
      ans++;
    }
  } else if (event.keyCode == 38) {
    if (currentCell.style.borderTop != "") {
      up -= h;
      box.style.top = up + "px";
      row--;
      ans++;
    }
  } else if (event.keyCode == 40) {
    if (currentCell.style.borderBottom != "") {
      up += h;
      box.style.top = up + "px";
      row++;
      ans++;
    }
  }
  if (row == mazeWidth && col == mazeWidth) {
    document.getElementById('maze_container').style.display = "none";
    document.getElementById("box").style.display = "none";
    document.getElementById("soln").style.display = "none";
    document.getElementById("gameOver").style.display = "flex";
    document.getElementById("steps").innerHTML = "Your Steps are: " + ans;

  }
})

function restart() {
  location.reload();
}