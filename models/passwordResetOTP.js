const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PasswordResetOTP = sequelize.define(
  "PasswordResetOTP",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    used: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true, // ✅ Prevents Sequelize from pluralizing the table name
  }
);

module.exports = PasswordResetOTP;
