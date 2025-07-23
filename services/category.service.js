const Category = require("../models/category");
const handleSequelizeError = require("../utils/sequelizeErrorHandler");

const categoryService = {
  getAllCategory: async () => {
    try {
      const result = await Category.findAll();
      return result;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
  createCategory: async (data) => {
    try {
      const result = await Category.create(data);
      return result;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = categoryService;
