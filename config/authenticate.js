const { Sequelize } = require("sequelize");
const sequelize = require("./database");

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};
module.exports = connectToDatabase;
