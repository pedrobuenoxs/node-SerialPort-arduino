const { serialport } = require("./app/serial-port");
const { io } = require("./app");

console.log("io", io);
io.on("connection", function (socket) {
  console.log("A user connected");

  socket.emit(
    "data",
    serialport.on("data", function (data) {
      const dataString = data.toString();
      socket.emit("data", dataString);
    })
  );

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});
