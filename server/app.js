const express = require("express");

const scoreRoute = require("./routes/score");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS"); //ok verbes sur req
  next();
});

app.use(express.json());

app.use("/", scoreRoute);

// app.use("/", (req, res, next) => {
//   res.json({ message: "App working !" });
// });

module.exports = app;
