const express = require("express");

const app = express();
const Router = express.Router;
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("healthy");
});

module.exports = { app, Router, express };
