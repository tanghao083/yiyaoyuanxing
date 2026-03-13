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
  
  // 处理登录页面
  if (pathname === '/login-new' || pathname === '/login-new.html') {
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.end(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>鏄撴鼎鍋ュ尰鐤楄璐х郴缁?- 鐧诲綍</title>
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
        <!-- 宸︿晶鍥剧墖 -->
        <div class="md:w-1/2 mb-8 md:mb-0">
            <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=medical%20equipment%20including%20blood%20glucose%20monitor%2C%20syringe%2C%20and%20medical%20forms%20on%20a%20pink%20background&image_size=landscape_16_9" alt="鍖荤枟璁惧" class="rounded-lg shadow-lg w-full max-w-md">
        </div>

        <!-- 鍙充晶鐧诲綍琛ㄥ崟 -->
        <div class="md:w-1/3 bg-white rounded-xl shadow-lg p-8">
            <div class="flex items-center justify-center mb-8">
                <div class="flex items-center">
                    <div class="text-3xl font-bold logo">M</div>
                    <span class="text-gray-800 text-xl font-bold ml-2">鏄撴鼎鍋ュ尰鐤楄璐х郴缁?/span>
                </div>
            </div>

            <form class="space-y-4" id="loginForm">
                <div>
                    <input type="text" id="username" placeholder="璇疯緭鍏ョ敤鎴峰悕" class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <p id="usernameError" class="text-red-500 text-xs mt-1 hidden">璇疯緭鍏ョ敤鎴 峰悕</p>
                </div>
                <div>
                    <input type="password" id="password" placeholder="璇疯緭鍏ュ瘑鐮? class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <p id="passwordError" class="text-red-500 text-xs mt-1 hidden">璇疯緭鍏ュ瘑鐮?/p>
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="captcha" class="mr-2">
                    <label for="captcha" class="text-sm text-gray-600">鐐瑰嚮鏍￠獙杩涜楠岃瘉</label>
                    <button type="button" class="ml-auto text-primary hover:text-primary/80 text-sm">
                        <i class="fa fa-refresh mr-1"></i>
                    </button>
                </div>
                <div class="flex items-center justify-between">
                    <a href="register.html" class="text-sm text-primary hover:text-primary/80">娌℃湁璐﹀彿锛熷幓娉ㄥ唽</a>
                    <a href="#" class="text-sm text-primary hover:text-primary/80">蹇樿瀵嗙爜锛?/a>
                </div>
                <button type="submit" id="loginButton" class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-all-300 flex items-center justify-center font-bold">      
                    <span id="loginText">鐧诲綍</span>
                    <span id="loginLoading" class="hidden">
                        <i class="fa fa-spinner fa-spin mr-2"></i>鐧诲綍涓?..
                    </span>
                    <i class="fa fa-arrow-right ml-2"></i>
                </button>
                <p id="loginError" class="text-red-500 text-sm text-center hidden"></p>
            </form>

            <div class="mt-6 text-center text-xs text-gray-500">
                鐧诲綍鍗充唬琛ㄥ悓鎰?a href="#" class="text-primary hover:text-primary/80">鐢ㄦ埛 鍗忚</a>鍜?a href="#" class="text-primary hover:text-primary/80">闅愮鏀跨瓥</a>
            </div>
        </div>
    </div>

    <div class="fixed bottom-4 left-0 right-0 text-center text-xs text-gray-500">
        Copyright 漏 2026 娌冲寳XXX绉戞妧 瀹夊叏缂栧彿锛?99800000878 绮CP澶?020000587鍙?
    </div>

    <script>
        // 鐧诲綍琛ㄥ崟鎻愪氦
        document.getElementById('loginForm').addEventListener('submit', async function(e) {       
            e.preventDefault();

            // 琛ㄥ崟楠岃瘉
            if (!validateForm()) {
                return;
            }

            // 鏄剧ず鍔犺浇鐘舵€?
            showLoading();

            try {
                // 鑾峰彇琛ㄥ崟鏁版嵁
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
                console.error('鐧诲綍閿欒:', error);
                showError('缃戠粶閿欒锛岃绋嶅悗閲嶈瘯');
            } finally {
                // 闅愯棌鍔犺浇鐘舵€?
                hideLoading();
            }
        });

        // 琛ㄥ崟楠岃瘉
        function validateForm() {
            let isValid = true;

            // 楠岃瘉鐢ㄦ埛鍚?
            const username = document.getElementById('username');
            const usernameError = document.getElementById('usernameError');
            if (!username.value.trim()) {
                usernameError.classList.remove('hidden');
                isValid = false;
            } else {
                usernameError.classList.add('hidden');
            }

            // 楠岃瘉瀵嗙爜
            const password = document.getElementById('password');
            const passwordError = document.getElementById('passwordError');
            if (!password.value.trim()) {
                passwordError.classList.remove('hidden');
                isValid = false;
            } else {
                passwordError.classList.add('hidden');
            }

            // 楠岃瘉楠岃瘉鐮?
            const captcha = document.getElementById('captcha');
            if (!captcha.checked) {
                alert('璇风偣鍑绘牎楠岃繘琛岄獙璇?);
                isValid = false;
            }

            return isValid;
        }

        // 鏄剧ず鍔犺浇鐘舵€?
        function showLoading() {
            document.getElementById('loginText').classList.add('hidden');
            document.getElementById('loginLoading').classList.remove('hidden');
            document.getElementById('loginButton').disabled = true;
        }

        // 闅愯棌鍔犺浇鐘舵€?
        function hideLoading() {
            document.getElementById('loginText').classList.remove('hidden');
            document.getElementById('loginLoading').classList.add('hidden');
            document.getElementById('loginButton').disabled = false;
        }

        // 鏄剧ず閿欒淇℃伅
        function showError(message) {
            const errorElement = document.getElementById('loginError');
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }

        // 楠岃瘉鐮佸埛鏂?
        document.querySelector('button[type="button"]').addEventListener('click', function() {    
            alert('楠岃瘉鐮佸凡鍒锋柊');
        });

        // 蹇樿瀵嗙爜閾炬帴
        document.querySelector('a[href="#"]').addEventListener('click', function(e) {
            e.preventDefault();
            alert('璺宠浆鍒板繕璁板瘑鐮侀〉闈?);
        });
    </script>
</body>
</html>`);
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
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});