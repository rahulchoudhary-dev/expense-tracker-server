const router = require("express").Router();

const userRoutes = require("./userRoutes");
const paymentMethodsRoutes = require("./paymentMethods");
const categoryRoutes = require("../v1Routes/category");
const expenseRouter = require("../v1Routes/expense");
const authRoutes = require("./auth");
const analyticsRoutes = require("./analytics");
const budgetRoutes = require("./budget");

const authMiddleware = require("../../middleware/authMiddleware");

router.use("/auth", authRoutes);

router.use("/user", authMiddleware, userRoutes);
router.use("/payment-methods", authMiddleware, paymentMethodsRoutes);
router.use("/categories", authMiddleware, categoryRoutes);

router.use("/expense", authMiddleware, expenseRouter);

router.use("/analytics-charts", authMiddleware, analyticsRoutes);

router.use("/budget", authMiddleware, budgetRoutes);

module.exports = router;
