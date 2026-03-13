const http = require('http');

// 创建服务器
const server = http.createServer((req, res) => {
  console.log('Request received:', req.url, req.method);
  
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
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        console.log('Request body:', body);
        
        if (!body) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 400;
          res.end(JSON.stringify({ error: '请求体不能为空' }));
          return;
        }
        
        const data = JSON.parse(body);
        console.log('Parsed data:', data);
        
        if (!data.username || !data.password) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 400;
          res.end(JSON.stringify({ error: '用户名和密码不能为空' }));
          return;
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ token: 'test-token-' + Date.now(), user: { id: 1, username: data.username, role: 'user' } }));
        console.log('Response sent successfully');
      } catch (error) {
        console.error('Login error:', error);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Server error', details: error.message }));
      }
    });
    return;
  }
  
  // 处理注册API
  if (req.url === '/api/users/register' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ message: '注册成功' }));
    return;
  }
  
  // 处理其他请求
  res.statusCode = 404;
  res.end('File not found');
});

// 启动服务器
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 捕获未处理的异常
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  console.error('Stack trace:', error.stack);
});

// 捕获未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
});
