const { User } = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key';

async function testLogin() {
  try {
    console.log('Testing login...');
    
    console.log('Looking for user...');
    const user = await User.findOne({ where: { username: 'testuser' } });
    console.log('User found:', user);
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log('Comparing password...');
    const isMatch = await bcrypt.compare('test123', user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match');
      return;
    }
    
    console.log('Generating token...');
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('Token generated:', token);
    console.log('Login successful');
  } catch (error) {
    console.error('Error:', error);
    console.error('Error stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

testLogin();