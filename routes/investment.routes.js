const express = require("express");
const router = express.Router();
const controller = require("../controllers/investment.controller");

router.post("/", controller.createInvestment);
router.get("/", controller.getAllInvestments);
router.get("/:walletAddress", controller.getInvestmentsByWallet);

module.exports = router;
