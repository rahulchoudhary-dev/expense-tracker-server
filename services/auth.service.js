const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const handleSequelizeError = require("../utils/sequelizeErrorHandler");
const User = require("../models/user");
const userMedia = require("../models/userMedia");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokenUtils");

const authService = {
  signIn: async (userCredentials) => {
    try {
      const { email, password } = userCredentials;

      const user = await User.findOne({
        where: { email },
        include: [
          {
            model: userMedia,
            as: "userMedia",
          },
        ],
      });
      if (!user) {
        throw new Error("User not found");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Password not matched");
      }
      const access_token = generateAccessToken(user);
      const refresh_token = generateRefreshToken(user);
      const userObj = user.get({ plain: true });
      delete userObj.password;
      return { ...userObj, access_token, refresh_token };
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  signUp: async (data) => {
    try {
      await User.create(data);
      delete data.password;
      return data;
    } catch (error) {
      if (error instanceof Sequelize.UniqueConstraintError) {
        throw new Error("Email already exists");
      }
      throw handleSequelizeError(error);
    }
  },
  refreshToken: async (refreshToken) => {
    try {
      const verifiedRefreshToken = verifyRefreshToken(refreshToken);
      if (!verifiedRefreshToken) {
        throw new Error("Invalid refresh token");
      }
      const payload = verifiedRefreshToken.user;
      if (!payload) {
        throw new Error("Invalid token payload");
      }
      const newAccesssToken = generateAccessToken(payload);
      const newRefreshToken = generateRefreshToken(payload);
      return { newAccesssToken, newRefreshToken };
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = authService;
