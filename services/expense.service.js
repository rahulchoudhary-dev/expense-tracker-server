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

      const { rows, count } = await Expense.findAndCountAll({
        where: { ...whereClause },
        include: [
          { model: Category, attributes: ["id", "name"] },
          { model: PaymentMethods, attributes: ["id", "name"] },
        ],
        limit: Number(limit),
        offset: Number(offset),
      });

      const resp = rows?.filter((item) => {
        const expenseMonth = new Date(item.date).getMonth() + 1;
        const expenseYear = new Date(item.date).getFullYear();
        return month == expenseMonth && year == expenseYear;
      });

      const data = {
        count,
        limit,
        page,
        resp,
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
