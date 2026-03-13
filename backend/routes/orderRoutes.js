const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

// 创建订单
router.post('/', auth, orderController.createOrder);

// 获取用户订单列表
router.get('/', auth, orderController.getUserOrders);

// 获取订单详情
router.get('/:id', auth, orderController.getOrderById);

// 获取所有订单（管理员）
router.get('/all', adminAuth, orderController.getAllOrders);

// 更新订单状态
router.put('/status', adminAuth, orderController.updateOrderStatus);

// 搜索订单
router.get('/search', auth, orderController.searchOrders);

module.exports = router;