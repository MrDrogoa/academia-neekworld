<template>
  <v-dialog
    v-model="dialog"
    max-width="1200px"
    scrollable
  >
    <v-card>
      <v-card-title>
        <div class="d-flex align-center">
          <v-icon class="mr-3">mdi-chart-line</v-icon>
          <div>
            <div class="text-h5">Analytics del Curso</div>
            <div class="text-subtitle-1 text-grey">{{ course?.title }}</div>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            @click="closeDialog"
          ></v-btn>
        </div>
      </v-card-title>

      <v-card-text v-if="analytics">
        <!-- Resumen General -->
        <v-row class="mb-6">
          <v-col cols="12" md="3">
            <v-card color="primary" variant="tonal">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="40" class="mr-3">mdi-account-group</v-icon>
                  <div>
                    <div class="text-h4">{{ analytics.overview.totalStudents }}</div>
                    <div class="text-caption">Estudiantes Inscritos</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="3">
            <v-card color="success" variant="tonal">
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon size="40" class="mr-3">mdi-progress-check</v-icon>
                  <div>
                    <div class="text-h4">{{ analytics.overview.completionRate }}%</div>
                    <div class="text-caption">Tasa de Finalización</div>
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
                    <div class="text-h4">{{ analytics.overview.averageRating.toFixed(1) }}</div>
                    <div class="text-caption">Calificación Promedio</div>
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
                    <div class="text-h4">${{ formatCurrency(analytics.overview.totalRevenue) }}</div>
                    <div class="text-caption">Ingresos Generados</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Gráficos -->
        <v-row>
          <!-- Estudiantes en el tiempo -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                <v-icon class="mr-2">mdi-trending-up</v-icon>
                Inscripciones por Mes
              </v-card-title>
              <v-card-text>
                <div class="chart-container">
                  <canvas ref="studentsChart"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Ingresos en el tiempo -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                <v-icon class="mr-2">mdi-cash-multiple</v-icon>
                Ingresos por Mes
              </v-card-title>
              <v-card-text>
                <div class="chart-container">
                  <canvas ref="revenueChart"></canvas>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Módulos más populares -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                <v-icon class="mr-2">mdi-book-multiple</v-icon>
                Módulos Más Populares
              </v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item
                    v-for="module in analytics.topModules"
                    :key="module.name"
                  >
                    <template v-slot:prepend>
                      <v-avatar color="primary" size="small">
                        <span class="text-white">{{ module.name.charAt(0) }}</span>
                      </v-avatar>
                    </template>
                    
                    <v-list-item-title>{{ module.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ module.views }} visualizaciones
                    </v-list-item-subtitle>
                    
                    <template v-slot:append>
                      <div class="text-center">
                        <v-rating
                          :model-value="module.rating"
                          readonly
                          density="compact"
                          size="small"
                        ></v-rating>
                        <div class="text-caption">{{ module.rating }}/5</div>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Tasas de finalización por módulo -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>
                <v-icon class="mr-2">mdi-progress-check</v-icon>
                Finalización por Módulo
              </v-card-title>
              <v-card-text>
                <div v-for="completion in analytics.completionRates" :key="completion.module" class="mb-3">
                  <div class="d-flex justify-space-between mb-1">
                    <span class="text-body-2">{{ completion.module }}</span>
                    <span class="text-body-2 font-weight-bold">{{ completion.rate }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="completion.rate"
                    :color="getCompletionColor(completion.rate)"
                    height="8"
                    rounded
                  ></v-progress-linear>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Actividad reciente -->
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-icon class="mr-2">mdi-clock-outline</v-icon>
                Actividad Reciente
              </v-card-title>
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
                    
                    <div class="d-flex justify-space-between">
                      <div>
                        <div class="font-weight-medium">{{ activity.title }}</div>
                        <div class="text-caption text-grey">{{ activity.description }}</div>
                      </div>
                      <div class="text-caption">{{ formatDate(activity.timestamp) }}</div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-else-if="loading">
        <div class="text-center py-8">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
          <div class="mt-4">Cargando analytics...</div>
        </div>
      </v-card-text>

      <v-card-text v-else>
        <v-alert type="info" class="ma-4">
          No hay datos de analytics disponibles para este curso.
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="refreshAnalytics"
          :loading="loading"
          prepend-icon="mdi-refresh"
        >
          Actualizar
        </v-btn>
        <v-btn
          @click="exportAnalytics"
          prepend-icon="mdi-download"
          variant="outlined"
        >
          Exportar
        </v-btn>
        <v-btn @click="closeDialog">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Chart from 'chart.js/auto'
import courseManagementService from '@/services/courseManagementService'

export default {
  name: 'CourseAnalyticsDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    course: {
      type: Object,
      default: null
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      loading: false,
      analytics: null,
      studentsChart: null,
      revenueChart: null,
      recentActivity: [
        {
          type: 'enrollment',
          title: 'Nueva inscripción',
          description: 'María González se inscribió al curso',
          timestamp: new Date()
        },
        {
          type: 'completion',
          title: 'Módulo completado',
          description: 'Carlos Ruiz completó "Introducción a Vue.js"',
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          type: 'review',
          title: 'Nueva reseña',
          description: 'Ana Silva dejó una reseña de 5 estrellas',
          timestamp: new Date(Date.now() - 7200000)
        },
        {
          type: 'question',
          title: 'Nueva pregunta',
          description: 'Luis Martín hizo una pregunta en el módulo 2',
          timestamp: new Date(Date.now() - 10800000)
        }
      ]
    }
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  watch: {
    dialog(isOpen) {
      if (isOpen && this.course) {
        this.loadAnalytics()
      }
    },
    course: {
      handler(newCourse) {
        if (newCourse && this.dialog) {
          this.loadAnalytics()
        }
      }
    }
  },
  mounted() {
    if (this.dialog && this.course) {
      this.loadAnalytics()
    }
  },
  beforeUnmount() {
    this.destroyCharts()
  },
  methods: {
    async loadAnalytics() {
      if (!this.course?.id) return
      
      this.loading = true
      try {
        this.analytics = await courseManagementService.getCourseAnalytics(this.course.id)
        this.$nextTick(() => {
          this.createCharts()
        })
      } catch (error) {
        console.error('Error loading analytics:', error)
        this.$toast.error('Error al cargar los analytics')
      } finally {
        this.loading = false
      }
    },
    
    async refreshAnalytics() {
      await this.loadAnalytics()
    },
    
    createCharts() {
      this.destroyCharts()
      this.$nextTick(() => {
        this.createStudentsChart()
        this.createRevenueChart()
      })
    },
    
    createStudentsChart() {
      if (!this.$refs.studentsChart || !this.analytics) return
      
      const ctx = this.$refs.studentsChart.getContext('2d')
      
      this.studentsChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.analytics.studentsOverTime.map(item => item.date),
          datasets: [{
            label: 'Inscripciones',
            data: this.analytics.studentsOverTime.map(item => item.count),
            borderColor: '#1976D2',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
    },
    
    createRevenueChart() {
      if (!this.$refs.revenueChart || !this.analytics) return
      
      const ctx = this.$refs.revenueChart.getContext('2d')
      
      this.revenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.analytics.revenueOverTime.map(item => item.date),
          datasets: [{
            label: 'Ingresos',
            data: this.analytics.revenueOverTime.map(item => item.amount),
            backgroundColor: '#4CAF50',
            borderColor: '#2E7D32',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString()
                }
              }
            }
          }
        }
      })
    },
    
    destroyCharts() {
      if (this.studentsChart) {
        this.studentsChart.destroy()
        this.studentsChart = null
      }
      if (this.revenueChart) {
        this.revenueChart.destroy()
        this.revenueChart = null
      }
    },
    
    getCompletionColor(rate) {
      if (rate >= 80) return 'success'
      if (rate >= 60) return 'warning'
      return 'error'
    },
    
    getActivityColor(type) {
      const colors = {
        enrollment: 'primary',
        completion: 'success',
        review: 'warning',
        question: 'info'
      }
      return colors[type] || 'grey'
    },
    
    getActivityIcon(type) {
      const icons = {
        enrollment: 'mdi-account-plus',
        completion: 'mdi-check-circle',
        review: 'mdi-star',
        question: 'mdi-help-circle'
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
      if (!this.analytics) return
      
      const data = {
        course: this.course.title,
        overview: this.analytics.overview,
        studentsOverTime: this.analytics.studentsOverTime,
        revenueOverTime: this.analytics.revenueOverTime,
        completionRates: this.analytics.completionRates,
        topModules: this.analytics.topModules,
        exportedAt: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-${this.course.title.replace(/\s+/g, '-')}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      this.$toast.success('Analytics exportados exitosamente')
    },
    
    closeDialog() {
      this.dialog = false
      this.destroyCharts()
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
