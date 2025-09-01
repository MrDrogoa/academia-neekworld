<template>
  <div class="payment-dashboard">
    <!-- Header con estadísticas principales -->
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-2">
          <v-icon left>mdi-credit-card</v-icon>
          Dashboard de Pagos
        </h1>
        <p class="text-body-1">Gestiona pagos, suscripciones y analiza el rendimiento financiero</p>
      </v-col>
    </v-row>

    <!-- Tarjetas de resumen -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" color="primary" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-3">mdi-cash-multiple</v-icon>
              <div>
                <div class="text-h5 font-weight-bold">
                  {{ formatCurrency(dashboard.summary?.totalRevenue || 0) }}
                </div>
                <div class="text-caption">Ingresos Totales</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" color="success" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-3">mdi-chart-line</v-icon>
              <div>
                <div class="text-h5 font-weight-bold">
                  {{ dashboard.summary?.totalPayments || 0 }}
                </div>
                <div class="text-caption">Pagos Totales</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" color="info" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-3">mdi-account-multiple</v-icon>
              <div>
                <div class="text-h5 font-weight-bold">
                  {{ dashboard.summary?.activeSubscriptions || 0 }}
                </div>
                <div class="text-caption">Suscripciones Activas</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card" color="warning" dark>
          <v-card-text>
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-3">mdi-repeat</v-icon>
              <div>
                <div class="text-h5 font-weight-bold">
                  {{ formatCurrency(dashboard.summary?.monthlyRecurringRevenue || 0) }}
                </div>
                <div class="text-caption">MRR</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Gráficos y analytics -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-chart-line</v-icon>
            Ingresos en el Tiempo
          </v-card-title>
          <v-card-text>
            <canvas ref="revenueChart" height="400"></canvas>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-chart-pie</v-icon>
            Métodos de Pago
          </v-card-title>
          <v-card-text>
            <canvas ref="methodsChart" height="400"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Pagos recientes y suscripciones -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-clock-outline</v-icon>
            Pagos Recientes
            <v-spacer></v-spacer>
            <v-btn color="primary" size="small" @click="viewAllPayments">
              Ver Todos
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div v-if="loading" class="text-center py-4">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else-if="dashboard.recentPayments?.length">
              <v-list>
                <v-list-item
                  v-for="payment in dashboard.recentPayments"
                  :key="payment.id"
                  class="px-0"
                >
                  <template #prepend>
                    <v-icon :color="getPaymentStatusColor(payment.status)">
                      {{ getPaymentStatusIcon(payment.status) }}
                    </v-icon>
                  </template>
                  
                  <v-list-item-title>
                    {{ formatCurrency(payment.amount) }}
                  </v-list-item-title>
                  
                  <v-list-item-subtitle>
                    {{ payment.method?.toUpperCase() }} • {{ formatDate(payment.createdAt) }}
                  </v-list-item-subtitle>

                  <template #append>
                    <v-chip
                      :color="getPaymentStatusColor(payment.status)"
                      size="small"
                      variant="flat"
                    >
                      {{ payment.status }}
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </div>
            <div v-else class="text-center py-4 text-grey">
              No hay pagos recientes
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-account-clock</v-icon>
            Suscripciones Activas
            <v-spacer></v-spacer>
            <v-btn color="primary" size="small" @click="viewAllSubscriptions">
              Ver Todas
            </v-btn>
          </v-card-title>
          <v-card-text>
            <div v-if="loading" class="text-center py-4">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else-if="dashboard.activeSubscriptions?.length">
              <v-list>
                <v-list-item
                  v-for="subscription in dashboard.activeSubscriptions"
                  :key="subscription.id"
                  class="px-0"
                >
                  <template #prepend>
                    <v-icon color="success">mdi-account-check</v-icon>
                  </template>
                  
                  <v-list-item-title>
                    {{ subscription.plan?.name || 'Plan' }}
                  </v-list-item-title>
                  
                  <v-list-item-subtitle>
                    {{ formatCurrency(subscription.monthlyAmount) }}/mes
                    • Desde {{ formatDate(subscription.startDate) }}
                  </v-list-item-subtitle>

                  <template #append>
                    <v-chip color="success" size="small" variant="flat">
                      Activa
                    </v-chip>
                  </template>
                </v-list-item>
              </v-list>
            </div>
            <div v-else class="text-center py-4 text-grey">
              No hay suscripciones activas
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botones de acción rápida -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-lightning-bolt</v-icon>
            Acciones Rápidas
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="primary"
                  variant="outlined"
                  @click="goToPlans"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Crear Plan
                </v-btn>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="success"
                  variant="outlined"
                  @click="processPayment"
                >
                  <v-icon left>mdi-credit-card-plus</v-icon>
                  Procesar Pago
                </v-btn>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="info"
                  variant="outlined"
                  @click="viewAnalytics"
                >
                  <v-icon left>mdi-chart-box</v-icon>
                  Analytics
                </v-btn>
              </v-col>
              
              <v-col cols="12" sm="6" md="3">
                <v-btn
                  block
                  color="orange"
                  variant="outlined"
                  @click="exportData"
                >
                  <v-icon left>mdi-download</v-icon>
                  Exportar
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import Chart from 'chart.js/auto'
import advancedPaymentService from '@/services/advancedPaymentService'

