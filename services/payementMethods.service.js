const PaymentMethods = require("../models/paymentMethods");

const PaymentMethodsService = {
  getPaymentMethodsService: async () => {
    try {
      const data = await PaymentMethods.findAll();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

module.exports = PaymentMethodsService;
