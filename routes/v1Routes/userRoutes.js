const express = require("express");
const multer = require("multer");

const userController = require("../../controllers/user/index.js");

const upload = multer({ dest: "uploads/" }); // temp local storage

const router = express.Router();

router.get("/get-user", userController.getUser);
router.post(
  "/profile-upload",
  upload.single("file"),
  userController.uploadProfileImage
);

router.patch("/update-user", userController.updateUser);
router.delete("/delete-user", userController.deleteUser);

module.exports = router;
