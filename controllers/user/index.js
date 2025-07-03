const userService = require("../../services/user.service.js");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler.js");

const userController = {
  getUser: (req, res) => {
    res.status(200).json({ message: "User details fetched successfully" });
  },
  createUser: async (req, res) => {
    const userData = req.body;
    try {
      const user = await userService.createUser(userData);
      return successResponse(res, 201, "User created successfully", user);
    } catch (error) {
      return errorResponse(res, 500, "Error creating user", error.message);
    }
  },
  updateUser: (req, res) => {},
  deleteUser: (req, res) => {},
};

module.exports = userController;
