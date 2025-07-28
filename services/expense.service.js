const { Op } = require("sequelize");
const Expense = require("../models/expense.js");
const Budget = require("../models/budget.js");

const handleSequelizeError = require("../utils/sequelizeErrorHandler.js");
const User = require("../models/user.js");
const Category = require("../models/category.js");
const PaymentMethods = require("../models/paymentMethods.js");
const cloudinary = require("../utils/upload.js");
const ExpenseAttachment = require("../models/expenseAttachments.js");
const fs = require("fs");
const sequelize = require("../config/database.js");

const expenseService = {
  createExpense: async (userId, expenseData) => {
    const transaction = await sequelize.transaction();
    try {
      const { date, amount } = expenseData;
      const expenseDate = new Date(date);
      const month = expenseDate.getMonth() + 1;
      const year = expenseDate.getFullYear();

      // Fetch both yearly and monthly budgets in parallel
      const [yearlyBudget, monthlyBudget] = await Promise.all([
        Budget.findOne({
          where: { type: "yearly", year, userId },
          transaction,
          lock: transaction.LOCK.UPDATE,
        }),
        Budget.findOne({
          where: { type: "monthly", year, month, userId },
          transaction,
          lock: transaction.LOCK.UPDATE,
        }),
      ]);

      // Safely increment usedAmount if budgets exist
      if (yearlyBudget) {
        await yearlyBudget.increment("usedAmount", {
          by: amount,
          transaction,
        });
      }

      if (monthlyBudget) {
        await monthlyBudget.increment("usedAmount", {
          by: amount,
          transaction,
        });
      }

      // Create the expense record
      const result = await Expense.create(
        { ...expenseData, userId },
        { transaction }
      );

      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw handleSequelizeError(error);
    }
  },
  getAllExpenses: async (userId, filters) => {
    const { month, year, limit, page } = filters;
    const offset = (page - 1) * limit;
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
          { model: ExpenseAttachment, as: "attachments" },
        ],
        order: [["id", "DESC"]],
        limit: Number(limit),
        offset: Number(offset),
        distinct: true,
      });

      const result = {
        count,
        limit,
        page,
        resp: rows,
      };
      return result;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  getExpenseById: async (expenseId) => {
    try {
      const resp = await Expense.findOne({
        where: {
          id: expenseId,
        },
        include: [
          { model: Category, attributes: ["id", "name"] },
          { model: PaymentMethods, attributes: ["id", "name"] },
          { model: ExpenseAttachment, as: "attachments" },
        ],
      });
      if (!resp) {
        throw new Error("Expense Not Found");
      }
      return resp;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  getExpenseSummary: async (userId, filters) => {
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
      throw handleSequelizeError(error);
    }
  },
  editExpense: async (userId, expenseId, expenseData) => {
    const transaction = await sequelize.transaction();

    // Remove fields that should not be updated manually
    delete expenseData.userId;
    delete expenseData.id;

    try {
      const oldExpense = await Expense.findOne({
        where: { userId, id: expenseId },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!oldExpense) {
        throw new Error("Expense not found");
      }

      const oldAmount = oldExpense.amount;
      const newAmount = expenseData.amount;

      // If amount is unchanged, just update other fields
      if (oldAmount === newAmount) {
        const [_, updatedRows] = await Expense.update(expenseData, {
          where: { id: expenseId, userId },
          returning: true,
          transaction,
        });

        await transaction.commit();
        return updatedRows[0];
      }

      // Amount changed — update budgets accordingly
      const expenseDate = new Date(expenseData.date || oldExpense.date);
      const month = expenseDate.getMonth() + 1;
      const year = expenseDate.getFullYear();

      const [yearlyBudget, monthlyBudget] = await Promise.all([
        Budget.findOne({
          where: { type: "yearly", year, userId },
          transaction,
          lock: transaction.LOCK.UPDATE,
        }),
        Budget.findOne({
          where: { type: "monthly", year, month, userId },
          transaction,
          lock: transaction.LOCK.UPDATE,
        }),
      ]);

      if (yearlyBudget) {
        await yearlyBudget.decrement("usedAmount", {
          by: oldAmount,
          transaction,
        });
        await yearlyBudget.increment("usedAmount", {
          by: newAmount,
          transaction,
        });
      }

      if (monthlyBudget) {
        await monthlyBudget.decrement("usedAmount", {
          by: oldAmount,
          transaction,
        });
        await monthlyBudget.increment("usedAmount", {
          by: newAmount,
          transaction,
        });
      }

      const [_, updatedRows] = await Expense.update(expenseData, {
        where: { id: expenseId, userId },
        returning: true,
        transaction,
      });

      await transaction.commit();
      return updatedRows[0];
    } catch (error) {
      await transaction.rollback();
      throw handleSequelizeError(error);
    }
  },
  deleteExpense: async (expenseId) => {
    try {
      const resp = await Expense.destroy({ where: { id: expenseId } });
      return resp;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  uploadExpenseAttachment: async (files, userId, expenseId) => {
    try {
      for (const file of files) {
        const filePath = file.path;

        const res = await cloudinary.v2.uploader.upload(filePath, {
          overwrite: true,
        });

        const data = {
          attachmentUrl: res.secure_url,
          public_id: res.public_id,
          format: res.format,
          resource_type: res.resource_type,
          userId,
          expenseId,
        };

        await ExpenseAttachment.create(data);
        fs.unlinkSync(filePath);
      }
      return "Attachments added successfully.";
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  deleteExpenseAttachmentById: async (attachmentId) => {
    try {
      const attachmentData = await ExpenseAttachment.findOne({
        where: { id: attachmentId },
      });
      if (!attachmentData) {
        throw new Error("Attachment Not found");
      }
      const public_id = attachmentData?.public_id;
      await cloudinary.v2.uploader.destroy(public_id);

      await ExpenseAttachment.destroy({
        where: { id: attachmentId },
      });
      return { message: "Deleted successfully" };
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = expenseService;
