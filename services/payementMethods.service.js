const PaymentMethods = require("../models/paymentMethods");
const handleSequelizeError = require("../utils/sequelizeErrorHandler");

const paymentMethodsService = {
  getPaymentMethods: async () => {
    try {
      const result = await PaymentMethods.findAll();
      return result;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = paymentMethodsService;
