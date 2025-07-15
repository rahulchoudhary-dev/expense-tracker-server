const { Sequelize, Op } = require("sequelize");
const Expense = require("../models/expense.js");
const handleSequelizeError = require("../utils/sequelizeErrorHandler.js");
const User = require("../models/user.js");
const Category = require("../models/category.js");
const PaymentMethods = require("../models/paymentMethods.js");

const ExpenseService = {
  createExpenseService: async (data) => {
    try {
      const result = await Expense.create(data);
      return result;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },

  getExpenseService: async (userId, filters) => {
    const { month, year, limit, page } = filters;
    const offset = page * limit;
    try {
      if (!month || !year) {
        throw new Error("Month and year are required.");
      }

      const whereClause = { userId };

      if (filters?.categoryId) {
        whereClause.categoryId = filters.categoryId;
      }
      if (filters?.paymentMethodId) {
        whereClause.paymentMethodId = filters.paymentMethodId;
      }
      if (filters.q) {
        const searchConditions = [
          { description: { [Op.iLike]: `%${filters.q}%` } },
        ];

        if (!isNaN(Number(filters.q))) {
          searchConditions.push({ amount: { [Op.eq]: Number(filters.q) } });
        }

        whereClause[Op.or] = searchConditions;
      }

      const monthStartDate = new Date(year, month - 1, 1);
      const monthEndDate = new Date(year, month, 1);

      const { rows, count } = await Expense.findAndCountAll({
        where: {
          ...whereClause,
          date: {
            [Op.gte]: monthStartDate,
            [Op.lt]: monthEndDate,
          },
        },
        include: [
          { model: Category, attributes: ["id", "name"] },
          { model: PaymentMethods, attributes: ["id", "name"] },
        ],
        limit: Number(limit),
        offset: Number(offset),
      });

      const data = {
        count,
        limit,
        page,
        resp: rows,
      };
      return data;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  getExpenseSummaryService: async (userId, filters) => {
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
          lable: "Total Expense",
          value: `${totalExpense}`,
          currency: "$",
          otherInfo: `${expensesSummary?.length} Transactions`,
        },
        {
          lable: "Avg Expense",
          value: `${avgExpense}`,
          currency: "$",
          otherInfo: `0.01+ from last month`,
        },
        {
          lable: "This Month",
          value: `${currMonthExpenseAmount}`,
          currency: "$",
          otherInfo: `Per transaction`,
        },
        {
          lable: "Top Category",
          value: topCategoryData.name,
          currency: "$",
          otherInfo: `${topCategoryData.amt}`,
        },
      ];
    } catch (error) {
      throw new Error(error.message);
    }
  },
  editExpenseService: async (expenseId, data) => {
    try {
      const resp = await Expense.update(data, {
        where: {
          id: expenseId,
        },
        returning: true,
      });
      return resp[1][0];
    } catch (error) {
      return handleSequelizeError(error);
    }
  },
  deleteExpenseService: async (expenseId) => {
    try {
      const resp = await Expense.destroy({ where: { id: expenseId } });
      return resp;
    } catch (error) {
      return handleSequelizeError(error);
    }
  },
};

module.exports = ExpenseService;
