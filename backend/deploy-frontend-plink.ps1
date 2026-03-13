# 部署前端应用脚本

# 服务器信息
$server = "47.94.191.58"
$username = "root"
$password = "MyS3rv3r!2026"

# 部署命令
$deployCommand = @'
#!/bin/bash

# 开始部署前端应用
echo "开始部署前端应用..."

# 创建前端目录
echo "创建前端目录..."
mkdir -p /root/app/frontend

# 进入前端目录
cd /root/app/frontend

# 复制前端文件
echo "复制前端文件..."
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>医疗用品采购平台</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .nav {
            background-color: #333;
            color: white;
            padding: 10px 0;
            margin-bottom: 20px;
        }
        .nav ul {
            list-style: none;
            padding: 0;
            margin: 0;
            text-align: center;
        }
        .nav li {
            display: inline-block;
            margin: 0 10px;
        }
        .nav a {
            color: white;
            text-decoration: none;
            padding: 5px 10px;
        }
        .nav a:hover {
            background-color: #555;
            border-radius: 3px;
        }
        .section {
            background-color: white;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 5px;
        }
        .btn:hover {
            background-color: #45a049;
        }
        .btn-secondary {
            background-color: #2196F3;
        }
        .btn-secondary:hover {
            background-color: #0b7dda;
        }
    </style>
</head>
<body>
    <div class="nav">
        <ul>
            <li><a href="index.html">首页</a></li>
            <li><a href="login.html">登录</a></li>
            <li><a href="register.html">注册</a></li>
            <li><a href="order.html">订单</a></li>
            <li><a href="admin-login.html">后台管理</a></li>
        </ul>
    </div>
    
    <div class="container">
        <h1>医疗用品采购平台</h1>
        
        <div class="section">
            <h2>平台介绍</h2>
            <p>本平台为医疗机构提供医疗用品采购服务，支持在线下单、订单管理、供应商管理等功能。</p>
            <a href="login.html" class="btn">立即登录</a>
            <a href="register.html" class="btn btn-secondary">注册账号</a>
        </div>
        
        <div class="section">
            <h2>主要功能</h2>
            <ul>
                <li>用户注册与登录</li>
                <li>产品浏览与搜索</li>
                <li>在线下单</li>
                <li>订单管理</li>
                <li>供应商管理</li>
                <li>库存管理</li>
            </ul>
        </div>
        
        <div class="section">
            <h2>联系方式</h2>
            <p>客服电话：400-123-4567</p>
            <p>邮箱：service@medical-platform.com</p>
        </div>
    </div>
</body>
</html>
EOF

cat > login.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户登录</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 400px;
            margin: 100px auto;
            padding: 20px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #666;
        }
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .btn {
            width: 100%;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        }
        .btn:hover {
            background-color: #45a049;
        }
        .message {
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
        }
        .error {
            background-color: #ffebee;
            color: #c62828;
        }
        .success {
            background-color: #e8f5e8;
            color: #2e7d32;
        }
        .link {
            text-align: center;
            margin-top: 15px;
        }
        .link a {
            color: #2196F3;
            text-decoration: none;
        }
        .link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>用户登录</h1>
        <form id="loginForm">
            <div class="form-group">
                <label for="username">用户名</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">密码</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn">登录</button>
            <div class="link">
                <a href="register.html">还没有账号？立即注册</a>
            </div>
        </form>
        <div id="message" class="message" style="display: none;"></div>
    </div>
    
    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const message = document.getElementById('message');
            
            // 发送登录请求
            fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    message.className = 'message error';
                    message.textContent = data.error;
                    message.style.display = 'block';
                } else {
                    message.className = 'message success';
                    message.textContent = '登录成功！';
                    message.style.display = 'block';
                    // 跳转到首页
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }
            })
            .catch(error => {
                message.className = 'message error';
                message.textContent = '服务器错误，请稍后重试';
                message.style.display = 'block';
                console.error('Error:', error);
            });
        });
    </script>
</body>
</html>
EOF

cat > register.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户注册</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #666;
        }
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .btn {
            width: 100%;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        }
        .btn:hover {
            background-color: #45a049;
        }
        .message {
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
        }
        .error {
            background-color: #ffebee;
            color: #c62828;
        }
        .success {
            background-color: #e8f5e8;
            color: #2e7d32;
        }
        .link {
            text-align: center;
            margin-top: 15px;
        }
        .link a {
            color: #2196F3;
            text-decoration: none;
        }
        .link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>用户注册</h1>
        <form id="registerForm">
            <div class="form-group">
                <label for="username">用户名</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">密码</label>
                <input type="password" id="password" name="password" required>
            </div>
            <div class="form-group">
                <label for="companyName">公司名称</label>
                <input type="text" id="companyName" name="companyName">
            </div>
            <div class="form-group">
                <label for="contactPerson">联系人</label>
                <input type="text" id="contactPerson" name="contactPerson">
            </div>
            <div class="form-group">
                <label for="contactPhone">联系电话</label>
                <input type="text" id="contactPhone" name="contactPhone">
            </div>
            <div class="form-group">
                <label for="address">地址</label>
                <input type="text" id="address" name="address">
            </div>
            <button type="submit" class="btn">注册</button>
            <div class="link">
                <a href="login.html">已有账号？立即登录</a>
            </div>
        </form>
        <div id="message" class="message" style="display: none;"></div>
    </div>
    
    <script>
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                companyName: document.getElementById('companyName').value,
                contactPerson: document.getElementById('contactPerson').value,
                contactPhone: document.getElementById('contactPhone').value,
                address: document.getElementById('address').value
            };
            
            const message = document.getElementById('message');
            
            // 发送注册请求
            fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    message.className = 'message error';
                    message.textContent = data.error;
                    message.style.display = 'block';
                } else {
                    message.className = 'message success';
                    message.textContent = '注册成功！';
                    message.style.display = 'block';
                    // 跳转到登录页
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1000);
                }
            })
            .catch(error => {
                message.className = 'message error';
                message.textContent = '服务器错误，请稍后重试';
                message.style.display = 'block';
                console.error('Error:', error);
            });
        });
    </script>
