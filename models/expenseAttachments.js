const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const Expense = require("./expense.js");
const User = require("./user.js");

const ExpenseAttachment = sequelize.define("ExpenseAttachments", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  attachmentUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  public_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  format: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resource_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  expenseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Expense,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = ExpenseAttachment;
