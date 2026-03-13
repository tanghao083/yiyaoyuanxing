const express = require('express');
const bodyParser = require('body-parser');

// 创建 express 应用
const app = express();

// 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS 中间件
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 登录 API
app.post('/api/users/login', (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login request received:', req.body);
    
    if (!username || !password) {
      res.status(400).json({ error: '用户名和密码不能为空' });
      return;
    }
    
    res.status(200).json({ token: 'test-token-' + Date.now(), user: { id: 1, username, role: 'user' } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// 注册 API
app.post('/api/users/register', (req, res) => {
  res.status(200).json({ message: '注册成功' });
});

// 处理 404
app.use((req, res) => {
  res.status(404).send('File not found');
});

// 启动服务器
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 捕获未处理的异常
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

// 捕获未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
});
