const fetch = require('node-fetch');

async function testRegister() {
  try {
    const response = await fetch('http://47.94.191.58:3001/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'test123',
        companyName: 'Test Company',
        contactPerson: 'Test Person',
        contactPhone: '13111111111',
        address: 'Test Address'
      })
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testRegister();