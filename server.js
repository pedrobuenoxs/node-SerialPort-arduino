const { app, express } = require("./app/config/app");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT || 3000;

const server = require("http").createServer(app);

app.use(express.static(path.join(__dirname, "./app/public")));

const io = require("socket.io")(server);

//When a client connects, we note it in the console
io.on("connection", function (socket) {
  console.log("A user connected");

  //Whenever someone disconnects this piece of code executed
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
