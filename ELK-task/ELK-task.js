/*
type Options struct {
maxClusterSize int
}
func dropSyms(rows, cols int, syms rune[], opt Options) [][]rune {
// your code here
}
*/

const Options = {
  maxClusterSize: 5,
};
const symbols = [];
const boardDiv = document.getElementById("board");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const colorCountInput = document.getElementById("colorCount");
const validationDiv = document.getElementById("validation");
const maxClusterSizeInput = document.getElementById("maxClusterSize");

function dropSyms_random(rows, cols, syms, opt) {
  const returnValue = [];
  for (let i = 0; i < rows; i++) {
    returnValue[i] = [];
    for (let j = 0; j < cols; j++) {
      returnValue[i][j] = syms[Math.floor(Math.random() * syms.length)];
    }
  }
  return returnValue;
}
function dropSyms(rows, cols, syms, opt) {
  const returnValue = [];
  const clusterPercentage = 1 / opt.maxClusterSize;
  const clusters = [];

  for (let i = 0; i < rows; i++) {
    returnValue[i] = [];
    for (let j = 0; j < cols; j++) {
      if (Math.random() <= clusterPercentage) {
        let newCluster = new Object();
        newCluster.positions = [];
        newCluster.positions.push({ x: i, y: j });
        newCluster.symbol = syms[Math.floor(Math.random() * syms.length)];
        clusters.push(newCluster);
        returnValue[i][j] = newCluster.symbol;
      }
    }
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (returnValue[i][j] == null) {
        returnValue[i][j] = syms[0];
      }
    }
  }
  return returnValue;
}

function generateBoard(width, height, symbolCount) {
  boardDiv.innerHTML = "";
  Options.maxClusterSize = maxClusterSizeInput.value;
  let boardLayout = dropSyms(
    width,
    height,
    getSymbolSubset(symbolCount),
    Options
  );
  const table = document.createElement("table");
  boardDiv.appendChild(table);
  for (let y = 0; y < height; y++) {
    const tableRow = document.createElement("tr");
    table.appendChild(tableRow);
    for (let x = 0; x < width; x++) {
      const tableData = document.createElement("td");
      const symbol = boardLayout[x][y];
      tableData.style = "background-color: " + symbol;
      //tableData.innerHTML = x + ", " + y;
      tableRow.appendChild(tableData);
    }
  }
  validateInput(boardLayout);
}

function validateInput(boardLayout) {
  validationDiv.innerHTML = "";
  const rows = boardLayout.length;
  const cols = boardLayout[0].length;
  const usedColors = new Map();
  let largestBlock = 0;
  const visited = [];
  let totalBlocks = 0;
  let totalSymbols = 0;
  let smallestBlock = 10000;
  const blockSizes = [];
  for (let i = 0; i < rows; i++) {
    visited[i] = [];
    for (let j = 0; j < cols; j++) {
      visited[i][j] = false;
    }
  }
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (visited[i][j] == false) {
        const blockSize = calculateBlock(boardLayout, visited, i, j);
        largestBlock = Math.max(largestBlock, blockSize);
        smallestBlock = Math.min(smallestBlock, blockSize);
        totalBlocks++;
        totalSymbols += blockSize;
        usedColors.set(
          boardLayout[i][j],
          (usedColors[boardLayout[i][j]] || 0) + blockSize
        );
        blockSizes.push(blockSize);
      }
    }
  }
  addValidationOutput(
    "Largest block: ",
    largestBlock,
    maxClusterSizeInput.value,
    2,
    0
  );
  addValidationOutput(
    "Average block size: ",
    totalSymbols / totalBlocks,
    maxClusterSizeInput.value - 2,
    1,
    2
  );
  addValidationOutput("Runes Used: ", usedColors.size, colorCountInput.value);
  addValidationOutput("Smallest Block: ", smallestBlock, 1, 0, 3);
}

