# 部署脚本 - 使用OpenSSH

# 服务器信息
$server = "47.94.191.58"
$username = "root"
$password = "MyS3rv3r!2026"

# 本地路径
$localBackendPath = "d:\yiyaoyuanxing\backend"
$localFrontendPath = "d:\yiyaoyuanxing"

# 远程路径
$remoteAppPath = "/root/app"
$remoteFrontendPath = "/var/www/frontend"

# 创建临时部署脚本
$deployScript = @'
#!/bin/bash

echo "===== 开始部署 ====="

# 检查 Node.js 环境
echo "检查 Node.js 环境..."
if command -v node > /dev/null 2>&1; then
    echo "Node.js 已安装"
    node -v
    npm -v
else
    echo "Node.js 未安装，开始安装..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    echo "Node.js 安装完成"
    node -v
    npm -v
fi

# 安装 pm2
echo "检查 pm2..."
if ! command -v pm2 > /dev/null 2>&1; then
    echo "安装 pm2..."
    npm install pm2 -g
fi

# 创建应用目录
echo "创建应用目录..."
mkdir -p $remoteAppPath
mkdir -p $remoteFrontendPath

# 停止旧的服务器
echo "停止旧服务器..."
pm2 stop yirunjian-server 2>/dev/null || true
pm2 delete yirunjian-server 2>/dev/null || true

# 进入应用目录
cd $remoteAppPath

# 安装依赖
echo "安装依赖..."
npm install

# 复制前端文件到正确位置
echo "部署前端文件..."
cp -r /root/app/../*.html $remoteFrontendPath/ 2>/dev/null || true
cp -r /root/app/../*.css $remoteFrontendPath/ 2>/dev/null || true
cp -r /root/app/../*.js $remoteFrontendPath/ 2>/dev/null || true

# 设置前端文件权限
echo "设置文件权限..."
chown -R www-data:www-data $remoteFrontendPath 2>/dev/null || true
chmod -R 755 $remoteFrontendPath 2>/dev/null || true

# 启动服务器
echo "启动服务器..."
cd $remoteAppPath
pm2 start app.js --name yirunjian-server

# 保存 pm2 配置
echo "保存 pm2 配置..."
pm2 save
pm2 startup 2>/dev/null || true

# 查看状态
echo "===== 部署完成 ====="
pm2 status

echo "服务器运行在端口 3001"
'@

# 保存部署脚本
$deployScript | Out-File -FilePath "deploy-remote.sh" -Encoding ASCII

Write-Host "===== 开始部署到云服务器 =====" -ForegroundColor Green

# 使用 sshpass 或者直接 SSH (这里需要先配置 SSH 密钥)
Write-Host "上传文件到服务器..."

# 首先测试连接
Write-Host "测试服务器连接..."
try {
    # 我们需要使用 sshpass 或者交互式输入密码
    # 由于 Windows 上没有 sshpass，让我们使用 plink 或者其他方式
    Write-Host "注意：由于密码认证的限制，请使用以下步骤手动部署或配置 SSH 密钥" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "方法 1：配置 SSH 密钥（推荐）" -ForegroundColor Cyan
    Write-Host "  1. 生成 SSH 密钥：ssh-keygen"
    Write-Host "  2. 复制公钥到服务器：ssh-copy-id root@47.94.191.58"
    Write-Host "  3. 然后运行：ssh root@47.94.191.58 'bash -s' < deploy-remote.sh"
    Write-Host ""
    Write-Host "方法 2：使用 PuTTY 的 plink 和 pscp" -ForegroundColor Cyan
    Write-Host "  下载 PuTTY：https://www.putty.org/"
    Write-Host ""
    Write-Host "方法 3：手动部署" -ForegroundColor Cyan
    Write-Host "  1. 使用 FileZilla 或其他 SFTP 工具上传文件"
    Write-Host "  2. SSH 登录服务器：ssh root@47.94.191.58"
    Write-Host "  3. 运行部署命令"
    Write-Host ""
    
    # 让我们尝试使用 plink，如果有的话
    Write-Host "检查 plink..."
    $plinkPath = Get-Command plink -ErrorAction SilentlyContinue
    if ($plinkPath) {
        Write-Host "找到 plink，开始自动部署..." -ForegroundColor Green
        
        # 上传 backend 文件
        Write-Host "上传后端文件..."
        & pscp -pw $password -r "$localBackendPath\*" "$username@${server}:${remoteAppPath}/"
        
        # 上传前端文件
        Write-Host "上传前端文件..."
        $htmlFiles = Get-ChildItem $localFrontendPath -Filter "*.html"
        foreach ($file in $htmlFiles) {
            & pscp -pw $password $file.FullName "$username@${server}:${remoteFrontendPath}/"
        }
        
        # 上传部署脚本并执行
        Write-Host "执行部署命令..."
        & plink -pw $password "$username@${server}" "bash -s" < deploy-remote.sh
        
        Write-Host "===== 部署完成 =====" -ForegroundColor Green
    } else {
        Write-Host "未找到 plink，请使用上述方法之一进行部署" -ForegroundColor Red
        Write-Host ""
        Write-Host "部署脚本已保存到: deploy-remote.sh" -ForegroundColor Yellow
    }
} catch {
    Write-Host "部署过程中出错: $_" -ForegroundColor Red
}
