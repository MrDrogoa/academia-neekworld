<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title>
            <v-icon left>mdi-chart-line</v-icon>
            Analytics Global
          </v-card-title>
          <v-card-subtitle>
            Resumen de rendimiento de todos tus cursos
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- Métricas principales -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card color="primary" variant="tonal">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-3">mdi-school</v-icon>
              <div>
                <div class="text-h4">{{ metrics.totalCourses }}</div>
                <div class="text-caption">Total de Cursos</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card color="success" variant="tonal">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-3">mdi-account-group</v-icon>
              <div>
                <div class="text-h4">{{ metrics.totalStudents }}</div>
                <div class="text-caption">Estudiantes Totales</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card color="info" variant="tonal">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-3">mdi-cash</v-icon>
              <div>
                <div class="text-h4">${{ formatCurrency(metrics.totalRevenue) }}</div>
                <div class="text-caption">Ingresos Totales</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="3">
        <v-card color="warning" variant="tonal">
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-3">mdi-star</v-icon>
              <div>
                <div class="text-h4">{{ metrics.averageRating.toFixed(1) }}</div>
                <div class="text-caption">Calificación Promedio</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtros de tiempo -->
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="timeFilter"
          :items="timeFilterOptions"
          label="Período de tiempo"
          @update:model-value="updateCharts"
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="courseFilter"
          :items="courseFilterOptions"
          label="Filtrar por curso"
          clearable
          @update:model-value="updateCharts"
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn
          @click="exportAnalytics"
          prepend-icon="mdi-download"
          variant="outlined"
          block
        >
          Exportar Datos
        </v-btn>
      </v-col>
    </v-row>

    <!-- Gráficos principales -->
    <v-row>
      <!-- Ingresos en el tiempo -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Ingresos por Mes</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <canvas ref="revenueChart"></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Inscripciones en el tiempo -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Inscripciones por Mes</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <canvas ref="enrollmentChart"></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Top cursos por ingresos -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Top Cursos por Ingresos</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <canvas ref="topCoursesChart"></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Distribución por categorías -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Distribución por Categorías</v-card-title>
          <v-card-text>
            <div class="chart-container">
              <canvas ref="categoriesChart"></canvas>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Tablas de detalles -->
    <v-row>
      <!-- Rendimiento por curso -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Rendimiento Detallado por Curso</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="courseHeaders"
              :items="coursePerformance"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:[`item.revenue`]="{ item }">
                <span class="text-success font-weight-bold">
                  ${{ formatCurrency(item.revenue) }}
                </span>
              </template>
              
              <template v-slot:[`item.rating`]="{ item }">
                <div class="d-flex align-center">
                  <v-rating
                    :model-value="item.rating"
                    readonly
                    density="compact"
                    size="small"
                    class="mr-2"
                  ></v-rating>
                  <span>{{ item.rating.toFixed(1) }}</span>
                </div>
              </template>
              
              <template v-slot:[`item.trend`]="{ item }">
                <v-chip
                  :color="getTrendColor(item.trend)"
                  size="small"
                >
                  <v-icon start :icon="getTrendIcon(item.trend)"></v-icon>
                  {{ item.trend }}%
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Actividad reciente -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Actividad Reciente</v-card-title>
          <v-card-text>
            <v-timeline density="compact">
              <v-timeline-item
                v-for="(activity, index) in recentActivity"
                :key="index"
                :dot-color="getActivityColor(activity.type)"
                size="small"
              >
                <template v-slot:icon>
                  <v-icon size="small">{{ getActivityIcon(activity.type) }}</v-icon>
                </template>
                
                <div>
                  <div class="font-weight-medium">{{ activity.title }}</div>
                  <div class="text-caption text-grey">{{ activity.description }}</div>
                  <div class="text-caption">{{ formatDate(activity.timestamp) }}</div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'GlobalAnalyticsView',
  data() {
    return {
      loading: false,
      timeFilter: 'last-6-months',
      courseFilter: null,
      metrics: {
        totalCourses: 12,
        totalStudents: 356,
        totalRevenue: 8945200,
        averageRating: 4.3
      },
      revenueChart: null,
      enrollmentChart: null,
      topCoursesChart: null,
      categoriesChart: null,
      timeFilterOptions: [
        { title: 'Últimos 3 meses', value: 'last-3-months' },
        { title: 'Últimos 6 meses', value: 'last-6-months' },
        { title: 'Último año', value: 'last-year' },
        { title: 'Todo el tiempo', value: 'all-time' }
      ],
      courseFilterOptions: [
        { title: 'Todos los cursos', value: null },
        { title: 'Vue.js Avanzado', value: 'vue-advanced' },
        { title: 'Diseño UX/UI', value: 'ux-ui-design' },
        { title: 'JavaScript Moderno', value: 'modern-js' }
      ],
      courseHeaders: [
        { title: 'Curso', key: 'title', sortable: true },
        { title: 'Estudiantes', key: 'students', sortable: true },
        { title: 'Ingresos', key: 'revenue', sortable: true },
        { title: 'Calificación', key: 'rating', sortable: true },
        { title: 'Tendencia', key: 'trend', sortable: true }
      ],
      coursePerformance: [
        {
          title: 'Vue.js Avanzado',
          students: 45,
          revenue: 4049550,
          rating: 4.5,
          trend: 12
        },
        {
          title: 'Diseño UX/UI Profesional',
          students: 32,
          revenue: 2559680,
          rating: 4.3,
          trend: -3
        },
        {
          title: 'JavaScript Moderno',
          students: 67,
          revenue: 2335970,
          rating: 4.1,
          trend: 8
        }
      ],
      recentActivity: [
        {
          type: 'course-created',
          title: 'Nuevo curso creado',
          description: 'React Native para Principiantes',
          timestamp: new Date()
        },
        {
          type: 'high-enrollment',
          title: 'Alta demanda',
          description: 'Vue.js Avanzado superó 40 inscripciones',
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          type: 'milestone',
          title: 'Hito alcanzado',
          description: 'Total de estudiantes superó los 350',
          timestamp: new Date(Date.now() - 7200000)
        },
        {
          type: 'rating',
          title: 'Nueva reseña 5 estrellas',
          description: 'Diseño UX/UI Profesional',
          timestamp: new Date(Date.now() - 10800000)
        }
      ]
    }
  },
  mounted() {
    this.loadAnalytics()
  },
  beforeUnmount() {
    this.destroyCharts()
  },
  methods: {
    async loadAnalytics() {
      this.loading = true
      try {
        // Cargar datos de analytics
        await this.loadGlobalMetrics()
        this.$nextTick(() => {
          this.createCharts()
        })
      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        this.loading = false
      }
    },
    
    async loadGlobalMetrics() {
      // En una implementación real, esto cargaría datos del backend
      // Por ahora usamos datos simulados
      this.metrics = {
        totalCourses: 12,
        totalStudents: 356,
        totalRevenue: 8945200,
        averageRating: 4.3
      }
    },
    
    createCharts() {
      this.destroyCharts()
      this.$nextTick(() => {
        this.createRevenueChart()
        this.createEnrollmentChart()
        this.createTopCoursesChart()
        this.createCategoriesChart()
      })
    },
    
    createRevenueChart() {
      if (!this.$refs.revenueChart) return
      
      const ctx = this.$refs.revenueChart.getContext('2d')
      
      this.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [{
            label: 'Ingresos',
            data: [1200000, 1450000, 1680000, 1320000, 1890000, 2100000],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + (value / 1000000).toFixed(1) + 'M'
                }
              }
            }
          }
        }
      })
    },
    
    createEnrollmentChart() {
      if (!this.$refs.enrollmentChart) return
      
      const ctx = this.$refs.enrollmentChart.getContext('2d')
      
      this.enrollmentChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [{
            label: 'Inscripciones',
            data: [45, 52, 48, 61, 55, 67],
            backgroundColor: '#2196F3',
            borderColor: '#1976D2',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    },
    
    createTopCoursesChart() {
      if (!this.$refs.topCoursesChart) return
      
      const ctx = this.$refs.topCoursesChart.getContext('2d')
      
      this.topCoursesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Vue.js Avanzado', 'Diseño UX/UI', 'JavaScript Moderno', 'React Básico'],
          datasets: [{
            data: [4049550, 2559680, 2335970, 1800000],
            backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    },
    
    createCategoriesChart() {
      if (!this.$refs.categoriesChart) return
      
      const ctx = this.$refs.categoriesChart.getContext('2d')
      
      this.categoriesChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Programación', 'Diseño', 'Marketing', 'Negocios'],
          datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#E91E63']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      })
    },
    
    destroyCharts() {
      const charts = [
        'revenueChart',
        'enrollmentChart', 
        'topCoursesChart',
        'categoriesChart'
      ]
      
      charts.forEach(chartName => {
        if (this[chartName]) {
          this[chartName].destroy()
          this[chartName] = null
        }
      })
    },
    
    updateCharts() {
      // Actualizar gráficos basado en filtros
      this.createCharts()
    },
    
    getTrendColor(trend) {
      return trend > 0 ? 'success' : trend < 0 ? 'error' : 'info'
    },
    
    getTrendIcon(trend) {
      return trend > 0 ? 'mdi-trending-up' : trend < 0 ? 'mdi-trending-down' : 'mdi-trending-neutral'
    },
    
    getActivityColor(type) {
      const colors = {
        'course-created': 'primary',
        'high-enrollment': 'success',
        'milestone': 'warning',
        'rating': 'info'
      }
      return colors[type] || 'grey'
    },
    
    getActivityIcon(type) {
      const icons = {
        'course-created': 'mdi-plus-circle',
        'high-enrollment': 'mdi-trending-up',
        'milestone': 'mdi-trophy',
        'rating': 'mdi-star'
      }
      return icons[type] || 'mdi-circle'
    },
    
    formatCurrency(amount) {
      return new Intl.NumberFormat('es-CL').format(amount || 0)
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('es-CL', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(date))
    },
    
    exportAnalytics() {
      const data = {
        metrics: this.metrics,
        coursePerformance: this.coursePerformance,
        timeFilter: this.timeFilter,
        courseFilter: this.courseFilter,
        exportedAt: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-global-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      this.$toast?.success('Analytics exportados exitosamente')
    }
  }
}
</script>

<style scoped>
.chart-container {
  height: 300px;
  position: relative;
}
</style>
