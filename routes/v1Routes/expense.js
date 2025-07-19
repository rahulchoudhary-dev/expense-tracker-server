const express = require("express");
const ExpenseController = require("../../controllers/expense");

const multer = require("multer");

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/", ExpenseController.createExpense);
router.patch("/:id", ExpenseController.editExpense);
router.delete("/:id", ExpenseController.deleteExpense);

router.get("/expense-summary", ExpenseController.getExpenseSummary);

router.get("/", ExpenseController.getExpenses);

router.post(
  "/upload-attachments",
  upload.array("files", 5),
  ExpenseController.uploadExpeneAttachments
);

module.exports = router;
