const { Op } = require("sequelize");
const Expense = require("../models/expense.js");
const handleSequelizeError = require("../utils/sequelizeErrorHandler.js");
const MONTH_NAMES = require("../constants/index.js");
const Category = require("../models/category.js");

const AnalyticsService = {
  getYearlyExpensesService: async (userId, year) => {
    try {
      if (!year) {
        throw new Error("year must required");
      }
      const yearStartDate = new Date(`${year}-01-01`);
      const newYearStartDate = new Date(`${Number(year) + 1}-01-01`);

      const expenses = await Expense.findAll({
        where: {
          userId,
          date: {
            [Op.gte]: yearStartDate,
            [Op.lt]: newYearStartDate,
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
  getCategoryExpensesService: async (userId, year, month) => {
    try {
      if (!year || !month) {
        throw new Error("month and year required");
      }

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      const { rows, count } = await Expense.findAndCountAll({
        where: {
          userId,
          date: {
            [Op.gte]: startDate,
            [Op.lt]: endDate,
          },
        },
        attribute: ["id", "categoryId", "amount", "date"],
        include: [{ model: Category, attributes: ["id", "name"] }],
      });

      const categoryMap = new Map();
      rows.forEach((item) => {
        const categoryId = item.categoryId;
        const exists = categoryMap.get(categoryId);
        if (exists) {
          exists.totalExpenseAmount += Number(item.amount);
        } else {
          categoryMap.set(categoryId, {
            totalExpenseAmount: Number(item.amount),
            categoryName: item.Category.name,
          });
        }
      });
      const resp = Array.from(categoryMap.values());

      const data = {
        count: resp?.length,
        resp,
      };
      return data;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = AnalyticsService;
