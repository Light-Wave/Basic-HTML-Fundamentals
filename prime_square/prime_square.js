"use strict";
const mapSize = 309;
const map = [];
let primes = [];

function CalcPrimest() {
  for (let i = 2; i < mapSize * mapSize; i++) {
    let sqrt = Math.sqrt(i);
    let mightBePrime = true;
    for (let j = 0; j < primes.length && primes[j] <= sqrt; j++) {
      if ((i / primes[j]) % 1.0 == 0.0) {
        mightBePrime = false;
        break;
      }
    }
    if (mightBePrime) {
      primes.push(i);
    }
  }
}
function GenerateMap() {
  let htmlOut = "";
  htmlOut += "<table>";
  for (let i = 0; i < mapSize; i++) {
    htmlOut += "<tr>";
    for (let j = 0; j < mapSize; j++) {
      htmlOut += "<td id='";
      htmlOut += i.toString();
      htmlOut += "_";
      htmlOut += j.toString();
      htmlOut += "' ";
      htmlOut += "></td>";
    }
    htmlOut += "</tr>";
  }
  htmlOut += "</table>";
  document.getElementById("board").innerHTML = htmlOut;

  //Populate map[][] and hints[][] with data
  for (let i = 0; i < mapSize; i++) {
    const row = [];
    for (let j = 0; j < mapSize; j++) {
      row.push(document.getElementById(i.toString() + "_" + j.toString()));
    }
    map.push(row);
  }
}
async function PaintCells() {
  let pos = [Math.floor(mapSize / 2), Math.floor(mapSize / 2)];
  let directions = [
    [1, 0],
    [0, -1],
    [-1, 0],
    [0, 1],
  ];
  let curentDir = 0;
  let sideLength = 1;
  let remainingSteps = 1;
  let nextPrime = 0;
  let i = 1;
  while (pos[0] >= 0 && pos[0] < mapSize && pos[1] >= 0 && pos[1] < mapSize) {
    let cell = map[pos[0]][pos[1]];
    if (primes[nextPrime] == i) {
      nextPrime++;
      cell.style.backgroundColor = "white";
    } else {
      cell.style.backgroundColor = "black";
    }
    pos[0] += directions[curentDir][0];
    pos[1] += directions[curentDir][1];
    remainingSteps--;
    if (remainingSteps == 0) {
      curentDir = (curentDir + 1) % 4;
      if (curentDir == 0 || curentDir == 2) {
        sideLength++;
      }
      remainingSteps = sideLength;
    }
    i++;
    //await new Promise((r) => setTimeout(r, 1)); // Useful for debugging
  }
}
GenerateMap();
CalcPrimest();
PaintCells();
