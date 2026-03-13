const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Qualification = sequelize.define('Qualification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  certificateNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'valid'
  }
}, {
  tableName: 'qualifications',
  timestamps: false
});

module.exports = Qualification;