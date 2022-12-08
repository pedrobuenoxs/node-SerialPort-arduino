var socket = io();
socket.on("connect", function () {
  console.log("Connected");
});

socket.on("data", function (data) {
  const dataArray = data.split(" ");
  const Xraw = dataArray[3];
  const Yraw = dataArray[6];
  const Zraw = dataArray[9].replace("\r\n", "");
  const Xnorm = dataArray[12];
  const Ynorm = dataArray[15];
  const Znorm = dataArray[18].replace("\r\n", "");
  const dataObj = {
    Xraw: Xraw,
    Yraw: Yraw,
    Zraw: Zraw,
    Xnorm: Xnorm,
    Ynorm: Ynorm,
    Znorm: Znorm,
  };
  console.log(dataObj);
  ws_data.push(dataObj);

  moveElement(player, -Xraw * 0.1, Yraw * 0.1);
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
