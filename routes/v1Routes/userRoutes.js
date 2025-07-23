const express = require("express");
const multer = require("multer");

const userController = require("../../controllers/user/index.js");

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/get-user", userController.getUser);

router.patch("/update-user", userController.updateUser);
router.delete("/delete-user", userController.deleteUser);

router.post(
  "/profile-upload",
  upload.single("file"),
  userController.uploadProfileImage
);

module.exports = router;
