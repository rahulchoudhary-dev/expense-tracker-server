const Budget = require("../models/budget");
const handleSequelizeError = require("../utils/sequelizeErrorHandler");
const Expense = require("../models/expense.js");
const { Op } = require("sequelize");

const budgetService = {
  createBudget: async (userId, budgetData) => {
    try {
      const whereCondition = {
        userId,
        year: budgetData.year,
      };

      if (budgetData.type === "monthly") {
        if (!budgetData.month) {
          throw new Error("Month is required for monthly budget.");
        }
        whereCondition.month = budgetData.month;
      } else if (budgetData.type === "yearly") {
        whereCondition.month = null;
      } else {
        throw new Error("Invalid budget type. Must be 'monthly' or 'yearly'.");
      }

      const existingBudget = await Budget.findOne({ where: whereCondition });
      if (existingBudget) {
        if (budgetData.type === "monthly") {
          throw new Error(
            `Budget already exists for year ${budgetData.year} and month ${budgetData.month}.`
          );
        } else {
          throw new Error(`Budget already exists for year ${budgetData.year}.`);
        }
      }

      let getExpenseAmount = 0;
      if (budgetData.type == "yearly") {
        const budgetYear = budgetData.year;
        const yearStartDate = new Date(`${budgetYear}-01-01`);
        const newYearStartDate = new Date(`${Number(budgetYear) + 1}-01-01`);
        getExpenseAmount = await Expense.sum("amount", {
          where: {
            userId,
            date: {
              [Op.gte]: yearStartDate,
              [Op.lt]: newYearStartDate,
            },
          },
        });
      }

      let getMonthExpenseAmount = 0;
      if (budgetData.type == "monthly") {
        const month = Number(budgetData.month);
        const year = Number(budgetData.year);
        const monthStartDate = new Date(year, month - 1, 1);
        const nextMonthStartDate = new Date(year, month, 1);
        getMonthExpenseAmount = await Expense.sum("amount", {
          where: {
            userId,
            date: {
              [Op.gte]: monthStartDate,
              [Op.lt]: nextMonthStartDate,
            },
          },
        });
      }

      const usedAmount =
        budgetData.type === "monthly"
          ? getMonthExpenseAmount || 0
          : getExpenseAmount || 0;

      const result = await Budget.create({
        ...budgetData,
        usedAmount,
        userId,
      });

      return result;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  getBudget: async (userId, type) => {
    try {
      const whereClouse = {};
      if (type == "all") {
        whereClouse.userId = userId;
      } else {
        whereClouse.userId = userId;
        whereClouse.type = type;
      }

      console.log(whereClouse);
      const { rows, count: totalBudgetCount } = await Budget.findAndCountAll({
        where: {
          ...whereClouse,
        },
        distinct: true,
        order: [["id", "ASC"]],
      });

      // Monthly count and sum
      const monthlyBudgetCount = await Budget.count({
        where: { userId, type: "monthly" },
      });
      const monthlyBudgetSumResult = await Budget.sum("amount", {
        where: { userId, type: "monthly" },
      });

      // Yearly count and sum
      const yearlyBudgetCount = await Budget.count({
        where: { userId, type: "yearly" },
      });
      const yearlyBudgetSumResult = await Budget.sum("amount", {
        where: { userId, type: "yearly" },
      });

      // Total sum
      const totalBudgetSum =
        (monthlyBudgetSumResult || 0) + (yearlyBudgetSumResult || 0);

      // Return full response
      return {
        budgets: rows,
        summary: {
          counts: {
            total: totalBudgetCount,
            monthly: monthlyBudgetCount,
            yearly: yearlyBudgetCount,
          },
          sums: {
            total: totalBudgetSum,
            monthly: monthlyBudgetSumResult || 0,
            yearly: yearlyBudgetSumResult || 0,
          },
        },
      };
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  deleteBudget: async (userId, budgetId) => {
    try {
      const budgetData = await Budget.findOne({
        where: {
          id: budgetId,
          userId: userId,
        },
      });

      if (!budgetData) {
        throw new Error("Budget not found for this user.");
      }

      await Budget.destroy({
        where: {
          id: budgetId,
        },
      });

      return { message: "Budget deleted successfully" };
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  updateBudget: async (userId, budgetId, updatedData) => {
    delete updatedData.id;
    delete updatedData.usedAmount;

    try {
      const existingBudget = await Budget.findOne({
        where: {
          id: budgetId,
          userId: userId,
        },
      });

      if (!existingBudget) {
        throw new Error("Budget not found for this user.");
      }

      await Budget.update(updatedData, {
        where: {
          id: budgetId,
          userId,
        },
      });

      return { message: "Budget updated successfully" };
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = budgetService;
