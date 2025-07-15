const { Sequelize } = require("sequelize");
const User = require("../models/user.js");
const handleSequelizeError = require("../utils/sequelizeErrorHandler.js");

const userService = {
  updateUser: async (userId, userData) => {
    try {
      delete userData.password;
      delete userData.confirmPassword;
      delete userData.id;

      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error("User not found");
      }
      const resp = await User.update(userData, {
        where: { id: userId },
        returning: true,
      });
      const updatedUser = resp[1][0];

      return updatedUser;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = userService;
