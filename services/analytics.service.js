const { Op } = require("sequelize");
const Expense = require("../models/expense.js");
const handleSequelizeError = require("../utils/sequelizeErrorHandler.js");
const MONTH_NAMES = require("../constants/index.js");

const AnalyticsService = {
  getYearlyExpensesService: async (userId, year) => {
    try {
      if (!year) {
        throw new Error("year must required");
      }

      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${Number(year) + 1}-01-01`);

      const expenses = await Expense.findAll({
        where: {
          userId,
          date: {
            [Op.gte]: startDate,
            [Op.lt]: endDate,
          },
        },
      });

      const monthlyExpenseData = MONTH_NAMES?.map((monthName, index) => {
        return {
          month: monthName,
          monthIndex: index,
          totalExpenseAmount: 0,
          year: Number(year),
        };
      });

      expenses.forEach((expense) => {
        const monthIndex = new Date(expense.date).getMonth();
        monthlyExpenseData[monthIndex].totalExpenseAmount += Number(
          expense.amount
        );
      });

      return monthlyExpenseData;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = AnalyticsService;
