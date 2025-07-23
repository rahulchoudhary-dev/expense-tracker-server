const express = require("express");
const analyticsController = require("../../controllers/analytics");

const router = express.Router();

router.get("/yearly-expenses", analyticsController.getYearlyExpenses);
router.get("/category-expenses", analyticsController.getCategoryExpenses);

module.exports = router;
