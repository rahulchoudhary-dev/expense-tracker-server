const AuthService = require("../../services/auth.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");

const AuthController = {
  signIn: async (req, res) => {
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
  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        return errorResponse(res, 400, "Refresh token is required");
      }
      const data = await AuthService.refreshTokenService(refreshToken);
      console.log("data", data);
      return successResponse(res, 200, "Token refreshed successfully", data);
    } catch (error) {
      return errorResponse(res, 500, error.message, "Error refreshing token");
    }
  },
};

module.exports = AuthController;
