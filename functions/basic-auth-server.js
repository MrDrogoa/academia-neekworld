require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true
}));
app.use(express.json());

// Basic auth controller for testing
const registerUser = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { name, email, password, confirmPassword, phone } = req.body;

    // Basic validation
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

    // For now, just return success
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: 'test-user-id',
        name: name,
        email: email,
        phone: phone,
        role: 'student'
      }
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ 
      message: 'Error al registrar usuario', 
      details: error.message 
    });
  }
};

// Routes
app.post('/api/auth/register', registerUser);

app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

const PORT = 5007;

app.listen(PORT, () => {
  console.log(`🚀 Basic Auth Server running on http://localhost:${PORT}`);
  console.log(`📋 Registration endpoint: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`❤️ Health check: GET http://localhost:${PORT}/health`);
});
