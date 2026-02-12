'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('leads', 'lead_token', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.addColumn('leads', 'is_partial', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });

    await queryInterface.addColumn('leads', 'is_paid', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn('leads', 'partial_created_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('leads', 'paid_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('leads', 'lead_token');
    await queryInterface.removeColumn('leads', 'is_partial');
    await queryInterface.removeColumn('leads', 'is_paid');
    await queryInterface.removeColumn('leads', 'partial_created_at');
    await queryInterface.removeColumn('leads', 'paid_at');
  }
};
