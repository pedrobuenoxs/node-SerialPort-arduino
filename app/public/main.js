var socket = io();
socket.on("connect", function () {
  console.log("Connected");
});

socket.on("data", function (data) {
  console.log("Data:", data);
});

socket.on("port", function (port) {
  port.forEach((element) => {
    const option = document.createElement("option");
    option.setAttribute("id", "port");
    option.appendChild(document.createTextNode(element));
    document.getElementById("inlineFormCustomSelect").appendChild(option);
  });
});
