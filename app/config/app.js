import express from "express";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { socketConnect, routeFunc } from "../routes/routes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.io = io;
routeFunc(app, io);
socketConnect(app, io);

export { server };
