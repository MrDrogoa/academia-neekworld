require('dotenv').config();
const express = require('express');
const cors = require('cors');

console.log('Starting server...');

// Create Express app
const app = express();

console.log('Express app created');

// Middleware
app.use(cors());
app.use(express.json());

console.log('Middleware configured');

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

console.log('Health route configured');

// Import auth routes
console.log('Loading auth routes...');
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
console.log('Auth routes loaded');

const PORT = process.env.PORT || 5006;

console.log(`Starting server on port ${PORT}...`);
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`❤️ Health check at http://localhost:${PORT}/health`);
});
