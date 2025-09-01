/**
 * Script de pruebas manuales para el sistema de autenticación
 * Prueba registro y login para diferentes roles
 */

const axios = require('axios');

// URL de la API (cambiar según el entorno)
const API_BASE_URL = 'https://us-central1-academy-bd619.cloudfunctions.net/api';

// Datos de prueba para diferentes roles
const testUsers = [
  {
    name: 'Estudiante Neekworld',
    email: 'student@neekworld.cl',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    role: 'student'
  },
  {
    name: 'Profesor Neekworld',
    email: 'teacher@neekworld.cl',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    role: 'teacher'
  },
  {
    name: 'Admin Neekworld',
    email: 'admin@neekworld.cl',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    role: 'admin'
  }
];

// Casos de prueba para errores
const errorTestCases = [
  {
    name: 'Contraseña Débil',
    data: {
      name: 'Test User',
      email: 'weak.password@example.com',
      password: '123',
      confirmPassword: '123'
    },
    expectedError: 'contraseña debe tener al menos 8 caracteres'
  },
  {
    name: 'Email Inválido',
    data: {
      name: 'Test User',
      email: 'email-invalido',
      password: 'Test123!@#',
      confirmPassword: 'Test123!@#'
    },
    expectedError: 'correo no es válido'
  },
  {
    name: 'Contraseñas No Coinciden',
    data: {
      name: 'Test User',
      email: 'mismatch@example.com',
      password: 'Test123!@#',
      confirmPassword: 'Test456!@#'
    },
    expectedError: 'contraseña y la confirmación no coinciden'
  }
];

// Función para probar registro
async function testRegister(userData, testName) {
  try {
    console.log(`📝 Probando registro: ${testName}`);
    console.log(`   Email: ${userData.email}`);
    console.log(`   Rol: ${userData.role || 'student'}`);
    
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    
    console.log(`   ✅ Registro exitoso!`);
    console.log(`   📄 Usuario creado: ${response.data.user.name} (${response.data.user.role})`);
    console.log(`   🔑 Token recibido: ${response.data.token.substring(0, 20)}...`);
    console.log('');
    
    return {
      success: true,
      user: response.data.user,
      token: response.data.token
    };
    
  } catch (error) {
    if (error.response) {
      console.log(`   ❌ Error ${error.response.status}: ${error.response.data.message}`);
    } else {
      console.log(`   ❌ Error de conexión: ${error.message}`);
    }
    console.log('');
    
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

// Función para probar login
async function testLogin(email, password, testName) {
  try {
    console.log(`🔐 Probando login: ${testName}`);
    console.log(`   Email: ${email}`);
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    
    console.log(`   ✅ Login exitoso!`);
    console.log(`   👤 Usuario: ${response.data.user.name} (${response.data.user.role})`);
    console.log(`   🔑 Token recibido: ${response.data.token.substring(0, 20)}...`);
    console.log('');
    
    return {
      success: true,
      user: response.data.user,
      token: response.data.token
    };
    
  } catch (error) {
    if (error.response) {
      console.log(`   ❌ Error ${error.response.status}: ${error.response.data.message}`);
    } else {
      console.log(`   ❌ Error de conexión: ${error.message}`);
    }
    console.log('');
    
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
}

// Función para probar casos de error
async function testErrorCases() {
  console.log('🚨 === PROBANDO CASOS DE ERROR ===');
  console.log('');
  
  for (const testCase of errorTestCases) {
    const result = await testRegister(testCase.data, testCase.name);
    
    if (!result.success) {
      if (result.error.toLowerCase().includes(testCase.expectedError.toLowerCase())) {
        console.log(`   ✅ Error esperado detectado correctamente`);
      } else {
        console.log(`   ⚠️ Error diferente al esperado:`);
        console.log(`      Esperado: ${testCase.expectedError}`);
        console.log(`      Recibido: ${result.error}`);
      }
    } else {
      console.log(`   ❌ Se esperaba un error pero el registro fue exitoso`);
    }
    console.log('');
  }
}

// Función principal para ejecutar todas las pruebas
async function runManualTests() {
  console.log('🧪 === PRUEBAS MANUALES DEL SISTEMA DE AUTENTICACIÓN ===');
  console.log(`🌐 API Base URL: ${API_BASE_URL}`);
  console.log('');
  
  // Estadísticas
  let totalTests = 0;
  let successfulTests = 0;
  const registeredUsers = [];
  
  try {
    // 1. Probar casos de error
    await testErrorCases();
    
    // 2. Probar registro de usuarios válidos
    console.log('📝 === PROBANDO REGISTROS VÁLIDOS ===');
    console.log('');
    
    for (const user of testUsers) {
      totalTests++;
      const result = await testRegister(user, `${user.role.toUpperCase()} - ${user.name}`);
      
      if (result.success) {
        successfulTests++;
        registeredUsers.push({
          email: user.email,
          password: user.password,
          name: user.name,
          role: user.role
        });
      }
    }
    
    // 3. Probar login con usuarios registrados
    console.log('🔐 === PROBANDO LOGINS ===');
    console.log('');
    
    for (const user of registeredUsers) {
      totalTests++;
      const result = await testLogin(user.email, user.password, `${user.role.toUpperCase()} - ${user.name}`);
      
      if (result.success) {
        successfulTests++;
      }
    }
    
    // 4. Probar login con credenciales incorrectas
    if (registeredUsers.length > 0) {
      totalTests++;
      console.log('🔐 Probando login con contraseña incorrecta...');
      const result = await testLogin(registeredUsers[0].email, 'PasswordIncorrecto123!', 'Credenciales Incorrectas');
      
      if (!result.success && result.error.includes('Credenciales incorrectas')) {
        successfulTests++;
        console.log(`   ✅ Error de credenciales manejado correctamente`);
      }
      console.log('');
    }
    
    // 5. Mostrar resumen
    console.log('📊 === RESUMEN DE PRUEBAS ===');
    console.log(`✅ Pruebas exitosas: ${successfulTests}/${totalTests}`);
    console.log(`📈 Tasa de éxito: ${((successfulTests/totalTests)*100).toFixed(1)}%`);
    console.log('');
    
    if (registeredUsers.length > 0) {
      console.log('👥 Usuarios registrados para pruebas:');
      registeredUsers.forEach(user => {
        console.log(`   - ${user.name} (${user.role}): ${user.email}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error ejecutando pruebas:', error.message);
  }
}

// Función para limpiar usuarios de prueba (opcional)
async function cleanupTestUsers() {
  console.log('🧹 === LIMPIEZA DE USUARIOS DE PRUEBA ===');
  console.log('Nota: Esta función requiere permisos de administrador');
  console.log('Los usuarios de prueba deben eliminarse manualmente desde Firebase Console');
  console.log('');
}

// Ejecutar pruebas si el script se ejecuta directamente
if (require.main === module) {
  runManualTests();
}

module.exports = {
  runManualTests,
  testRegister,
  testLogin,
  testUsers,
  errorTestCases,
  cleanupTestUsers
};
