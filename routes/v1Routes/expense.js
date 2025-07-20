const express = require("express");
const multer = require("multer");
const ExpenseController = require("../../controllers/expense");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", ExpenseController.createExpense);
router.patch("/:id", ExpenseController.editExpense);
router.delete("/:id", ExpenseController.deleteExpense);

router.get("/expense-summary", ExpenseController.getExpenseSummary);

router.get("/", ExpenseController.getAllExpenses);
router.get("/:expenseId", ExpenseController.getExpenseById);

router.post(
  "/upload-attachments",
  upload.array("files", 5),
  ExpenseController.uploadExpenseAttachments
);

router.delete(
  "/delete-attachment/:attachmentId",
  ExpenseController.deleteExpenseAttachment
);

module.exports = router;
