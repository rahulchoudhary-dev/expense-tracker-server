const express = require("express");
const userController = require("../../controllers/user/index.js");

const router = express.Router();

router.get("/get-user", userController.getUser);

router.patch("/update-user", userController.updateUser);
router.delete("/delete-user", userController.deleteUser);

module.exports = router;
