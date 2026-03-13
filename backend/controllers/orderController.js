const { Order, OrderItem, Product } = require('../models');
const { Op } = require('sequelize');

const orderController = {
  // 创建订单
  async createOrder(req, res) {
    try {
      const { items, contactPerson, contactPhone, address } = req.body;
      const userId = req.user.id;
      
      // 计算订单总金额
      let totalAmount = 0;
      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        if (!product) {
          return res.status(404).json({ error: `Product ${item.productId} not found` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ error: `Insufficient stock for product ${product.name}` });
        }
        totalAmount += product.purchasePrice * item.quantity;
      }
      
      // 生成订单号
      const orderNumber = `ORD${Date.now()}`;
      
      // 创建订单
      const order = await Order.create({
        orderNumber,
        userId,
        totalAmount,
        contactPerson,
        contactPhone,
        address
      });
      
      // 创建订单商品
      for (const item of items) {
        const product = await Product.findByPk(item.productId);
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product.purchasePrice
        });
        
        // 减少库存
        product.stock -= item.quantity;
        await product.save();
      }
      
      res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // 获取用户订单列表
  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await Order.findAll({ where: { userId } });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // 获取订单详情
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        include: [{ model: OrderItem, include: [{ model: Product }] }]
      });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // 获取所有订单（管理员）
  async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll({
        include: [{ model: OrderItem, include: [{ model: Product }] }]
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // 更新订单状态
  async updateOrderStatus(req, res) {
    try {
      const { id, status } = req.body;
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      order.status = status;
      await order.save();
      res.json({ message: 'Order status updated', order });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // 搜索订单
  async searchOrders(req, res) {
    try {
      const { orderNumber, status, startDate, endDate } = req.query;
      const where = {};
      
      if (orderNumber) {
        where.orderNumber = { [Op.like]: `%${orderNumber}%` };
      }
      if (status) {
        where.status = status;
      }
      if (startDate) {
        where.orderTime = { [Op.gte]: new Date(startDate) };
      }
      if (endDate) {
        where.orderTime = { ...where.orderTime, [Op.lte]: new Date(endDate) };
      }
      
      const orders = await Order.findAll({ where });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = orderController;