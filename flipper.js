"use strict";
const mapSize = 5;
let lastMousedOver = [];
const map = [];
const hints = [];
let hintsAreActive = false;
let winFadeOutTime = 2000.0;
let winTimeStamp = 0;
let blackWin = true;
const glowForce = 30;
const glowSpeed = 600.0;
let curentMouseoverColor = 128;

function GenerateMap() {
  let htmlOut = "";
  htmlOut += "<div id='mainDiv'>";
  htmlOut += "<table onmouseout='ClearMouseOver()'>";
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
  htmlOut += "</div>";

  htmlOut += '<div id="blackWin"></div>';

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
  CheckWinCon();
}
function MouseOver(tileX, tileY) {
  if (hintsAreActive) {
    return;
  }
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
  lastMousedOver = [];
}
function ClearBorder(item, index, arr) {
  item.style.border = "";
}
function SoftGlowMouseOver() {
  const currentStrength = 128 + Math.cos(Date.now() / glowSpeed) * glowForce;
  curentMouseoverColor = Math.floor(currentStrength);
  lastMousedOver.forEach(SetHighlightBorder);
}
function SetHighlightBorder(item, index, arr) {
  item.style.border =
    "5px solid #" +
    curentMouseoverColor.toString(16) +
    curentMouseoverColor.toString(16) +
    curentMouseoverColor.toString(16);

  //item.style.border = "5px solid #858585ff";
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
function CheckWinCon() {
  let blackCount = 0;
  let whiteCount = 0;
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      if (map[i][j].className == "blackTile") {
        blackCount++;
      } else {
        whiteCount++;
      }
    }
  }
  if (whiteCount == 0) {
    blackWin = true;
    winTimeStamp = Date.now();
    document.getElementById("blackWin").innerText = "black.";
    setInterval(FadeOut, 16);
  } else if (blackCount == 0) {
    blackWin = false;
    winTimeStamp = Date.now();
    document.getElementById("blackWin").innerText = "white.";
    setInterval(FadeOut, 16);
  }
}
function FadeOut() {
  let fadeFactor = (Date.now() - winTimeStamp) / winFadeOutTime;
  document.getElementById("mainDiv").style.opacity = 1.0 - fadeFactor;
  let bgBrightness;
  if (blackWin) {
    bgBrightness = 128 - 128 * fadeFactor;
  } else {
    bgBrightness = 128 + 128 * fadeFactor;
  }
  document.body.style.backgroundColor = rgb(
    bgBrightness,
    bgBrightness,
    bgBrightness
  );
  document.getElementById("blackWin").style.color = rgb(
    255 - bgBrightness,
    255 - bgBrightness,
    255 - bgBrightness
  );
  if (fadeFactor >= 1) {
    clearInterval(FadeOut);
    document.getElementById("mainDiv").hidden = true;
  }
}
function ResizeBoard() {
  const newTextSize = Math.min(window.innerWidth, window.innerHeight) * 0.35;
  //const newTextSize = window.innerWidth * 0.35;
  document.getElementById("blackWin").style.fontSize = newTextSize + "px";
  document.getElementById("blackWin").style.top =
    (window.innerHeight - newTextSize) / 2 + "px";
  const tileSize =
    (Math.min(window.innerWidth, window.innerHeight - 50) * 0.45) / mapSize;
  for (let i = 0; i < mapSize; i++) {
    for (let j = 0; j < mapSize; j++) {
      map[i][j].style.padding = tileSize + "px";
    }
  }
}
function rgb(r, g, b) {
  return "rgb(" + r + "," + g + "," + b + ")";
}
//clearInterval(SoftGlowMouseOver);
setInterval(SoftGlowMouseOver, 16);
GenerateMap();
ScrableBoard();
ResizeBoard();
window.onresize = ResizeBoard;
