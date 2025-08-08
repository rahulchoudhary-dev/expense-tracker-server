const { ZodError } = require("zod");
const contactSupportService = require("../../services/contactSupport.service");
const {
  successResponse,
  errorResponse,
} = require("../../utils/responseHandler");
const {
  contactSupportSchema,
} = require("../../validations/contactSupport.validation");

const contactSupportController = {
  createContactSupport: async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
      throw new Error("userId is required");
    }
    try {
      const parsedData = await contactSupportSchema.parseAsync(req.body);
      delete parsedData.userId;

      const result = await contactSupportService.createContactSupport(
        userId,
        parsedData
      );
      return successResponse(
        res,
        200,
        "Support request submitted successfully",
        result
      );
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

module.exports = contactSupportController;
