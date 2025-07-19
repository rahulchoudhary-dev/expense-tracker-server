"use strict";

const { DataTypes, Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn("userMedia", "updatedAt", {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("userMedia", "updatedAt");
  },
};
