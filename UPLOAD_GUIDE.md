# 上传文件详细指南

## 需要上传的文件和服务器路径

### 1. 后端文件
**本地路径**: `d:\yiyaoyuanxing\backend\`
**服务器路径**: `/root/app/`

**需要上传的文件包括**:
- `app.js` (主应用文件)
- `package.json` (依赖配置)
- `package-lock.json` (依赖锁定文件)
- `config/` 文件夹 (数据库配置)
- `controllers/` 文件夹 (控制器)
- `models/` 文件夹 (数据模型)
- `routes/` 文件夹 (路由)
- `middleware/` 文件夹 (中间件)
- `.env` 文件 (环境配置)

**排除的文件**:
- `node_modules/` 文件夹 (会在服务器上重新安装)
- `*.log` 文件 (日志文件)

### 2. 前端文件
**本地路径**: `d:\yiyaoyuanxing\`
**服务器路径**: `/var/www/frontend/`

**需要上传的文件包括**:
- `index.html` (首页)
- `login.html` (登录页)
- `register.html` (注册页)
- `admin-login.html` (管理后台登录)
- `admin-index.html` (管理后台首页)
- `admin-users.html` (用户管理)
- 其他所有 `.html` 文件

### 3. 部署脚本
**本地路径**: `d:\yiyaoyuanxing\server-deploy.sh`
**服务器路径**: `/root/server-deploy.sh`

## 上传工具推荐

### FileZilla (推荐)
1. 下载并安装 FileZilla: https://filezilla-project.org/
2. 打开 FileZilla，点击 "文件" → "站点管理器"
3. 点击 "新建站点"，填写以下信息:
   - 主机: `47.94.191.58`
   - 协议: SFTP - SSH File Transfer Protocol
   - 登录类型: 正常
   - 用户: `root`
   - 密码: `MyS3rv3r!2026`
4. 点击 "连接"

### WinSCP
1. 下载并安装 WinSCP: https://winscp.net/
2. 打开 WinSCP，填写以下信息:
   - 文件协议: SFTP
   - 主机名: `47.94.191.58`
   - 端口: 22
   - 用户名: `root`
   - 密码: `MyS3rv3r!2026`
3. 点击 "登录"

## 上传步骤

1. **上传后端文件**:
   - 在本地浏览器中找到 `d:\yiyaoyuanxing\backend\` 目录
   - 在远程浏览器中找到 `/root/` 目录
   - 右键点击 `backend` 文件夹，选择 "上传"

2. **上传前端文件**:
   - 在本地浏览器中找到 `d:\yiyaoyuanxing\` 目录
   - 在远程浏览器中找到 `/var/www/` 目录
   - 右键点击所有 `.html` 文件，选择 "上传"

3. **上传部署脚本**:
   - 在本地浏览器中找到 `d:\yiyaoyuanxing\server-deploy.sh` 文件
   - 在远程浏览器中找到 `/root/` 目录
   - 右键点击 `server-deploy.sh` 文件，选择 "上传"

## 验证上传

上传完成后，使用 SSH 登录服务器验证文件是否正确上传:

```bash
# 验证后端文件
ls -la /root/app/

# 验证前端文件
ls -la /var/www/frontend/

# 验证部署脚本
ls -la /root/server-deploy.sh
```

## 执行部署

上传完成后，执行部署脚本:

```bash
cd /root
chmod +x server-deploy.sh
bash server-deploy.sh
```
