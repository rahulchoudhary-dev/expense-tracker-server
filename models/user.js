const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.js");
const bcrypt = require("bcrypt");
const saltRounds = parseInt(process.env.BCRYPT_SALT) || 10;

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
      beforeCreate: async (user) => {
        const hash = bcrypt.hashSync(user.password, saltRounds);
        user.password = hash;
      },
      beforeUpdate: (user) => {
        if (user.changed("password")) {
          const hash = bcrypt.hashSync(user.password, saltRounds);
          user.password = hash;
        }
      },
    },
  }
);

module.exports = User;
