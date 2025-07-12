const ExpenseService = require("../../services/expense.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");

const ExpenseController = {
  createExpense: async (req, res) => {
    const data = req.body;
    try {
      const result = await ExpenseService.createExpenseService(data);
      return successResponse(res, 200, "", result);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  },
  getExpenses: async (req, res) => {
    const userId = req.user.id;
    const { categoryId, paymentMethodId, month, year, q, limit, page } =
      req.query;
    try {
      const data = await ExpenseService.getExpenseService(userId, {
        categoryId,
        paymentMethodId,
        month,
        year,
        q,
        limit,
        page,
      });
      return successResponse(res, 200, "fetched", data);
    } catch (error) {
      return errorResponse(res, 400, error.message || "Something went wrong.");
    }
  },
  getExpenseSummary: async (req, res) => {
    const userId = req.query.userId;
    try {
      const resp = await ExpenseService.getExpenseSummaryService(userId);
      return successResponse(res, 200, "fetched", resp);
    } catch (error) {
      return errorResponse(res, 200, error);
    }
  },
};

module.exports = ExpenseController;
