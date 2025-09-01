// Servicio para conectar con las APIs del backend para notificaciones
import axios from 'axios';

class BackendNotificationService {
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
        console.error('Notification API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  getAuthToken() {
    try {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    } catch (error) {
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

  async getNotifications(userId = null, limit = 20) {
    try {
      const currentUser = userId ? { id: userId } : this.getCurrentUser();
      const response = await this.api.get(`/notifications/user/${currentUser.id}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.log('Backend no disponible para notificaciones, usando datos locales');
      return this.getFallbackNotifications();
    }
  }

  async getUnreadCount(userId = null) {
    try {
      const currentUser = userId ? { id: userId } : this.getCurrentUser();
      const response = await this.api.get(`/notifications/unread/${currentUser.id}`);
      return response.data.count;
    } catch (error) {
      console.log('Backend no disponible para conteo, usando datos locales');
      return Math.floor(Math.random() * 5) + 1;
    }
  }

  async markAsRead(notificationId) {
    try {
      const response = await this.api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.log('Backend no disponible, simulando marcado como leído');
      return { message: 'Notificación marcada como leída (local)' };
    }
  }

  async markAllAsRead(userId = null) {
    try {
      const currentUser = userId ? { id: userId } : this.getCurrentUser();
      const response = await this.api.patch(`/notifications/read-all/${currentUser.id}`);
      return response.data;
    } catch (error) {
      console.log('Backend no disponible, simulando marcado masivo');
      return { message: 'Todas las notificaciones marcadas como leídas (local)' };
    }
  }

  async deleteNotification(notificationId) {
    try {
      const response = await this.api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.log('Backend no disponible, simulando eliminación');
      return { message: 'Notificación eliminada (local)' };
    }
  }

  async createNotification(notificationData) {
    try {
      const response = await this.api.post('/notifications', notificationData);
      return response.data;
    } catch (error) {
      console.log('Backend no disponible, simulando creación');
      return {
        id: Date.now(),
        ...notificationData,
        timestamp: new Date(),
        read: false
      };
    }
  }

  // Método de fallback con notificaciones simuladas
  getFallbackNotifications() {
    const currentUser = this.getCurrentUser();
    const demoNotifications = [];

    switch (currentUser.role) {
      case 'student':
        demoNotifications.push(
          {
            id: Date.now() + 1,
            title: 'Nuevo curso disponible',
            message: 'Se agregó "Vue.js Avanzado" a tu lista de cursos recomendados',
            type: 'info',
            priority: 'medium',
            read: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            userId: currentUser.id,
            category: 'course'
          },
          {
            id: Date.now() + 2,
            title: 'Evaluación pendiente',
            message: 'Tienes una evaluación pendiente en el curso "React Fundamentos"',
            type: 'warning',
            priority: 'high',
            read: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
            userId: currentUser.id,
            category: 'evaluation'
          }
        );
        break;

      case 'teacher':
        demoNotifications.push(
          {
            id: Date.now() + 1,
            title: 'Nuevo estudiante inscrito',
            message: '3 estudiantes se inscribieron en tu curso "JavaScript Avanzado"',
            type: 'success',
            priority: 'medium',
            read: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            userId: currentUser.id,
            category: 'enrollment'
          },
          {
            id: Date.now() + 2,
            title: 'Curso aprobado',
            message: 'Tu curso "Node.js Backend" ha sido aprobado y publicado',
            type: 'success',
            priority: 'high',
            read: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
            userId: currentUser.id,
            category: 'course_approval'
          }
        );
        break;

      case 'admin':
        demoNotifications.push(
          {
            id: Date.now() + 1,
            title: 'Cursos pendientes de aprobación',
            message: '5 cursos nuevos requieren tu revisión',
            type: 'warning',
            priority: 'high',
            read: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 45),
            userId: currentUser.id,
            category: 'approval'
          },
          {
            id: Date.now() + 2,
            title: 'Reporte de ventas disponible',
            message: 'El reporte mensual de ventas está listo para revisión',
            type: 'info',
            priority: 'medium',
            read: false,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
            userId: currentUser.id,
            category: 'report'
          }
        );
        break;

      default:
        demoNotifications.push({
          id: Date.now(),
          title: 'Bienvenido a la Academia',
          message: 'Explora nuestros cursos y comienza tu aprendizaje',
          type: 'info',
          priority: 'low',
          read: false,
          timestamp: new Date(),
          userId: 'guest',
          category: 'welcome'
        });
    }

    return demoNotifications;
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

  // Simulación de suscripción en tiempo real para notificaciones
  subscribe(callback) {
    const intervalId = setInterval(async () => {
      try {
        const notifications = await this.getNotifications();
        callback(notifications);
      } catch (error) {
        console.log('Error en suscripción, usando datos locales');
        callback(this.getFallbackNotifications());
      }
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(intervalId);
  }
}

export default new BackendNotificationService();
