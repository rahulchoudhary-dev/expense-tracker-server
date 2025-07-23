const authService = require("../../services/auth.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");

const authController = {
  signIn: async (req, res) => {
    const userCredentials = req.body;
    try {
      const result = await authService.signIn(userCredentials);
      return successResponse(res, 200, "Login successful", result);
    } catch (error) {
      return errorResponse(res, 400, error.message, error.stack || null);
    }
  },
  signUp: async (req, res) => {
    const userData = req.body;
    try {
      const result = await authService.signUp(userData);
      return successResponse(res, 201, "User created successfully", result);
    } catch (error) {
      return errorResponse(res, 500, error.message, error.stack);
    }
  },
  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        return errorResponse(
          res,
          400,
          "Refresh token is required",
          "Token is required"
        );
      }
      const result = await authService.refreshToken(refreshToken);
      return successResponse(res, 200, "Token refreshed successfully", result);
    } catch (error) {
      return errorResponse(res, 500, error.message, error.stack);
    }
  },
};

module.exports = authController;
