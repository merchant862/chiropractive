'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'slug', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Single product image path'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'slug');
  }
};
