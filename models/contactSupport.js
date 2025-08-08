const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("../models/user");
const FAQCategory = require("./faqCategories");

const ContactSupport = sequelize.define(
  "ContactSupport",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FAQCategory,
        key: "id",
      },
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
);
ContactSupport.belongsTo(FAQCategory, {
  foreignKey: "categoryId",
  as: "category",
});
module.exports = ContactSupport;
