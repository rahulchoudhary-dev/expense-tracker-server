const express = require("express");
const multer = require("multer");
const expenseController = require("../../controllers/expense");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", expenseController.createExpense);
router.patch("/:id", expenseController.editExpense);
router.delete("/:id", expenseController.deleteExpense);

router.get("/expense-summary", expenseController.getExpenseSummary);

router.get("/", expenseController.getAllExpenses);
router.get("/:expenseId", expenseController.getExpenseById);

router.post(
  "/upload-attachments",
  upload.array("files", 5),
  expenseController.uploadExpenseAttachments
);

router.delete(
  "/delete-attachment/:attachmentId",
  expenseController.deleteExpenseAttachment
);

module.exports = router;
