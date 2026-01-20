'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class leads extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  leads.init({
    billingFirstName: DataTypes.STRING,
    billingLastName: DataTypes.STRING,
    billingAddress: DataTypes.TEXT,
    billingPostalCode: DataTypes.TEXT,
    billingCity: DataTypes.STRING,
    billingState: DataTypes.STRING,
    billingCountry: DataTypes.STRING,
    billingEmail: DataTypes.STRING,
    billingPhone: DataTypes.STRING,
    shippingFirstName: DataTypes.STRING,
    shippingLastName: DataTypes.STRING,
    shippingAddress: DataTypes.TEXT,
    shippingPostalCode: DataTypes.TEXT,
    shippingCity: DataTypes.STRING,
    shippingState: DataTypes.STRING,
    shippingCountry: DataTypes.STRING,
    shippingEmail: DataTypes.STRING,
    shippingPhone: DataTypes.STRING,
    cardNo: DataTypes.STRING,
    cardExpMonth: DataTypes.STRING,
    cardExpYear: DataTypes.STRING,
    cardCVV: DataTypes.STRING,
    clientID: DataTypes.INTEGER,
    products: DataTypes.JSON,
    customerOrderNotes: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'leads',
  });
  return leads;
};