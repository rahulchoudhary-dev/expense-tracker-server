const express = require("express");
const AuthController = require("../../controllers/auth");

const router = express.Router();

router.post("/signIn", AuthController.signIn);
router.post("/signUp", AuthController.signUp);

router.post("/refresh-token", AuthController.refreshToken);

module.exports = router;
