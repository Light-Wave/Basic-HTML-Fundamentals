/*
type Options struct {
maxClusterSize int
}
func dropSyms(rows, cols int, syms rune[], opt Options) [][]rune {
// your code here
}
*/
class Cluster {
  clusterID;
  members = [];
  neighbors = new Set();
  open = [];
  symbol;
  nudge = 0;
}
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
let debugMap = [];

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
  console.log("#####################################################");
  const returnValue = [];
  const clusterMap = [];
  const remainingTiles = new Set();
  const clusters = [];

  // Populate data structures
  for (let x = 0; x < rows; x++) {
    returnValue[x] = [];
    clusterMap[x] = [];
    for (let y = 0; y < cols; y++) {
      remainingTiles.add(x + ":" + y);
      clusterMap[x][y] = -1;
    }
  }
  while (remainingTiles.size > 0) {
    // Pick a random unpainted spot
    item =
      Array.from(remainingTiles)[
        Math.floor(Math.random() * remainingTiles.size)
      ];
    remainingTiles.delete(item);
    let components = item.split(":");
    let xPos = parseInt(components[0]);
    let yPos = parseInt(components[1]);

    // Set up a cluster
    const cluster = new Cluster();
    cluster.clusterID = clusters.length;
    cluster.open.push({ x: xPos, y: yPos });

    //Start growing the cluster
    while (
      cluster.open.length > 0 &&
      cluster.members.length < opt.maxClusterSize
    ) {
      const index = Math.floor(Math.random() * cluster.open.length); //Got help from chatGPT
      const current = cluster.open.splice(index, 1)[0]; // Got help from chatGPT
      clusterMap[current.x][current.y] = cluster.clusterID;
      cluster.members.push(current);
      remainingTiles.delete(current.x + ":" + current.y);

      const neighbors = getneighbors(clusterMap, current.x, current.y);
      neighbors.forEach((neighbor) => {
        if (neighbor.tile == -1) {
          cluster.open.push({ x: neighbor.x, y: neighbor.y });
        }
      });
    }

    //Find neighboring clusters
    cluster.members.forEach((tile) => {
      getneighbors(clusterMap, tile.x, tile.y).forEach((neighbor) => {
        if (neighbor.tile != -1 && neighbor.tile != cluster.clusterID) {
          cluster.neighbors.add(neighbor.tile);
          clusters[neighbor.tile].neighbors.add(cluster.clusterID);
        }
      });
    });

    clusters.push(cluster);
  }

  // Paint clusters
  let nudge = 0;
  for (let clusterItt = 0; clusterItt < clusters.length; clusterItt++) {
    const cluster = clusters[clusterItt];
    // Use a Four color theorem algorithm to ensure no neighboring clusters share color
    let foundValid = false;
    cluster.symbol = null;
    for (let symbolItt = 0; symbolItt < syms.length; symbolItt++) {
      let newSymbol = (clusterItt + symbolItt) % syms.length;
      let isValid = true;
      cluster.neighbors.forEach((neighbor) => {
        /*console.log(
          foundValid + ", " + clusters[neighbor].symbol + ", " + newSymbol
        );*/
        if (clusters[neighbor].symbol == newSymbol) {
          isValid = false;
        }
      });
      if (isValid) {
        if (nudge > 0) {
          nudge--;
          isValid = false;
        } else {
          foundValid = true;
          cluster.symbol = newSymbol;
          break;
        }
      }
    }
    if (!foundValid) {
      nudge = 1;
      if (cluster.nudge >= cluster.neighbors.size) {
        console.log("Could not find valid color for " + clusterItt);
        nudge = 1 + Math.floor(cluster.nudge / cluster.neighbors.size);
      }
      let targetCluster = Array.from(cluster.neighbors)[
        cluster.nudge % cluster.neighbors.size
      ];
      console.log("Trying to nudge " + targetCluster + " due to " + clusterItt);
      clusters[targetCluster].symbol = null;
      clusterItt = Math.min(targetCluster, clusterItt) - 1;
      cluster.nudge++;
    }
  }

  // Paint tiles
  clusters.forEach((cluster) => {
    cluster.members.forEach((tile) => {
      returnValue[tile.x][tile.y] = syms[cluster.symbol];
    });
  });

  debugMap = clusterMap;
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
      tableData.innerHTML = debugMap[x][y];
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
    const neighbors = getneighbors(boardLayout, currentTile.x, currentTile.y);
    neighbors.forEach((neighbor) => {
      if (
        visited[neighbor.x][neighbor.y] == false &&
        neighbor.tile == boardLayout[currentTile.x][currentTile.y]
      ) {
        blockCount++;
        open.push({ x: neighbor.x, y: neighbor.y });
        visited[neighbor.x][neighbor.y] = true;
      }
    });
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
  symbols.pop(); // removes white to make debugging easier
}

function getneighbors(board, posX, posY) {
  const returnValue = [];
  if (posX > 0) {
    returnValue.push({ x: posX - 1, y: posY, tile: board[posX - 1][posY] });
  }
  if (posY > 0) {
    returnValue.push({ x: posX, y: posY - 1, tile: board[posX][posY - 1] });
  }
  if (posX < board.length - 1) {
    returnValue.push({ x: posX + 1, y: posY, tile: board[posX + 1][posY] });
  }
  if (posY < board[0].length - 1) {
    returnValue.push({ x: posX, y: posY + 1, tile: board[posX][posY + 1] });
  }

  return returnValue;
}

generateColors();
readInput();
