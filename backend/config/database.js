const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  'yirunjianpingtai',
  'ceshibushu_k1',
  'MyS3rv3r!2026',
  {
    host: 'rm-2zee36m35h918va76so.mysql.rds.aliyuncs.com',
    dialect: 'mysql',
    port: 3306,
    logging: false
  }
);

module.exports = sequelize;