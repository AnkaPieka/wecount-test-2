const { json } = require("express");

//identité joueurs
let player1 = {
  name: "",
  results: [],
};
let player2 = {
  name: "",
  results: [],
};

//winner/looser
let gameRes = [];

//points de chaques joueur / set
let player1Points = [];
let player2Points = [];

//ont deux points de diff
let isTwoPointsAffar = false;

let newListOfPoints = [];

// //arr pour set
let p1 = [];
let p2 = [];

const calcGame = (listOfPoints) => {
  newListOfPoints = [...listOfPoints];

  player1.name = listOfPoints[0];
  player2.name = listOfPoints.find((elem) => elem !== player1.name);

  listOfPoints.forEach((elem) => {
    while (player1Points.length <= 4 || player2Points.length <= 4 || !isTwoPointsAffar) {
      newListOfPoints.shift();

      if (
        Math.abs(player1Points.length - player2Points.length) >= 2 &&
        (player1Points.length === 4 || player2Points.length === 4)
      ) {
        isTwoPointsAffar = true;
        break;
      } else {
        elem === player1.name
          ? player1Points.push(player1.name)
          : player2Points.push(player2.name);
      }
    }

    if (isTwoPointsAffar) {
      player1Points.length > player2Points.length
        ? gameRes.push(player1.name)
        : gameRes.push(player2.name);

      player1Points = [];
      player2Points = [];

      isTwoPointsAffar = false;
    } else {
      return calcGame(newListOfPoints);
    }

    if (
      gameRes.filter((elem) => elem === player1.name).length === 6 ||
      gameRes.filter((elem) => elem === player2.name).length === 6
    ) {
      return calcSet(gameRes);
    }
  });
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

        return (gameResArr = []);
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
    } else if (p1.length >= 7 || p2.length >= 7) {
      player1.results.push(p1.length);
      player2.results.push(p2.length);

      p1 = [];
      p2 = [];
    }

    return (gameRes = []);
  });
};

exports.calculateScore = (req, res, next) => {
  try {
    let listOfPoints = req.body;
    calcGame(listOfPoints);

    res.status(200).json({ message: "It worked" });
  } catch (err) {
    res.status(400).json({ message: `ERR! ${err.message}` });
  }
};

exports.sendScore = (req, res, next) => {
  try {
    res.setHeader("Content-Type", "application/json");
    res.send({ data: player1, player2 });

    res.status(200).json({ message: "It was sent!" });
  } catch (err) {
    res.status(400).json({ message: `ERR! ${err.message}` });
  }
};
