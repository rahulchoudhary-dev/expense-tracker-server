const express = require("express");
const authController = require("../../controllers/auth");

const router = express.Router();

router.post("/signIn", authController.signIn);
router.post("/signUp", authController.signUp);

router.post("/refresh-token", authController.refreshToken);

module.exports = router;
