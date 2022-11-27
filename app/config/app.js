import express from "express";
import path from "path";
const app = express();

import http from "http";
const server = http.createServer(app);
const Router = express.Router;
app.use(express.json());
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/health", (req, res) => {
  res.send("healthy");
});
var serialport;
app.post("/connect", async (req, res) => {
  // console.log("req.body", req.body);
  serialport = await setDevice(req.body.port);
  serialport.on("data", (data) => {
    // console.log("data", data.toString());
    io.emit("data", data.toString());
  });
});

import { Server } from "socket.io";
import { getPaths, setDevice } from "../serial-port/index.js";
const io = new Server(server);

io.on("connection", async function (socket) {
  console.log("A user connected");
  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });

  const port = await getPaths();
  socket.emit("port", port);
});

app.set("io", io);

export { app, server };
