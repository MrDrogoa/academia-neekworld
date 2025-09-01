const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.send('Server is working!');
});

const PORT = 5008;
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`Test server running on http://127.0.0.1:${PORT}`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});
