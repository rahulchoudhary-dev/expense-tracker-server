const { Sequelize } = require("sequelize");
const User = require("../models/user.js");
const handleSequelizeError = require("../utils/sequelizeErrorHandler.js");
const cloudinary = require("../utils/upload.js");
const fs = require("fs");
const userMedia = require("../models/userMedia.js");
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
  uploadProfileImage: async (filePath, userId) => {
    try {
      const existingMedia = await userMedia.findOne({ where: { userId } });

      const res = await cloudinary.v2.uploader.upload(filePath, {
        overwrite: true,
      });

      fs.unlinkSync(filePath);

      if (existingMedia) {
        await cloudinary.v2.uploader.destroy(existingMedia.public_id, {
          invalidate: true,
        });
        await userMedia.destroy({
          where: { public_id: existingMedia.public_id },
        });
      }

      const data = {
        url: res.secure_url,
        public_id: res.public_id,
        format: res.format,
        resource_type: res.resource_type,
        userId,
      };
      const uploadedData = await userMedia.create(data);

      return uploadedData;
    } catch (error) {
      return handleSequelizeError(error);
    }
  },
};

module.exports = userService;
