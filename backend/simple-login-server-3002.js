const http = require('http');

// 登录页面HTML
const loginHtml = `<!DOCTYPE html>
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
                登录即代表同意<a href="#" class="text-primary hover:text-primary/80">用户协议</a>和<a href="#" class="text-primary hover:text-primary/80">隐私政策</a>
            </div>
        </div>
    </div>
    
    <div class="fixed bottom-4 left-0 right-0 text-center text-xs text-gray-500">
        Copyright © 2026 河北XXX科技 安全编号：199800000878 粤ICP备2020000587号
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
                
                // 璋冪敤鐧诲綍API
                const response = await fetch('http://47.94.191.58:3001/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // 登录成功，存储token
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // 跳转到首页
                    window.location.href = 'index.html';
                } else {
                    // 登录失败
                    showError(data.error || '登录失败，请检查用户名和密码');
                }
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
            alert('跳转到忘记密码页面');
        });
    </script>
</body>
</html>`;

// 注册页面HTML
const registerHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>注册 - 易润健医疗订货系统</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome -->
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <!-- 统一的Tailwind配置 -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#1E40AF',
                        secondary: '#3B82F6',
                        accent: '#60A5FA',
                        neutral: '#F3F4F6',
                        'neutral-dark': '#1F2937',
                        'success': '#10B981',
                        'warning': '#F59E0B',
                        'danger': '#EF4444',
                    },
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                    },
                },
            }
        }
    </script>
    <style type="text/tailwindcss">
        @layer utilities {
            .content-auto {
                content-visibility: auto;
            }
            .transition-all-300 {
                transition: all 300ms ease-in-out;
            }
        }
    </style>
