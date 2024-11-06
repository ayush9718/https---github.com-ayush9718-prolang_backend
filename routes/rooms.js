const express = require("express");
const router = express.Router();

// controllers
const {getRandRoom,createRoom}= require("../controllers/Room");

// mount

router.get("/randRoom",getRandRoom);
router.post("/createRoom",createRoom);

module.exports = router;