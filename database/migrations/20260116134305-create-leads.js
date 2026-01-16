'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      billingFirstName: {
        type: Sequelize.STRING
      },
      billingLastName: {
        type: Sequelize.STRING
      },
      billingAddress: {
        type: Sequelize.TEXT
      },
      billingCity: {
        type: Sequelize.STRING
      },
      billingState: {
        type: Sequelize.STRING
      },
      billingCountry: {
        type: Sequelize.STRING
      },
      billingEmail: {
        type: Sequelize.STRING
      },
      billingPhone: {
        type: Sequelize.STRING
      },
      shippingFirstName: {
        type: Sequelize.STRING
      },
      shippingLastName: {
        type: Sequelize.STRING
      },
      shippingAddress: {
        type: Sequelize.TEXT
      },
      shippingCity: {
        type: Sequelize.STRING
      },
      shippingState: {
        type: Sequelize.STRING
      },
      shippingCountry: {
        type: Sequelize.STRING
      },
      shippingEmail: {
        type: Sequelize.STRING
      },
      shippingPhone: {
        type: Sequelize.STRING
      },
      cardNo: {
        type: Sequelize.STRING
      },
      cardExpMonth: {
        type: Sequelize.STRING
      },
      cardExpYear: {
        type: Sequelize.STRING
      },
      cardCVV: {
        type: Sequelize.STRING
      },
      clientID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'clients', // future table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      productID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('leads');
  }
};