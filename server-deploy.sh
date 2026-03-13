#!/bin/bash
# 在云服务器上运行的部署脚本

set -e

echo "========================================"
echo "  易润健医疗系统 - 服务器部署脚本"
echo "========================================"
echo ""

# 配置
APP_DIR="/root/app"
FRONTEND_DIR="/var/www/frontend"
BACKUP_DIR="/root/backup-$(date +%Y%m%d-%H%M%S)"

echo "工作目录: $APP_DIR"
echo "前端目录: $FRONTEND_DIR"
echo ""

# 1. 检查 Node.js
echo "[1/8] 检查 Node.js 环境..."
if ! command -v node &> /dev/null; then
    echo "  安装 Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi
echo "  ✓ Node.js: $(node -v)"
echo "  ✓ npm: $(npm -v)"
echo ""

# 2. 检查 pm2
echo "[2/8] 检查 pm2..."
if ! command -v pm2 &> /dev/null; then
    echo "  安装 pm2..."
    npm install -g pm2
fi
echo "  ✓ pm2 已就绪"
echo ""

# 3. 备份旧版本
echo "[3/8] 备份旧版本..."
if [ -d "$APP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    cp -r "$APP_DIR" "$BACKUP_DIR/app" 2>/dev/null || true
    echo "  ✓ 已备份到: $BACKUP_DIR"
else
    echo "  - 无旧版本，跳过备份"
fi
echo ""

# 4. 创建目录
echo "[4/8] 创建应用目录..."
mkdir -p "$APP_DIR"
mkdir -p "$FRONTEND_DIR"
echo "  ✓ 目录已创建"
echo ""

# 5. 安装依赖
echo "[5/8] 安装依赖包..."
cd "$APP_DIR"
if [ -f "package.json" ]; then
    npm install --production
    echo "  ✓ 依赖安装完成"
else
    echo "  ⚠  警告: 未找到 package.json"
fi
echo ""

# 6. 部署前端文件
echo "[6/8] 配置前端文件..."
cd "$FRONTEND_DIR"
if ls *.html 1>/dev/null 2>&1; then
    # 更新 API 地址
    sed -i 's|http://localhost:3001/api|/api|g' *.html 2>/dev/null || true
    sed -i 's|http://47.94.191.58:3001/api|/api|g' *.html 2>/dev/null || true
    # 设置权限
    chown -R www-data:www-data "$FRONTEND_DIR" 2>/dev/null || true
    chmod -R 755 "$FRONTEND_DIR" 2>/dev/null || true
    echo "  ✓ 前端文件已配置"
else
    echo "  - 未找到前端文件"
fi
echo ""

# 7. 启动服务
echo "[7/8] 启动应用服务..."
cd "$APP_DIR"

# 停止旧服务
pm2 stop yirunjian-server 2>/dev/null || true
pm2 delete yirunjian-server 2>/dev/null || true

# 确定启动文件
if [ -f "app.js" ]; then
    START_FILE="app.js"
elif [ -f "server.js" ]; then
    START_FILE="server.js"
else
    echo "  ✗ 错误: 未找到启动文件 (app.js 或 server.js)"
    exit 1
fi

# 启动新服务
pm2 start "$START_FILE" --name yirunjian-server
echo "  ✓ 服务已启动 ($START_FILE)"
echo ""

# 8. 保存配置
echo "[8/8] 保存 pm2 配置..."
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true
echo "  ✓ 配置已保存"
echo ""

echo "========================================"
echo "  部署完成！"
echo "========================================"
echo ""
echo "服务状态:"
pm2 status
echo ""
echo "访问地址:"
echo "  - 首页: http://47.94.191.58:3001/index.html"
echo "  - 登录: http://47.94.191.58:3001/login.html"
echo "  - 管理: http://47.94.191.58:3001/admin-login.html"
echo ""
echo "查看日志: pm2 logs yirunjian-server"
echo "重启服务: pm2 restart yirunjian-server"
