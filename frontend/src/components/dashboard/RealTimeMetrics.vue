<template>
  <v-row class="real-time-metrics mb-6">
    <!-- Métricas del Estudiante -->
    <template v-if="userRole === 'student'">
      <v-col cols="12" md="3">
        <v-card class="metric-card student-primary" elevation="3">
          <v-card-text class="text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-book-multiple</v-icon>
            <div class="metric-number">{{ studentMetrics.availableCoursesCount }}</div>
            <div class="metric-label">Cursos Disponibles</div>
            <v-chip size="small" color="info" class="mt-2">
              +{{ studentMetrics.newCoursesThisWeek }} esta semana
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card class="metric-card student-secondary" elevation="3">
          <v-card-text class="text-center">
            <v-icon size="48" color="success" class="mb-2">mdi-school</v-icon>
            <div class="metric-number">{{ studentMetrics.enrolledCoursesCount }}</div>
            <div class="metric-label">Mis Cursos</div>
            <v-progress-linear 
              :model-value="studentMetrics.progressPercentage" 
              color="success" 
              height="4" 
              class="mt-2"
            ></v-progress-linear>
            <div class="text-caption">{{ studentMetrics.progressPercentage }}% progreso</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card class="metric-card student-accent" elevation="3">
          <v-card-text class="text-center">
            <v-icon size="48" color="warning" class="mb-2">mdi-certificate</v-icon>
            <div class="metric-number">{{ studentMetrics.completedCoursesCount }}</div>
            <div class="metric-label">Completados</div>
            <div class="text-caption text-success">
              {{ studentMetrics.certificatesEarned }} certificados obtenidos
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card class="metric-card student-info" elevation="3">
          <v-card-text class="text-center">
            <v-icon size="48" color="info" class="mb-2">mdi-clock-time-eight</v-icon>
            <div class="metric-number">{{ studentMetrics.studyTimeHours }}</div>
            <div class="metric-label">Horas de Estudio</div>
            <div class="text-caption">{{ studentMetrics.studyTimeThisWeek }}h esta semana</div>
          </v-card-text>
        </v-card>
      </v-col>
    </template>

    <!-- Métricas del Profesor -->
    <template v-if="userRole === 'teacher'">
      <v-col cols="12" md="3">
        <v-card class="metric-card teacher-primary" elevation="3">
          <v-card-text class="text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-teach</v-icon>
            <div class="metric-number">{{ teacherMetrics.teacherCoursesCount }}</div>
            <div class="metric-label">Mis Cursos</div>
            <v-chip size="small" color="success" class="mt-2">
              {{ teacherMetrics.approvedCourses }} aprobados
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card class="metric-card teacher-secondary" elevation="3">
          <v-card-text class="text-center">
            <v-icon size="48" color="success" class="mb-2">mdi-account-group</v-icon>
            <div class="metric-number">{{ teacherMetrics.totalStudentsCount }}</div>
            <div class="metric-label">Total Estudiantes</div>
            <div class="text-caption text-success">
              +{{ teacherMetrics.newStudentsThisMonth }} este mes
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card class="metric-card teacher-accent" elevation="3">
          <v-card-text class="text-center">
            <v-icon size="48" color="warning" class="mb-2">mdi-currency-usd</v-icon>
            <div class="metric-number">${{ formatPrice(teacherMetrics.monthlyEarnings) }}</div>
            <div class="metric-label">Ingresos del Mes</div>
            <v-chip 
              size="small" 
              :color="teacherMetrics.earningsChange >= 0 ? 'success' : 'error'" 
              class="mt-2"
            >
              {{ teacherMetrics.earningsChange >= 0 ? '+' : '' }}{{ teacherMetrics.earningsChange }}%
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card class="metric-card teacher-info" elevation="3">
          <v-card-text class="text-center">
            <v-icon size="48" color="info" class="mb-2">mdi-star</v-icon>
            <div class="metric-number">{{ teacherMetrics.averageRating }}</div>
            <div class="metric-label">Calificación Promedio</div>
            <v-rating 
              :model-value="teacherMetrics.averageRating" 
              color="amber" 
              half-increments 
              readonly 
              size="small"
            ></v-rating>
          </v-card-text>
        </v-card>
      </v-col>
    </template>

    <!-- Métricas del Administrador -->
    <template v-if="userRole === 'admin'">
      <v-col cols="12" md="3">
        <v-card class="metric-card admin-primary" elevation="3">
          <v-card-text class="text-center">
            <v-icon size="48" color="primary" class="mb-2">mdi-account-multiple</v-icon>
            <div class="metric-number">{{ adminMetrics.totalUsersCount }}</div>
            <div class="metric-label">Total Usuarios</div>
            <div class="metric-breakdown">
              <span class="text-caption">{{ adminMetrics.studentsCount }} estudiantes</span>
              <span class="mx-1">•</span>
              <span class="text-caption">{{ adminMetrics.teachersCount }} profesores</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card class="metric-card admin-secondary" elevation="3">
          <v-card-text class="text-center">
            <v-icon size="48" color="success" class="mb-2">mdi-book-multiple</v-icon>
            <div class="metric-number">{{ adminMetrics.publishedCoursesCount }}</div>
            <div class="metric-label">Cursos Publicados</div>
            <v-chip size="small" color="warning" class="mt-2">
              {{ adminMetrics.pendingApprovalCount }} pendientes
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card class="metric-card admin-accent" elevation="3">
          <v-card-text class="text-center">
            <v-icon size="48" color="warning" class="mb-2">mdi-chart-line</v-icon>
            <div class="metric-number">${{ formatPrice(adminMetrics.monthlySales) }}</div>
            <div class="metric-label">Ventas del Mes</div>
            <v-chip 
              size="small" 
              :color="adminMetrics.salesGrowth >= 0 ? 'success' : 'error'" 
              class="mt-2"
            >
              {{ adminMetrics.salesGrowth >= 0 ? '+' : '' }}{{ adminMetrics.salesGrowth }}%
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card class="metric-card admin-info" elevation="3">
          <v-card-text class="text-center">
            <v-icon size="48" color="info" class="mb-2">mdi-bell</v-icon>
            <div class="metric-number">{{ adminMetrics.pendingNotifications }}</div>
            <div class="metric-label">Notificaciones</div>
            <div class="text-caption">{{ adminMetrics.systemAlerts }} alertas del sistema</div>
          </v-card-text>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import { formatPrice } from '@/utils/courseUtils';
