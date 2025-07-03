const express = require("express");
const userController = require("../../controllers/user/index.js");

const router = express.Router();

router.get("/", userController.getUser);

router.post("/", userController.createUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
