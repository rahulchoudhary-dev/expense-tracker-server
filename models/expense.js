const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Category = require("./category");
const PaymentMethods = require("./paymentMethods");

const Expense = sequelize.define("Expense", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // validate: {
    //   min: 0,
    //   isDecimal: true,
    // },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  categoryId: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: "id",
    },
  },
  paymentMethodId: {
    type: DataTypes.INTEGER,
    references: {
      model: PaymentMethods,
      key: "id",
    },
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
Expense.belongsTo(User, { foreignKey: "userId" });
Expense.belongsTo(Category, { foreignKey: "categoryId" });
Expense.belongsTo(PaymentMethods, { foreignKey: "paymentMethodId" });

module.exports = Expense;
