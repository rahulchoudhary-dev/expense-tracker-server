const AuthService = require("../../services/auth.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");

const AuthController = {
  signIn: async (req, res) => {
    console.log("data");
    try {
      const result = await AuthService.signInService(req.body);
      return successResponse(res, 200, "Login successful", result);
    } catch (error) {
      return errorResponse(res, 400, error.message, error.message || null);
    }
  },
  signUp: async (req, res) => {
    const userData = req.body;
    try {
      const user = await AuthService.signUpService(userData);
      return successResponse(res, 201, "User created successfully", user);
    } catch (error) {
      return errorResponse(res, 500, error.message, "Error creating user");
    }
  },
};

module.exports = AuthController;
