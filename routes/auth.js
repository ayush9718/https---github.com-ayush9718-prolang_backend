const express = require("express");
const router = express.Router();

// controllers
const {login,signUp,sendotp,changePassword}= require("../controllers/Auth");

// mount
router.post("/login",login);
router.post("/signUp",signUp);
router.post("/sendotp",sendotp);
router.post("/changePassword",changePassword);

module.exports = router;