const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Budget = sequelize.define(
  "Budget",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("monthly", "yearly"),
      allowNull: false,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 12,
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    usedAmount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "Budgets",
    timestamps: true,
    validate: {
      checkMonthBasedOnType() {
        if (this.type === "monthly" && this.month === null) {
          throw new Error("Month is required for monthly budget.");
        }
        if (this.type === "yearly" && this.month !== null) {
          throw new Error("Month must be null for yearly budget.");
        }
      },
    },
  }
);

Budget.belongsTo(User, { foreignKey: "userId" });

module.exports = Budget;
