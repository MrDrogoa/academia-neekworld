const axios = require('axios');

async function testBackend() {
  const testUser = {
    name: "Maria Test",
    email: `test.${Date.now()}@example.com`,
    password: "Test123!@#",
    confirmPassword: "Test123!@#",
    role: "student"
  };

  console.log('🧪 Probando registro con datos:');
  console.log(JSON.stringify(testUser, null, 2));

  try {
    const response = await axios.post(
      'https://us-central1-academy-bd619.cloudfunctions.net/api/auth/register',
      testUser,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('✅ Registro exitoso!');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.log('❌ Error en el registro:');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error setting up request:', error.message);
    }
    
    console.log('Stack trace:', error.stack);
  }
}

testBackend();
