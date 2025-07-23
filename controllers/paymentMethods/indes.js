const paymentMethodsService = require("../../services/payementMethods.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");

const paymentMethodsController = {
  getPayementMethods: async (req, res) => {
    try {
      const result = await paymentMethodsService.getPaymentMethods();
      return successResponse(res, 200, "fetched", result);
    } catch (error) {}
    return errorResponse(res, 500, error, error.stack);
  },
};

module.exports = paymentMethodsController;
