const router = require("express").Router();

const userRoutes = require("./userRoutes");

router.use("/auth/user", userRoutes);

module.exports = router;
