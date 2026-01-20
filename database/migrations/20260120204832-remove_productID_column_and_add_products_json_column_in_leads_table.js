'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('leads', 'productID');
    await queryInterface.addColumn('leads', 'products', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('leads', 'products');
    await queryInterface.addColumn('leads', 'productID', {
      type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    });
  }
};