const paymentMethodsService = require("../../services/payementMethods.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");

const PaymentMethodsController = {
  getPayementMethods: async (req, res) => {
    try {
      const data = await paymentMethodsService.getPaymentMethodsService();
      return successResponse(res, 200, "", data);
    } catch (error) {}
    return errorResponse(res, 500, error);
  },
};

module.exports = PaymentMethodsController;
