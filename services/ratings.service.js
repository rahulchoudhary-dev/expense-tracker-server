const Rating = require("../models/ratings");
const handleSequelizeError = require("../utils/sequelizeErrorHandler");

const ratingService = {
  createOrUpdateRating: async (userId, ratingData) => {
    try {
      const existingRating = await Rating.findOne({ where: { userId } });

      if (existingRating) {
        await existingRating.update(ratingData);
        return existingRating;
      }

      return await Rating.create({ ...ratingData, userId });
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },

  getUserRatings: async (userId) => {
    try {
      return await Rating.findOne({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      throw handleSequelizeError(error);
    }
  },
};

module.exports = ratingService;
