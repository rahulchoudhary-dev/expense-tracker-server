const { z } = require("zod");

const contactSupportSchema = z.object({
  email: z.string().email("Invalid email"),
  category: z.string().min(1, "Category is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

module.exports = { contactSupportSchema };
