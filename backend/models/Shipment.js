const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shipment = sequelize.define('Shipment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  shipmentTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  shipper: {
    type: DataTypes.STRING,
    allowNull: false
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  logisticsCompany: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'shipped'
  }
}, {
  tableName: 'shipments',
  timestamps: false
});

module.exports = Shipment;