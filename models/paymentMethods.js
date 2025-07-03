const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const slugify = require("slugify");
const convertToSlug = require("../utils/slugify.js");

const PaymentMethods = sequelize.define(
  "PaymentMethods",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
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
      beforeCreate: async (payementMethod) => {
        if (!payementMethod.slug && payementMethod.name) {
          const slugData = convertToSlug(payementMethod.name);
          payementMethod.slug = slugData;
        }
      },
      beforeUpdate: async (payementMethod) => {
        if (payementMethod.changed("name")) {
          const slugData = slugify(payementMethod.name, {
            lower: true,
            strict: true,
            trim: true,
          });
          payementMethod.slug = slugData;
        }
      },
    },
  }
);
module.exports = PaymentMethods;
