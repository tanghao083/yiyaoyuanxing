const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Qualification = require('./Qualification');
const Shipment = require('./Shipment');

// 建立关联关系
Order.belongsTo(User, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
Order.hasMany(Shipment, { foreignKey: 'orderId' });

OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

Product.belongsTo(Qualification, { foreignKey: 'qualificationId' });

Shipment.belongsTo(Order, { foreignKey: 'orderId' });
Shipment.belongsTo(Product, { foreignKey: 'productId' });

module.exports = {
  User,
  Product,
  Order,
  OrderItem,
  Qualification,
  Shipment
};