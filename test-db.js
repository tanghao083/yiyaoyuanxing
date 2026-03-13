const mysql = require('mysql2/promise');

async function testDbConnection() {
  try {
    // 创建数据库连接
    const connection = await mysql.createConnection({
      host: 'rm-2zee36m35h918va76so.mysql.rds.aliyuncs.com',
      user: 'ceshibushu_k1',
      password: 'MyS3rv3r!2026',
      database: 'yirunjianpingtai',
      port: 3306
    });

    console.log('数据库连接成功');

    // 查询用户表
    const [rows] = await connection.execute('SELECT * FROM users');
    console.log('用户表数据:', rows);

    // 关闭连接
    await connection.end();
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}

testDbConnection();