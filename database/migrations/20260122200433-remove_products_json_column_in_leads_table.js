'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('leads', 'products');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('leads', 'products', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  }
};