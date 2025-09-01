const express = require('express');
const router = express.Router();
const admin = require('../config/firebase');
const { verifyToken } = require('../middlewares/authMiddleware');

const db = admin.firestore();

// Obtener métricas de estudiante
router.get('/student/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verificar que el usuario solicita sus propias métricas o es admin
    if (req.user.uid !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para ver estas métricas' });
    }

    const metrics = {
      availableCoursesCount: 0,
      newCoursesThisWeek: 0,
      enrolledCoursesCount: 0,
      progressPercentage: 0,
      completedCoursesCount: 0,
      certificatesEarned: 0,
      studyTimeHours: 0,
      studyTimeThisWeek: 0
    };

    // Obtener todos los cursos disponibles
    const coursesSnapshot = await db.collection('courses').get();
    metrics.availableCoursesCount = coursesSnapshot.size;

    // Obtener cursos nuevos (última semana)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const newCoursesSnapshot = await db.collection('courses')
      .where('createdAt', '>=', oneWeekAgo)
      .get();
    metrics.newCoursesThisWeek = newCoursesSnapshot.size;

    // Obtener inscripciones del estudiante
    const enrollmentsSnapshot = await db.collection('enrollments')
      .where('userId', '==', userId)
      .get();
    metrics.enrolledCoursesCount = enrollmentsSnapshot.size;

    // Calcular progreso y cursos completados
    let totalProgress = 0;
    let completedCount = 0;
    
    enrollmentsSnapshot.forEach(doc => {
      const enrollment = doc.data();
      totalProgress += enrollment.progress || 0;
      if (enrollment.completed) {
        completedCount++;
      }
    });

    metrics.completedCoursesCount = completedCount;
    metrics.progressPercentage = enrollmentsSnapshot.size > 0 
      ? Math.round(totalProgress / enrollmentsSnapshot.size) 
      : 0;

    // Obtener certificados
    const certificatesSnapshot = await db.collection('certificates')
      .where('userId', '==', userId)
      .get();
    metrics.certificatesEarned = certificatesSnapshot.size;

    // Simular horas de estudio (en implementación real vendría de analytics)
    metrics.studyTimeHours = Math.floor(Math.random() * 50) + 20;
    metrics.studyTimeThisWeek = Math.floor(Math.random() * 15) + 5;

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching student metrics:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener métricas de profesor
router.get('/teacher/:teacherId', verifyToken, async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    // Verificar que el usuario solicita sus propias métricas o es admin
    if (req.user.uid !== teacherId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para ver estas métricas' });
    }

    const metrics = {
      teacherCoursesCount: 0,
      approvedCourses: 0,
      totalStudentsCount: 0,
      newStudentsThisMonth: 0,
      monthlyEarnings: 0,
      earningsChange: 0,
      averageRating: 0
    };

    // Obtener cursos del profesor
    const teacherCoursesSnapshot = await db.collection('courses')
      .where('instructorId', '==', teacherId)
      .get();
    metrics.teacherCoursesCount = teacherCoursesSnapshot.size;

    // Contar cursos aprobados
    let approvedCount = 0;
    let totalStudents = 0;
    let totalRating = 0;
    let ratingCount = 0;

    for (const doc of teacherCoursesSnapshot.docs) {
      const course = doc.data();
      if (course.status === 'approved') {
        approvedCount++;
      }

      // Contar estudiantes inscritos en cada curso
      const enrollmentsSnapshot = await db.collection('enrollments')
        .where('courseId', '==', doc.id)
        .get();
      totalStudents += enrollmentsSnapshot.size;

      // Calcular rating promedio
      if (course.ratings && course.ratings.length > 0) {
        course.ratings.forEach(rating => {
          totalRating += rating.value;
          ratingCount++;
        });
      }
    }

    metrics.approvedCourses = approvedCount;
    metrics.totalStudentsCount = totalStudents;
    metrics.averageRating = ratingCount > 0 
      ? Math.round((totalRating / ratingCount) * 10) / 10 
      : 4.5;

    // Obtener ventas del mes actual
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const salesSnapshot = await db.collection('sales')
      .where('instructorId', '==', teacherId)
      .where('createdAt', '>=', firstDayOfMonth)
      .get();
    
    let monthlyTotal = 0;
    salesSnapshot.forEach(doc => {
      const sale = doc.data();
      monthlyTotal += sale.amount || 0;
    });
    metrics.monthlyEarnings = monthlyTotal;

    // Simular cambio de ganancias
    metrics.earningsChange = Math.floor(Math.random() * 30) - 5; // -5% a +25%
    metrics.newStudentsThisMonth = Math.floor(Math.random() * 30) + 10;

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching teacher metrics:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener métricas de administrador
router.get('/admin', verifyToken, async (req, res) => {
  try {
    // Verificar que el usuario es admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para ver métricas de admin' });
    }

    const metrics = {
      totalUsersCount: 0,
      studentsCount: 0,
      teachersCount: 0,
      publishedCoursesCount: 0,
      pendingApprovalCount: 0,
      monthlySales: 0,
      salesGrowth: 0,
      pendingNotifications: 0,
      systemAlerts: 0
    };

    // Obtener conteo de usuarios por rol
    const usersSnapshot = await db.collection('users').get();
    let students = 0;
    let teachers = 0;
    
    usersSnapshot.forEach(doc => {
      const user = doc.data();
      if (user.role === 'student') students++;
      else if (user.role === 'teacher') teachers++;
    });

    metrics.totalUsersCount = usersSnapshot.size;
    metrics.studentsCount = students;
    metrics.teachersCount = teachers;

    // Obtener cursos publicados y pendientes
    const coursesSnapshot = await db.collection('courses').get();
    let published = 0;
    let pending = 0;

    coursesSnapshot.forEach(doc => {
      const course = doc.data();
      if (course.status === 'approved') published++;
      else if (course.status === 'pending') pending++;
    });

    metrics.publishedCoursesCount = published;
    metrics.pendingApprovalCount = pending;

    // Obtener ventas del mes
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const salesSnapshot = await db.collection('sales')
      .where('createdAt', '>=', firstDayOfMonth)
      .get();
    
    let monthlyTotal = 0;
    salesSnapshot.forEach(doc => {
      const sale = doc.data();
      monthlyTotal += sale.amount || 0;
    });
    metrics.monthlySales = monthlyTotal;

    // Simular crecimiento de ventas y notificaciones
    metrics.salesGrowth = Math.floor(Math.random() * 40) + 5; // 5% a 45%
    metrics.pendingNotifications = Math.floor(Math.random() * 15) + 3;
    metrics.systemAlerts = Math.floor(Math.random() * 5);

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener métricas según el rol del usuario
router.get('/role/:role/:userId?', verifyToken, async (req, res) => {
  try {
    const { role, userId } = req.params;
    
    switch (role) {
      case 'student':
        if (!userId) {
          return res.status(400).json({ error: 'userId requerido para métricas de estudiante' });
        }
        return req.params.userId = userId, await router.handle(req, res, () => {});
      case 'teacher':
        if (!userId) {
          return res.status(400).json({ error: 'teacherId requerido para métricas de profesor' });
        }
        return req.params.teacherId = userId, await router.handle(req, res, () => {});
      case 'admin':
        return await router.handle(req, res, () => {});
      default:
        return res.status(400).json({ error: 'Rol no válido' });
    }
  } catch (error) {
    console.error('Error fetching metrics by role:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
