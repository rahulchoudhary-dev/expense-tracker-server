const { Sequelize } = require("sequelize");
const User = require("../models/user.js");

const userService = {
  createUser: async (data) => {
    try {
      const user = await User.create(data);
      delete data.password;
      return data;
    } catch (error) {
      if (error instanceof Sequelize.UniqueConstraintError) {
        throw new Error("Email already exists");
      }
      throw new Error(error.message);
    }
  },
};

module.exports = userService;
