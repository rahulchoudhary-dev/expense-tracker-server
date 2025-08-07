const express = require("express");
const faqController = require("../../controllers/faq");

const router = express.Router();
router.get("/", faqController.getFAQ);
router.get("/faq-categories", faqController.getFAQCategories);

module.exports = router;
