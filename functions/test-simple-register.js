/**
 * Prueba simple de registro usando la API de producción
 */

const https = require('https');

const testRegister = (userData) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(userData);
    
    const options = {
      hostname: 'us-central1-academy-bd619.cloudfunctions.net',
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
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

    req.write(data);
    req.end();
  });
};

const runTest = async () => {
  console.log('🧪 Probando registro con API de producción...');
  console.log('');
  
  const testUser = {
    name: 'Usuario Nuevo',
    email: `test.${Date.now()}@example.com`,
    password: 'TestPass123!@#',
    confirmPassword: 'TestPass123!@#',
    phone: `+5691${Math.floor(Math.random() * 10000000)}`,
    role: 'student'
  };
  
  try {
    console.log('📝 Enviando datos de registro:');
    console.log(`   Nombre: ${testUser.name}`);
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Rol: ${testUser.role}`);
    console.log('');
    
    const response = await testRegister(testUser);
    
    console.log(`📡 Status: ${response.status}`);
    console.log('📄 Respuesta:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.status === 201) {
      console.log('');
      console.log('✅ ¡Registro exitoso!');
      console.log(`🆔 ID de usuario: ${response.data.user?.id}`);
      console.log(`🔑 Token generado: ${response.data.token ? 'Sí' : 'No'}`);
    } else {
      console.log('');
      console.log('❌ Error en el registro');
      console.log(`💬 Mensaje: ${response.data.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
};

runTest();
