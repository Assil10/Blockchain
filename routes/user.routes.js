const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

router.post("/register", controller.registerUser);
router.get("/:walletAddress", controller.getUserProfile);

module.exports = router;
