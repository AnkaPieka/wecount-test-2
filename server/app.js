const express = require("express");

const app = express();

app.use("/", (req, res, next) => {
  res.json({ message: "App working !" });
});

module.exports = app;
