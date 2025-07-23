const analyticsService = require("../../services/analytics.service");
const {
  errorResponse,
  successResponse,
} = require("../../utils/responseHandler");

const analyticsController = {
  getYearlyExpenses: async (req, res) => {
    const userId = req.user.id;
    const year = req.query.year;
    try {
      const result = await analyticsService.getYearlyExpenses(userId, year);
      return successResponse(res, 200, "fetched", result);
    } catch (error) {
      return errorResponse(res, 400, error.message || "Something went wrong.");
    }
  },
  getCategoryExpenses: async (req, res) => {
    const userId = req.user.id;
    const { month, year } = req.query;
    try {
      const result = await analyticsService.getCategoryExpenses(
        userId,
        year,
        month
      );
      return successResponse(res, 200, "fetched", result);
    } catch (error) {
      return errorResponse(res, 500, error.message, error.stack);
    }
  },
};

module.exports = analyticsController;
