const handleSequelizeError = require("../utils/sequelizeErrorHandler");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");
const { Sequelize } = require("sequelize");

const AuthService = {
  signInService: async (data) => {
    try {
      const { email, password } = data;
      console.log("email");

      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Password not matched");
      }
      const payload = { id: user.id, fullName: user.fullName };
      const access_token = generateAccessToken(payload);
      const refresh_token = generateRefreshToken(payload);
      const userObj = user.get({ plain: true });
      delete userObj.password;

      return { ...userObj, access_token, refresh_token };
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  signUpService: async (data) => {
    try {
      const user = await User.create(data);
      delete data.password;
      return data;
    } catch (error) {
      if (error instanceof Sequelize.UniqueConstraintError) {
        throw new Error("Email already exists");
      }
      throw handleSequelizeError(error);
    }
  },
};

module.exports = AuthService;
