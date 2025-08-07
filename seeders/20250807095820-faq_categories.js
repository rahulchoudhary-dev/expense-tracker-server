"use strict";

const faqCategories = require("../seed-data/faqCategories");
const convertToSlug = require("../utils/slugify");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = faqCategories.map((item) => {
      return {
        name: item,
        slug: convertToSlug(item),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("faq_categories", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("faq_categories", null, {});
  },
};
