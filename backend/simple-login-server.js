const http = require('http');

const server = http.createServer((req, res) => {
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
  
  // 处理登录页面
  if (req.url === '/login-new' || req.url === '/login-new.html') {
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.end(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>易润健医疗订货系统 - 登录</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#1E40AF',
                        secondary: '#EC4899',
                    },
                }
            }
        }
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
        body {
            font-family: 'Noto Sans SC', sans-serif;
            background-color: #60A5FA;
        }
        .form-container {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        .transition-all-300 {
            transition: all 0.3s ease;
        }
        .logo {
            background: linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
    <div class="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl">
        <!-- 左侧图片 -->
        <div class="md:w-1/2 mb-8 md:mb-0">
            <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20equipment%20including%20blood%20glucose%20monitor%2C%20syringe%2C%20and%20medical%20forms%20on%20a%20pink%20background&image_size=landscape_16_9" alt="医疗设备" class="rounded-lg shadow-lg w-full max-w-md">
        </div>

        <!-- 右侧登录表单 -->
        <div class="md:w-1/3 bg-white rounded-xl shadow-lg p-8">
            <div class="flex items-center justify-center mb-8">
                <div class="flex items-center">
                    <div class="text-3xl font-bold logo">M</div>
                    <span class="text-gray-800 text-xl font-bold ml-2">易润健医疗订货系统</span>
                </div>
            </div>

            <form class="space-y-4" id="loginForm">
                <div>
                    <input type="text" id="username" placeholder="请输入用户名" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <p id="usernameError" class="text-red-500 text-xs mt-1 hidden">请输入用户名</p>
                </div>
                <div>
                    <input type="password" id="password" placeholder="请输入密码" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <p id="passwordError" class="text-red-500 text-xs mt-1 hidden">请输入密码</p>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="captcha" class="mr-2">
                    <label for="captcha" class="text-sm text-gray-600">点击校验进行验证</label>
                    <button type="button" class="ml-auto text-primary hover:text-primary/80 text-sm">
                        <i class="fa fa-refresh mr-1"></i>
                    </button>
                </div>
                <div class="flex items-center justify-between">
                    <a href="register.html" class="text-sm text-primary hover:text-primary/80">没有账号？去注册</a>
                    <a href="#" class="text-sm text-primary hover:text-primary/80">忘记密码？</a>
                </div>
                <button type="submit" id="loginButton" class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-all-300 flex items-center justify-center font-bold">      
                    <span id="loginText">登录</span>
                    <span id="loginLoading" class="hidden">
                        <i class="fa fa-spinner fa-spin mr-2"></i>登录中...
                    </span>
                    <i class="fa fa-arrow-right ml-2"></i>
                </button>
                <p id="loginError" class="text-red-500 text-sm text-center hidden"></p>
            </form>

            <div class="mt-6 text-center text-xs text-gray-500">
                登录即代表同意用户协议和隐私政策
            </div>
        </div>
    </div>

    <div class="fixed bottom-4 left-0 right-0 text-center text-xs text-gray-500">
        Copyright © 2026 易润健医疗 安全编码：199800000878 鲁ICP备2020000587号
    </div>

    <script>
        // 登录表单提交
        document.getElementById('loginForm').addEventListener('submit', async function(e) {       
            e.preventDefault();

            // 表单验证
            if (!validateForm()) {
                return;
            }

            // 显示加载状态
            showLoading();

            try {
                // 获取表单数据
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                // 模拟登录成功
                console.log('Login request received:', { username, password });
                
                // 存储token和用户信息
                localStorage.setItem('token', 'test-token-' + Date.now());
                localStorage.setItem('user', JSON.stringify({ id: 1, username: username, role: 'user' }));

                // 跳转到首页
                window.location.href = 'index.html';
            } catch (error) {
                console.error('登录错误:', error);
                showError('网络错误，请稍后重试');
            } finally {
                // 隐藏加载状态
                hideLoading();
            }
        });

        // 表单验证
        function validateForm() {
            let isValid = true;

            // 验证用户名
            const username = document.getElementById('username');
            const usernameError = document.getElementById('usernameError');
            if (!username.value.trim()) {
                usernameError.classList.remove('hidden');
                isValid = false;
            } else {
                usernameError.classList.add('hidden');
            }

            // 验证密码
            const password = document.getElementById('password');
            const passwordError = document.getElementById('passwordError');
            if (!password.value.trim()) {
                passwordError.classList.remove('hidden');
                isValid = false;
            } else {
                passwordError.classList.add('hidden');
            }

            // 验证验证码
            const captcha = document.getElementById('captcha');
            if (!captcha.checked) {
                alert('请点击校验进行验证');
                isValid = false;
            }

            return isValid;
        }

        // 显示加载状态
        function showLoading() {
            document.getElementById('loginText').classList.add('hidden');
            document.getElementById('loginLoading').classList.remove('hidden');
            document.getElementById('loginButton').disabled = true;
        }

        // 隐藏加载状态
        function hideLoading() {
            document.getElementById('loginText').classList.remove('hidden');
            document.getElementById('loginLoading').classList.add('hidden');
            document.getElementById('loginButton').disabled = false;
        }

        // 显示错误信息
        function showError(message) {
            const errorElement = document.getElementById('loginError');
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }

        // 验证码刷新
        document.querySelector('button[type="button"]').addEventListener('click', function() {    
            alert('验证码已刷新');
        });

        // 忘记密码链接
        document.querySelector('a[href="#"]').addEventListener('click', function(e) {
            e.preventDefault();
            alert('跳转到重置密码页面');
        });
    </script>
</body>
</html>`);
    return;
  }
  
  // 处理健康检查
  if (req.url === '/health') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'ok' }));
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