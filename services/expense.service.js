const Expense = require("../models/expense.js");

const ExpenseService = {
  createExpenseService: async (data) => {
    try {
      const result = await Expense.create(data);
      console.log("service", result);
      return result;
    } catch (error) {
      console.log("error", error);
      throw new Error(error.message);
    }
  },
};

module.exports = ExpenseService;
