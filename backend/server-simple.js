const http = require('http');

// 处理登录API
function handleLogin(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    try {
      body += chunk;
    } catch (error) {
      console.error('Error receiving data:', error);
    }
  });
  req.on('end', () => {
    try {
      if (!body) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.end(JSON.stringify({ error: '请求体不能为空' }));
        return;
      }
      const data = JSON.parse(body);
      console.log('Login request received:', data);
      
      if (!data.username || !data.password) {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 400;
        res.end(JSON.stringify({ error: '用户名和密码不能为空' }));
        return;
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(JSON.stringify({ token: 'test-token-' + Date.now(), user: { id: 1, username: data.username, role: 'user' } }));
    } catch (error) {
      console.error('Login error:', error);
      try {
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Server error', details: error.message }));
      } catch (e) {
        console.error('Error sending error response:', e);
      }
    }
  });
}

// 处理注册API
function handleRegister(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({ message: '注册成功' }));
}

// 创建服务器
const server = http.createServer((req, res) => {
  // 捕获所有未处理的异常
  try {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 处理 OPTIONS 请求
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }
    
    // 处理登录API
    if (req.url === '/api/users/login' && req.method === 'POST') {
      handleLogin(req, res);
      return;
    }
    
    // 处理注册API
    if (req.url === '/api/users/register' && req.method === 'POST') {
      handleRegister(req, res);
      return;
    }
    
    // 处理其他请求
    res.statusCode = 404;
    res.end('File not found');
  } catch (error) {
    console.error('Server error:', error);
    try {
      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Server error', details: error.message }));
    } catch (e) {
      console.error('Error sending error response:', e);
    }
  }
});

// 启动服务器
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
