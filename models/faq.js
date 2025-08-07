const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const FAQCategory = require("./faqCategories.js");

const Faqs = sequelize.define("Faqs", {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FAQCategory,
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

Faqs.belongsTo(FAQCategory, {
  foreignKey: "category_id",
  as: "category",
});

module.exports = Faqs;
