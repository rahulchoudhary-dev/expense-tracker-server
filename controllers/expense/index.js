const ExpenseService = require("../../services/expense.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");

const ExpenseController = {
  createExpense: async (req, res) => {
    const data = req.body;
    console.log("data", data);
    // return;
    try {
      const result = await ExpenseService.createExpenseService(data);
      return successResponse(res, 200, "", result);
    } catch (error) {
      console.log("er", error);
      return errorResponse(res, 500, error);
    }
  },
};

module.exports = ExpenseController;
