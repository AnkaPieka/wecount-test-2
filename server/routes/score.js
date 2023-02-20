const express = require("express");
const router = express.Router();
const scoreLogic = require("../controllers/score");

router.post("/get-score", scoreLogic.calculateScore);

router.get("/get-score", scoreLogic.sendScore);

module.exports = router;
