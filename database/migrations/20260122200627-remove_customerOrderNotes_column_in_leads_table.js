'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('leads', 'customerOrderNotes');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('leads', 'customerOrderNotes', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  }
};