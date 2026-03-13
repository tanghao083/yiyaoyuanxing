# 部署前端文件到服务器脚本

# 服务器信息
$server = "47.94.191.58"
$username = "root"
$password = "MyS3rv3r!2026"

# 本地前端文件目录
$localFrontendDir = "d:\yiyaoyuanxing"

# 服务器前端目录
$remoteFrontendDir = "/var/www/frontend"

# 要上传的文件列表
$filesToUpload = @(
    "index.html",
    "login.html",
    "register.html",
    "admin-login.html",
    "admin-index.html",
    "order.html",
    "order-center.html",
    "customer-service.html",
    "user-qualification.html"
)

# 上传文件函数
function Upload-File($localFile, $remoteFile) {
    Write-Host "上传文件: $localFile -> $remoteFile"
    & plink -ssh $username@$server -pw $password "mkdir -p $(Split-Path $remoteFile -Parent)"
    & pscp -ssh -pw $password "$localFile" "$username@$server:$remoteFile"
}

# 部署命令
$deployCommand = @'
#!/bin/bash

# 进入前端目录
cd /var/www/frontend

# 更新API路径
echo "更新API路径..."
sed -i 's|http://47.94.191.58:3001/api|/api|g' *.html
sed -i 's|http://localhost:3002/api|/api|g' *.html

# 设置权限
echo "设置权限..."
chown -R www-data:www-data /var/www/frontend
chmod -R 755 /var/www/frontend

# 重启Nginx
echo "重启Nginx..."
systemctl restart nginx

echo "前端部署完成！"
'@

# 保存部署命令到文件
$deployCommand | Out-File -FilePath "deploy-frontend-commands.sh" -Encoding ASCII

# 上传前端文件
Write-Host "开始上传前端文件..."
foreach ($file in $filesToUpload) {
    $localFile = Join-Path $localFrontendDir $file
    $remoteFile = Join-Path $remoteFrontendDir $file
    Upload-File $localFile $remoteFile
}

# 上传部署命令文件
Write-Host "上传部署命令文件..."
& pscp -ssh -pw $password "deploy-frontend-commands.sh" "$username@$server:/root/deploy-frontend-commands.sh"

# 执行部署命令
Write-Host "执行部署命令..."
& plink -ssh $username@$server -pw $password "chmod +x /root/deploy-frontend-commands.sh && bash /root/deploy-frontend-commands.sh"

# 清理临时文件
Remove-Item "deploy-frontend-commands.sh"

Write-Host "部署完成！"
