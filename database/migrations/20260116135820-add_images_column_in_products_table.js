'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'image', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Single product image path'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'image');
  }
};
