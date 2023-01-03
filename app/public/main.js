var socket = io();
let startTime;

socket.on("connect", function () {
  console.log("Connected");
});
function realTimeMovingAverage(data, period) {
  const movingAverage = [];
  let dataToFloat = data.map((element) => parseFloat(element));

  for (let i = 0; i < dataToFloat.length; i++) {
    const start = Math.max(0, i - period);
    const end = i;
    const subset = dataToFloat.slice(start, end + 1);
    const sum = subset.reduce((a, b) => a + b, 0);
    movingAverage.push(sum / subset.length);
  }

  return movingAverage;
}

let XrawMAelement = false;
let YrawMAelement = false;
let ZrawMAelement = false;
let XnormMAelement = false;
let YnormMAelement = false;
let ZnormMAelement = false;

socket.on("data", function (data) {
  if (ws_data.length === 0) {
    startTime = new Date();
    ws_data.push({
      "Time[ms]": 0,
      Xraw: 0,
      Yraw: 0,
      Zraw: 0,
      Xnorm: 0,
      Ynorm: 0,
      Znorm: 0,
      XrawMA: 0,
      YrawMA: 0,
      ZrawMA: 0,
      XnormMA: 0,
      YnormMA: 0,
      ZnormMA: 0,
    });
  }
  const dataArray = data.split(" ");
  const Xraw = dataArray[3];
  const Yraw = dataArray[6];
  const Zraw = dataArray[9].replace("\r\n", "");
  const Xnorm = dataArray[12];
  const Ynorm = dataArray[15];
  const Znorm = dataArray[18].replace("\r\n", "");
  if (ws_data.length > 24) {
    let lastTen = ws_data.slice(ws_data.length - 25, ws_data.length);
    const XrawArray = lastTen.map((element) => element.Xraw);
    const YrawArray = lastTen.map((element) => element.Yraw);
    const ZrawArray = lastTen.map((element) => element.Zraw);
    const XnormArray = lastTen.map((element) => element.Xnorm);
    const YnormArray = lastTen.map((element) => element.Ynorm);
    const ZnormArray = lastTen.map((element) => element.Znorm);
    const XrawMA = realTimeMovingAverage(XrawArray, 25);
    const YrawMA = realTimeMovingAverage(YrawArray, 25);
    const ZrawMA = realTimeMovingAverage(ZrawArray, 25);
    const XnormMA = realTimeMovingAverage(XnormArray, 25);
    const YnormMA = realTimeMovingAverage(YnormArray, 25);
    const ZnormMA = realTimeMovingAverage(ZnormArray, 25);
    YrawMAelement = YrawMA[YrawMA.length - 1];
    XrawMAelement = XrawMA[XrawMA.length - 1];
    ZrawMAelement = ZrawMA[ZrawMA.length - 1];
    YnormMAelement = YnormMA[YnormMA.length - 1];
    XnormMAelement = XnormMA[XnormMA.length - 1];
    ZnormMAelement = ZnormMA[ZnormMA.length - 1];
    // console.log(XrawMAelement, YrawMAelement, ZrawMAelement);
  }
  const dataObj = {
    "Time[ms]": timeBetweenInMs(new Date(), startTime),
    Xraw: Xraw,
    Yraw: Yraw,
    Zraw: Zraw,
    Xnorm: Xnorm,
    Ynorm: Ynorm,
    Znorm: Znorm,
    XrawMA: XrawMAelement ? XrawMAelement : 0,
    YrawMA: YrawMAelement ? YrawMAelement : 0,
    ZrawMA: ZrawMAelement ? ZrawMAelement : 0,
    XnormMA: XnormMAelement ? XnormMAelement : 0,
    YnormMA: YnormMAelement ? YnormMAelement : 0,
    ZnormMA: ZnormMAelement ? ZnormMAelement : 0,
  };
  console.log(dataObj);
  moveElement(player, -dataObj.YrawMA * 0.1, -dataObj.XrawMA * 0.1);
  // moveElement(player, -Xraw * 0.1, Yraw * 0.1);
  ws_data.push(dataObj);
});

function sendMessage(message) {
  fetch("http://localhost:3000/connect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

socket.on("port", function (port) {
  port.forEach((element) => {
    const option = document.createElement("option");
    option.setAttribute("id", "port");
    option.appendChild(document.createTextNode(element));
    document.getElementById("inlineFormCustomSelect").appendChild(option);
  });
});

let ws_data = [];
function createExcel(data) {
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.json_to_sheet(data);
  wb.Sheets["Record"] = ws;
  XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
  var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  return wbout;
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

$("#button-a").click(function () {
  console.log(ws_data);
  const array = ws_data.splice(0, 2);
  const buf = createExcel(ws_data);
  saveAs(
    new Blob([s2ab(buf)], { type: "application/octet-stream" }),
    "test.xlsx"
  );
});

var cnv = document.querySelector("canvas");
var ctx = cnv.getContext("2d");
var scoreSpan = document.querySelector("#score");

var player = {
  x: cnv.width / 2 - 50,
  y: cnv.height - 100,
  w: 100,
  h: 100,
  color: "black",
  score: 0,
};

var obstacle = {
  x: Math.random() * cnv.width - 50,
  y: Math.random() * cnv.height - 50,
  w: 50,
  h: 50,
  color: "white",
};

var canva = {
  x: 0,
  y: 0,
  w: cnv.width,
  h: cnv.height,
  color: "white",
};

window.addEventListener("keydown", function (event) {
  if (event.key == "ArrowRight") {
    player.x += 10;
  }
  if (event.key == "ArrowLeft") {
    player.x -= 10;
  }
  if (event.key == "ArrowUp") {
    player.y -= 10;
  }
  if (event.key == "ArrowDown") {
    player.y += 10;
  }
});

function collision(player, obstacle) {
  if (
    player.x + player.w > obstacle.x &&
    player.x < obstacle.x + obstacle.w &&
    player.y + player.h > obstacle.y &&
    player.y < obstacle.y + obstacle.h
  ) {
    moveElement(
      obstacle,
      Math.random() * cnv.width - 50,
      Math.random() * cnv.height - 50
    );
    player.score++;
    obstacle.color = Math.random() > 0.5 ? "white" : "white";
    // txt = document.createTextNode(player.score);
    scoreSpan.innerHTML = player.score;
  }
}
function moveElement(element, x, y) {
  element.x = x;
  element.y = y;
}

function generateElement(element) {
  ctx.fillStyle = element.color;
  ctx.fillRect(...Object.values(element));
}
const img = new Image();

async function draw() {
  generateElement(canva);
  generateElement(player);
  generateElement(obstacle);
  await ctx.drawImage(img, obstacle.x, obstacle.y, obstacle.w, obstacle.h);
}

function loop() {
  draw();
  requestAnimationFrame(loop, cnv);
  collision(player, obstacle);
}

loop();

img.src = "https://icon-library.com/images/fire-icon-png/fire-icon-png-25.jpg";

function timeBetweenInMs(date1, date2) {
  const diffInMs = Math.abs(date2 - date1);
  return diffInMs;
}
