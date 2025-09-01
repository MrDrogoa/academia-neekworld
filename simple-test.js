const axios = require('axios');

console.log('Iniciando prueba simple...');

async function testSimple() {
  try {
    console.log('Probando endpoint de registro...');
    
    const response = await axios.post('https://us-central1-academy-bd619.cloudfunctions.net/api/auth/register', {
      name: "Test User",
      email: "test123@example.com",
      password: "Test123!@#",
      role: "student"
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error:', error.message);
    }
  }
}

testSimple();
