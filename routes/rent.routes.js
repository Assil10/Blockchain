const express = require("express");
const router = express.Router();
const controller = require("../controllers/rent.controller");

// Admin trigger (rent simulation)
router.post("/distribute", controller.distributeRent);

// Rent history by wallet
router.get("/history/:walletAddress", controller.getRentHistoryByWallet);

// Rent payouts by project
router.get("/project/:projectId", controller.getRentByProject);

module.exports = router;
