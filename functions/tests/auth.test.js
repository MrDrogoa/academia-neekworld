const request = require('supertest');
const app = require('../app');
const { validateEmail, validatePassword, getPasswordRequirements } = require('../controllers/authController');

// Datos de prueba para diferentes roles
const testUsers = {
  student: {
    name: 'Estudiante Test',
    email: 'estudiante@test.com',
    password: 'Test123!@#',
    confirmPassword: 'Test123!@#',
    phone: '+56912345678',
    role: 'student'
  },
  teacher: {
    name: 'Profesor Test',
    email: 'profesor@test.com',
    password: 'Teacher456!@#',
    confirmPassword: 'Teacher456!@#',
    phone: '+56987654321',
    role: 'teacher'
  },
  admin: {
    name: 'Admin Test',
    email: 'admin@test.com',
    password: 'Admin789!@#',
    confirmPassword: 'Admin789!@#',
    phone: '+56911111111',
    role: 'admin'
  }
};

// Datos de prueba para casos de error
const invalidTestCases = {
  emailInvalido: {
    name: 'Test User',
    email: 'email-invalido',
    password: 'Test123!@#',
    confirmPassword: 'Test123!@#'
  },
  passwordDebil: {
    name: 'Test User',
    email: 'test@example.com',
    password: '123',
    confirmPassword: '123'
  },
  passwordNoCoincide: {
    name: 'Test User',
    email: 'test2@example.com',
    password: 'Test123!@#',
    confirmPassword: 'Test456!@#'
  },
  camposVacios: {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  rolInvalido: {
    name: 'Test User',
    email: 'test3@example.com',
    password: 'Test123!@#',
    confirmPassword: 'Test123!@#',
    role: 'invalid_role'
  }
};

describe('Sistema de Autenticación', () => {
  
  describe('Validaciones Unitarias', () => {
    
    describe('validateEmail', () => {
      it('debería validar emails correctos', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('usuario.test@dominio.cl')).toBe(true);
        expect(validateEmail('admin@universidad.edu')).toBe(true);
      });

      it('debería rechazar emails inválidos', () => {
        expect(validateEmail('email-sin-arroba')).toBe(false);
        expect(validateEmail('@sin-usuario.com')).toBe(false);
        expect(validateEmail('usuario@')).toBe(false);
        expect(validateEmail('')).toBe(false);
      });
    });

    describe('validatePassword', () => {
      it('debería validar contraseñas seguras', () => {
        expect(validatePassword('Test123!@#')).toBe(true);
        expect(validatePassword('MySecure1!')).toBe(true);
        expect(validatePassword('StrongPass2$')).toBe(true);
      });

      it('debería rechazar contraseñas débiles', () => {
        expect(validatePassword('123')).toBe(false);
        expect(validatePassword('password')).toBe(false);
        expect(validatePassword('PASSWORD')).toBe(false);
        expect(validatePassword('123456789')).toBe(false);
        expect(validatePassword('Test123')).toBe(false); // Sin símbolos
        expect(validatePassword('test123!')).toBe(false); // Sin mayúsculas
      });

      it('debería mostrar mensaje de requisitos correcto', () => {
        const requirements = getPasswordRequirements();
        expect(requirements).toContain('8 caracteres');
        expect(requirements).toContain('mayúsculas');
        expect(requirements).toContain('minúsculas');
        expect(requirements).toContain('números');
        expect(requirements).toContain('símbolos');
      });
    });
  });

  describe('Registro de Usuarios', () => {
    
    describe('Registros Exitosos por Rol', () => {
      
      it('debería registrar un estudiante correctamente', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send(testUsers.student);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Usuario registrado exitosamente');
        expect(response.body.user.role).toBe('student');
        expect(response.body.user.email).toBe(testUsers.student.email);
        expect(response.body.token).toBeDefined();
        
        // Verificar que la contraseña no se devuelve
        expect(response.body.user.password).toBeUndefined();
      });

      it('debería registrar un profesor correctamente', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send(testUsers.teacher);

        expect(response.status).toBe(201);
        expect(response.body.user.role).toBe('teacher');
        expect(response.body.user.email).toBe(testUsers.teacher.email);
        expect(response.body.token).toBeDefined();
      });

      it('debería registrar un administrador correctamente', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send(testUsers.admin);

        expect(response.status).toBe(201);
        expect(response.body.user.role).toBe('admin');
        expect(response.body.user.email).toBe(testUsers.admin.email);
        expect(response.body.token).toBeDefined();
      });
    });

    describe('Casos de Error en Registro', () => {
      
      it('debería rechazar email inválido', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send(invalidTestCases.emailInvalido);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('El correo no es válido');
      });

      it('debería rechazar contraseña débil', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send(invalidTestCases.passwordDebil);

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('8 caracteres');
      });

      it('debería rechazar cuando las contraseñas no coinciden', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send(invalidTestCases.passwordNoCoincide);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('La contraseña y la confirmación no coinciden');
      });

      it('debería rechazar campos vacíos', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send(invalidTestCases.camposVacios);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Todos los campos obligatorios deben ser completados');
      });

      it('debería rechazar rol inválido', async () => {
        const response = await request(app)
          .post('/api/auth/register')
          .send(invalidTestCases.rolInvalido);

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Rol no válido');
      });

      it('debería rechazar email duplicado', async () => {
        // Primer registro exitoso
        await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Usuario Original',
            email: 'duplicado@test.com',
            password: 'Test123!@#',
            confirmPassword: 'Test123!@#'
          });

        // Segundo registro con el mismo email
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Usuario Duplicado',
            email: 'duplicado@test.com',
            password: 'Test456!@#',
            confirmPassword: 'Test456!@#'
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('El correo ya está registrado');
      });
    });
  });

  describe('Inicio de Sesión', () => {
    
    beforeAll(async () => {
      // Registrar usuarios de prueba para login
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Usuario Login',
          email: 'login@test.com',
          password: 'LoginTest123!',
          confirmPassword: 'LoginTest123!'
        });
    });

    describe('Login Exitoso', () => {
      
      it('debería permitir login con credenciales correctas', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'login@test.com',
            password: 'LoginTest123!'
          });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Login exitoso');
        expect(response.body.user.email).toBe('login@test.com');
        expect(response.body.token).toBeDefined();
      });
    });

    describe('Casos de Error en Login', () => {
      
      it('debería rechazar credenciales incorrectas', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'login@test.com',
            password: 'PasswordIncorrecto123!'
          });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Credenciales incorrectas');
      });

      it('debería rechazar usuario inexistente', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'noexiste@test.com',
            password: 'Test123!'
          });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Credenciales incorrectas');
      });

      it('debería rechazar campos vacíos en login', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: '',
            password: ''
          });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email y contraseña son requeridos');
      });
    });
  });

  describe('Recuperación de Contraseña', () => {
    
    it('debería procesar solicitud de recuperación correctamente', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'login@test.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Enlace de restablecimiento');
    });

    it('debería manejar email inexistente sin revelar información', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'noexiste@test.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Si el correo existe');
    });
  });
});

// Función auxiliar para ejecutar todas las pruebas
const runAuthTests = async () => {
  console.log('🧪 Iniciando pruebas automatizadas del sistema de autenticación...');
  console.log('');
  
  try {
    // Ejecutar pruebas usando Jest
    const { execSync } = require('child_process');
    execSync('npm test', { stdio: 'inherit' });
    
    console.log('');
    console.log('✅ Todas las pruebas completadas exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando pruebas:', error.message);
  }
};

module.exports = {
  testUsers,
  invalidTestCases,
  runAuthTests
};
