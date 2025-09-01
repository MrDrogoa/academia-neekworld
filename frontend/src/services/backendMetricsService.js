// Servicio para conectar con las APIs del backend para métricas
import axios from 'axios';

class BackendMetricsService {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? 'https://us-central1-academy-bd619.cloudfunctions.net/api'
      : 'http://localhost:5006';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor para agregar token de autenticación
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar respuestas
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  getAuthToken() {
    try {
      // Intentar obtener token del localStorage o sessionStorage
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    } catch (error) {
      console.log('No auth token found');
      return null;
    }
  }

  getCurrentUser() {
    try {
      const store = window.$store;
      if (store && store.getters.currentUser) {
        return store.getters.currentUser;
      }

      const sessionUser = sessionStorage.getItem('currentUser');
      if (sessionUser) {
        return JSON.parse(sessionUser);
      }

      return {
        id: 'demo_user',
        role: 'student',
        name: 'Usuario Demo'
      };
    } catch (error) {
      return {
        id: 'demo_user',
        role: 'student',
        name: 'Usuario Demo'
      };
    }
  }

  async getStudentMetrics(userId) {
    try {
      const response = await this.api.get(`/metrics/student/${userId}`);
      return response.data;
    } catch (error) {
      console.log('Backend no disponible, usando datos locales');
      return this.getFallbackStudentMetrics();
    }
  }

  async getTeacherMetrics(teacherId) {
    try {
      const response = await this.api.get(`/metrics/teacher/${teacherId}`);
      return response.data;
    } catch (error) {
      console.log('Backend no disponible, usando datos locales');
      return this.getFallbackTeacherMetrics();
    }
  }

  async getAdminMetrics() {
    try {
      const response = await this.api.get('/metrics/admin');
      return response.data;
    } catch (error) {
      console.log('Backend no disponible, usando datos locales');
      return this.getFallbackAdminMetrics();
    }
  }

  async getMetricsByRole(userRole, userId) {
    try {
      const response = await this.api.get(`/metrics/role/${userRole}/${userId || ''}`);
      return response.data;
    } catch (error) {
      console.log('Backend no disponible, usando datos locales');
      switch (userRole) {
        case 'student':
          return this.getFallbackStudentMetrics();
        case 'teacher':
          return this.getFallbackTeacherMetrics();
        case 'admin':
          return this.getFallbackAdminMetrics();
        default:
          return this.getFallbackStudentMetrics();
      }
    }
  }

  // Métodos de fallback con datos simulados
  getFallbackStudentMetrics() {
    return {
      availableCoursesCount: 24 + Math.floor(Math.random() * 5),
      newCoursesThisWeek: 3 + Math.floor(Math.random() * 2),
      enrolledCoursesCount: 5 + Math.floor(Math.random() * 3),
      progressPercentage: 67 + Math.floor(Math.random() * 10),
      completedCoursesCount: 2 + Math.floor(Math.random() * 2),
      certificatesEarned: 2 + Math.floor(Math.random() * 2),
      studyTimeHours: 42 + Math.floor(Math.random() * 10),
      studyTimeThisWeek: 8 + Math.floor(Math.random() * 5)
    };
  }

  getFallbackTeacherMetrics() {
    return {
      teacherCoursesCount: 8 + Math.floor(Math.random() * 3),
      approvedCourses: 6 + Math.floor(Math.random() * 2),
      totalStudentsCount: 156 + Math.floor(Math.random() * 20),
      newStudentsThisMonth: 23 + Math.floor(Math.random() * 10),
      monthlyEarnings: 2450000 + Math.floor(Math.random() * 500000),
      earningsChange: 15.3 + (Math.random() * 10 - 5),
      averageRating: 4.8 + (Math.random() * 0.2 - 0.1)
    };
  }

  getFallbackAdminMetrics() {
    return {
      totalUsersCount: 1247 + Math.floor(Math.random() * 50),
      studentsCount: 1089 + Math.floor(Math.random() * 40),
      teachersCount: 147 + Math.floor(Math.random() * 10),
      publishedCoursesCount: 89 + Math.floor(Math.random() * 5),
      pendingApprovalCount: 12 + Math.floor(Math.random() * 5),
      monthlySales: 15680000 + Math.floor(Math.random() * 2000000),
      salesGrowth: 22.7 + (Math.random() * 10 - 5),
      pendingNotifications: 8 + Math.floor(Math.random() * 5),
      systemAlerts: 2 + Math.floor(Math.random() * 3)
    };
  }

  // Método para verificar conectividad con el backend
  async checkBackendConnectivity() {
    try {
      const response = await this.api.get('/health');
      return { connected: true, data: response.data };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }
}

export default new BackendMetricsService();
