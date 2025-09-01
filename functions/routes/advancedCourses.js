const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const advancedCourseController = require('../controllers/advancedCourseController');

// Middleware para verificar autenticación en todas las rutas
router.use(verifyToken);

// Dashboard de cursos para profesores y admins
router.get('/dashboard', advancedCourseController.getCourseDashboard);

// Crear curso con funcionalidades avanzadas
router.post('/advanced', advancedCourseController.createAdvancedCourse);

// Actualizar curso con historial
router.put('/advanced/:courseId', advancedCourseController.updateAdvancedCourse);

// Gestión de módulos del curso
router.post('/modules/:courseId', advancedCourseController.manageCourseModules);

// Analytics del curso
router.get('/analytics/:courseId', advancedCourseController.getCourseAnalytics);

// Gestión de estudiantes del curso
router.post('/students/:courseId', advancedCourseController.manageCourseStudents);

// Moderación de cursos (aprobar/rechazar)
router.post('/moderate/:courseId', advancedCourseController.moderateCourse);

module.exports = router;
