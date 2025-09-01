const axios = require('axios');

// Configuración del backend
const BASE_URL = 'https://us-central1-academy-bd619.cloudfunctions.net/api';

// Función para probar el registro de usuario
async function testUserRegistration() {
  const testUsers = [
    {
      name: "María González",
      email: "maria.test@example.com",
      password: "Test123!@#",
      role: "student"
    },
    {
      name: "Prof. Carlos López",
      email: "carlos.test@example.com",
      password: "Test456!@#",
      role: "teacher"
    },
    {
      name: "Admin Usuario",
      email: "admin.test@example.com",
      password: "Test789!@#",
      role: "admin"
    }
  ];

  console.log('🚀 Iniciando pruebas de registro de usuario...\n');

  for (const user of testUsers) {
    try {
      console.log(`📝 Probando registro para: ${user.name} (${user.role})`);
      
      const response = await axios.post(`${BASE_URL}/auth/register`, user, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 201) {
        console.log(`✅ Registro exitoso para ${user.email}`);
        console.log(`   - Token recibido: ${response.data.token ? '✓' : '✗'}`);
        console.log(`   - UID: ${response.data.user?.uid || 'No disponible'}`);
        console.log(`   - Rol: ${response.data.user?.role || 'No disponible'}\n`);
      }
    } catch (error) {
      console.log(`❌ Error en registro para ${user.email}:`);
      if (error.response) {
        console.log(`   - Status: ${error.response.status}`);
        console.log(`   - Mensaje: ${error.response.data.message || error.response.data.error}`);
      } else {
        console.log(`   - Error de conexión: ${error.message}`);
      }
      console.log('');
    }
  }
}

// Función para probar el login
async function testUserLogin() {
  console.log('🔐 Iniciando pruebas de login...\n');
  
  const loginCredentials = {
    email: "maria.test@example.com",
    password: "Test123!@#"
  };

  try {
    console.log(`🔑 Probando login para: ${loginCredentials.email}`);
    
    const response = await axios.post(`${BASE_URL}/auth/login`, loginCredentials, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (response.status === 200) {
      console.log(`✅ Login exitoso para ${loginCredentials.email}`);
      console.log(`   - Token recibido: ${response.data.token ? '✓' : '✗'}`);
      console.log(`   - Usuario: ${response.data.user?.name || 'No disponible'}`);
      console.log(`   - Rol: ${response.data.user?.role || 'No disponible'}\n`);
    }
  } catch (error) {
    console.log(`❌ Error en login para ${loginCredentials.email}:`);
    if (error.response) {
      console.log(`   - Status: ${error.response.status}`);
      console.log(`   - Mensaje: ${error.response.data.message || error.response.data.error}`);
    } else {
      console.log(`   - Error de conexión: ${error.message}`);
    }
    console.log('');
  }
}

// Función para probar validaciones de contraseña
async function testPasswordValidation() {
  console.log('🔒 Iniciando pruebas de validación de contraseñas...\n');
  
  const invalidPasswords = [
    { password: "123", description: "Muy corta (3 caracteres)" },
    { password: "12345678", description: "Solo números" },
    { password: "abcdefgh", description: "Solo minúsculas" },
    { password: "ABCDEFGH", description: "Solo mayúsculas" },
    { password: "Abcdefgh", description: "Sin números ni símbolos" },
    { password: "Abc123", description: "Muy corta (6 caracteres)" }
  ];

  for (const test of invalidPasswords) {
    try {
      console.log(`🧪 Probando contraseña inválida: ${test.description}`);
      
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        name: "Test User",
        email: `test.${Date.now()}@example.com`,
        password: test.password,
        role: "student"
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log(`❌ Error: La contraseña "${test.password}" debería haber sido rechazada\n`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(`✅ Validación correcta: ${error.response.data.message || error.response.data.error}\n`);
      } else {
        console.log(`❌ Error inesperado: ${error.message}\n`);
      }
    }
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {
  console.log('═══════════════════════════════════════');
  console.log('🧪 SUITE DE PRUEBAS DE AUTENTICACIÓN');
  console.log('═══════════════════════════════════════\n');

  await testPasswordValidation();
  await testUserRegistration();
  await testUserLogin();

  console.log('═══════════════════════════════════════');
  console.log('✨ Pruebas completadas');
  console.log('═══════════════════════════════════════');
}

// Ejecutar las pruebas
runAllTests().catch(console.error);
