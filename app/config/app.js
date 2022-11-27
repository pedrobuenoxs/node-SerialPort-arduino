const express = require("express");

const app = express();
const Router = express.Router;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("final paper health check");
});

module.exports = { app, Router };
