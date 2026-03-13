const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 数据库连接
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

// User 模型
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  companyName: DataTypes.STRING,
  contactPerson: DataTypes.STRING,
  contactPhone: DataTypes.STRING,
  address: DataTypes.STRING,
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  }
}, {
  tableName: 'users',
  timestamps: false
});

// JWT Secret
const JWT_SECRET = 'default_jwt_secret_key';

// 登录端点
app.post('/api/users/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // 查找用户
    console.log('Finding user:', username);
    const user = await User.findOne({ where: { username } });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // 验证密码
    console.log('Comparing password...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // 生成JWT令牌
    console.log('Generating token...');
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('Login successful');
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message,
      stack: error.stack 
    });
  }
});

// 注册端点
app.post('/api/users/register', async (req, res) => {
  try {
    console.log('Register request received:', req.body);
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
    
    console.log('User registered:', user.username);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 同步数据库并启动服务器
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

startServer();