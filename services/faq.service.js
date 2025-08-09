const Faqs = require("../models/faq");
const FAQCategory = require("../models/faqCategories");
const handleSequelizeError = require("../utils/sequelizeErrorHandler");

const faqService = {
  getFAQCategories: async () => {
    try {
      const result = await FAQCategory.findAll();
      return result;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },

  getFAQ: async () => {
    try {
      const result = await Faqs.findAll({
        include: {
          model: FAQCategory,
          as: "category",
          attributes: ["name"],
        },
        attributes: ["question", "answer", "id"],
      });
      return result;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = faqService;
