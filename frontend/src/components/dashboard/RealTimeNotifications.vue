<template>
  <div class="notifications-container">
    <!-- Indicador de notificaciones -->
    <v-btn
      icon
      size="large"
      class="notification-bell"
      @click="toggleNotifications"
      :color="hasUnreadNotifications ? 'error' : 'default'"
    >
      <v-badge
        :content="unreadCount"
        :model-value="hasUnreadNotifications"
        color="error"
        offset-x="12"
        offset-y="12"
      >
        <v-icon>
          {{ hasUnreadNotifications ? 'mdi-bell-ring' : 'mdi-bell' }}
        </v-icon>
      </v-badge>
    </v-btn>

    <!-- Panel de notificaciones -->
    <v-menu
      v-model="showNotifications"
      :close-on-content-click="false"
      location="bottom end"
      origin="top end"
      max-width="400"
      min-width="350"
    >
      <v-card class="notifications-panel">
        <v-card-title class="d-flex justify-space-between align-center pa-4">
          <span class="text-h6">Notificaciones</span>
          <v-btn
            icon="mdi-check-all"
            size="small"
            color="primary"
            variant="text"
            @click="markAllAsRead"
            :disabled="!hasUnreadNotifications"
            title="Marcar todas como leídas"
          ></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pa-0" style="max-height: 400px; overflow-y: auto;">
          <v-list v-if="notifications.length > 0" density="compact">
            <template v-for="(notification, index) in notifications" :key="notification.id">
              <v-list-item
                :class="{ 'notification-unread': !notification.read }"
                @click="markAsRead(notification.id)"
              >
                <template v-slot:prepend>
                  <v-avatar :color="getNotificationColor(notification.type)" size="small">
                    <v-icon color="white" size="small">
                      {{ getNotificationIcon(notification.type) }}
                    </v-icon>
                  </v-avatar>
                </template>

                <v-list-item-title class="text-wrap">
                  {{ notification.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="text-wrap">
                  {{ notification.message }}
                </v-list-item-subtitle>

                <template v-slot:append>
                  <div class="d-flex flex-column align-end">
                    <span class="text-caption text-medium-emphasis">
                      {{ formatTimeAgo(notification.createdAt) }}
                    </span>
                    <v-chip
                      v-if="!notification.read"
                      size="x-small"
                      color="primary"
                      class="mt-1"
                    >
                      Nuevo
                    </v-chip>
                  </div>
                </template>
              </v-list-item>
              <v-divider v-if="index < notifications.length - 1"></v-divider>
            </template>
          </v-list>

          <div v-else class="pa-6 text-center">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-bell-off</v-icon>
            <p class="text-body-2 text-medium-emphasis">No tienes notificaciones</p>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-3">
          <v-btn
            block
            variant="text"
            color="primary"
            @click="goToNotificationsPage"
          >
            Ver todas las notificaciones
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

    <!-- Toast para nuevas notificaciones -->
    <v-snackbar
      v-model="showNewNotificationToast"
      :timeout="4000"
      color="success"
      location="top right"
      class="notification-toast"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-bell-ring</v-icon>
        <span>{{ lastNotification?.title }}</span>
      </div>
      
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showNewNotificationToast = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import notificationService from '@/services/notificationService';
import { mapGetters } from 'vuex';

export default {
  name: 'RealTimeNotifications',
  props: {
    userRole: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showNotifications: false,
      showNewNotificationToast: false,
      lastNotification: null,
      notifications: [],
      isLoading: false,
      unsubscribeCallback: null
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    
    unreadCount() {
      return this.notifications.filter(n => !n.read).length;
    },
    hasUnreadNotifications() {
      return this.unreadCount > 0;
    }
  },
  async mounted() {
    await this.loadNotifications();
    this.subscribeToRealTimeUpdates();
  },
  beforeUnmount() {
    this.cleanup();
  },
  methods: {
    async loadNotifications() {
      this.isLoading = true;
      try {
        const userId = this.getUser?.id || this.getUser?.uid || 'demo_user';
        const notifications = await notificationService.getUserNotifications(userId);
        this.notifications = notifications;
      } catch (error) {
        console.error('Error loading notifications:', error);
        // Usar notificaciones de fallback
        this.notifications = this.getFallbackNotifications();
      } finally {
        this.isLoading = false;
      }
    },
    
    subscribeToRealTimeUpdates() {
      const userId = this.getUser?.id || this.getUser?.uid || 'demo_user';
      
      this.unsubscribeCallback = notificationService.subscribeToNotifications(
        userId,
        (notifications) => {
          const oldCount = this.notifications.length;
          this.notifications = notifications;
          
          // Mostrar toast si hay una nueva notificación
          if (notifications.length > oldCount && notifications.length > 0) {
            this.lastNotification = notifications[0];
            this.showNewNotificationToast = true;
            this.$emit('new-notification', notifications[0]);
          }
        }
      );
    },
    
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    
    async markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        await notificationService.markAsRead(notificationId);
        this.$emit('notification-read', notificationId);
      }
    },
    
    async markAllAsRead() {
      const userId = this.getUser?.id || this.getUser?.uid || 'demo_user';
      
      this.notifications.forEach(notification => {
        notification.read = true;
      });
      
      await notificationService.markAllAsRead(userId);
      this.$emit('all-notifications-read');
    },
    
    goToNotificationsPage() {
      this.showNotifications = false;
      this.$router.push('/notifications');
    },
    
    getNotificationIcon(type) {
      const icons = {
        enrollment: 'mdi-school',
        course_approved: 'mdi-check-circle',
        payment: 'mdi-credit-card',
        system: 'mdi-cog',
        certificate: 'mdi-certificate',
        reminder: 'mdi-clock-alert',
        new_course: 'mdi-book-plus'
      };
      return icons[type] || 'mdi-information';
    },
    
    getNotificationColor(type) {
      const colors = {
        enrollment: 'success',
        course_approved: 'primary',
        payment: 'warning',
        system: 'info',
        certificate: 'purple',
        reminder: 'orange',
        new_course: 'teal'
      };
      return colors[type] || 'grey';
    },
    
    formatTimeAgo(date) {
      const now = new Date();
      const diffInMs = now - date;
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInMinutes < 1) return 'Ahora';
      if (diffInMinutes < 60) return `${diffInMinutes}m`;
      if (diffInHours < 24) return `${diffInHours}h`;
      if (diffInDays < 7) return `${diffInDays}d`;
      return date.toLocaleDateString('es-CL');
    },
    
    getFallbackNotifications() {
      return [
        {
          id: 1,
          type: 'enrollment',
          title: 'Inscripción exitosa',
          message: 'Te has inscrito exitosamente en el curso de Vue.js Avanzado',
          createdAt: new Date(Date.now() - 1000 * 60 * 5),
          read: false
        },
        {
          id: 2,
          type: 'course_approved',
          title: 'Curso aprobado',
          message: 'Tu curso "Introducción a Firebase" ha sido aprobado y publicado',
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          read: false
        },
        {
          id: 3,
          type: 'payment',
          title: 'Pago procesado',
          message: 'Tu pago de $29.990 ha sido procesado exitosamente',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          read: true
        }
      ];
    },
    
    cleanup() {
      if (this.unsubscribeCallback) {
        this.unsubscribeCallback();
        this.unsubscribeCallback = null;
      }
      notificationService.unsubscribeAll();
    }
  }
}
</script>

<style scoped>
.notification-bell {
  position: relative;
}

.notifications-panel {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.notification-unread {
  background-color: rgba(25, 118, 210, 0.04);
  border-left: 4px solid var(--v-theme-primary);
}

.notification-unread:hover {
  background-color: rgba(25, 118, 210, 0.08);
}

.notification-toast {
  z-index: 9999;
}

.notifications-container {
  position: relative;
}

/* Animación para nuevas notificaciones */
@keyframes notification-bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.notification-bell.has-new {
  animation: notification-bounce 2s infinite;
}

/* Estilos responsivos */
@media (max-width: 600px) {
  .notifications-panel {
    min-width: 300px;
    max-width: 300px;
  }
}
</style>
