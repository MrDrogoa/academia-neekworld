// Servicio de métricas híbrido - usa backend y fallback local
// Simula datos reales con lógica inteligente

import backendMetricsService from './backendMetricsService';

class MetricsService {
  constructor() {
    this.useBackend = true; // Activar/desactivar uso del backend
    this.baseData = {
      student: {
        availableCoursesCount: 24,
        newCoursesThisWeek: 3,
        enrolledCoursesCount: 5,
        progressPercentage: 67,
        completedCoursesCount: 2,
        certificatesEarned: 2,
        studyTimeHours: 42,
        studyTimeThisWeek: 8
      },
      teacher: {
        teacherCoursesCount: 8,
        approvedCourses: 6,
        totalStudentsCount: 156,
        newStudentsThisMonth: 23,
        monthlyEarnings: 2450000,
        earningsChange: 15.3,
        averageRating: 4.8
      },
      admin: {
        totalUsersCount: 1247,
        studentsCount: 1089,
        teachersCount: 147,
        publishedCoursesCount: 89,
        pendingApprovalCount: 12,
        monthlySales: 15680000,
        salesGrowth: 22.7,
        pendingNotifications: 8,
        systemAlerts: 2
      }
    };
  }

  // Simular obtención de datos desde el store actual
  async getStudentMetrics() {
    // Intentar usar backend primero
    if (this.useBackend) {
      try {
        const currentUser = this.getCurrentUser();
        const backendData = await backendMetricsService.getStudentMetrics(currentUser.id);
        return backendData;
      } catch (error) {
        console.log('Backend no disponible, usando datos locales');
      }
    }

    try {
      // Simular datos del usuario desde store
      const enrolledCourses = this.getEnrolledCoursesFromStore();
      const allCourses = this.getAllCoursesFromStore();
      
      const metrics = {
        ...this.baseData.student,
        availableCoursesCount: allCourses.length || 24,
        enrolledCoursesCount: enrolledCourses.length || 5,
        progressPercentage: this.calculateProgress(enrolledCourses),
        completedCoursesCount: enrolledCourses.filter(c => c.progress === 100).length || 2
      };

      // Agregar variación temporal para simular tiempo real
      metrics.studyTimeThisWeek = this.baseData.student.studyTimeThisWeek + Math.floor(Math.random() * 3);
      metrics.progressPercentage = Math.min(100, metrics.progressPercentage + Math.random() * 2);

      return metrics;
    } catch (error) {
      console.log('Usando datos de demostración para métricas de estudiante');
      return this.baseData.student;
    }
  }

  async getTeacherMetrics() {
    // Intentar usar backend primero
    if (this.useBackend) {
      try {
        const currentUser = this.getCurrentUser();
        const backendData = await backendMetricsService.getTeacherMetrics(currentUser.id);
        return backendData;
      } catch (error) {
        console.log('Backend no disponible, usando datos locales');
      }
    }

    try {
      // Simular datos del profesor desde store
      const teacherCourses = this.getTeacherCoursesFromStore();
      
      const metrics = {
        ...this.baseData.teacher,
        teacherCoursesCount: teacherCourses.length || 8,
        approvedCourses: teacherCourses.filter(c => c.status === 'approved').length || 6
      };

      // Variación temporal
      metrics.totalStudentsCount = this.baseData.teacher.totalStudentsCount + Math.floor(Math.random() * 5);
      metrics.monthlyEarnings = this.baseData.teacher.monthlyEarnings + Math.floor(Math.random() * 100000);

      return metrics;
    } catch (error) {
      console.log('Usando datos de demostración para métricas de profesor');
      return this.baseData.teacher;
    }
  }

  async getAdminMetrics() {
    // Intentar usar backend primero
    if (this.useBackend) {
      try {
        const backendData = await backendMetricsService.getAdminMetrics();
        return backendData;
      } catch (error) {
        console.log('Backend no disponible, usando datos locales');
      }
    }

    try {
      // Simular datos administrativos
      const metrics = {
        ...this.baseData.admin
      };

      // Variación temporal para simular actividad
      metrics.totalUsersCount = this.baseData.admin.totalUsersCount + Math.floor(Math.random() * 10);
      metrics.monthlySales = this.baseData.admin.monthlySales + Math.floor(Math.random() * 500000);
      metrics.pendingNotifications = Math.max(0, this.baseData.admin.pendingNotifications + Math.floor(Math.random() * 3 - 1));

      return metrics;
    } catch (error) {
      console.log('Usando datos de demostración para métricas de admin');
      return this.baseData.admin;
    }
  }

  async getMetricsByRole(userRole) {
    // Intentar usar backend primero
    if (this.useBackend) {
      try {
        const currentUser = this.getCurrentUser();
        const backendData = await backendMetricsService.getMetricsByRole(userRole, currentUser.id);
        return backendData;
      } catch (error) {
        console.log('Backend no disponible, usando datos locales');
      }
    }

    switch (userRole) {
      case 'student':
        return await this.getStudentMetrics();
      case 'teacher':
        return await this.getTeacherMetrics();
      case 'admin':
        return await this.getAdminMetrics();
      default:
        return this.baseData.student;
    }
  }

  // Métodos auxiliares para simular datos del store
  getEnrolledCoursesFromStore() {
    try {
      // Intentar obtener datos del store de Vuex
      const store = window.$store || {};
      return store.getters?.enrolledCourses || [];
    } catch (error) {
      return [];
    }
  }

  getAllCoursesFromStore() {
    try {
      const store = window.$store || {};
      return store.getters?.allCourses || [];
    } catch (error) {
      return [];
    }
  }

  getTeacherCoursesFromStore() {
    try {
      const store = window.$store || {};
      return store.getters?.teacherCourses || [];
    } catch (error) {
      return [];
    }
  }

  calculateProgress(courses) {
    if (!courses || courses.length === 0) return 67;
    
    const totalProgress = courses.reduce((sum, course) => sum + (course.progress || 0), 0);
    return Math.round(totalProgress / courses.length);
  }
}

export default new MetricsService();
