const express = require("express");
const contactSupportController = require("../../controllers/contactSupport");

const router = express.Router();

router.post("/", contactSupportController.createContactSupport);

module.exports = router;
