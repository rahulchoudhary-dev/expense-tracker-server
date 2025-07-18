"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "role", {
      type: Sequelize.ENUM("user", "admin"),
      defaultValue: "user",
      allowNull: false,
    });

    await queryInterface.addColumn("Users", "isActive", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    });
    await queryInterface.addColumn("Users", "bio", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("Users", "subscriptionStatus", {
      type: Sequelize.ENUM("free", "premium", "trial"),
      defaultValue: "trial",
      allowNull: false,
    });
    await queryInterface.addColumn("Users", "phone", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn("Users", "address", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "role");
    await queryInterface.removeColumn("Users", "bio");
    await queryInterface.removeColumn("Users", "isactive");
    await queryInterface.removeColumn("Users", "phone");
    await queryInterface.removeColumn("Users", "address");
    await queryInterface.removeColumn("Users", "subscriptionStatus");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Users_role";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Users_subscriptionStatus";'
    );
  },
};
