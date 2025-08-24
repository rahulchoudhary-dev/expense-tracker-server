const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("../models/user");

const UserTelegram = sequelize.define(
  "UserTelegram",
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
    telegramId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "userTelegram",
  }
);

module.exports = UserTelegram;
