const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const convertToSlug = require("../utils/slugify.js");
const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
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
  },
  {
    paranoid: true,
    hooks: {
      beforeCreate: (category) => {
        if (!category.slug && category.name) {
          const slug = convertToSlug(category.name);
          category.slug = slug;
        }
      },
      beforeUpdate: (category) => {
        if (category.changed("name")) {
          const slug = convertToSlug(category.name);
          category.slug = slug;
        }
      },
    },
  }
);

module.exports = Category;
