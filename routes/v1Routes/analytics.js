const express = require("express");
const AnalyticsController = require("../../controllers/analytics");

const router = express.Router();

router.get("/yearly-expenses", AnalyticsController.getYearlyExpenses);
router.get("/category-expenses", AnalyticsController.getCategoryExpenses);

module.exports = router;
