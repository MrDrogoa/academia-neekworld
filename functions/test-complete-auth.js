/**
 * Script para probar todas las validaciones del sistema de autenticación
 */

const https = require('https');

const makeRequest = (path, data) => {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    
    const options = {
      hostname: 'us-central1-academy-bd619.cloudfunctions.net',
      path: `/api${path}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({
            status: res.statusCode,
            data: response
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: { message: body }
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(payload);
    req.end();
  });
};

const testCases = [
  {
    name: 'Registro Exitoso - Estudiante',
    type: 'register',
    data: {
      name: 'Estudiante Test',
      email: `estudiante.${Date.now()}@test.com`,
      password: 'Student123!@#',
      confirmPassword: 'Student123!@#',
      phone: `+5691${Math.floor(Math.random() * 10000000)}`,
      role: 'student'
    },
    expectedStatus: 201
  },
  {
    name: 'Registro Exitoso - Profesor',
    type: 'register',
    data: {
      name: 'Profesor Test',
      email: `profesor.${Date.now()}@test.com`,
      password: 'Teacher456!@#',
      confirmPassword: 'Teacher456!@#',
      phone: `+5691${Math.floor(Math.random() * 10000000)}`,
      role: 'teacher'
    },
    expectedStatus: 201
  },
  {
    name: 'Registro Exitoso - Admin',
    type: 'register',
    data: {
      name: 'Admin Test',
      email: `admin.${Date.now()}@test.com`,
      password: 'Admin789!@#',
      confirmPassword: 'Admin789!@#',
      phone: `+5691${Math.floor(Math.random() * 10000000)}`,
      role: 'admin'
    },
    expectedStatus: 201
  },
  {
    name: 'Error - Email Inválido',
    type: 'register',
    data: {
      name: 'Test User',
      email: 'email-invalido',
      password: 'Test123!@#',
      confirmPassword: 'Test123!@#'
    },
    expectedStatus: 400,
    expectedMessage: 'correo no es válido'
  },
  {
    name: 'Error - Contraseña Débil',
    type: 'register',
    data: {
      name: 'Test User',
      email: `weak.${Date.now()}@test.com`,
      password: '123',
      confirmPassword: '123'
    },
    expectedStatus: 400,
    expectedMessage: '8 caracteres'
  },
  {
    name: 'Error - Contraseñas No Coinciden',
    type: 'register',
    data: {
      name: 'Test User',
      email: `mismatch.${Date.now()}@test.com`,
      password: 'Test123!@#',
      confirmPassword: 'Test456!@#'
    },
    expectedStatus: 400,
    expectedMessage: 'no coinciden'
  },
  {
    name: 'Error - Campos Vacíos',
    type: 'register',
    data: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    expectedStatus: 400,
    expectedMessage: 'campos obligatorios'
  },
  {
    name: 'Error - Rol Inválido',
    type: 'register',
    data: {
      name: 'Test User',
      email: `invalid.role.${Date.now()}@test.com`,
      password: 'Test123!@#',
      confirmPassword: 'Test123!@#',
      role: 'invalid_role'
    },
    expectedStatus: 400,
    expectedMessage: 'Rol no válido'
  }
];

let registeredUsers = [];

const runTest = async (testCase) => {
  console.log(`🧪 ${testCase.name}`);
  console.log(`   Tipo: ${testCase.type}`);
  
  try {
    const path = testCase.type === 'register' ? '/auth/register' : '/auth/login';
    const response = await makeRequest(path, testCase.data);
    
    console.log(`   📡 Status: ${response.status}`);
    
    if (response.status === testCase.expectedStatus) {
      console.log(`   ✅ Status correcto`);
      
      if (testCase.expectedMessage) {
        const messageMatches = response.data.message?.toLowerCase().includes(testCase.expectedMessage.toLowerCase());
        if (messageMatches) {
          console.log(`   ✅ Mensaje de error correcto`);
        } else {
          console.log(`   ⚠️ Mensaje diferente al esperado:`);
          console.log(`      Esperado: ${testCase.expectedMessage}`);
          console.log(`      Recibido: ${response.data.message}`);
        }
      } else if (response.status === 201) {
        console.log(`   ✅ Usuario registrado: ${response.data.user?.name} (${response.data.user?.role})`);
        console.log(`   🔑 Token recibido: ${response.data.token ? 'Sí' : 'No'}`);
        
        // Guardar usuario para pruebas de login
        if (testCase.data.email && testCase.data.password) {
          registeredUsers.push({
            email: testCase.data.email,
            password: testCase.data.password,
            name: testCase.data.name,
            role: testCase.data.role
          });
        }
      }
    } else {
      console.log(`   ❌ Status incorrecto - Esperado: ${testCase.expectedStatus}, Recibido: ${response.status}`);
      console.log(`   💬 Mensaje: ${response.data.message}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Error de conexión: ${error.message}`);
  }
  
  console.log('');
};

const testLogin = async (user) => {
  console.log(`🔐 Login - ${user.name} (${user.role})`);
  console.log(`   Email: ${user.email}`);
  
  try {
    const response = await makeRequest('/auth/login', {
      email: user.email,
      password: user.password
    });
    
    console.log(`   📡 Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log(`   ✅ Login exitoso`);
      console.log(`   👤 Usuario: ${response.data.user?.name} (${response.data.user?.role})`);
      console.log(`   🔑 Token recibido: ${response.data.token ? 'Sí' : 'No'}`);
    } else {
      console.log(`   ❌ Error en login: ${response.data.message}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Error de conexión: ${error.message}`);
  }
  
  console.log('');
};

const runAllTests = async () => {
  console.log('🧪 === PRUEBAS COMPLETAS DEL SISTEMA DE AUTENTICACIÓN ===');
  console.log('🌐 API: https://us-central1-academy-bd619.cloudfunctions.net/api');
  console.log('');
  
  let totalTests = 0;
  let passedTests = 0;
  
  // Ejecutar pruebas de registro
  console.log('📝 === PRUEBAS DE REGISTRO ===');
  console.log('');
  
  for (const testCase of testCases) {
    totalTests++;
    await runTest(testCase);
    
    // Pequeña pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Ejecutar pruebas de login con usuarios registrados
  if (registeredUsers.length > 0) {
    console.log('🔐 === PRUEBAS DE LOGIN ===');
    console.log('');
    
    for (const user of registeredUsers) {
      await testLogin(user);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Probar login con credenciales incorrectas
    if (registeredUsers.length > 0) {
      console.log('🔐 Login con contraseña incorrecta');
      console.log(`   Email: ${registeredUsers[0].email}`);
      
      try {
        const response = await makeRequest('/auth/login', {
          email: registeredUsers[0].email,
          password: 'PasswordIncorrecto123!'
        });
        
        if (response.status === 401 && response.data.message.includes('Credenciales incorrectas')) {
          console.log('   ✅ Error de credenciales manejado correctamente');
        } else {
          console.log('   ❌ Error no manejado correctamente');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
      console.log('');
    }
  }
  
  console.log('📊 === RESUMEN ===');
  console.log(`✅ Usuarios registrados exitosamente: ${registeredUsers.length}`);
  console.log(`📧 Emails de prueba creados:`);
  registeredUsers.forEach(user => {
    console.log(`   - ${user.email} (${user.role})`);
  });
  console.log('');
  console.log('🎉 ¡Pruebas completadas!');
};

runAllTests();
