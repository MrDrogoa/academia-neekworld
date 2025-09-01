const admin = require('../config/firebase');
const { verifyToken } = require('../middlewares/authMiddleware');

const db = admin.firestore();

// Controlador avanzado para gestión de cursos - Día 3
class AdvancedCourseController {
  
  // Obtener dashboard de cursos para profesor/admin
  async getCourseDashboard(req, res) {
    try {
      const { role } = req.user;
      const userId = req.user.uid;

      let coursesQuery;
      if (role === 'admin') {
        // Admin ve todos los cursos
        coursesQuery = db.collection('courses');
      } else if (role === 'teacher') {
        // Profesor ve solo sus cursos
        coursesQuery = db.collection('courses').where('instructorId', '==', userId);
      } else {
        return res.status(403).json({ error: 'No autorizado para acceder al dashboard' });
      }

      const coursesSnapshot = await coursesQuery.get();
      const courses = [];
      
      for (const doc of coursesSnapshot.docs) {
        const courseData = doc.data();
        
        // Obtener estadísticas del curso
        const enrollmentsSnapshot = await db.collection('enrollments')
          .where('courseId', '==', doc.id)
          .get();
        
        const studentsCount = enrollmentsSnapshot.size;
        let completedCount = 0;
        let averageProgress = 0;
        let totalRevenue = 0;

        enrollmentsSnapshot.forEach(enrollDoc => {
          const enrollment = enrollDoc.data();
          if (enrollment.completed) completedCount++;
          averageProgress += enrollment.progress || 0;
          totalRevenue += enrollment.amountPaid || 0;
        });

        averageProgress = studentsCount > 0 ? averageProgress / studentsCount : 0;

        courses.push({
          id: doc.id,
          ...courseData,
          stats: {
            studentsCount,
            completedCount,
            averageProgress: Math.round(averageProgress),
            totalRevenue,
            completionRate: studentsCount > 0 ? Math.round((completedCount / studentsCount) * 100) : 0
          }
        });
      }

      res.json({
        courses,
        summary: {
          totalCourses: courses.length,
          totalStudents: courses.reduce((sum, course) => sum + course.stats.studentsCount, 0),
          totalRevenue: courses.reduce((sum, course) => sum + course.stats.totalRevenue, 0),
          avgCompletionRate: courses.length > 0 
            ? Math.round(courses.reduce((sum, course) => sum + course.stats.completionRate, 0) / courses.length)
            : 0
        }
      });
    } catch (error) {
      console.error('Error fetching course dashboard:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Crear nuevo curso con validaciones avanzadas
  async createAdvancedCourse(req, res) {
    try {
      const { role } = req.user;
      const instructorId = req.user.uid;

      if (role !== 'admin' && role !== 'teacher') {
        return res.status(403).json({ error: 'No autorizado para crear cursos' });
      }

      const {
        title,
        description,
        category,
        level,
        price,
        currency,
        duration,
        modules,
        prerequisites,
        learningObjectives,
        tags,
        thumbnail,
        trailerVideo,
        maxStudents,
        language,
        certificate
      } = req.body;

      // Validaciones
      if (!title || !description || !category || !level) {
        return res.status(400).json({ 
          error: 'Campos requeridos: title, description, category, level' 
        });
      }

      const courseData = {
        title: title.trim(),
        description: description.trim(),
        category,
        level,
        price: price || 0,
        currency: currency || 'CLP',
        duration: duration || 0,
        instructorId,
        modules: modules || [],
        prerequisites: prerequisites || [],
        learningObjectives: learningObjectives || [],
        tags: tags || [],
        thumbnail: thumbnail || '',
        trailerVideo: trailerVideo || '',
        maxStudents: maxStudents || null,
        language: language || 'es',
        certificate: certificate || false,
        status: role === 'admin' ? 'approved' : 'pending',
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
        enrollmentCount: 0,
        rating: 0,
        reviews: [],
        isActive: true
      };

      const docRef = await db.collection('courses').add(courseData);
      
      // Crear notificación para admin si es un profesor creando
      if (role === 'teacher') {
        await db.collection('notifications').add({
          title: 'Nuevo curso pendiente de aprobación',
          message: `El profesor ha creado un nuevo curso: "${title}"`,
          type: 'info',
          priority: 'medium',
          userId: 'all', // Para todos los admins
          category: 'course_approval',
          timestamp: admin.firestore.Timestamp.now(),
          read: false,
          courseId: docRef.id
        });
      }

      res.status(201).json({
        id: docRef.id,
        ...courseData,
        message: role === 'admin' ? 'Curso creado y aprobado' : 'Curso creado, pendiente de aprobación'
      });
    } catch (error) {
      console.error('Error creating advanced course:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Actualizar curso con historial de cambios
  async updateAdvancedCourse(req, res) {
    try {
      const { courseId } = req.params;
      const { role } = req.user;
      const userId = req.user.uid;

      const courseRef = db.collection('courses').doc(courseId);
      const courseDoc = await courseRef.get();

      if (!courseDoc.exists) {
        return res.status(404).json({ error: 'Curso no encontrado' });
      }

      const courseData = courseDoc.data();

      // Verificar permisos
      if (role !== 'admin' && courseData.instructorId !== userId) {
        return res.status(403).json({ error: 'No autorizado para editar este curso' });
      }

      const updates = req.body;
      
      // Campos que no se pueden editar directamente
      delete updates.instructorId;
      delete updates.createdAt;
      delete updates.enrollmentCount;
      delete updates.rating;
      delete updates.reviews;

      // Si no es admin, ciertos cambios requieren re-aprobación
      if (role !== 'admin' && courseData.status === 'approved') {
        const criticalFields = ['title', 'description', 'price', 'modules'];
        const hasCriticalChanges = criticalFields.some(field => 
          updates[field] && updates[field] !== courseData[field]
        );

        if (hasCriticalChanges) {
          updates.status = 'pending';
          
          // Notificar a admins sobre cambios críticos
          await db.collection('notifications').add({
            title: 'Curso modificado - Requiere re-aprobación',
            message: `El curso "${courseData.title}" ha sido modificado y requiere aprobación`,
            type: 'warning',
            priority: 'high',
            userId: 'all',
            category: 'course_approval',
            timestamp: admin.firestore.Timestamp.now(),
            read: false,
            courseId
          });
        }
      }

      updates.updatedAt = admin.firestore.Timestamp.now();

      // Guardar historial de cambios
      await db.collection('courseHistory').add({
        courseId,
        changes: updates,
        changedBy: userId,
        timestamp: admin.firestore.Timestamp.now(),
        previousData: courseData
      });

      await courseRef.update(updates);

      res.json({
        message: 'Curso actualizado exitosamente',
        courseId,
        status: updates.status || courseData.status
      });
    } catch (error) {
      console.error('Error updating advanced course:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Gestión de módulos del curso
  async manageCourseModules(req, res) {
    try {
      const { courseId } = req.params;
      const { action, moduleData, moduleId } = req.body;
      const { role } = req.user;
      const userId = req.user.uid;

      const courseRef = db.collection('courses').doc(courseId);
      const courseDoc = await courseRef.get();

      if (!courseDoc.exists) {
        return res.status(404).json({ error: 'Curso no encontrado' });
      }

      const courseData = courseDoc.data();

      // Verificar permisos
      if (role !== 'admin' && courseData.instructorId !== userId) {
        return res.status(403).json({ error: 'No autorizado para gestionar módulos' });
      }

      let modules = [...(courseData.modules || [])];

      switch (action) {
        case 'add':
          const newModule = {
            id: Date.now().toString(),
            title: moduleData.title,
            description: moduleData.description,
            lessons: moduleData.lessons || [],
            order: modules.length + 1,
            createdAt: new Date().toISOString()
          };
          modules.push(newModule);
          break;

        case 'update':
          const moduleIndex = modules.findIndex(m => m.id === moduleId);
          if (moduleIndex === -1) {
            return res.status(404).json({ error: 'Módulo no encontrado' });
          }
          modules[moduleIndex] = { ...modules[moduleIndex], ...moduleData };
          break;

        case 'delete':
          modules = modules.filter(m => m.id !== moduleId);
          break;

        case 'reorder':
          const { newOrder } = moduleData;
          modules = newOrder.map(id => modules.find(m => m.id === id)).filter(Boolean);
          break;

        default:
          return res.status(400).json({ error: 'Acción no válida' });
      }

      await courseRef.update({ 
        modules,
        updatedAt: admin.firestore.Timestamp.now()
      });

      res.json({
        message: 'Módulos actualizados exitosamente',
        modules
      });
    } catch (error) {
      console.error('Error managing course modules:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Analytics avanzados del curso
  async getCourseAnalytics(req, res) {
    try {
      const { courseId } = req.params;
      const { period = '30d' } = req.query;
      const { role } = req.user;
      const userId = req.user.uid;

      const courseRef = db.collection('courses').doc(courseId);
      const courseDoc = await courseRef.get();

      if (!courseDoc.exists) {
        return res.status(404).json({ error: 'Curso no encontrado' });
      }

      const courseData = courseDoc.data();

      // Verificar permisos
      if (role !== 'admin' && courseData.instructorId !== userId) {
        return res.status(403).json({ error: 'No autorizado para ver analytics' });
      }

      // Calcular fecha de inicio según el período
      const now = new Date();
      const periodDays = parseInt(period.replace('d', ''));
      const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000));

      // Obtener inscripciones en el período
      const enrollmentsSnapshot = await db.collection('enrollments')
        .where('courseId', '==', courseId)
        .where('enrolledAt', '>=', admin.firestore.Timestamp.fromDate(startDate))
        .get();

      // Obtener todas las inscripciones para estadísticas generales
      const allEnrollmentsSnapshot = await db.collection('enrollments')
        .where('courseId', '==', courseId)
        .get();

      // Calcular métricas
      const analytics = {
        period,
        totalEnrollments: allEnrollmentsSnapshot.size,
        newEnrollments: enrollmentsSnapshot.size,
        revenue: {
          total: 0,
          period: 0
        },
        completion: {
          completed: 0,
          inProgress: 0,
          notStarted: 0,
          averageProgress: 0
        },
        engagement: {
          activeStudents: 0,
          avgTimeSpent: 0,
          lessonsCompleted: 0
        },
        ratings: {
          average: courseData.rating || 0,
          count: courseData.reviews?.length || 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        }
      };

      let totalProgress = 0;
      let activeCount = 0;

      allEnrollmentsSnapshot.forEach(doc => {
        const enrollment = doc.data();
        analytics.revenue.total += enrollment.amountPaid || 0;
        
        if (enrollment.completed) {
          analytics.completion.completed++;
        } else if (enrollment.progress > 0) {
          analytics.completion.inProgress++;
        } else {
          analytics.completion.notStarted++;
        }

        totalProgress += enrollment.progress || 0;
        
        // Considerar activo si ha tenido actividad en los últimos 7 días
        const lastActivity = enrollment.lastActivityAt?.toDate();
        if (lastActivity && (now - lastActivity) < (7 * 24 * 60 * 60 * 1000)) {
          activeCount++;
        }
      });

      enrollmentsSnapshot.forEach(doc => {
        const enrollment = doc.data();
        analytics.revenue.period += enrollment.amountPaid || 0;
      });

      analytics.completion.averageProgress = allEnrollmentsSnapshot.size > 0 
        ? Math.round(totalProgress / allEnrollmentsSnapshot.size) 
        : 0;
      analytics.engagement.activeStudents = activeCount;

      // Calcular distribución de ratings
      if (courseData.reviews) {
        courseData.reviews.forEach(review => {
          const rating = Math.floor(review.rating);
          if (analytics.ratings.distribution[rating] !== undefined) {
            analytics.ratings.distribution[rating]++;
          }
        });
      }

      res.json(analytics);
    } catch (error) {
      console.error('Error fetching course analytics:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Gestión de estudiantes del curso
  async manageCourseStudents(req, res) {
    try {
      const { courseId } = req.params;
      const { action, studentId, data } = req.body;
      const { role } = req.user;
      const userId = req.user.uid;

      const courseRef = db.collection('courses').doc(courseId);
      const courseDoc = await courseRef.get();

      if (!courseDoc.exists) {
        return res.status(404).json({ error: 'Curso no encontrado' });
      }

      const courseData = courseDoc.data();

      // Verificar permisos
      if (role !== 'admin' && courseData.instructorId !== userId) {
        return res.status(403).json({ error: 'No autorizado para gestionar estudiantes' });
      }

      switch (action) {
        case 'remove':
          // Eliminar inscripción
          const enrollmentQuery = await db.collection('enrollments')
            .where('courseId', '==', courseId)
            .where('userId', '==', studentId)
            .limit(1)
            .get();

          if (!enrollmentQuery.empty) {
            await enrollmentQuery.docs[0].ref.delete();
            
            // Actualizar contador de inscripciones
            await courseRef.update({
              enrollmentCount: admin.firestore.FieldValue.increment(-1)
            });
          }
          break;

        case 'updateProgress':
          // Actualizar progreso del estudiante
          const enrollmentQuery2 = await db.collection('enrollments')
            .where('courseId', '==', courseId)
            .where('userId', '==', studentId)
            .limit(1)
            .get();

          if (!enrollmentQuery2.empty) {
            await enrollmentQuery2.docs[0].ref.update({
              progress: data.progress,
              completed: data.progress >= 100,
              updatedAt: admin.firestore.Timestamp.now()
            });
          }
          break;

        case 'grantAccess':
          // Inscripción manual gratuita
          await db.collection('enrollments').add({
            userId: studentId,
            courseId,
            enrolledAt: admin.firestore.Timestamp.now(),
            progress: 0,
            completed: false,
            amountPaid: 0,
            paymentMethod: 'manual_grant',
            grantedBy: userId
          });

          // Actualizar contador
          await courseRef.update({
            enrollmentCount: admin.firestore.FieldValue.increment(1)
          });
          break;

        default:
          return res.status(400).json({ error: 'Acción no válida' });
      }

      res.json({ message: 'Acción completada exitosamente' });
    } catch (error) {
      console.error('Error managing course students:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Aprobar/Rechazar cursos (solo admin)
  async moderateCourse(req, res) {
    try {
      const { courseId } = req.params;
      const { action, feedback } = req.body;
      const { role } = req.user;

      if (role !== 'admin') {
        return res.status(403).json({ error: 'Solo administradores pueden moderar cursos' });
      }

      const courseRef = db.collection('courses').doc(courseId);
      const courseDoc = await courseRef.get();

      if (!courseDoc.exists) {
        return res.status(404).json({ error: 'Curso no encontrado' });
      }

      const courseData = courseDoc.data();
      let newStatus;
      let notificationMessage;

      switch (action) {
        case 'approve':
          newStatus = 'approved';
          notificationMessage = `Tu curso "${courseData.title}" ha sido aprobado y publicado`;
          break;
        case 'reject':
          newStatus = 'rejected';
          notificationMessage = `Tu curso "${courseData.title}" ha sido rechazado. ${feedback || ''}`;
          break;
        default:
          return res.status(400).json({ error: 'Acción no válida' });
      }

      // Actualizar curso
      await courseRef.update({
        status: newStatus,
        moderatedAt: admin.firestore.Timestamp.now(),
        moderatedBy: req.user.uid,
        moderationFeedback: feedback || ''
      });

      // Notificar al instructor
      await db.collection('notifications').add({
        title: 'Estado del curso actualizado',
        message: notificationMessage,
        type: newStatus === 'approved' ? 'success' : 'warning',
        priority: 'high',
        userId: courseData.instructorId,
        category: 'course_moderation',
        timestamp: admin.firestore.Timestamp.now(),
        read: false,
        courseId
      });

      res.json({
        message: `Curso ${action === 'approve' ? 'aprobado' : 'rechazado'} exitosamente`,
        newStatus
      });
    } catch (error) {
      console.error('Error moderating course:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = new AdvancedCourseController();
