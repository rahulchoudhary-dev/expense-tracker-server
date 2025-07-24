const { Op } = require("sequelize");
const Expense = require("../models/expense.js");
const handleSequelizeError = require("../utils/sequelizeErrorHandler.js");
const User = require("../models/user.js");
const Category = require("../models/category.js");
const PaymentMethods = require("../models/paymentMethods.js");
const cloudinary = require("../utils/upload.js");
const ExpenseAttachment = require("../models/expenseAttachments.js");
const fs = require("fs");

const expenseService = {
  createExpenseService: async (data) => {
    try {
      const result = await Expense.create(data);
      return result;
    } catch (error) {
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
  editExpense: async (expenseId, data) => {
    try {
      const resp = await Expense.update(data, {
        where: {
          id: expenseId,
        },
        returning: true,
      });
      return resp[1][0];
    } catch (error) {
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
