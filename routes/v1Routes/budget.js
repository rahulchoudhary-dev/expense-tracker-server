const express = require("express");
const budgetController = require("../../controllers/budget");

const router = express.Router();

router.post("/", budgetController.createBudget);
router.get("/", budgetController.getBudget);
router.delete("/:id", budgetController.deleteBudget);
router.patch("/", budgetController.updateBudget);

module.exports = router;
