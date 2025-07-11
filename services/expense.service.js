const { Sequelize } = require("sequelize");
const Expense = require("../models/expense.js");
const handleSequelizeError = require("../utils/sequelizeErrorHandler.js");
const User = require("../models/user.js");
const Category = require("../models/category.js");

const ExpenseService = {
  createExpenseService: async (data) => {
    try {
      const result = await Expense.create(data);
      return result;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  getExpenseSummaryService: async (userId) => {
    try {
      const expensesSummary = await Expense.findAll({
        where: {
          userId,
        },
        include: [{ model: User }, { model: Category }],
      });
      if (!expensesSummary.length) {
        return {
          totalExpense: 0,
          averageExpense: 0,
          thisMonthExpense: 0,
          topCategory: null,
        };
      }
      const totalExpense = expensesSummary.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const avgExpense = totalExpense / expensesSummary.length;

      // This Month's Expense
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const currentMonthExpenseData = expensesSummary.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      });

      const currMonthExpenseAmount = currentMonthExpenseData.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const categoryMap = new Map();
      let topCategoryData = null;
      let maxAmt = 0;

      expensesSummary?.forEach((item) => {
        const catId = item.categoryId;
        const amt = item.amount;
        const name = item.Category.name;

        if (categoryMap.has(catId)) {
          const existing = categoryMap.get(catId);
          existing.amt += amt;
        } else {
          categoryMap.set(catId, { catId, amt, name });
        }

        const current = categoryMap.get(catId);
        if (current.amt > maxAmt) {
          maxAmt = current.amt;
          topCategoryData = current;
        }
      });

      return [
        {
          key: "Total Expense",
          amount: `$ ${totalExpense}`,
          otherInfo: `${expensesSummary?.length} Transactions`,
        },
        {
          key: "Avg Expense",
          amount: `$ ${avgExpense}`,
          otherInfo: `0.01+ from last month`,
        },
        {
          key: "This Month",
          amount: `$ ${currMonthExpenseAmount}`,
          otherInfo: `Per transaction`,
        },
        {
          key: "Top Category",
          amount: topCategoryData.name,
          otherInfo: `$ ${topCategoryData.amt}`,
        },
      ];
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = ExpenseService;
