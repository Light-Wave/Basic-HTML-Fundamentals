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

function generateColors() {
  for (let r = 0; r < 2; r++) {
    for (let g = 0; g < 2; g++) {
      for (let b = 0; b < 2; b++) {
        symbols.push(rgb(r * 127, g * 127, b * 127));
      }
    }
  }
}
function rgb(r, g, b) {
  return "rgb(" + r + "," + g + "," + b + ")";
}

generateColors();
console.log(...dropSyms_random(5, 5, symbols, Options));
