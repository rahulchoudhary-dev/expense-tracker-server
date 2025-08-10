const express = require("express");
const ratingController = require("../../controllers/ratings");

const router = express.Router();

router.post("/", ratingController.addRating);
// router.get("/");

module.exports = router;
