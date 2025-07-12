const router = require("express").Router();

const userRoutes = require("./userRoutes");
const paymentMethodsRoutes = require("./paymentMethods");
const categoryRoutes = require("../v1Routes/category");
const expenseRouter = require("../v1Routes/expense");
const authRoutes = require("./auth");
const authMiddleware = require("../../middleware/authMiddleware");

router.use("/auth", authRoutes);

router.use("/user", userRoutes);
router.use("/payment-methods", authMiddleware, paymentMethodsRoutes);
router.use("/categories", authMiddleware, categoryRoutes);

router.use("/expense", authMiddleware, expenseRouter);

module.exports = router;
