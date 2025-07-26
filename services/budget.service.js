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
  getBudget: async (userId) => {
    try {
      const result = await Budget.findAll({
        where: {
          userId,
        },
      });
      return result;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = budgetService;
