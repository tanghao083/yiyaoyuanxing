const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
  // 解析请求 URL
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
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
  
  // 处理登录请求
  if (pathname === '/api/users/login' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Login request received:', data);
        
        // 简单返回成功响应
        const response = {
          token: 'test-token-' + Date.now(),
          user: {
            id: 1,
            username: data.username,
            role: 'user'
          }
        };
        
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify(response));
      } catch (error) {
        console.error('Login error:', error);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Server error', details: error.message }));
      }
    });
    return;
  }
  
  // 处理健康检查
  if (pathname === '/health' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  
  // 处理静态文件
  const filePath = path.join(__dirname, '..', pathname);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end('File not found');
    } else {
      // 设置内容类型
      if (filePath.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html');
      } else if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'text/javascript');
      } else if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
      res.statusCode = 200;
      res.end(data);
    }
  });
});

// 启动服务器
const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});