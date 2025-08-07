const faqService = require("../../services/faq.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");

const faqController = {
  getFAQCategories: async (req, res) => {
    try {
      const result = await faqService.getFAQCategories();
      return successResponse(res, 200, "fetched", result);
    } catch (error) {
      return errorResponse(res, 400, error.message, error.stack);
    }
  },

  getFAQ: async (req, res) => {
    try {
      const result = await faqService.getFAQ();
      return successResponse(res, 200, "fetched", result);
    } catch (error) {
      return errorResponse(res, 400, error.message, error.stack);
    }
  },
};

module.exports = faqController;
