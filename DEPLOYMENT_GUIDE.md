# 云服务器部署指南

## 服务器信息
- IP: 47.94.191.58
- 用户: root
- 密码: MyS3rv3r!2026

## 方法一：使用 PuTTY 工具（推荐 Windows 用户）

### 1. 下载 PuTTY
访问 https://www.putty.org/ 下载并安装 PuTTY，确保安装了 `plink` 和 `pscp` 工具。

### 2. 运行部署脚本
项目中已包含使用 plink 的部署脚本：
```powershell
cd d:\yiyaoyuanxing\backend
.\deploy-plink.ps1
```

## 方法二：使用 SSH 密钥（推荐）

### 1. 生成 SSH 密钥
在 PowerShell 中运行：
```powershell
ssh-keygen -t rsa -b 4096
```
按回车使用默认设置。

### 2. 复制公钥到服务器
```powershell
# 方法 A: 使用 ssh-copy-id (如果可用)
ssh-copy-id root@47.94.191.58

# 方法 B: 手动复制
# 1. 打开 C:\Users\你的用户名\.ssh\id_rsa.pub
# 2. SSH 登录服务器: ssh root@47.94.191.58
# 3. 编辑 ~/.ssh/authorized_keys，粘贴公钥内容
```

### 3. 运行部署（在 WSL 或 Git Bash 中）
```bash
cd /d/yiyaoyuanxing
bash deploy-remote.sh
```

## 方法三：手动部署

### 1. 使用 SFTP 工具上传文件
使用 FileZilla、WinSCP 等工具上传：
- 后端文件 → `/root/app/`
- 前端 HTML 文件 → `/var/www/frontend/`

### 2. SSH 登录服务器
```powershell
ssh root@47.94.191.58
```

### 3. 在服务器上执行部署命令
```bash
cd /root/app

# 安装依赖
npm install --production

# 安装 pm2
npm install -g pm2

# 停止旧服务
pm2 stop yirunjian-server
pm2 delete yirunjian-server

# 启动新服务
pm2 start app.js --name yirunjian-server

# 保存配置
pm2 save
pm2 startup

# 查看状态
pm2 status
```

## 访问应用

部署完成后，访问：
- 首页: http://47.94.191.58:3001/index.html
- 登录页: http://47.94.191.58:3001/login.html
- 管理后台: http://47.94.191.58:3001/admin-login.html

## 数据库配置

应用已配置连接阿里云 RDS MySQL：
- 主机: rm-2zee36m35h918va76so.mysql.rds.aliyuncs.com
- 端口: 3306
- 数据库: yirunjianpingtai
- 用户: ceshibushu_k1
