const { ZodError } = require("zod");
const ratingService = require("../../services/ratings.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");
const { ratingSchema } = require("../../validations/ratings.validations");

const ratingController = {
  addRating: async (req, res) => {
    const userId = req.user.id;
    const data = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID are required." });
    }
    try {
      const parsedData = await ratingSchema.parseAsync(data);
      delete parsedData.userId;
      const result = await ratingService.addRating(userId, parsedData);
      return successResponse(res, 200, "Ratings added successfully", result);
    } catch (error) {
      if (error instanceof ZodError) {
        return errorResponse(
          res,
          500,
          error?._zod?.def[0]?.message || "Internal Server Error"
        );
      }

      return errorResponse(res, 500, error?.message || "Internal Server Error");
    }
  },
};

module.exports = ratingController;
