const User = require("../models/user.js");
const handleSequelizeError = require("../utils/sequelizeErrorHandler.js");
const cloudinary = require("../utils/upload.js");
const fs = require("fs");
const userMedia = require("../models/userMedia.js");
const userService = {
  updateUser: async (userId, userData) => {
    try {
      const { password, confirmPassword, id, ...sanitizedData } = userData;

      const user = await User.findOne({ where: { id: userId } });
      if (!user) {
        throw new Error("User not found");
      }
      const result = await User.update(sanitizedData, {
        where: { id: userId },
        returning: true,
      });
      const updatedUser = result[1][0];

      return updatedUser;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  uploadProfileImage: async (filePath, userId) => {
    try {
      const existingMedia = await userMedia.findOne({ where: { userId } });

      const uploadResult = await cloudinary.v2.uploader.upload(filePath, {
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

      const newMedia = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        resource_type: uploadResult.resource_type,
        userId,
      };
      const uploadedData = await userMedia.create(newMedia);

      return uploadedData;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = userService;
