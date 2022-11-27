const SerialPort = require("serialport").SerialPort;

const serialport = new SerialPort({ path: "/dev/ttyUSB1", baudRate: 115200 });

// Read data that is available but keep the stream in "paused mode"
// serialport.on("readable", function () {
//   console.log("Data:", serialport.read());
// });

// Switches the port into "flowing mode"
serialport.on("data", function (data) {
  console.log("Data:", data.toString());
});

// Pipe the data into another stream (like a parser or standard out)
// const lineStream = serialport.pipe(new Readline());
