# 快速部署指南 - PowerShell 脚本
# 请按照以下步骤操作

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  易润健医疗系统 - 快速部署指南" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$server = "47.94.191.58"
$username = "root"
$password = "MyS3rv3r!2026"

Write-Host "服务器信息:" -ForegroundColor Yellow
Write-Host "  IP: $server"
Write-Host "  用户: $username"
Write-Host ""

Write-Host "请选择部署方式:" -ForegroundColor Green
Write-Host "  1. 使用 PuTTY (推荐 Windows 用户)"
Write-Host "  2. 手动部署 (使用任何 SFTP 工具)"
Write-Host "  3. 使用 SSH 密钥 (需要先配置密钥)"
Write-Host ""

$choice = Read-Host "请输入选项 (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "===== 使用 PuTTY 部署 =====" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "步骤 1: 下载并安装 PuTTY" -ForegroundColor Yellow
        Write-Host "  访问: https://www.putty.org/"
        Write-Host "  下载并安装 PuTTY (包含 plink.exe 和 pscp.exe)"
        Write-Host ""
        Write-Host "步骤 2: 运行部署脚本" -ForegroundColor Yellow
        Write-Host "  cd d:\yiyaoyuanxing\backend"
        Write-Host "  .\deploy-plink.ps1"
        Write-Host ""
        Write-Host "注意: 确保 PuTTY 安装目录已添加到系统 PATH 环境变量中" -ForegroundColor Red
    }
    "2" {
        Write-Host ""
        Write-Host "===== 手动部署步骤 =====" -ForegroundColor Cyan
        Write-Host ""
        
        Write-Host "步骤 1: 上传后端文件" -ForegroundColor Yellow
        Write-Host "使用 FileZilla/WinSCP 等工具连接到服务器 ($server)"
        Write-Host "将 d:\yiyaoyuanxing\backend\ 目录下的所有文件上传到: /root/app/"
        Write-Host "(排除 node_modules 文件夹和 .log 文件)"
        Write-Host ""
        
        Write-Host "步骤 2: 上传前端文件" -ForegroundColor Yellow
        Write-Host "将 d:\yiyaoyuanxing\ 目录下的所有 .html 文件上传到: /var/www/frontend/"
        Write-Host ""
        
        Write-Host "步骤 3: 上传部署脚本" -ForegroundColor Yellow
        Write-Host "将 d:\yiyaoyuanxing\server-deploy.sh 上传到: /root/"
        Write-Host ""
        
        Write-Host "步骤 4: SSH 登录服务器并执行部署" -ForegroundColor Yellow
        Write-Host "在 PowerShell 中运行:"
        Write-Host "  ssh $username@$server"
        Write-Host ""
        Write-Host "登录后执行:"
        Write-Host "  cd /root"
        Write-Host "  chmod +x server-deploy.sh"
        Write-Host "  bash server-deploy.sh"
        Write-Host ""
    }
    "3" {
        Write-Host ""
        Write-Host "===== 使用 SSH 密钥部署 =====" -ForegroundColor Cyan
        Write-Host ""
        
        Write-Host "步骤 1: 生成 SSH 密钥" -ForegroundColor Yellow
        Write-Host "在 PowerShell 中运行:"
        Write-Host "  ssh-keygen -t rsa -b 4096"
        Write-Host "按回车使用默认设置"
        Write-Host ""
        
        Write-Host "步骤 2: 复制公钥到服务器" -ForegroundColor Yellow
        Write-Host "方法 A - 手动复制:"
        Write-Host "  1. 打开文件: C:\Users\$env:USERNAME\.ssh\id_rsa.pub"
        Write-Host "  2. 复制全部内容"
        Write-Host "  3. SSH 登录服务器: ssh $username@$server"
        Write-Host "  4. 编辑文件: nano ~/.ssh/authorized_keys"
        Write-Host "  5. 粘贴公钥内容，保存退出 (Ctrl+O, Enter, Ctrl+X)"
        Write-Host "  6. 设置权限: chmod 600 ~/.ssh/authorized_keys"
        Write-Host ""
        
        Write-Host "步骤 3: 配置完成后，可以无密码登录" -ForegroundColor Yellow
        Write-Host "然后使用 deploy-remote.sh 脚本进行部署"
        Write-Host ""
    }
    default {
        Write-Host "无效选项" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "===== 部署完成后访问 =====" -ForegroundColor Green
Write-Host "  首页: http://$server`:3001/index.html"
Write-Host "  登录页: http://$server`:3001/login.html"
Write-Host "  管理后台: http://$server`:3001/admin-login.html"
Write-Host ""
Write-Host "详细说明请查看: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
