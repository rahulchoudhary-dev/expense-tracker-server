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
      const resp = await userService.updateUser(userId, userData);
      return successResponse(res, 200, "User updated successfully", resp);
    } catch (error) {
      return errorResponse(res, 400, error.message || "Something went wrong.");
    }
  },
  deleteUser: (req, res) => {},
};

module.exports = userController;
