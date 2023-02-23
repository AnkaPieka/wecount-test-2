const { json } = require("express");

//players identity
let player1 = {
  name: "",
  results: [],
};
let player2 = {
  name: "",
  results: [],
};

////JEU
//set results
let gameRes = [];

//points of each player by set
let player1Points = [];
let player2Points = [];

////SET
let p1 = [];
let p2 = [];

////LISTS
let originalListOfPoints = [];
let newListOfPoints = [];

const calcGame = (listOfPoints) => {
  for (let i = 0; i < listOfPoints.length; i++) {
    let elem = listOfPoints[i];

    if (
      (player1Points.length >= 4 || player2Points.length >= 4) &&
      Math.abs(player1Points.length - player2Points.length) >= 2
    ) {
      player1Points.length > player2Points.length
        ? gameRes.push(player1.name)
        : gameRes.push(player2.name);

      player1Points = [];
      player2Points = [];
    }

    elem === player1.name
      ? player1Points.push(player1.name)
      : player2Points.push(player2.name);
  }

  calcSet(gameRes);
};

const calcGameDecisive = (listOfPoints) => {
  newListOfPoints = [...listOfPoints];

  listOfPoints.forEach((elem) => {
    while (player1Points.length <= 7 || player2Points.length <= 7) {
      newListOfPoints.shift();

      if (player1Points.length === 7 || player2Points.length === 7) {
        player1Points.length > player2Points.length
          ? gameRes.push(player1.name)
          : gameRes.push(player2.name);

        player1Points = [];
        player2Points = [];

        return calcSet(gameRes);
      } else {
        return elem === player1.name
          ? player1Points.push(player1.name)
          : player2Points.push(player2.name);
      }
    }
  });

  return;
};

const calcSet = (gameResArr) => {
  let newGameResArr = [...gameResArr];

  gameRes.forEach((winner) => {
    newGameResArr.shift();

    if (p1.length <= 6 || p2.length <= 6) {
      if ((p1.length === 6 || p2.length === 6) && Math.abs(p1.length - p2.length) >= 2) {
        player1.results.push(p1.length);
        player2.results.push(p2.length);

        p1 = [];
        p2 = [];
      } else {
        if (winner === player1.name) {
          p1.push(winner);
        } else {
          p2.push(winner);
        }
      }
    }

    if (p1.length === 6 && p2.length === 6) {
      return calcGameDecisive(newListOfPoints);
    }

    if (p1.length >= 7 || p2.length >= 7) {
      player1.results.push(p1.length);
      player2.results.push(p2.length);

      p1 = [];
      p2 = [];
    }
  });
};

exports.calculateScore = (req, res, next) => {
  try {
    originalListOfPoints = req.body;
    player1.name = originalListOfPoints[0];
    player2.name = originalListOfPoints.find((name) => name !== player1.name);
    calcGame(originalListOfPoints);

    res.status(200).json({ message: "List of points ok" });
  } catch (err) {
    res.status(400).json({ message: `ERR! ${err.message}` });
  }
};

exports.sendScore = (req, res, next) => {
  try {
    res.status(200).send([player1, player2]);
  } catch (err) {
    res.status(400).json({ message: `ERR! ${err.message}` });
  }
};
