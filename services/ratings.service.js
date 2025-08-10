const Rating = require("../models/ratings");
const handleSequelizeError = require("../utils/sequelizeErrorHandler");

const ratingService = {
  addRating: async (userId, data) => {
    try {
      const result = await Rating.create({ ...data, userId });
      return result;
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = ratingService;
