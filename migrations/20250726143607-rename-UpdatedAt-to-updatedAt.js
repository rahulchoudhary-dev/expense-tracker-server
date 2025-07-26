"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("Budgets", "UpdatedAt", "updatedAt");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("Budgets", "updatedAt", "UpdatedAt");
  },
};
