const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 设置默认的 JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key';

const userController = {
  // 用户注册
  async register(req, res) {
    try {
      const { username, password, companyName, contactPerson, contactPhone, address } = req.body;
      
      // 检查用户名是否已存在
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      
      // 密码加密
      const hashedPassword = await bcrypt.hash(password, 8);
      
      // 创建用户
      const user = await User.create({
        username,
        password: hashedPassword,
        companyName,
        contactPerson,
        contactPhone,
        address
      });
      
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // 用户登录
  async login(req, res) {
    try {
      console.log('Login request received');
      const { username, password } = req.body;
      console.log('Username:', username);
      
      console.log('Looking for user...');
      // 查找用户
      const user = await User.findOne({ where: { username } });
      console.log('User found:', user);
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      console.log('Comparing password...');
      // 验证密码
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      console.log('Generating token...');
      // 生成JWT令牌
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      console.log('Sending response...');
      res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        error: 'Server error', 
        details: error.message, 
        stack: error.stack,
        code: error.code
      });
    }
  },
  
  // 获取用户信息
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // 获取所有用户（管理员）
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },
  
  // 更新用户状态
  async updateUserStatus(req, res) {
    try {
      const { id, status } = req.body;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      user.status = status;
      await user.save();
      res.json({ message: 'User status updated', user });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = userController;