export default {
  name: 'PaymentDashboard',
  setup() {
    const router = useRouter()
    const loading = ref(true)
    const dashboard = ref({})
    const revenueChart = ref(null)
    const methodsChart = ref(null)
    const snackbar = ref({
      show: false,
      message: '',
      color: 'success'
    })

    const loadDashboard = async () => {
      try {
        loading.value = true
        dashboard.value = await advancedPaymentService.getPaymentDashboard()
        
        await nextTick()
        initCharts()
        
      } catch (error) {
        console.error('Error loading dashboard:', error)
        showSnackbar('Error al cargar el dashboard', 'error')
      } finally {
        loading.value = false
      }
    }

    const initCharts = () => {
      initRevenueChart()
      initMethodsChart()
    }

    const initRevenueChart = () => {
      if (!revenueChart.value) return

      const ctx = revenueChart.value.getContext('2d')
      const revenueData = dashboard.value.analytics?.revenueOverTime || []

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: revenueData.map(item => {
            const date = new Date(item.date)
            return date.toLocaleDateString('es-CL', { 
              month: 'short', 
              day: 'numeric' 
            })
          }),
          datasets: [{
            label: 'Ingresos',
            data: revenueData.map(item => item.revenue),
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            borderWidth: 2,
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
                  return formatCurrency(value)
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      })
    }

    const initMethodsChart = () => {
      if (!methodsChart.value) return

      const ctx = methodsChart.value.getContext('2d')
      const methodsData = dashboard.value.analytics?.paymentsByMethod || {}

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(methodsData).map(method => method.toUpperCase()),
          datasets: [{
            data: Object.values(methodsData),
            backgroundColor: [
              '#1976d2',
              '#388e3c',
              '#f57c00',
              '#7b1fa2',
              '#d32f2f'
            ]
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
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
      }).format(amount)
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const getPaymentStatusColor = (status) => {
      const colors = {
        completed: 'success',
        pending: 'warning',
        failed: 'error',
        cancelled: 'grey'
      }
      return colors[status] || 'grey'
    }

    const getPaymentStatusIcon = (status) => {
      const icons = {
        completed: 'mdi-check-circle',
        pending: 'mdi-clock-outline',
        failed: 'mdi-close-circle',
        cancelled: 'mdi-cancel'
      }
      return icons[status] || 'mdi-help-circle'
    }

    const showSnackbar = (message, color = 'success') => {
      snackbar.value = {
        show: true,
        message,
        color
      }
    }

    // Navegación
    const viewAllPayments = () => {
      router.push('/admin/payments/history')
    }

    const viewAllSubscriptions = () => {
      router.push('/admin/payments/subscriptions')
    }

    const goToPlans = () => {
      router.push('/admin/payments/plans')
    }

    const processPayment = () => {
      router.push('/admin/payments/process')
    }

    const viewAnalytics = () => {
      router.push('/admin/payments/analytics')
    }

    const exportData = async () => {
      try {
        // Simular exportación de datos
        showSnackbar('Exportando datos...', 'info')
        
        // Aquí iría la lógica real de exportación
        setTimeout(() => {
          showSnackbar('Datos exportados exitosamente')
        }, 2000)
        
      } catch (error) {
        console.error('Error exporting data:', error)
        showSnackbar('Error al exportar datos', 'error')
      }
    }

    onMounted(() => {
      loadDashboard()
    })

    return {
      loading,
      dashboard,
      revenueChart,
      methodsChart,
      snackbar,
      formatCurrency,
      formatDate,
      getPaymentStatusColor,
      getPaymentStatusIcon,
      viewAllPayments,
      viewAllSubscriptions,
      goToPlans,
      processPayment,
      viewAnalytics,
      exportData
    }
  }
}
</script>

<style scoped>
.payment-dashboard {
  padding: 20px;
}

.stat-card {
  height: 100px;
}

.stat-card .v-card-text {
  padding: 16px !important;
}

@media (max-width: 600px) {
  .payment-dashboard {
    padding: 10px;
  }
  
  .stat-card {
    height: auto;
    min-height: 100px;
  }
}
</style>
