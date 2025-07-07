"use strict";

const categories = require("../seed-data/categories");
const convertToSlug = require("../utils/slugify");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const data = categories.map((items) => {
      return {
        name: items,
        slug: convertToSlug(items),
        createdAt: now,
        updatedAt: now,
      };
    });
    await queryInterface.bulkInsert("Categories", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
