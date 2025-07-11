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
  getExpenseSummary: async (req, res) => {
    const data = req.body;
    try {
      const resp = await ExpenseService.getExpenseSummaryService(data);
      return successResponse(res, 200, "fetched", resp);
    } catch (error) {
      return errorResponse(res, 200, error);
    }
  },
};

module.exports = ExpenseController;
