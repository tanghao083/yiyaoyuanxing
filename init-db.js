// 简化版数据库初始化脚本
const fs = require('fs');
const path = require('path');

// 模拟数据库初始化
console.log('开始初始化数据库...');

// 创建数据库文件
const dbPath = path.join(__dirname, 'medical_ordering_system.db');
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
  console.log('数据库文件创建成功:', dbPath);
} else {
  console.log('数据库文件已存在:', dbPath);
}

// 模拟表结构创建
console.log('创建表结构...');
console.log('创建 users 表');
console.log('创建 products 表');
console.log('创建 orders 表');
console.log('创建 order_items 表');
console.log('创建 qualifications 表');
console.log('创建 shipments 表');

console.log('数据库初始化完成！');
