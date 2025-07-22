const Category = require("../models/category");
const handleSequelizeError = require("../utils/sequelizeErrorHandler");

const CategoryService = {
  getAllCategoryService: async () => {
    try {
      const data = await Category.findAll();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  createCategoryService: async (data) => {
    try {
      const resp = await Category.create(data);
      return resp;
    } catch (error) {
      return handleSequelizeError(error);
    }
  },
};

module.exports = CategoryService;
