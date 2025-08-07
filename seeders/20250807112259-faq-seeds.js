"use strict";

const faqs = require("../seed-data/faqs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Faqs", faqs);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Faqs", null, {});
  },
};
