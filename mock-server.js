// 模拟服务器，用于测试前端功能
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// 模拟数据
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    companyName: '河北xxx医疗器械有限公司',
    contactPerson: '孟大卫',
    contactPhone: '13800138000',
    address: '北京市朝阳区',
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    companyName: '北京医疗器械公司',
    contactPerson: '张三',
    contactPhone: '13900139000',
    address: '北京市海淀区',
    role: 'user'
  }
];

const mockOrders = [
  {
    id: 1,
    orderNumber: 'PMXDM00081456',
    userId: 1,
    totalAmount: 21532.00,
    paidAmount: 21532.00,
    shippedAmount: 20412.00,
    status: 'completed',
    orderTime: '2026-02-16T10:20:00',
    contactPerson: '孟大卫',
    contactPhone: '13800138000',
    address: '北京市朝阳区'
  },
  {
    id: 2,
    orderNumber: 'PMXDM00081457',
    userId: 1,
    totalAmount: 5000.00,
    paidAmount: 5000.00,
    shippedAmount: 5000.00,
    status: 'completed',
    orderTime: '2026-02-15T14:30:00',
    contactPerson: '孟大卫',
    contactPhone: '13800138000',
    address: '北京市朝阳区'
  }
];

const mockProducts = [
  {
    id: 1,
    code: 'PROD001',
    name: '商品名称1',
    spec: '规格1',
    manufacturer: '生产厂家1',
    packaging: '1',
    stock: 100,
    purchasePrice: 100.00,
    status: true
  },
  {
    id: 2,
    code: 'PROD002',
    name: '商品名称2',
    spec: '规格2',
    manufacturer: '生产厂家2',
    packaging: '1',
    stock: 50,
    purchasePrice: 200.00,
    status: true
  }
];

// 生成JWT令牌（模拟）
function generateToken(user) {
  return `mock-token-${user.id}-${Date.now()}`;
}

// 处理API请求
function handleApiRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 处理OPTIONS请求
  if (method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }
  
  // 登录请求
  if (pathname === '/api/users/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body);
        const user = mockUsers.find(u => u.username === username && u.password === password);
        if (user) {
          const token = generateToken(user);
          res.statusCode = 200;
          res.end(JSON.stringify({
            token,
            user: {
              id: user.id,
              username: user.username,
              role: user.role,
              companyName: user.companyName
            }
          }));
        } else {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid credentials' }));
        }
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Server error' }));
      }
    });
    return;
  }
  
  // 注册请求
  if (pathname === '/api/users/register' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const userData = JSON.parse(body);
        const newUser = {
          id: mockUsers.length + 1,
          ...userData,
          role: 'user'
        };
        mockUsers.push(newUser);
        res.statusCode = 201;
        res.end(JSON.stringify({ message: 'User registered successfully', user: newUser }));
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Server error' }));
      }
    });
    return;
  }
  
  // 获取订单列表
  if (pathname === '/api/orders' && method === 'GET') {
    // 模拟验证token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(mockOrders));
    return;
  }
  
  // 获取商品列表
  if (pathname === '/api/products' && method === 'GET') {
    // 模拟验证token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(mockProducts));
    return;
  }
  
  // 获取所有用户（管理员）
  if (pathname === '/api/users/all' && method === 'GET') {
    // 模拟验证token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify(mockUsers));
    return;
  }
  
  // 健康检查
  if (pathname === '/health' && method === 'GET') {
    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  
  // 未找到路由
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
}

// 处理静态文件请求
function handleStaticRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  
  // 默认文件
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  const filePath = path.join(__dirname, pathname);
  const extname = path.extname(filePath);
  
  // 支持的文件类型
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };
  
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

// 创建服务器
const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  
  // 处理API请求
  if (pathname.startsWith('/api/')) {
    handleApiRequest(req, res);
  } else {
    // 处理静态文件请求
    handleStaticRequest(req, res);
  }
});

// 启动服务器
const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('测试账号:');
  console.log('  管理员: admin / admin123');
  console.log('  普通用户: user / user123');
});
