const sequelize = require('./backend/config/database');

async function testDbConnection() {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 同步数据库模型
    await sequelize.sync({ alter: true });
    console.log('数据库模型同步成功');

    // 关闭连接
    await sequelize.close();
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}

testDbConnection();