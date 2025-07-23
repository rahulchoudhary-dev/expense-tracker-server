const express = require("express");
const paymentMethodsController = require("../../controllers/paymentMethods/indes.js");

const router = express.Router();

router.get("/", paymentMethodsController.getPayementMethods);

module.exports = router;
