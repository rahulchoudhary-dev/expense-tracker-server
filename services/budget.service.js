const Budget = require("../models/budget"); // Adjust path as needed
const handleSequelizeError = require("../utils/sequelizeErrorHandler");

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

      const result = await Budget.create({
        ...budgetData,
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
};

module.exports = budgetService;
