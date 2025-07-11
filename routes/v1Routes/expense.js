const express = require("express");
const ExpenseController = require("../../controllers/expense");

const router = express.Router();

router.post("/", ExpenseController.createExpense);
router.get("/expense-summary", ExpenseController.getExpenseSummary);

module.exports = router;
