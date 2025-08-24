// config/database.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // add port
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Supabase requires this for SSL
      },
    },
    pool: {
      max: 5, // keep connections low (Supabase pooler limit ~20)
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: false, // optional: disable SQL query logging
  }
);

module.exports = sequelize;
