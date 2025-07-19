"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("userMedia", "created_at", "createdAt");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("userMedia", "createdAt", "created_at");
  },
};
