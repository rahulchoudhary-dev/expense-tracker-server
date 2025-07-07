const express = require("express");
const CategoryController = require("../../controllers/category");

const router = express.Router();

router.get("/", CategoryController.getAllCategory);

module.exports = router;
