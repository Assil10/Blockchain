const express = require("express");
const router = express.Router();
const controller = require("../controllers/payment.controller");

router.post("/create", controller.createPayment);
router.post("/callback", controller.handleCallback);
router.get("/status/:ref", controller.getPaymentStatusByRef);
router.get("/wallet/:walletAddress", controller.getPaymentsByWallet);


module.exports = router;

