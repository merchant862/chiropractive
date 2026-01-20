'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('leads', 'shippingPostalCode', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('leads', 'billingPostalCode', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('leads', 'customerOrderNotes', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('leads', 'shippingPostalCode');
    await queryInterface.removeColumn('leads', 'billingPostalCode');
    await queryInterface.removeColumn('leads', 'customerOrderNotes');
  }
};