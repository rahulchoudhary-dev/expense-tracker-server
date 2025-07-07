const express = require("express");
const PaymentMethodsController = require("../../controllers/paymentMethods/indes.js");

const router = express.Router();

router.get("/", PaymentMethodsController.getPayementMethods);

module.exports = router;
