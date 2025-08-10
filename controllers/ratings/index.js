const { ZodError } = require("zod");
const ratingService = require("../../services/ratings.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");
const { ratingSchema } = require("../../validations/ratings.validations");

const ratingController = {
  createOrUpdateRating: async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      return errorResponse(res, 400, "User ID is required.");
    }

    try {
      const parsedData = await ratingSchema.parseAsync(req.body);
      delete parsedData.userId; // Prevent overriding userId
      const result = await ratingService.createOrUpdateRating(
        userId,
        parsedData
      );

      return successResponse(res, 201, "Rating created successfully.", result);
    } catch (error) {
      if (error instanceof ZodError) {
        return errorResponse(
          res,
          400,
          error.errors?.[0]?.message || "Validation error."
        );
      }
      return errorResponse(
        res,
        500,
        error?.message || "Failed to create rating."
      );
    }
  },

  getUserRatings: async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      return errorResponse(res, 400, "User ID is required.");
    }

    try {
      const result = await ratingService.getUserRatings(userId);
      return successResponse(
        res,
        200,
        "User ratings retrieved successfully.",
        result
      );
    } catch (error) {
      return errorResponse(
        res,
        500,
        error?.message || "Failed to fetch user ratings."
      );
    }
  },
};

module.exports = ratingController;
