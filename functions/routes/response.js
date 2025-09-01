const express = require('express');
const { 
  submitResponse,
  getCompletedEvaluations,
  getResponseById,
  getEvaluationResponses,
  gradeResponse
} = require('../controllers/responseController');
const { isAuthenticated, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

// Enviar respuestas a una evaluación
router.post('/', isAuthenticated, submitResponse);

// Obtener historial de evaluaciones completadas por el usuario
router.get('/history', isAuthenticated, getCompletedEvaluations);

// Obtener una respuesta específica por ID
router.get('/:id', isAuthenticated, getResponseById);

// Obtener todas las respuestas de una evaluación (solo instructores)
router.get('/evaluation/:evaluationId', isAuthenticated, checkRole(['instructor', 'admin']), getEvaluationResponses);

// Calificar una respuesta manualmente (solo instructores)
router.patch('/:id/grade', isAuthenticated, checkRole(['instructor', 'admin']), gradeResponse);

// Mantener compatibilidad con ruta anterior
router.post('/submit', isAuthenticated, submitResponse);

module.exports = router;
