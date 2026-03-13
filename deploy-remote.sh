#!/bin/bash

# 云服务器部署脚本
# 使用方法: bash deploy-remote.sh

echo "===== 易润健医疗系统部署脚本 ====="
echo ""

# 配置变量
REMOTE_USER="root"
REMOTE_HOST="47.94.191.58"
REMOTE_APP_DIR="/root/app"
REMOTE_FRONTEND_DIR="/var/www/frontend"
LOCAL_BACKEND_DIR="$(dirname "$0")/backend"
LOCAL_FRONTEND_DIR="$(dirname "$0")"

echo "服务器: $REMOTE_USER@$REMOTE_HOST"
echo "本地后端目录: $LOCAL_BACKEND_DIR"
echo "本地前端目录: $LOCAL_FRONTEND_DIR"
echo ""

# 检查是否有 SSH 密钥
if [ ! -f ~/.ssh/id_rsa ]; then
    echo "未找到 SSH 密钥，正在生成..."
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
    echo "SSH 密钥已生成"
    echo ""
    echo "请手动复制公钥到服务器:"
    echo "ssh-copy-id $REMOTE_USER@$REMOTE_HOST"
    echo ""
    echo "或者手动添加以下公钥到服务器的 ~/.ssh/authorized_keys 文件:"
    cat ~/.ssh/id_rsa.pub
    echo ""
    exit 1
fi

# 上传文件
echo "===== 开始上传文件 ====="

# 创建远程目录
echo "创建远程目录..."
ssh $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_APP_DIR && mkdir -p $REMOTE_FRONTEND_DIR"

# 上传后端文件
echo "上传后端文件..."
cd "$LOCAL_BACKEND_DIR" && tar czf - --exclude='node_modules' --exclude='*.log' . | ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_APP_DIR && tar xzf -"

# 上传前端文件
echo "上传前端文件..."
cd "$LOCAL_FRONTEND_DIR" && tar czf - *.html *.css *.js 2>/dev/null | ssh $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_FRONTEND_DIR && tar xzf -"

# 远程执行部署命令
echo ""
echo "===== 在远程服务器上执行部署 ====="

ssh $REMOTE_USER@$REMOTE_HOST << 'EOF'
set -e

REMOTE_APP_DIR="/root/app"
REMOTE_FRONTEND_DIR="/var/www/frontend"

echo "===== 检查 Node.js ====="
if ! command -v node &> /dev/null; then
    echo "安装 Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

echo "Node.js 版本: $(node -v)"
echo "npm 版本: $(npm -v)"

echo ""
echo "===== 检查 pm2 ====="
if ! command -v pm2 &> /dev/null; then
    echo "安装 pm2..."
    npm install -g pm2
fi

echo ""
echo "===== 停止旧服务 ====="
pm2 stop yirunjian-server 2>/dev/null || true
pm2 delete yirunjian-server 2>/dev/null || true

echo ""
echo "===== 安装依赖 ====="
cd $REMOTE_APP_DIR
npm install --production

echo ""
echo "===== 设置前端文件 ====="
# 更新API地址为相对路径
cd $REMOTE_FRONTEND_DIR
sed -i 's|http://localhost:3001/api|/api|g' *.html 2>/dev/null || true
sed -i 's|http://47.94.191.58:3001/api|/api|g' *.html 2>/dev/null || true

# 设置权限
chown -R www-data:www-data $REMOTE_FRONTEND_DIR 2>/dev/null || true
chmod -R 755 $REMOTE_FRONTEND_DIR 2>/dev/null || true

echo ""
echo "===== 启动服务 ====="
cd $REMOTE_APP_DIR
pm2 start app.js --name yirunjian-server

# 保存 pm2 配置
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo ""
echo "===== 检查服务状态 ====="
pm2 status

echo ""
echo "===== 部署完成 ====="
echo "应用运行在: http://47.94.191.58:3001"
echo "管理后台: http://47.94.191.58:3001/admin-login.html"
EOF

echo ""
echo "===== 全部完成 ====="
