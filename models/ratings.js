const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Rating = sequelize.define(
  "Ratings",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: "id",
      },
    },
    ratingValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "Ratings", // lowercase and plural is best practice
  }
);

// Associations (optional)
Rating.belongsTo(User, { foreignKey: "userId", as: "user" });
module.exports = Rating;
