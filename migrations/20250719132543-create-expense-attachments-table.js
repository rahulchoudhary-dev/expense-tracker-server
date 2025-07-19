"use strict";

const User = require("../models/user");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ExpenseAttachments", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      attachmentUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      public_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      format: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      resource_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      expenseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Expenses",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ExpenseAttachments");
  },
};
