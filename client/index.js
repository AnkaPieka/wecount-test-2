const playerForm = document.getElementById("info-players");
const htmlListOfPoints = document.getElementById("random-points-list");
const sendToBackBtn = document.getElementById("send-list-to-back");

let listOfPoints = [];
let score = {};

playerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  //get form and its entries
  const formData = new FormData(event.target);

  const entries = Object.fromEntries(formData);

  //get players info from form obj
  const player1 = { name: entries["player-name-1"], level: entries["player-level-1"] };
  const player2 = { name: entries["player-name-2"], level: entries["player-level-2"] };

  //generate a list of 150 random points
  const generatePoints = (player1, player2) => {
    let randomNum = Math.floor(Math.random() * 10);

    const player1Level = player1.level;
    const player2Level = player2.level;

    if (player1Level === player2Level) {
      return randomNum <= 5
        ? listOfPoints.push(player1.name)
        : listOfPoints.push(player2.name);
    }

    const bestPlayer = player1Level > player2Level ? player1Level : player2Level;
    const worstPlayer = player1Level > player2Level ? player2Level : player1Level;

    if (randomNum > bestPlayer && randomNum > worstPlayer)
      return generatePoints(player1, player2);

    if (randomNum <= worstPlayer && randomNum <= bestPlayer) {
      return randomNum <= 5
        ? worstPlayer === player1Level
          ? listOfPoints.push(player1.name)
          : listOfPoints.push(player2.name)
        : bestPlayer === player1Level
        ? listOfPoints.push(player1.name)
        : listOfPoints.push(player2.name);
    } else {
      if (randomNum <= worstPlayer) {
        return worstPlayer === player1Level
          ? listOfPoints.push(player1.name)
          : listOfPoints.push(player2.name);
      }

      if (randomNum <= bestPlayer) {
        return bestPlayer === player1Level
          ? listOfPoints.push(player1.name)
          : listOfPoints.push(player2.name);
      }
    }
  };

  for (let i = 0; i <= 150; i++) {
    generatePoints(player1, player2);
  }

  listOfPoints.forEach((elem, i) => {
    let singlePoint = document.createElement("li");
    singlePoint.classList.add("random-point");
    let singlePointText = document.createTextNode(
      `Point ${i + 1} : remporté par ${elem}`
    );
    singlePoint.appendChild(singlePointText);
    htmlListOfPoints.appendChild(singlePoint);
  });
});

sendToBackBtn.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await fetch("http://localhost:3000/get-score", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listOfPoints),
    })
      .then((response) => response.json())
      .catch((err) => console.log("An error occured:", err.message));
  } catch (err) {
    console.log("ERROR !", err.message);
  }
});

///get scores
// getScoreFromBackBtn.addEventListener("click", async (event) => {
//   event.preventDefault();

//   try {
//     fetch("http://localhost:3000/get-score", {
//       method: "GET",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("data:", data);
//         score = data;
//       })
//       .catch((err) => console.log(err));
//   } catch (err) {
//     console.log("ERROR !", err.message);
//   }
// });
