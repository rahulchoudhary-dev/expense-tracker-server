const express = require("express");
const ratingController = require("../../controllers/ratings");

const router = express.Router();

router.post("/", ratingController.createOrUpdateRating);
router.get("/", ratingController.getUserRatings);

module.exports = router;
