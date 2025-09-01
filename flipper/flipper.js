"use strict";
let mapSize = 3;
let lastMousedOver = [];
const map = [];
const hints = [];
let hintsAreActive = false;
const winFadeOutTime = 1200.0;
let winTimeStamp = 0;
let blackWin = true;
const glowForce = 30;
const glowSpeed = 600.0;
let curentMouseoverColor = 128;
let gameState = "play";
let FadeOutID;
let FadeInID;

function GenerateMap() {
  let htmlOut = "";
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
  document.getElementById("board").innerHTML = htmlOut;

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
function ScrambleBoard() {
  if (gameState != "play") {
    return;
  }
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
  if (gameState != "play") {
    return;
  }
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
  if (gameState != "play") {
    return;
  }
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
  let win = false;
  if (whiteCount == 0) {
    blackWin = true;
    win = true;
    document.getElementById("blackWin").innerText = "black.";
  } else if (blackCount == 0) {
    blackWin = false;
    win = true;
    document.getElementById("blackWin").innerText = "white.";
  }
  if (win) {
    winTimeStamp = Date.now();
    gameState = "fadeOut";
    document.getElementById("blackWin").hidden = false;
    document.getElementById("blackWin").style.opacity = 1.0;
    document.getElementById("blackWin").style.color = "rgb(128, 128, 128)";
    document.getElementById("dot").hidden = true;
    FadeOutID = setInterval(FadeOut, 16);
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
  if (fadeFactor < 1) {
    document.getElementById("blackWin").style.color = rgb(
      255 - bgBrightness,
      255 - bgBrightness,
      255 - bgBrightness
    );
  } else if (fadeFactor >= 1 && fadeFactor < 2) {
    document.getElementById("blackWin").style.color = rgb(
      255 - bgBrightness,
      255 - bgBrightness,
      255 - bgBrightness
    );
    document.getElementById("mainDiv").hidden = true;
    document.getElementById("dot").style.color = rgb(
      255 - bgBrightness,
      255 - bgBrightness,
      255 - bgBrightness
    );
    document.getElementById("dot").hidden = false;
  } else if (fadeFactor >= 2 && fadeFactor < 3) {
    fadeFactor -= 2;
    document.getElementById("blackWin").style.opacity = 1.0 - fadeFactor;
  } else {
    document.getElementById("blackWin").style.opacity = 0;
    gameState = "faded";
    clearInterval(FadeOutID);
  }
}
function ContinueGame() {
  if (gameState != "faded") {
    return;
  }
  gameState = "play";
  ScrambleBoard();
  gameState = "fadeIn";
  document.getElementById("mainDiv").hidden = false;
  winTimeStamp = Date.now();
  FadeInID = setInterval(FadeIn, 16);
}
function FadeIn() {
  let fadeFactor = (Date.now() - winTimeStamp) / winFadeOutTime;
  let bgBrightness;
  if (blackWin) {
    bgBrightness = 0 + 128 * fadeFactor;
  } else {
    bgBrightness = 255 - 128 * fadeFactor;
  }
  if (fadeFactor < 1.0) {
    document.getElementById("mainDiv").style.opacity = fadeFactor;
    document.getElementById("dot").style.color = rgb(
      255 - bgBrightness,
      255 - bgBrightness,
      255 - bgBrightness
    );
    document.body.style.backgroundColor = rgb(
      bgBrightness,
      bgBrightness,
      bgBrightness
    );
  } else {
    document.getElementById("blackWin").hidden = true;
    document.getElementById("dot").hidden = true;
    gameState = "play";
    document.getElementById("blackWin").style.color = "rgb(128, 128, 128);";
    clearInterval(FadeInID);
  }
}
function ResizeBoard() {
  const newTextSize = Math.min(window.innerWidth, window.innerHeight) * 0.25;
  //const newTextSize = window.innerWidth * 0.35;
  let newTop = (window.innerHeight - newTextSize) / 2 + "px";
  document.getElementById("blackWin").style.fontSize = newTextSize + "px";
  document.getElementById("blackWin").style.top = newTop;

  document.getElementById("dot").style.fontSize = newTextSize + "px";
  document.getElementById("dot").style.top = newTop;

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
function Start(givenMapSize) {
  mapSize = givenMapSize;
  setInterval(SoftGlowMouseOver, 16);
  GenerateMap();
  ScrambleBoard();
  ResizeBoard();
  window.onresize = ResizeBoard;
}
