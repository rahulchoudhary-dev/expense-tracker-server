const categoryService = require("../../services/category.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");

const categoryController = {
  getAllCategory: async (req, res) => {
    try {
      const result = await categoryService.getAllCategory();
      return successResponse(
        res,
        200,
        "Categories fetched successfully",
        result
      );
    } catch (error) {
      return errorResponse(res, 500, "Failed to fetch categories", error.stack);
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
      const result = await categoryService.createCategory(data);
      return successResponse(res, 201, "category created successfully", result);
    } catch (error) {
      return errorResponse(res, 500, "category not created", error.stack);
    }
  },
};
module.exports = categoryController;
