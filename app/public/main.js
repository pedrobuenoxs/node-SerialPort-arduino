var socket = io();
socket.on("connect", function () {
  console.log("Connected");
});

socket.on("data", function (data) {
  console.log("Data:", data);
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

var wb = XLSX.utils.book_new();
wb.Props = {
  Title: "SheetJS Tutorial",
  Subject: "Test",
  Author: "Red Stapler",
  CreatedDate: new Date(2017, 12, 19),
};

wb.SheetNames.push("Test Sheet");
var ws_data = [["hello", "world"]];
var ws = XLSX.utils.aoa_to_sheet(ws_data);
wb.Sheets["Test Sheet"] = ws;

var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

$("#button-a").click(function () {
  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    "test.xlsx"
  );
});
