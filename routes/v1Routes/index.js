const router = require("express").Router();

const userRoutes = require("./userRoutes");
const paymentMethodsRoutes = require("./paymentMethods");
const categoryRoutes = require("../v1Routes/category");
const expenseRouter = require("../v1Routes/expense");
const authRoutes = require("./auth");

router.use("/auth", authRoutes);

router.use("/user", userRoutes);
router.use("/payment-methods", paymentMethodsRoutes);
router.use("/category", categoryRoutes);

router.use("/expense", expenseRouter);

module.exports = router;
