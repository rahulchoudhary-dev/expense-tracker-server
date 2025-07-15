const express = require("express");
const ExpenseController = require("../../controllers/expense");

const router = express.Router();

router.post("/", ExpenseController.createExpense);
router.patch("/:id", ExpenseController.editExpense);
router.delete("/:id", ExpenseController.deleteExpense);

router.get("/expense-summary", ExpenseController.getExpenseSummary);

router.get("/", ExpenseController.getExpenses);

module.exports = router;
