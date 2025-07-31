const ContactSupport = require("../models/contactSupport");
const handleSequelizeError = require("../utils/sequelizeErrorHandler");

const contactSupportService = {
  createContactSupport: async (userId, data) => {
    console.log("data", data);
    try {
      const result = await ContactSupport.create({ ...data, userId });
      return result;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};
module.exports = contactSupportService;
