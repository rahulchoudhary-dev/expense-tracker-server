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
  getAllExpenses: async (req, res) => {
    const userId = req.user.id;
    const { categoryId, paymentMethodId, month, year, q, limit, page } =
      req.query;
    try {
      const data = await ExpenseService.getAllExpensesService(userId, {
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
  getExpenseById: async (req, res) => {
    const { expenseId } = req.params;
    if (!expenseId) {
      return errorResponse(res, 400, "Expense ID is required");
    }
    try {
      const expense = await ExpenseService.getExpenseByIdService(expenseId);
      if (!expense) {
        return errorResponse(res, 404, "Expense not found");
      }
      return successResponse(res, 200, "Expense fetched successfully", expense);
    } catch (error) {
      return errorResponse(res, 500, error?.message || "Internal Server Error");
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
  editExpense: async (req, res) => {
    try {
      const expenseId = req.params.id;
      if (!expenseId) {
        throw new Error("Expense ID is required");
      }
      const data = req.body;
      const resp = await ExpenseService.editExpenseService(expenseId, data);
      return successResponse(res, 200, "Expense updated successfully", resp);
    } catch (error) {
      return errorResponse(res, 400, error.message || "Something went wrong.");
    }
  },
  deleteExpense: async (req, res) => {
    try {
      const expenseId = req.params.id;
      if (!expenseId) {
        throw new Error("Expense ID is required");
      }
      await ExpenseService.deleteExpenseService(expenseId);
      return successResponse(res, 200, "Expense deleted successfully");
    } catch (error) {}
  },
  uploadExpenseAttachments: async (req, res) => {
    const files = req.files;
    const userId = req.user.id;
    const expenseId = req.body.expenseId;
    try {
      const response = await ExpenseService.uploadExpenseAttachmentService(
        files,
        userId,
        expenseId
      );
      return successResponse(
        res,
        200,
        "Expense aattachment successfully",
        response
      );
    } catch (error) {
      return errorResponse(res, 400, error.message || "Something went wrong.");
    }
  },
};

module.exports = ExpenseController;
