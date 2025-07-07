const { Sequelize } = require("sequelize");
const Expense = require("../models/expense.js");
const handleSequelizeError = require("../utils/sequelizeErrorHandler.js");

const ExpenseService = {
  createExpenseService: async (data) => {
    try {
      const result = await Expense.create(data);
      return result;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = ExpenseService;