</body>
</html>
EOF

cat > admin-login.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>后台管理登录</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 400px;
            margin: 100px auto;
            padding: 20px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #666;
        }
        input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .btn {
            width: 100%;
            padding: 10px;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
        }
        .btn:hover {
            background-color: #0b7dda;
        }
        .message {
            margin-top: 15px;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
        }
        .error {
            background-color: #ffebee;
            color: #c62828;
        }
        .success {
            background-color: #e8f5e8;
            color: #2e7d32;
        }
        .link {
            text-align: center;
            margin-top: 15px;
        }
        .link a {
            color: #2196F3;
            text-decoration: none;
        }
        .link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>后台管理登录</h1>
        <form id="loginForm">
            <div class="form-group">
                <label for="username">用户名</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">密码</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn">登录</button>
            <div class="link">
                <a href="index.html">返回前台</a>
            </div>
        </form>
        <div id="message" class="message" style="display: none;"></div>
    </div>
    
    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const message = document.getElementById('message');
            
            // 发送登录请求
            fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    message.className = 'message error';
                    message.textContent = data.error;
                    message.style.display = 'block';
                } else {
                    message.className = 'message success';
                    message.textContent = '登录成功！';
                    message.style.display = 'block';
                    // 跳转到后台首页
                    setTimeout(() => {
                        window.location.href = 'admin-index.html';
                    }, 1000);
                }
            })
            .catch(error => {
                message.className = 'message error';
                message.textContent = '服务器错误，请稍后重试';
                message.style.display = 'block';
                console.error('Error:', error);
            });
        });
    </script>
</body>
</html>
EOF

cat > admin-index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>后台管理系统</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .header {
            background-color: #333;
            color: white;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
        }
        .header .user {
            font-size: 14px;
        }
        .sidebar {
            width: 200px;
            background-color: #2c3e50;
            color: white;
            height: calc(100vh - 50px);
            float: left;
        }
        .sidebar ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .sidebar li {
            padding: 15px;
            border-bottom: 1px solid #34495e;
        }
        .sidebar li:hover {
            background-color: #34495e;
        }
        .sidebar a {
            color: white;
            text-decoration: none;
            display: block;
        }
        .content {
            margin-left: 200px;
            padding: 20px;
            min-height: calc(100vh - 50px);
            background-color: white;
        }
        .dashboard {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .card h3 {
            margin-top: 0;
            color: #333;
        }
        .card .value {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>医疗用品采购平台 - 后台管理</h1>
        <div class="user">
            <span>管理员</span>
            <a href="login.html" style="color: white; margin-left: 10px; text-decoration: none;">退出</a>
        </div>
    </div>
    
    <div class="sidebar">
        <ul>
            <li><a href="admin-index.html">控制台</a></li>
            <li><a href="admin-products.html">产品管理</a></li>
            <li><a href="admin-orders.html">订单管理</a></li>
            <li><a href="admin-users.html">用户管理</a></li>
            <li><a href="admin-supplier.html">供应商管理</a></li>
            <li><a href="admin-inventory.html">库存管理</a></li>
            <li><a href="admin-finance.html">财务管理</a></li>
            <li><a href="admin-settings.html">系统设置</a></li>
        </ul>
    </div>
    
    <div class="content">
        <h2>控制台</h2>
        
        <div class="dashboard">
            <div class="card">
                <h3>总用户数</h3>
                <div class="value">128</div>
            </div>
            <div class="card">
                <h3>总订单数</h3>
                <div class="value">56</div>
            </div>
            <div class="card">
                <h3>总销售额</h3>
                <div class="value">¥125,800</div>
            </div>
        </div>
        
        <div class="card">
            <h3>最近订单</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px;">订单号</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">用户</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">金额</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">状态</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">时间</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">ORD-20260312-001</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">张三</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">¥1,280</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">已完成</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">2026-03-12 10:30</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">ORD-20260312-002</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">李四</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">¥2,560</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">处理中</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">2026-03-12 09:15</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
EOF

# 安装 Nginx 作为前端服务器
echo "安装 Nginx..."
apt-get update
apt-get install -y nginx

# 配置 Nginx
echo "配置 Nginx..."
cat > /etc/nginx/sites-available/medical-platform << 'EOF'
server {
    listen 80;
    server_name _;
    
    root /root/app/frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 启用 Nginx 配置
ln -s /etc/nginx/sites-available/medical-platform /etc/nginx/sites-enabled/

# 重启 Nginx
echo "重启 Nginx..."
systemctl restart nginx

# 配置防火墙
echo "配置防火墙..."
ufw allow 80/tcp
ufw reload

echo "前端部署完成！"
'@

# 保存部署命令到文件
$deployCommand | Out-File -FilePath "deploy-frontend.sh" -Encoding ASCII

# 使用 plink 执行部署命令
echo "执行前端部署命令..."
& plink -ssh $username@$server -pw $password -m "deploy-frontend.sh"

# 清理临时文件
Remove-Item "deploy-frontend.sh"
