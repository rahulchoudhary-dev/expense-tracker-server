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
  getExpenseSummaryService: async (data) => {
    const { userId } = data;
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

      const thisMonthExpenseAmount = currentMonthExpenseData.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      // const categoryGroup = [];
      // expensesSummary?.map((item) => {
      //   const catId = item.categoryId;
      //   const amt = item.amount;
      //   const found = categoryGroup.find((ite) => ite.catId == catId);
      //   console.log(found);
      //   if (found) {
      //     found.amt += amt;
      //   } else {
      //     categoryGroup.push({ catId, amt, name: item.Category.name });
      //   }
      // });
      // const amt = 0;
      // let topCategoryData = null;
      // categoryGroup?.map((item) => {
      //   if (item.amt > amt) {
      //     topCategoryData = item;
      //   } else {
      //     amt = item.amt;
      //   }
      // });

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

      return {
        totalExpense,
        avgExpense,
        thisMonthExpenseAmount,
        topCategoryData,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = ExpenseService;
