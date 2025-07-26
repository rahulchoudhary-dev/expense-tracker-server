const express = require("express");
const budgetController = require("../../controllers/budget");

const router = express.Router();

router.post("/", budgetController.createBudget);
router.get("/", budgetController.getBudget);

module.exports = router;
