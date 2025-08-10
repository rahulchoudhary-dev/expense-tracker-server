const { z } = require("zod");

const ratingSchema = z.object({
  ratingValue: z
    .number()
    .int()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating cannot be more than 5" }),
  comment: z.string().optional().nullable(),
});

module.exports = { ratingSchema };
