const router = require("express").Router();

const userRoutes = require("./userRoutes");
const paymentMethodsRoutes = require("./paymentMethods");
const categoryRoutes = require("../v1Routes/category");
const expenseRouter = require("../v1Routes/expense");

router.use("/auth/user", userRoutes);
router.use("/payment-methods", paymentMethodsRoutes);
router.use("/category", categoryRoutes);

router.use("/expense", expenseRouter);

module.exports = router;
