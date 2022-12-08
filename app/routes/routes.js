import { getPaths, setDevice } from "../serial-port/index.js";

const socketConnect = async (app, io) => {
  const port = await getPaths();

  io.on("connection", function (socket) {
    console.log("A user connected");

    socket.on("disconnect", function () {
      console.log("A user disconnected");
    });

    socket.emit("port", port);
  });
};

const routeFunc = (app, io) => {
  let serialport;
  app.get("/health", (req, res) => {
    res.send("healthy");
  });

  app.post("/connect", async (req, res) => {
    serialport = await setDevice(req.body.port);
    serialport.on("data", (data) => {
      io.emit("data", data.toString());
    });
  });
};
export { socketConnect, routeFunc };
