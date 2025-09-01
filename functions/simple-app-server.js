const app = require('./app');

const PORT = process.env.PORT || 5006;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`❤️ Health check at http://localhost:${PORT}/health`);
});
