"use strict";

const paymentMethods = require("../seed-data/paymentMethods");
const convertToSlug = require("../utils/slugify");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const data = paymentMethods.map((items) => {
      return {
        name: items,
        slug: convertToSlug(items),
        createdAt: now,
        updatedAt: now,
      };
    });

    await queryInterface.bulkInsert("PaymentMethods", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("PaymentMethods", null, {});
  },
};
