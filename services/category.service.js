const Category = require("../models/category");

const CategoryService = {
  getAllCategoryService: async () => {
    try {
      const data = await Category.findAll();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = CategoryService;
