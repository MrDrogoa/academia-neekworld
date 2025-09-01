<template>
  <div class="advanced-course-management">
    <!-- Header -->
    <v-app-bar color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-icon class="mr-2">mdi-school</v-icon>
        Gestión Avanzada de Cursos
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-bell" @click="showNotifications"></v-btn>
      <v-btn icon="mdi-help-circle" @click="showHelp"></v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="left"
    >
      <v-list>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard Principal"
          @click="currentView = 'dashboard'"
          :class="{ 'v-list-item--active': currentView === 'dashboard' }"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-plus-circle"
          title="Crear Curso"
          @click="createNewCourse"
        ></v-list-item>
        
        <v-divider></v-divider>
        
        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Analytics Global"
          @click="currentView = 'analytics'"
          :class="{ 'v-list-item--active': currentView === 'analytics' }"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-cog"
          title="Configuración"
          @click="currentView = 'settings'"
          :class="{ 'v-list-item--active': currentView === 'settings' }"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <!-- Dashboard Principal -->
        <div v-if="currentView === 'dashboard'">
          <CourseManagementDashboard />
        </div>

        <!-- Analytics Global -->
        <div v-else-if="currentView === 'analytics'">
          <GlobalAnalyticsView />
        </div>

        <!-- Configuración -->
        <div v-else-if="currentView === 'settings'">
          <CourseSettingsView />
        </div>
      </v-container>
    </v-main>

    <!-- FAB para acciones rápidas -->
    <v-fab
      icon="mdi-plus"
      color="primary"
      location="bottom end"
      app
      @click="showQuickActions = true"
    ></v-fab>

    <!-- Menu de acciones rápidas -->
    <v-dialog v-model="showQuickActions" max-width="400px">
      <v-card>
        <v-card-title>Acciones Rápidas</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item @click="createNewCourse">
              <template v-slot:prepend>
                <v-icon>mdi-plus-circle</v-icon>
              </template>
              <v-list-item-title>Crear Nuevo Curso</v-list-item-title>
            </v-list-item>
            
            <v-list-item @click="importCourse">
              <template v-slot:prepend>
                <v-icon>mdi-upload</v-icon>
              </template>
              <v-list-item-title>Importar Curso</v-list-item-title>
            </v-list-item>
            
            <v-list-item @click="bulkActions">
              <template v-slot:prepend>
                <v-icon>mdi-checkbox-multiple-marked</v-icon>
              </template>
              <v-list-item-title>Acciones en Lote</v-list-item-title>
            </v-list-item>
            
            <v-list-item @click="generateReport">
              <template v-slot:prepend>
                <v-icon>mdi-file-chart</v-icon>
              </template>
              <v-list-item-title>Generar Reporte</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showQuickActions = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notificaciones Toast -->
    <v-snackbar
      v-model="notification.show"
      :color="notification.color"
      :timeout="notification.timeout"
      location="top right"
    >
      {{ notification.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="notification.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import CourseManagementDashboard from '@/components/course/CourseManagementDashboard.vue'
import GlobalAnalyticsView from '@/components/course/GlobalAnalyticsView.vue'
import CourseSettingsView from '@/components/course/CourseSettingsView.vue'

export default {
  name: 'AdvancedCourseManagement',
  components: {
    CourseManagementDashboard,
    GlobalAnalyticsView,
    CourseSettingsView
  },
  data() {
    return {
      drawer: false,
      currentView: 'dashboard',
      showQuickActions: false,
      notification: {
        show: false,
        text: '',
        color: 'info',
        timeout: 3000
      }
    }
  },
  mounted() {
    // Configurar el sistema de notificaciones global
    this.setupNotificationSystem()
    
    // Verificar permisos de usuario
    this.checkUserPermissions()
  },
  methods: {
    setupNotificationSystem() {
      // Configurar toast global para todos los componentes hijos
      this.$toast = {
        success: (message) => this.showNotification(message, 'success'),
        error: (message) => this.showNotification(message, 'error'),
        info: (message) => this.showNotification(message, 'info'),
        warning: (message) => this.showNotification(message, 'warning')
      }
      
      // Hacer disponible globalmente
      this.provide('toast', this.$toast)
    },
    
    showNotification(text, color = 'info', timeout = 3000) {
      this.notification = {
        show: true,
        text,
        color,
        timeout
      }
    },
    
    checkUserPermissions() {
      // Verificar que el usuario tenga permisos para gestionar cursos
      const user = this.$store.getters.getCurrentUser
      if (!user || !['teacher', 'admin'].includes(user.role)) {
        this.$router.push('/dashboard')
        this.showNotification('No tienes permisos para acceder a esta sección', 'error')
      }
    },
    
    createNewCourse() {
      this.showQuickActions = false
      // El dashboard maneja la creación de cursos
      this.currentView = 'dashboard'
      // Emitir evento para abrir el dialog de creación
      this.$nextTick(() => {
        const dashboard = this.$refs.dashboard || this.findDashboardComponent()
        if (dashboard) {
          dashboard.showCreateDialog = true
        }
      })
    },
    
    findDashboardComponent() {
      // Buscar el componente dashboard en los hijos
      const findComponent = (children) => {
        for (let child of children) {
          if (child.$options.name === 'CourseManagementDashboard') {
            return child
          }
          if (child.$children) {
            const found = findComponent(child.$children)
            if (found) return found
          }
        }
        return null
      }
      return findComponent(this.$children || [])
    },
    
    importCourse() {
      this.showQuickActions = false
      this.showNotification('Función de importación - En desarrollo', 'info')
      // TODO: Implementar importación de cursos
    },
    
    bulkActions() {
      this.showQuickActions = false
      this.showNotification('Acciones en lote - En desarrollo', 'info')
      // TODO: Implementar acciones en lote
    },
    
    generateReport() {
      this.showQuickActions = false
      this.showNotification('Generando reporte...', 'info')
      
      // Simular generación de reporte
      setTimeout(() => {
        this.showNotification('Reporte generado exitosamente', 'success')
        // TODO: Implementar generación real de reportes
      }, 2000)
    },
    
    showNotifications() {
      this.showNotification('Panel de notificaciones - En desarrollo', 'info')
      // TODO: Implementar panel de notificaciones
    },
    
    showHelp() {
      this.showNotification('Panel de ayuda - En desarrollo', 'info')
      // TODO: Implementar sistema de ayuda
    }
  },
  
  // Proveer el sistema de toast a componentes hijos
  provide() {
    return {
      toast: {
        success: (message) => this.showNotification(message, 'success'),
        error: (message) => this.showNotification(message, 'error'),
        info: (message) => this.showNotification(message, 'info'),
        warning: (message) => this.showNotification(message, 'warning')
      }
    }
  }
}
</script>

<style scoped>
.advanced-course-management {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.v-list-item--active {
  background-color: rgba(25, 118, 210, 0.1);
  color: #1976D2;
}

.v-main {
  padding-top: 64px; /* Account for app bar */
}
</style>
