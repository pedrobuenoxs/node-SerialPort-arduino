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
