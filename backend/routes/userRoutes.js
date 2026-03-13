const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

// 用户注册
router.post('/register', userController.register);

// 用户登录
router.post('/login', userController.login);

// 获取用户信息
router.get('/profile', auth, userController.getProfile);

// 获取所有用户（管理员）
router.get('/all', adminAuth, userController.getAllUsers);

// 更新用户状态
router.put('/status', adminAuth, userController.updateUserStatus);

module.exports = router;