// Servicio de notificaciones híbrido - usa backend y fallback local
// Simula notificaciones con datos inteligentes y persistencia local

import backendNotificationService from './backendNotificationService';

class NotificationService {
  constructor() {
    this.useBackend = true; // Activar/desactivar uso del backend
    this.listeners = [];
    this.localStorageKey = 'academia_notifications';
    this.init();
  }

  init() {
    // Cargar notificaciones desde localStorage
    this.notifications = this.loadFromStorage();
    
    // Si no hay notificaciones, crear algunas de demostración
    if (this.notifications.length === 0) {
      this.notifications = this.createDemoNotifications();
      this.saveToStorage();
    }

    // Simular nuevas notificaciones cada 30 segundos
    this.startSimulation();
  }

  createDemoNotifications() {
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
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
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
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
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
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
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
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
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
            timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
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
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
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

  startSimulation() {
    // Simular nuevas notificaciones cada 30 segundos para la demostración
    setInterval(() => {
      if (Math.random() < 0.3) { // 30% de probabilidad
        this.createRandomNotification();
      }
    }, 30000);
  }

  createRandomNotification() {
    const currentUser = this.getCurrentUser();
    const templates = this.getNotificationTemplates(currentUser.role);
    const template = templates[Math.floor(Math.random() * templates.length)];

    const notification = {
      id: Date.now(),
      ...template,
      timestamp: new Date(),
      userId: currentUser.id,
      read: false
    };

    this.notifications.unshift(notification);
    this.saveToStorage();
    this.notifyListeners();
  }

  getNotificationTemplates(role) {
    const templates = {
      student: [
        {
          title: 'Progreso actualizado',
          message: 'Has completado el 80% del curso actual',
          type: 'success',
          priority: 'medium',
          category: 'progress'
        },
        {
          title: 'Recordatorio de estudio',
          message: 'No olvides continuar con tus lecciones hoy',
          type: 'info',
          priority: 'low',
          category: 'reminder'
        }
      ],
      teacher: [
        {
          title: 'Nueva pregunta en el foro',
          message: 'Un estudiante hizo una pregunta en tu curso',
          type: 'info',
          priority: 'medium',
          category: 'forum'
        },
        {
          title: 'Evaluación completada',
          message: 'Un estudiante completó la evaluación final',
          type: 'success',
          priority: 'medium',
          category: 'evaluation'
        }
      ],
      admin: [
        {
          title: 'Nuevo usuario registrado',
          message: 'Se registró un nuevo profesor en la plataforma',
          type: 'info',
          priority: 'low',
          category: 'registration'
        },
        {
          title: 'Alerta del sistema',
          message: 'Uso de CPU elevado en el servidor principal',
          type: 'warning',
          priority: 'high',
          category: 'system'
        }
      ]
    };

    return templates[role] || templates.student;
  }

  // Métodos públicos de la API
  async getNotifications(userId = null) {
    // Intentar usar backend primero
    if (this.useBackend) {
      try {
        const backendNotifications = await backendNotificationService.getNotifications(userId);
        return backendNotifications;
      } catch (error) {
        console.log('Backend no disponible para notificaciones, usando datos locales');
      }
    }

    // Fallback a datos locales
    const currentUser = userId ? { id: userId } : this.getCurrentUser();
    return this.notifications
      .filter(n => n.userId === currentUser.id || n.userId === 'all')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getUnreadCount(userId = null) {
    // Intentar usar backend primero
    if (this.useBackend) {
      try {
        const count = await backendNotificationService.getUnreadCount(userId);
        return count;
      } catch (error) {
        console.log('Backend no disponible para conteo, usando datos locales');
      }
    }

    // Fallback a datos locales
    const notifications = await this.getNotifications(userId);
    return notifications.filter(n => !n.read).length;
  }

  async markAsRead(notificationId) {
    // Intentar usar backend primero
    if (this.useBackend) {
      try {
  await backendNotificationService.markAsRead(notificationId);
        this.notifyListeners(); // Notificar cambios localmente también
        return true;
      } catch (error) {
        console.log('Backend no disponible, marcando como leído localmente');
      }
    }

    // Fallback a datos locales
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  async markAllAsRead(userId = null) {
    const currentUser = userId ? { id: userId } : this.getCurrentUser();
    let updated = false;
    
    this.notifications.forEach(notification => {
      if ((notification.userId === currentUser.id || notification.userId === 'all') && !notification.read) {
        notification.read = true;
        updated = true;
      }
    });

    if (updated) {
      this.saveToStorage();
      this.notifyListeners();
    }
    return updated;
  }

  async deleteNotification(notificationId) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index > -1) {
      this.notifications.splice(index, 1);
      this.saveToStorage();
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Simulación de suscripción en tiempo real
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.notifications);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  // Métodos auxiliares
  getCurrentUser() {
    try {
      // Intentar obtener el usuario del store o sessionStorage
      const store = window.$store;
      if (store && store.getters.currentUser) {
        return store.getters.currentUser;
      }

      const sessionUser = sessionStorage.getItem('currentUser');
      if (sessionUser) {
        return JSON.parse(sessionUser);
      }

      // Usuario por defecto para la demostración
      return {
        id: 'demo_user_' + Date.now(),
        role: 'student',
        name: 'Usuario Demo'
      };
    } catch (error) {
      console.log('Usando usuario demo');
      return {
        id: 'demo_user',
        role: 'student',
        name: 'Usuario Demo'
      };
    }
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.localStorageKey);
      if (stored) {
        const notifications = JSON.parse(stored);
        // Convertir timestamps de string a Date
        return notifications.map(n => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
    }
    return [];
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }
}

export default new NotificationService();
