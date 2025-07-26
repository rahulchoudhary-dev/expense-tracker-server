const { Sequelize, where } = require("sequelize");
const bcrypt = require("bcrypt");
const handleSequelizeError = require("../utils/sequelizeErrorHandler");
const User = require("../models/user");
const userMedia = require("../models/userMedia");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} = require("../utils/tokenUtils");
const PasswordResetOTP = require("../models/passwordResetOTP");
const sendEmail = require("../utils/email");
const generateOTP = require("../utils/generateOTP");

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
  forgotPassword: async (emailId) => {
    try {
      const existingUser = await User.findOne({
        where: {
          email: emailId,
        },
      });
      if (!existingUser) {
        throw new Error("not a valid email address");
      }
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

      const data = {
        userId: existingUser.id,
        otp,
        expiresAt,
      };
      await PasswordResetOTP.destroy({
        where: {
          userId: existingUser.id,
        },
      });
      await PasswordResetOTP.create(data);
      await sendEmail(emailId, otp);
      return { message: "OTP sent to your email." };
    } catch (error) {
      console.log("error", error);
      throw handleSequelizeError(error);
    }
  },
  verifyOTP: async (otp, emailId) => {
    try {
      const user = await User.findOne({
        where: { email: emailId },
        attributes: ["id", "email"],
      });
      console.log("user", user);
      if (!user) throw new Error("User not found");

      const otpData = await PasswordResetOTP.findOne({
        where: {
          userId: user.id,
          used: false,
        },
      });
      if (otpData.otp != otp) throw new Error("OTP not matched ");

      if (otpData.expiresAt <= new Date()) throw new Error("OTP Expierd");
      const token = generateAccessToken(user);

      return { message: "OTP verified successfully", resetPasstoken: token };
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  resetPassword: async (password, emailId, resetPassToken) => {
    try {
      const verifiedToken = verifyAccessToken(resetPassToken);
      console.log("verifiedToken", verifiedToken);
      if (!verifiedToken) {
        throw new Error("Token Expierd");
      }

      const user = await User.findOne({ where: { email: emailId } });
      if (!user) throw new Error("User not found");

      await user.update({ password });
      return { message: "Password updated successfully" };
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = authService;
