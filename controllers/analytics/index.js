const AnalyticsService = require("../../services/analytics.service");
const {
  errorResponse,
  successResponse,
} = require("../../utils/responseHandler");

const AnalyticsController = {
  getYearlyExpenses: async (req, res) => {
    const userId = req.user.id;
    const year = req.query.year;
    try {
      const resp = await AnalyticsService.getYearlyExpensesService(
        userId,
        year
      );
      return successResponse(res, 200, "", resp);
    } catch (error) {
      return errorResponse(res, 400, error.message || "Something went wrong.");
    }
  },
  getCategoryExpenses: async (req, res) => {
    const userId = req.user.id;
    const { month, year } = req.query;
    try {
      const resp = await AnalyticsService.getCategoryExpensesService(
        userId,
        year,
        month
      );
      return successResponse(res, 200, "", resp);
    } catch (error) {
      return errorResponse(res, 400, error.message || "Something went wrong.");
    }
  },
};

module.exports = AnalyticsController;
