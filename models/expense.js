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
    validate: {
      min: {
        args: [0],
        msg: "Amount cannot be negative",
      },
    },
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: {
        msg: "description should not be empty",
      },
      notEmpty: {
        msg: "Description should not be empty",
      },
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    validate: {
      notNull: {
        msg: "User Id Is Not found",
      },
      isInt: {
        msg: "User Id should be integer",
      },
    },
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: "id",
    },
    validate: {
      notNull: {
        msg: "CategoryId Comlusory",
      },
      isInt: {
        msg: "User Id should be integer",
      },
    },
  },
  paymentMethodId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PaymentMethods,
      key: "id",
    },
    validate: {
      notNull: {
        msg: "paymentMethodId Compulsory",
      },
      isInt: {
        msg: "User Id should be integer",
      },
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
Expense.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Expense.belongsTo(Category, { foreignKey: "categoryId" });
Expense.belongsTo(PaymentMethods, { foreignKey: "paymentMethodId" });

module.exports = Expense;
