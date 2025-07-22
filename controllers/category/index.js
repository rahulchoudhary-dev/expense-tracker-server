const CategoryService = require("../../services/category.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");
const handleSequelizeError = require("../../utils/sequelizeErrorHandler");

const CategoryController = {
  getAllCategory: async (req, res) => {
    try {
      const data = await CategoryService.getAllCategoryService();
      return successResponse(res, 200, "", data);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  },
  createCategory: async (req, res) => {
    const role = req.user.role;
    if (role == "user") {
      return errorResponse(
        res,
        500,
        "error",
        "Role is not able to craete category"
      );
    }
    const data = req.body;
    try {
      const resp = await CategoryService.createCategoryService(data);
      return successResponse(res, 201, "category created successfully", resp);
    } catch (error) {
      return errorResponse(res, 500, "category not created", error.message);
    }
  },
};
module.exports = CategoryController;
