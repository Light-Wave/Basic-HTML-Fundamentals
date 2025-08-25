const mapSize = 7;
let lastMousedOver;
const map = [];
const hints = [];
let hintsAreActive = false;

function GenerateMap() {
  let htmlOut = "<table onmouseout='ClearMouseOver()'>";
  for (let i = 0; i < mapSize; i++) {
    htmlOut += "<tr>";
    for (let j = 0; j < mapSize; j++) {
      htmlOut += "<td id='";
      htmlOut += i.toString();
      htmlOut += "_";
      htmlOut += j.toString();
      htmlOut += "' ";

      htmlOut +=
        "onmouseover='MouseOver(" + i.toString() + ", " + j.toString() + ")'";
      htmlOut +=
        "onclick='ClickedTile(" + i.toString() + ", " + j.toString() + ")'";

      htmlOut += " class='blackTile'";
      htmlOut += "></td>";
    }
    htmlOut += "</tr>";
  }
  htmlOut += "</table>";
  htmlOut += '<button onclick="ToggleHints()">Hints</button>';
  htmlOut += '<button onclick="ScrableBoard()">Scramble</button>';
  htmlOut += document.write(htmlOut);

  //Populate map[][] and hints[][] with data
  for (let i = 0; i < mapSize; i++) {
    const row = [];
    const innerHints = [];
    for (let j = 0; j < mapSize; j++) {
      row.push(document.getElementById(i.toString() + "_" + j.toString()));
      innerHints.push(false);
    }
    map.push(row);
    hints.push(innerHints);
  }
}

function ScrableBoard() {
  HideHints();
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      if (Math.random() > 0.5) {
        ClickedTile(i, j);
      }
    }
  }
}

function ClickedTile(tileX, tileY) {
  hints[tileX][tileY] = !hints[tileX][tileY];
  GetNeigbors(tileX, tileY).forEach(FlipTile);
  if (hintsAreActive) {
    ShowHints();
  }
}
function MouseOver(tileX, tileY) {
  ClearMouseOver();
  lastMousedOver = GetNeigbors(tileX, tileY);
  lastMousedOver.forEach(SetHighlightBorder);
}
function ClearMouseOver() {
  if (hintsAreActive) {
    return;
  }
  if (lastMousedOver != null) {
    lastMousedOver.forEach(ClearBorder);
  }
}
function ClearBorder(item, index, arr) {
  item.style.border = "";
}
function SetHighlightBorder(item, index, arr) {
  item.style.border = "5px solid #d9ff32ff";
}
function FlipTile(item, index, arr) {
  if (item.className == "blackTile") {
    item.className = "whiteTile";
  } else {
    item.className = "blackTile";
  }
}

function GetNeigbors(tileX, tileY) {
  const returnValues = [];
  if (tileX > 0) {
    returnValues.push(map[tileX - 1][tileY]);
  }
  if (tileX < mapSize - 1) {
    returnValues.push(map[tileX + 1][tileY]);
  }
  if (tileY > 0) {
    returnValues.push(map[tileX][tileY - 1]);
  }
  if (tileY < mapSize - 1) {
    returnValues.push(map[tileX][tileY + 1]);
  }
  returnValues.push(map[tileX][tileY]);
  return returnValues;
}
function ToggleHints() {
  if (hintsAreActive) {
    HideHints();
  } else {
    ShowHints();
  }
}

function HideHints() {
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      map[i][j].style.border = "";
    }
  }
  hintsAreActive = false;
}

function ShowHints() {
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      if (hints[i][j]) {
        map[i][j].style.border = "5px solid #32ff98ff";
      } else {
        map[i][j].style.border = "";
      }
    }
  }
  hintsAreActive = true;
}

GenerateMap();
ScrableBoard();