function addValidationOutput(
  validationString,
  value,
  expected,
  downwardsAcceptance = 0,
  uppwardsAcceptance = 0
) {
  const newDiv = document.createElement("div");
  newDiv.className = "validationOutput";
  newDiv.innerText =
    validationString +
    parseFloat(value.toFixed(2)) + // limit digits to 2 and remove trailing zeros
    " | Expected: " +
    expected;
  let correctness;
  if (value == expected) {
    correctness = 1;
  } else if (value < expected) {
    let lowestValueAccepted = expected - downwardsAcceptance;
    if (value >= lowestValueAccepted) {
      correctness = (value - lowestValueAccepted) / downwardsAcceptance;
    } else {
      correctness = 0;
    }
  } else {
    let highestValueAccepted = parseInt(expected) + uppwardsAcceptance;
    if (value <= highestValueAccepted) {
      correctness = 1 - (highestValueAccepted - value) / uppwardsAcceptance;
    } else {
      correctness = 0;
    }
  }
  if (correctness == 0) {
    newDiv.style = "background-color:red";
  } else if (correctness == 1) {
    newDiv.style = "background-color:green";
  } else {
    newDiv.style = "background-color:yellow";
  }
  validationDiv.appendChild(newDiv);
}

function calculateBlock(boardLayout, visited, posX, posY) {
  let open = [];
  open.push({ x: posX, y: posY });
  visited[posX][posY] = true;
  let blockCount = 1;
  while (open.length > 0) {
    currentTile = open.pop();
    if (
      currentTile.x > 0 &&
      visited[currentTile.x - 1][currentTile.y] == false &&
      boardLayout[currentTile.x - 1][currentTile.y] ==
        boardLayout[currentTile.x][currentTile.y]
    ) {
      blockCount++;
      open.push({ x: currentTile.x - 1, y: currentTile.y });
      visited[currentTile.x - 1][currentTile.y] = true;
    }
    if (
      currentTile.y > 0 &&
      visited[currentTile.x][currentTile.y - 1] == false &&
      boardLayout[currentTile.x][currentTile.y - 1] ==
        boardLayout[currentTile.x][currentTile.y]
    ) {
      blockCount++;
      open.push({ x: currentTile.x, y: currentTile.y - 1 });
      visited[currentTile.x][currentTile.y - 1] = true;
    }
    if (
      currentTile.x < boardLayout.length - 1 &&
      visited[currentTile.x + 1][currentTile.y] == false &&
      boardLayout[currentTile.x + 1][currentTile.y] ==
        boardLayout[currentTile.x][currentTile.y]
    ) {
      blockCount++;
      open.push({ x: currentTile.x + 1, y: currentTile.y });
      visited[currentTile.x + 1][currentTile.y] = true;
    }
    if (
      currentTile.y < boardLayout[0].length - 1 &&
      visited[currentTile.x][currentTile.y + 1] == false &&
      boardLayout[currentTile.x][currentTile.y + 1] ==
        boardLayout[currentTile.x][currentTile.y]
    ) {
      blockCount++;
      open.push({ x: currentTile.x, y: currentTile.y + 1 });
      visited[currentTile.x][currentTile.y + 1] = true;
    }
  }
  return blockCount;
}

function readInput() {
  generateBoard(widthInput.value, heightInput.value, colorCountInput.value);
}

function rgb(r, g, b) {
  return "rgb(" + r + "," + g + "," + b + ")";
}

// Returns 'count' random unique symbols
function getSymbolSubset(count) {
  if (count >= symbols.length) {
    return symbols;
  }
  const sortedArray = [];
  const returnValues = [];
  for (let i = 0; i < symbols.length; i++) {
    sortedArray[i] = i;
  }
  for (let i = 0; i < count; i++) {
    const randomNumber = Math.floor(Math.random() * sortedArray.length);
    returnValues[i] = symbols[sortedArray[randomNumber]];
    sortedArray.splice(randomNumber, 1);
  }
  return returnValues;
}

function generateColors() {
  for (let r = 0; r <= 2; r++) {
    for (let g = 0; g <= 2; g++) {
      for (let b = 0; b <= 2; b++) {
        symbols.push(rgb(r * 127, g * 127, b * 127));
      }
    }
  }
}

function getNeigbors(board, posX, posY) {
  const returnValue = [];
  if (posX > 0) {
    returnValue.push({ x: posX - 1, y: posY, tile: board[posX - 1][posY] });
  }
  if (currentTile.y > 0) {
    returnValue.push({ x: posX, y: posY - 1, tile: board[posX][posY - 1] });
  }
  if (currentTile.x < boardLayout.length - 1) {
    returnValue.push({ x: posX + 1, y: posY, tile: board[posX + 1][posY] });
  }
  if (currentTile.y < boardLayout[0].length - 1) {
    returnValue.push({ x: posX, y: posY + 1, tile: board[posX][posY + 1] });
  }

  return returnValue;
}

generateColors();
generateBoard(5, 8, 5);
