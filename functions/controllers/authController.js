const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = require('../config/firebase'); 

// Validar email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar contraseña - Requisitos más específicos
const validatePassword = (password) => {
  if (!password || password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

// Obtener mensaje de requisitos de contraseña
const getPasswordRequirements = () => {
  return 'La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, números y símbolos especiales';
};

// Validar teléfono (opcional)
const validatePhone = (phone) => {
  if (!phone) return true;
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,10}$/;
  return phoneRegex.test(phone);
};

// Registrar usuario
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, role = 'student' } = req.body;

    console.log('📝 Iniciando registro de usuario:', { name, email, role });

    // Validaciones básicas
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        message: 'Todos los campos obligatorios deben ser completados' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        message: 'La contraseña y la confirmación no coinciden' 
      });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'El correo no es válido' });
    }
    
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: getPasswordRequirements()
      });
    }
    
    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ 
        message: 'El formato del número de teléfono no es válido' 
      });
    }

    // Validar rol - Permitir student, teacher y admin
    const validRoles = ['student', 'teacher', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: 'Rol no válido. Los roles permitidos son: student, teacher, admin' 
      });
    }

    console.log('✅ Validaciones pasadas, verificando usuario existente...');

    // Verificar si el email ya está registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    console.log('✅ Email disponible, creando usuario en Firebase Auth...');

    // Crear usuario en Firebase Authentication
    let firebaseUser;
    try {
      const firebaseUserData = {
        email,
        password,
        displayName: name,
      };
      
      // Solo agregar phoneNumber si existe y es válido
      if (phone && phone.trim()) {
        firebaseUserData.phoneNumber = phone;
      }
      
      firebaseUser = await admin.auth().createUser(firebaseUserData);
      console.log('✅ Usuario creado en Firebase Auth:', firebaseUser.uid);
    } catch (firebaseError) {
      console.error('❌ Error creando usuario en Firebase Auth:', firebaseError);
      return res.status(500).json({ 
        message: 'Error al crear usuario en Firebase Auth', 
        details: firebaseError.message 
      });
    }

    // Encriptar la contraseña para almacenar
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
      console.log('✅ Contraseña encriptada, guardando en Firestore...');
    } catch (hashError) {
      console.error('❌ Error encriptando contraseña:', hashError);
      // Limpiar usuario de Firebase Auth
      try {
        await admin.auth().deleteUser(firebaseUser.uid);
      } catch (deleteError) {
        console.error('❌ Error limpiando Firebase Auth:', deleteError);
      }
      return res.status(500).json({ 
        message: 'Error al procesar contraseña', 
        details: hashError.message 
      });
    }

    // Registrar usuario en Firestore
    let user;
    try {
      user = await User.create({
        id: firebaseUser.uid,
        name,
        email,
        phone,
        password: hashedPassword,
        role,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Usuario registrado exitosamente en Firestore');
    } catch (firestoreError) {
      console.error('❌ Error guardando en Firestore:', firestoreError);
      // Limpiar usuario de Firebase Auth
      try {
        await admin.auth().deleteUser(firebaseUser.uid);
      } catch (deleteError) {
        console.error('❌ Error limpiando Firebase Auth:', deleteError);
      }
      return res.status(500).json({ 
        message: 'Error al guardar usuario en base de datos', 
        details: firestoreError.message 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    
    // Si se creó el usuario en Firebase Auth pero falló en Firestore, eliminarlo
    if (error.firebaseUser) {
      try {
        await admin.auth().deleteUser(error.firebaseUser.uid);
        console.log('🧹 Usuario eliminado de Firebase Auth tras error en Firestore');
      } catch (deleteError) {
        console.error('❌ Error al limpiar usuario de Firebase Auth:', deleteError);
      }
    }
    
    res.status(500).json({ 
      message: 'Error al registrar usuario', 
      details: error.message 
    });
  }
};

// Iniciar sesión - Método mejorado con manejo de errores detallado
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Iniciando proceso de login para:', email);

    // Validaciones básicas
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son requeridos'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Formato de correo no válido' });
    }

    // Buscar usuario en la base de datos
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciales incorrectas' 
      });
    }

    console.log('✅ Usuario encontrado:', user.id);

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Credenciales incorrectas' 
      });
    }

    console.log('✅ Contraseña válida');

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: '24h' }
    );

    console.log('✅ Login exitoso para:', email);

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Solicitar recuperación de contraseña
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email es requerido' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Formato de correo no válido' });
    }

    // Verificar si el usuario existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return res.status(200).json({ 
        message: 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña' 
      });
    }

    // Generar enlace de restablecimiento en Firebase Auth
    const resetLink = await admin.auth().generatePasswordResetLink(email);

    console.log('🔗 Enlace de restablecimiento generado para:', email);

    // Aquí podrías enviar el email (implementación pendiente)
    
    res.status(200).json({
      message: 'Enlace de restablecimiento enviado',
      resetLink: resetLink // En producción, esto se enviaría por email
    });
  } catch (error) {
    console.error('❌ Error en forgot password:', error);
    res.status(500).json({ 
      message: 'Error al procesar solicitud',
      details: error.message 
    });
  }
};

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    res.status(500).json({ 
      message: 'Error al obtener perfil',
      details: error.message 
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  getProfile,
  validateEmail,
  validatePassword,
  validatePhone,
  getPasswordRequirements
};
