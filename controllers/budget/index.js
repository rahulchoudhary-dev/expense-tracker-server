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
    const type = req.query.type;
    if (!userId) {
      throw new Error("User ID is required.");
    }
    try {
      const result = await budgetService.getBudget(userId, type);
      return successResponse(res, 200, "fetched", result);
    } catch (error) {
      return errorResponse(res, 500, error.message, error.stack);
    }
  },
  deleteBudget: async (req, res) => {
    const userId = req.user?.id;
    const budgetId = req.params?.id;
    if (!userId || !budgetId) {
      return res
        .status(400)
        .json({ message: "User ID and Budget ID are required." });
    }
    try {
      const result = await budgetService.deleteBudget(userId, budgetId);
      return successResponse(res, 200, "deleted", result);
    } catch (error) {
      return errorResponse(res, 500, error.message, error.stack);
    }
  },
};

module.exports = budgetController;
