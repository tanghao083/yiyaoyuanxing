@echo off
echo 开始上传文件到云服务器...

:: 设置FinalShell路径（根据您的安装位置调整）
set FINALSHELL_PATH="C:\Program Files\FinalShell\FinalShell.exe"

:: 上传文件（使用FinalShell的命令行功能）
%FINALSHELL_PATH% -upload "d:\yiyaoyuanxing\common.js" "root@47.94.191.58:/var/www/html/"
%FINALSHELL_PATH% -upload "d:\yiyaoyuanxing\admin-products.html" "root@47.94.191.58:/var/www/html/"
%FINALSHELL_PATH% -upload "d:\yiyaoyuanxing\admin-orders.html" "root@47.94.191.58:/var/www/html/"
%FINALSHELL_PATH% -upload "d:\yiyaoyuanxing\admin-inventory.html" "root@47.94.191.58:/var/www/html/"
%FINALSHELL_PATH% -upload "d:\yiyaoyuanxing\admin-finance.html" "root@47.94.191.58:/var/www/html/"
%FINALSHELL_PATH% -upload "d:\yiyaoyuanxing\admin-supplier-certifications.html" "root@47.94.191.58:/var/www/html/"

echo 上传完成！
pause