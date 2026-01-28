'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('products', 'material', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'moreDesc', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'packaging', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'hpisCode', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'healthCareProvidersOnly', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'latexFree', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'medicationRoute', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'material');
    await queryInterface.removeColumn('products', 'moreDesc');
    await queryInterface.removeColumn('products', 'packaging');
    await queryInterface.removeColumn('products', 'hpisCode');
    await queryInterface.removeColumn('products', 'healthCareProvidersOnly');
    await queryInterface.removeColumn('products', 'latexFree');
    await queryInterface.removeColumn('products', 'medicationRoute');
  }
};
