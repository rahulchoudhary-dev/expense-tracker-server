const AuthService = require("../../services/auth.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");

const handleSequelizeError = require("../../utils/sequelizeErrorHandler");

const AuthController = {
  signIn: async (req, res) => {
    try {
      const result = await AuthService.signInService(req.body);
      return successResponse(res, 200, "Login successful", result);
    } catch (error) {
      return errorResponse(
        res,
        error.statusCode || 500,
        error.message,
        error.message || null
      );
    }
  },
};

module.exports = AuthController;
