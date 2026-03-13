# 部署脚本

# 服务器信息
$server = "47.94.191.58"
$username = "root"
$password = "MyS3rv3r!2026"

# 创建凭据
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($username, $securePassword)

# 创建远程会话
try {
    Write-Host "创建远程会话..."
    $session = New-PSSession -ComputerName $server -Credential $credential
    
    # 执行远程命令
    Write-Host "执行远程部署命令..."
    Invoke-Command -Session $session -ScriptBlock {
        # 检查 Node.js 环境
        Write-Host "检查 Node.js 环境..."
        if (Get-Command node -ErrorAction SilentlyContinue) {
            Write-Host "Node.js 已安装"
            node -v
            npm -v
        } else {
            Write-Host "Node.js 未安装，开始安装..."
            curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
            apt-get install -y nodejs
            Write-Host "Node.js 安装完成"
            node -v
            npm -v
        }
        
        # 创建应用目录
        Write-Host "创建应用目录..."
        mkdir -p /root/app
        
        # 进入应用目录
        cd /root/app
        
        # 安装依赖
        Write-Host "安装依赖..."
        npm install mysql2
        npm install pm2 -g
        
        # 创建服务器代码
        Write-Host "创建服务器代码..."
        cat > server.js << 'EOF'
const http = require('http');
const mysql = require('mysql2/promise');

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'rm-2zee36m35h918va76so.mysql.rds.aliyuncs.com',
  port: 3306,
  user: 'ceshibushu_k1',
  password: 'MyS3rv3r!2026',
  database: 'yirunjianpingtai',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 检查数据库连接
async function checkDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

// 初始化数据库表
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // 创建用户表
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        companyName VARCHAR(255),
        contactPerson VARCHAR(255),
        contactPhone VARCHAR(255),
        address VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database table initialized');
    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// 调用数据库初始化函数
checkDatabaseConnection();
initDatabase();

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
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        console.log('Login request received:', data);
        
        if (!data.username || !data.password) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 400;
          res.end(JSON.stringify({ error: '用户名和密码不能为空' }));
          return;
        }
        
        // 从数据库中查找用户
        const [rows] = await pool.query(
          'SELECT * FROM users WHERE username = ? AND password = ?',
          [data.username, data.password]
        );
        
        if (rows.length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ 
            token: 'test-token-' + Date.now(), 
            user: { 
              id: rows[0].id, 
              username: rows[0].username, 
              role: 'user' 
            } 
          }));
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 401;
          res.end(JSON.stringify({ error: '用户名或密码错误' }));
        }
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
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        console.log('Register request received:', data);
        
        if (!data.username || !data.password) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 400;
          res.end(JSON.stringify({ error: '用户名和密码不能为空' }));
          return;
        }
        
        // 检查用户名是否已存在
        const [existingUsers] = await pool.query(
          'SELECT * FROM users WHERE username = ?',
          [data.username]
        );
        
        if (existingUsers.length > 0) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 400;
          res.end(JSON.stringify({ error: '用户名已存在' }));
          return;
        }
        
        // 插入新用户
        await pool.query(
          'INSERT INTO users (username, password, companyName, contactPerson, contactPhone, address) VALUES (?, ?, ?, ?, ?, ?)',
          [data.username, data.password, data.companyName, data.contactPerson, data.contactPhone, data.address]
        );
        
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ message: '注册成功' }));
      } catch (error) {
        console.error('Register error:', error);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Server error', details: error.message }));
      }
    });
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
EOF
        
        # 启动服务器
        Write-Host "启动服务器..."
        pm2 start server.js --name yirunjian-server
        
        # 查看服务器状态
        Write-Host "查看服务器状态..."
        pm2 status
        
        # 设置 pm2 开机自启
        Write-Host "设置 pm2 开机自启..."
        pm2 startup
        pm2 save
        
        # 配置防火墙
        Write-Host "配置防火墙..."
        ufw allow 3001/tcp
        ufw reload
        
        # 测试 API 连接
        Write-Host "测试 API 连接..."
        curl -X POST http://localhost:3001/api/users/register \
          -H "Content-Type: application/json" \
          -d '{"username": "testuser", "password": "password123", "companyName": "测试公司", "contactPerson": "测试人员", "contactPhone": "13800138000", "address": "北京市"}'
        
        Write-Host "部署完成！"
    }
    
    # 关闭会话
    Remove-PSSession $session
} catch {
    Write-Host "部署失败: $($_.Exception.Message)"
}