import metricsService from '@/services/metricsService';
import { mapGetters } from 'vuex';

export default {
  name: 'RealTimeMetrics',
  props: {
    userRole: {
      type: String,
      required: true
    },
    metricsData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      updateInterval: null,
      lastUpdate: null,
      realTimeData: {},
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['getUser']),
    
    studentMetrics() {
      return {
        availableCoursesCount: this.realTimeData.availableCoursesCount || 0,
        newCoursesThisWeek: this.realTimeData.newCoursesThisWeek || 0,
        enrolledCoursesCount: this.realTimeData.enrolledCoursesCount || 0,
        progressPercentage: this.realTimeData.progressPercentage || 0,
        completedCoursesCount: this.realTimeData.completedCoursesCount || 0,
        certificatesEarned: this.realTimeData.certificatesEarned || 0,
        studyTimeHours: this.realTimeData.studyTimeHours || 0,
        studyTimeThisWeek: this.realTimeData.studyTimeThisWeek || 0
      }
    },
    teacherMetrics() {
      return {
        teacherCoursesCount: this.realTimeData.teacherCoursesCount || 0,
        approvedCourses: this.realTimeData.approvedCourses || 0,
        totalStudentsCount: this.realTimeData.totalStudentsCount || 0,
        newStudentsThisMonth: this.realTimeData.newStudentsThisMonth || 0,
        monthlyEarnings: this.realTimeData.monthlyEarnings || 0,
        earningsChange: this.realTimeData.earningsChange || 0,
        averageRating: this.realTimeData.averageRating || 0
      }
    },
    adminMetrics() {
      return {
        totalUsersCount: this.realTimeData.totalUsersCount || 0,
        studentsCount: this.realTimeData.studentsCount || 0,
        teachersCount: this.realTimeData.teachersCount || 0,
        publishedCoursesCount: this.realTimeData.publishedCoursesCount || 0,
        pendingApprovalCount: this.realTimeData.pendingApprovalCount || 0,
        monthlySales: this.realTimeData.monthlySales || 0,
        salesGrowth: this.realTimeData.salesGrowth || 0,
        pendingNotifications: this.realTimeData.pendingNotifications || 0,
        systemAlerts: this.realTimeData.systemAlerts || 0
      }
    }
  },
  async mounted() {
    await this.loadInitialMetrics();
    this.startRealTimeUpdates();
  },
  beforeUnmount() {
    this.stopRealTimeUpdates();
  },
  methods: {
    formatPrice,
    
    async loadInitialMetrics() {
      this.isLoading = true;
      try {
        const userId = this.getUser?.id || this.getUser?.uid;
        const metrics = await metricsService.getMetricsByRole(this.userRole, userId);
        this.realTimeData = { ...metrics };
        this.lastUpdate = new Date();
      } catch (error) {
        console.error('Error loading initial metrics:', error);
        // Fallback a datos mockeados si hay error
        this.loadFallbackData();
      } finally {
        this.isLoading = false;
      }
    },
    
    loadFallbackData() {
      const fallbackData = {
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
      
      this.realTimeData = fallbackData[this.userRole] || {};
    },
    
    startRealTimeUpdates() {
      // Actualizar métricas cada 30 segundos
      this.updateInterval = setInterval(() => {
        this.fetchLatestMetrics();
      }, 30000);
    },
    
    stopRealTimeUpdates() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
    },
    
    async fetchLatestMetrics() {
      try {
        const userId = this.getUser?.id || this.getUser?.uid;
        const freshMetrics = await metricsService.getMetricsByRole(this.userRole, userId);
        
        // Actualizar datos gradualmente para mostrar cambios
        this.realTimeData = { ...this.realTimeData, ...freshMetrics };
        
        this.$emit('metrics-updated', {
          timestamp: new Date(),
          role: this.userRole,
          data: freshMetrics
        });
      } catch (error) {
        console.error('Error fetching latest metrics:', error);
        // Simular pequeños cambios si hay error de conexión
        this.simulateMetricChanges();
      }
    },
    
    simulateMetricChanges() {
      // Simular pequeños cambios en tiempo real para mantener la demo viva
      if (this.userRole === 'student') {
        this.realTimeData.studyTimeThisWeek = Math.max(0, 
          this.realTimeData.studyTimeThisWeek + Math.floor(Math.random() * 2 - 0.5)
        );
        this.realTimeData.progressPercentage = Math.min(100, 
          Math.max(0, this.realTimeData.progressPercentage + Math.random() * 2 - 1)
        );
      } else if (this.userRole === 'teacher') {
        this.realTimeData.totalStudentsCount += Math.floor(Math.random() * 3 - 1);
        this.realTimeData.monthlyEarnings += Math.floor(Math.random() * 10000 - 5000);
      } else if (this.userRole === 'admin') {
        this.realTimeData.totalUsersCount += Math.floor(Math.random() * 2);
        this.realTimeData.monthlySales += Math.floor(Math.random() * 50000 - 25000);
      }
    }
  }
}
</script>

<style scoped>
.real-time-metrics {
  margin-bottom: 2rem;
}

.metric-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.metric-number {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  margin: 0.5rem 0;
}

.metric-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(0,0,0,0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-breakdown {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.8;
}

/* Colores específicos por rol */
.student-primary {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.student-secondary {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
}

.student-accent {
  background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%);
}

.student-info {
  background: linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%);
}

.teacher-primary {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
}

.teacher-secondary {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
}

.teacher-accent {
  background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
}

.teacher-info {
  background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
}

.admin-primary {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%);
}

.admin-secondary {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
}

.admin-accent {
  background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%);
}

.admin-info {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

@media (max-width: 960px) {
  .metric-number {
    font-size: 2rem;
  }
  
  .metric-label {
    font-size: 0.75rem;
  }
}
</style>
