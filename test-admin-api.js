// Test script để kiểm tra API admin users
const fetch = require('node-fetch');

async function testAdminUsersAPI() {
  try {
    console.log('Testing admin users API...');
    
    const response = await fetch('http://localhost:3000/api/admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.log('Response not OK - likely auth error (expected)');
      const text = await response.text();
      console.log('Response body:', text);
      return;
    }
    
    const data = await response.json();
    console.log('API Response:');
    console.log('Users count:', data.users?.length || 0);
    console.log('Stats:', data.stats);
    
    if (data.users) {
      console.log('\nUsers:');
      data.users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Created: ${user.createdAt}`);
      });
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAdminUsersAPI(); 