</head>
<body class="bg-gray-100 font-sans min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md">
        <div class="bg-white rounded-lg shadow-lg p-8">
            <div class="flex flex-col items-center mb-8">
                <div class="w-16 h-16 bg-pink-300 rounded-full flex items-center justify-center mb-4">
                    <span class="text-white text-2xl font-bold">M</span>
                </div>
                <h1 class="text-2xl font-bold text-gray-800">易润健医疗订货系统</h1>
                <p class="text-gray-600 mt-2">新用户注册</p>
            </div>
            
            <form class="space-y-4" id="registerForm">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">*登录账号</label>
                    <input type="text" id="username" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="请输入登录账号">
                    <p id="usernameError" class="text-red-500 text-xs mt-1 hidden">请输入登录账号</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">*设置密码</label>
                    <input type="password" id="password" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="请设置密码">
                    <p id="passwordError" class="text-red-500 text-xs mt-1 hidden">请设置密码</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">*确认密码</label>
                    <input type="password" id="confirmPassword" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="请确认密码">
                    <p id="confirmPasswordError" class="text-red-500 text-xs mt-1 hidden">两次密码输入不一致</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">*营业执照单位名称</label>
                    <input type="text" id="companyName" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="请输入营业执照单位名称">
                    <p id="companyNameError" class="text-red-500 text-xs mt-1 hidden">请输入营业执照单位名称</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">*业务分公司</label>
                    <select id="branch" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="">请选择</option>
                        <option value="beijing">北京分公司</option>
                        <option value="shanghai">上海分公司</option>
                        <option value="guangzhou">广州分公司</option>
                        <option value="shenzhen">深圳分公司</option>
                    </select>
                    <p id="branchError" class="text-red-500 text-xs mt-1 hidden">请选择业务分公司</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">*联系人姓名</label>
                    <input type="text" id="contactPerson" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="请输入联系人姓名">
                    <p id="contactPersonError" class="text-red-500 text-xs mt-1 hidden">请输入联系人姓名</p>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">*联系人电话</label>
                    <input type="tel" id="contactPhone" class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="请输入联系人电话">
                    <p id="contactPhoneError" class="text-red-500 text-xs mt-1 hidden">请输入联系人电话</p>
                </div>
                
                <div class="flex items-start">
                    <input type="checkbox" id="agree" class="mt-1 mr-2">
                    <label for="agree" class="text-sm text-gray-600">阅读并同意平台的相关协议</label>
                    <p id="agreeError" class="text-red-500 text-xs mt-1 hidden">请阅读并同意平台的相关协议</p>
                </div>
                
                <button type="submit" id="registerButton" class="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors">
                    <span id="registerText">立即注册</span>
                    <span id="registerLoading" class="hidden">
                        <i class="fa fa-spinner fa-spin mr-2"></i>注册中...
                    </span>
                </button>
                
                <p id="registerError" class="text-red-500 text-sm text-center hidden"></p>
                
                <div class="text-center">
                    <a href="login.html" class="text-sm text-primary hover:underline">已有账户，登录</a>
                </div>
            </form>
        </div>
    </div>
    
    <script>
        // 注册表单提交
        document.getElementById('registerForm').addEventListener('submit', async function(e) {
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
                const companyName = document.getElementById('companyName').value;
                const contactPerson = document.getElementById('contactPerson').value;
                const contactPhone = document.getElementById('contactPhone').value;
                const address = document.getElementById('branch').value;
                
                // 调用注册API
                const response = await fetch('http://localhost:3002/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        username, 
                        password, 
                        companyName, 
                        contactPerson, 
                        contactPhone, 
                        address 
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // 注册成功
                    alert('注册成功！');
                    window.location.href = 'login.html';
                } else {
                    // 注册失败
                    showError(data.error || '注册失败，请稍后重试');
                }
            } catch (error) {
                console.error('注册错误:', error);
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
            
            // 验证确认密码
            const confirmPassword = document.getElementById('confirmPassword');
            const confirmPasswordError = document.getElementById('confirmPasswordError');
            if (confirmPassword.value !== password.value) {
                confirmPasswordError.classList.remove('hidden');
                isValid = false;
            } else {
                confirmPasswordError.classList.add('hidden');
            }
            
            // 验证公司名称
            const companyName = document.getElementById('companyName');
            const companyNameError = document.getElementById('companyNameError');
            if (!companyName.value.trim()) {
                companyNameError.classList.remove('hidden');
                isValid = false;
            } else {
                companyNameError.classList.add('hidden');
            }
            
            // 验证业务分公司
            const branch = document.getElementById('branch');
            const branchError = document.getElementById('branchError');
            if (!branch.value) {
                branchError.classList.remove('hidden');
                isValid = false;
            } else {
                branchError.classList.add('hidden');
            }
            
            // 验证联系人姓名
            const contactPerson = document.getElementById('contactPerson');
            const contactPersonError = document.getElementById('contactPersonError');
            if (!contactPerson.value.trim()) {
                contactPersonError.classList.remove('hidden');
                isValid = false;
            } else {
                contactPersonError.classList.add('hidden');
            }
            
            // 验证联系人电话
            const contactPhone = document.getElementById('contactPhone');
            const contactPhoneError = document.getElementById('contactPhoneError');
            if (!contactPhone.value.trim()) {
                contactPhoneError.classList.remove('hidden');
                isValid = false;
            } else {
                contactPhoneError.classList.add('hidden');
            }
            
            // 验证协议
            const agree = document.getElementById('agree');
            const agreeError = document.getElementById('agreeError');
            if (!agree.checked) {
                agreeError.classList.remove('hidden');
                isValid = false;
            } else {
                agreeError.classList.add('hidden');
            }
            
            return isValid;
        }
        
        // 显示加载状态
        function showLoading() {
            document.getElementById('registerText').classList.add('hidden');
            document.getElementById('registerLoading').classList.remove('hidden');
            document.getElementById('registerButton').disabled = true;
        }
        
        // 隐藏加载状态
        function hideLoading() {
            document.getElementById('registerText').classList.remove('hidden');
            document.getElementById('registerLoading').classList.add('hidden');
            document.getElementById('registerButton').disabled = false;
        }
        
        // 显示错误信息
        function showError(message) {
            const errorElement = document.getElementById('registerError');
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    </script>
</body>
</html>`;

// 首页HTML
const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>易润健医疗订货系统 - 首页</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '#1E40AF',
                        secondary: '#3B82F6',
                        accent: '#60A5FA',
                        neutral: '#F3F4F6',
                        'neutral-dark': '#1F2937',
                        'success': '#10B981',
                        'warning': '#F59E0B',
                        'danger': '#EF4444',
                    },
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                    },
                },
            }
        }
    </script>
    <style type="text/tailwindcss">
        @layer utilities {
            .content-auto {
                content-visibility: auto;
            }
            .transition-all-300 {
                transition: all 300ms ease-in-out;
            }
        }
    </style>
</head>
<body class="bg-gray-100 font-sans min-h-screen">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center">
                <div class="w-10 h-10 bg-pink-300 rounded-full flex items-center justify-center mr-3">
                    <span class="text-white text-xl font-bold">M</span>
                </div>
                <span class="text-xl font-bold text-gray-800">易润健医疗订货系统</span>
            </div>
            <div class="flex items-center space-x-4">
                <span id="userInfo" class="text-gray-600"></span>
                <button id="logoutButton" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                    退出登录
                </button>
            </div>
        </div>
    </nav>

    <!-- 主要内容 -->
    <div class="container mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-lg p-8">
            <h1 class="text-2xl font-bold text-gray-800 mb-6">欢迎使用易润健医疗订货系统</h1>
            <p class="text-gray-600 mb-8">这里是系统首页，您可以开始浏览和订购医疗产品。</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-blue-50 p-6 rounded-lg">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <i class="fa fa-shopping-cart text-primary text-xl"></i>
                        </div>
                        <h2 class="text-lg font-semibold text-gray-800">产品管理</h2>
                    </div>
                    <p class="text-gray-600">浏览和搜索医疗产品，查看详细信息。</p>
                </div>
                
                <div class="bg-green-50 p-6 rounded-lg">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                            <i class="fa fa-file-text-o text-success text-xl"></i>
                        </div>
                        <h2 class="text-lg font-semibold text-gray-800">订单管理</h2>
                    </div>
                    <p class="text-gray-600">查看和管理您的订单，跟踪订单状态。</p>
                </div>
                
                <div class="bg-yellow-50 p-6 rounded-lg">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                            <i class="fa fa-user-o text-warning text-xl"></i>
                        </div>
                        <h2 class="text-lg font-semibold text-gray-800">个人中心</h2>
                    </div>
                    <p class="text-gray-600">管理您的个人信息和账户设置。</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 页面加载时获取用户信息
        window.onload = function() {
            const user = localStorage.getItem('user');
            if (user) {
                const userData = JSON.parse(user);
                document.getElementById('userInfo').textContent = '欢迎，' + userData.username;
            } else {
                // 没有用户信息，跳转到登录页面
                window.location.href = 'login.html';
            }
        };

        // 退出登录
        document.getElementById('logoutButton').addEventListener('click', function() {
            // 清除本地存储
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // 跳转到登录页面
            window.location.href = 'login.html';
        });
    </script>
</body>
</html>`;

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
  if (req.url === '/' || req.url === '/login' || req.url === '/login.html') {
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.end(loginHtml);
    return;
  }
  
  // 处理首页
  if (req.url === '/index' || req.url === '/index.html') {
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.end(indexHtml);
    return;
  }
  
  // 处理注册页面
  if (req.url === '/register' || req.url === '/register.html') {
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.end(registerHtml);
    return;
  }
  
  // 处理健康检查
  if (req.url === '/health') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  
  // 处理注册API
  if (req.url === '/api/users/register' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ message: '注册成功' }));
    return;
  }
  
  // 处理登录API
  if (req.url === '/api/users/login' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ token: 'test-token-' + Date.now(), user: { id: 1, username: 'testuser', role: 'user' } }));
    return;
  }
  
  // 处理其他请求
  res.statusCode = 404;
  res.end('File not found');
});

// 启动服务器
const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});