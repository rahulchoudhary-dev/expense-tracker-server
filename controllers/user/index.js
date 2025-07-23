const userService = require("../../services/user.service");
const {
  errorResponse,
  successResponse,
} = require("../../utils/responseHandler");

const userController = {
  getUser: (req, res) => {
    res.status(200).json({ message: "User details fetched successfully" });
  },

  updateUser: async (req, res) => {
    const userId = req.user.id;
    const userData = req.body;
    try {
      const result = await userService.updateUser(userId, userData);
      return successResponse(res, 200, "User updated successfully", result);
    } catch (error) {
      return errorResponse(res, 400, error.message, error.stack);
    }
  },
  deleteUser: async (req, res) => {},
  uploadProfileImage: async (req, res) => {
    const filePath = req.file.path;
    const userId = req.user.id;
    try {
      const result = await userService.uploadProfileImage(filePath, userId);
      return successResponse(
        res,
        200,
        "User profile updated successfully",
        result
      );
    } catch (error) {
      return errorResponse(res, 500, error.message, error.stack);
    }
  },
};

module.exports = userController;
