const CategoryService = require("../../services/category.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");

const CategoryController = {
  getAllCategory: async (req, res) => {
    try {
      const data = await CategoryService.getAllCategoryService();
      return successResponse(res, 200, "", data);
    } catch (error) {
      return errorResponse(res, 500, error);
    }
  },
};
module.exports = CategoryController;
