const budgetService = require("../../services/budget.service");
const {
  errorResponse,
  successResponse,
} = require("../../utils/responseHandler");

const budgetController = {
  createBudget: async (req, res) => {
    const userId = req.user.id;
    const budgetData = req.body;
    if (!userId) {
      throw new Error("User ID is required.");
    }
    try {
      const result = await budgetService.createBudget(userId, budgetData);
      return successResponse(res, 201, "Budget Created successfully", result);
    } catch (error) {
      return errorResponse(res, 500, error.message, error.stack);
    }
  },
  getBudget: async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
      throw new Error("User ID is required.");
    }
    try {
      const result = await budgetService.getBudget(userId);
      return successResponse(res, 200, "fetched", result);
    } catch (error) {
      return errorResponse(res, 500, error.message, error.stack);
    }
  },
};

module.exports = budgetController;
