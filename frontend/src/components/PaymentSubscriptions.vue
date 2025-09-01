<template>
  <div class="payment-subscriptions">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              <v-icon left>mdi-account-multiple</v-icon>
              Gestión de Suscripciones
            </h1>
            <p class="text-body-1">Administra las suscripciones activas, pausadas y canceladas</p>
          </div>
          <v-btn
            color="primary"
            size="large"
            @click="showCreateDialog = true"
          >
            <v-icon left>mdi-plus</v-icon>
            Nueva Suscripción
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Estadísticas de suscripciones -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center stat-card" color="success" dark>
          <v-card-text>
            <v-icon size="40" class="mb-2">mdi-account-check</v-icon>
            <div class="text-h5 font-weight-bold">{{ stats.active }}</div>
            <div class="text-caption">Activas</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center stat-card" color="warning" dark>
          <v-card-text>
            <v-icon size="40" class="mb-2">mdi-pause-circle</v-icon>
            <div class="text-h5 font-weight-bold">{{ stats.paused }}</div>
            <div class="text-caption">Pausadas</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center stat-card" color="error" dark>
          <v-card-text>
            <v-icon size="40" class="mb-2">mdi-cancel</v-icon>
            <div class="text-h5 font-weight-bold">{{ stats.cancelled }}</div>
            <div class="text-caption">Canceladas</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="text-center stat-card" color="info" dark>
          <v-card-text>
            <v-icon size="40" class="mb-2">mdi-cash-multiple</v-icon>
            <div class="text-h5 font-weight-bold">{{ formatCurrency(stats.mrr) }}</div>
            <div class="text-caption">MRR Total</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtros y búsqueda -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              append-inner-icon="mdi-magnify"
              label="Buscar suscripciones"
              single-line
              hide-details
              density="compact"
            ></v-text-field>
          </v-col>
          
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Estado"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="3">
            <v-select
              v-model="planFilter"
              :items="planOptions"
              label="Plan"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          
          <v-col cols="12" md="2">
            <v-btn
              color="primary"
              variant="outlined"
              block
              @click="exportSubscriptions"
            >
              <v-icon left>mdi-download</v-icon>
              Exportar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tabla de suscripciones -->
    <v-card>
      <v-card-title>
        <v-icon left>mdi-format-list-bulleted</v-icon>
        Lista de Suscripciones
        <v-spacer></v-spacer>
        <v-chip :color="getStatusColor('total')" variant="flat">
          Total: {{ filteredSubscriptions.length }}
        </v-chip>
      </v-card-title>
      
      <v-card-text>
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
          <div class="mt-3">Cargando suscripciones...</div>
        </div>
        
        <div v-else-if="filteredSubscriptions.length === 0" class="text-center py-8">
          <v-icon size="80" color="grey">mdi-account-off</v-icon>
          <div class="text-h6 mt-3">No se encontraron suscripciones</div>
          <div class="text-body-2 text-grey">
            {{ search || statusFilter !== 'all' ? 'Intenta ajustar los filtros' : 'No hay suscripciones registradas' }}
          </div>
        </div>
        
        <v-data-table
          v-else
          :headers="headers"
          :items="paginatedSubscriptions"
          :items-per-page="itemsPerPage"
          :page="currentPage"
          :loading="loading"
          hide-default-footer
          class="elevation-1"
        >
          <!-- Usuario -->
          <template #item.user="{ item }">
            <div class="d-flex align-center">
              <v-avatar size="32" class="mr-3">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.user?.name || 'Usuario' }}</div>
                <div class="text-caption text-grey">{{ item.user?.email || 'N/A' }}</div>
              </div>
            </div>
          </template>

          <!-- Plan -->
          <template #item.plan="{ item }">
            <div>
              <div class="font-weight-medium">{{ item.plan?.name || 'Plan eliminado' }}</div>
              <div class="text-caption text-grey">
                {{ formatCurrency(item.monthlyAmount || 0) }}/mes
              </div>
            </div>
          </template>

          <!-- Estado -->
          <template #item.status="{ item }">
            <v-chip
              :color="getStatusColor(item.status)"
              size="small"
              variant="flat"
            >
              <v-icon left size="16">{{ getStatusIcon(item.status) }}</v-icon>
              {{ getStatusText(item.status) }}
            </v-chip>
          </template>

          <!-- Fecha de inicio -->
          <template #item.startDate="{ item }">
            <div>
              <div>{{ formatDate(item.startDate) }}</div>
              <div class="text-caption text-grey">
                {{ getRelativeTime(item.startDate) }}
              </div>
            </div>
          </template>

          <!-- Próximo cobro -->
          <template #item.nextBilling="{ item }">
            <div v-if="item.status === 'active'">
              <div>{{ formatDate(item.nextBilling) }}</div>
              <div class="text-caption" :class="getNextBillingClass(item.nextBilling)">
                {{ getRelativeTime(item.nextBilling) }}
              </div>
            </div>
            <div v-else class="text-grey">-</div>
          </template>

          <!-- Acciones -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-1">
              <v-btn
                size="small"
                variant="text"
                icon="mdi-eye"
                @click="viewSubscription(item)"
              ></v-btn>
              
              <v-btn
                v-if="item.status === 'active'"
                size="small"
                variant="text"
                icon="mdi-pause"
                color="warning"
                @click="pauseSubscription(item)"
              ></v-btn>
              
              <v-btn
                v-if="item.status === 'paused'"
                size="small"
                variant="text"
                icon="mdi-play"
                color="success"
                @click="resumeSubscription(item)"
              ></v-btn>
              
              <v-btn
                v-if="['active', 'paused'].includes(item.status)"
                size="small"
                variant="text"
                icon="mdi-cancel"
                color="error"
                @click="cancelSubscription(item)"
              ></v-btn>
            </div>
          </template>
        </v-data-table>

        <!-- Paginación personalizada -->
        <div class="d-flex justify-space-between align-center mt-4">
          <div class="text-body-2">
            Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredSubscriptions.length) }} 
            de {{ filteredSubscriptions.length }} suscripciones
          </div>
          
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            density="comfortable"
          ></v-pagination>
        </div>
      </v-card-text>
    </v-card>

    <!-- Dialog para ver detalles -->
    <v-dialog v-model="showDetailsDialog" max-width="600px">
      <v-card v-if="selectedSubscription">
        <v-card-title>
          <v-icon left>mdi-account-details</v-icon>
          Detalles de Suscripción
        </v-card-title>
        
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <strong>Usuario:</strong><br>
              {{ selectedSubscription.user?.name || 'N/A' }}<br>
              <span class="text-caption">{{ selectedSubscription.user?.email || 'N/A' }}</span>
            </v-col>
            
            <v-col cols="12" md="6">
              <strong>Plan:</strong><br>
              {{ selectedSubscription.plan?.name || 'Plan eliminado' }}<br>
              <span class="text-caption">{{ formatCurrency(selectedSubscription.monthlyAmount || 0) }}/mes</span>
            </v-col>
            
            <v-col cols="12" md="6">
              <strong>Estado:</strong><br>
              <v-chip
                :color="getStatusColor(selectedSubscription.status)"
                size="small"
                variant="flat"
              >
                {{ getStatusText(selectedSubscription.status) }}
              </v-chip>
            </v-col>
            
            <v-col cols="12" md="6">
              <strong>Fecha de inicio:</strong><br>
              {{ formatDate(selectedSubscription.startDate) }}
            </v-col>
            
            <v-col v-if="selectedSubscription.nextBilling" cols="12" md="6">
              <strong>Próximo cobro:</strong><br>
              {{ formatDate(selectedSubscription.nextBilling) }}
            </v-col>
            
            <v-col v-if="selectedSubscription.cancelledAt" cols="12" md="6">
              <strong>Fecha de cancelación:</strong><br>
              {{ formatDate(selectedSubscription.cancelledAt) }}
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="showDetailsDialog = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
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
import { ref, computed, onMounted } from 'vue'
import advancedPaymentService from '@/services/advancedPaymentService'

export default {
  name: 'PaymentSubscriptions',
  setup() {
    const loading = ref(true)
    const subscriptions = ref([])
    const search = ref('')
    const statusFilter = ref('all')
    const planFilter = ref('all')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const showDetailsDialog = ref(false)
    const showCreateDialog = ref(false)
    const selectedSubscription = ref(null)

    const snackbar = ref({
      show: false,
      message: '',
      color: 'success'
    })

    // Headers para la tabla
    const headers = [
      { title: 'Usuario', key: 'user', sortable: false },
      { title: 'Plan', key: 'plan', sortable: false },
      { title: 'Estado', key: 'status', sortable: true },
      { title: 'Inicio', key: 'startDate', sortable: true },
      { title: 'Próximo Cobro', key: 'nextBilling', sortable: true },
      { title: 'Acciones', key: 'actions', sortable: false, width: '120px' }
    ]

    // Opciones de filtros
    const statusOptions = [
      { title: 'Todos los estados', value: 'all' },
      { title: 'Activas', value: 'active' },
      { title: 'Pausadas', value: 'paused' },
      { title: 'Canceladas', value: 'cancelled' },
      { title: 'Vencidas', value: 'expired' }
    ]

    const planOptions = computed(() => {
      const plans = [...new Set(subscriptions.value.map(s => s.plan?.name).filter(Boolean))]
      return [
        { title: 'Todos los planes', value: 'all' },
        ...plans.map(plan => ({ title: plan, value: plan }))
      ]
    })

    // Computadas
    const filteredSubscriptions = computed(() => {
      let filtered = subscriptions.value

      // Filtro por búsqueda
      if (search.value) {
        const searchLower = search.value.toLowerCase()
        filtered = filtered.filter(sub =>
          sub.user?.name?.toLowerCase().includes(searchLower) ||
          sub.user?.email?.toLowerCase().includes(searchLower) ||
          sub.plan?.name?.toLowerCase().includes(searchLower)
        )
      }

      // Filtro por estado
      if (statusFilter.value !== 'all') {
        filtered = filtered.filter(sub => sub.status === statusFilter.value)
      }

      // Filtro por plan
      if (planFilter.value !== 'all') {
        filtered = filtered.filter(sub => sub.plan?.name === planFilter.value)
      }

      return filtered
    })

    const paginatedSubscriptions = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredSubscriptions.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredSubscriptions.value.length / itemsPerPage.value)
    })

    const stats = computed(() => {
      const active = subscriptions.value.filter(s => s.status === 'active').length
      const paused = subscriptions.value.filter(s => s.status === 'paused').length
      const cancelled = subscriptions.value.filter(s => s.status === 'cancelled').length
      const mrr = subscriptions.value
        .filter(s => s.status === 'active')
        .reduce((sum, s) => sum + (s.monthlyAmount || 0), 0)

      return { active, paused, cancelled, mrr }
    })

    // Métodos
    const loadSubscriptions = async () => {
      try {
        loading.value = true
        const response = await advancedPaymentService.getUserSubscriptions()
        
        // Simular datos más completos para demostración
        subscriptions.value = generateMockSubscriptions()
        
      } catch (error) {
        console.error('Error loading subscriptions:', error)
        showSnackbar('Error al cargar las suscripciones', 'error')
      } finally {
        loading.value = false
      }
    }

    const generateMockSubscriptions = () => {
      const mockUsers = [
        { name: 'Juan Pérez', email: 'juan@example.com' },
        { name: 'María González', email: 'maria@example.com' },
        { name: 'Carlos López', email: 'carlos@example.com' },
        { name: 'Ana Martínez', email: 'ana@example.com' },
        { name: 'Pedro Sánchez', email: 'pedro@example.com' }
      ]

      const mockPlans = [
        { name: 'Plan Básico', amount: 19990 },
        { name: 'Plan Premium', amount: 39990 },
        { name: 'Plan Pro', amount: 59990 }
      ]

      const statuses = ['active', 'paused', 'cancelled']

      return Array.from({ length: 25 }, (_, i) => ({
        id: `sub-${i + 1}`,
        user: mockUsers[i % mockUsers.length],
        plan: mockPlans[i % mockPlans.length],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        monthlyAmount: mockPlans[i % mockPlans.length].amount,
        startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        nextBilling: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelledAt: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null
      }))
    }

    const viewSubscription = (subscription) => {
      selectedSubscription.value = subscription
      showDetailsDialog.value = true
    }

    const pauseSubscription = async (subscription) => {
      try {
        await advancedPaymentService.manageSubscription('pause', {
          subscriptionId: subscription.id
        })
        
        subscription.status = 'paused'
        showSnackbar('Suscripción pausada exitosamente')
      } catch (error) {
        console.error('Error pausing subscription:', error)
        showSnackbar('Error al pausar la suscripción', 'error')
      }
    }

    const resumeSubscription = async (subscription) => {
      try {
        await advancedPaymentService.manageSubscription('resume', {
          subscriptionId: subscription.id
        })
        
        subscription.status = 'active'
        showSnackbar('Suscripción reactivada exitosamente')
      } catch (error) {
        console.error('Error resuming subscription:', error)
        showSnackbar('Error al reactivar la suscripción', 'error')
      }
    }

    const cancelSubscription = async (subscription) => {
      try {
        await advancedPaymentService.manageSubscription('cancel', {
          subscriptionId: subscription.id
        })
        
        subscription.status = 'cancelled'
        subscription.cancelledAt = new Date().toISOString()
        showSnackbar('Suscripción cancelada exitosamente')
      } catch (error) {
        console.error('Error cancelling subscription:', error)
        showSnackbar('Error al cancelar la suscripción', 'error')
      }
    }

    const exportSubscriptions = () => {
      // Simular exportación
      showSnackbar('Exportando suscripciones...', 'info')
      setTimeout(() => {
        showSnackbar('Suscripciones exportadas exitosamente')
      }, 2000)
    }

    // Utilidades
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

    const getRelativeTime = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24))
      
      if (diffInDays === 0) return 'Hoy'
      if (diffInDays === 1) return 'Mañana'
      if (diffInDays === -1) return 'Ayer'
      if (diffInDays > 0) return `En ${diffInDays} días`
      return `Hace ${Math.abs(diffInDays)} días`
    }

    const getStatusColor = (status) => {
      const colors = {
        active: 'success',
        paused: 'warning',
        cancelled: 'error',
        expired: 'grey',
        total: 'primary'
      }
      return colors[status] || 'grey'
    }

    const getStatusIcon = (status) => {
      const icons = {
        active: 'mdi-check-circle',
        paused: 'mdi-pause-circle',
        cancelled: 'mdi-cancel',
        expired: 'mdi-clock-alert'
      }
      return icons[status] || 'mdi-help-circle'
    }

    const getStatusText = (status) => {
      const texts = {
        active: 'Activa',
        paused: 'Pausada',
        cancelled: 'Cancelada',
        expired: 'Vencida'
      }
      return texts[status] || status
    }

    const getNextBillingClass = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffInDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24))
      
      if (diffInDays <= 3) return 'text-error'
      if (diffInDays <= 7) return 'text-warning'
      return 'text-success'
    }

    const showSnackbar = (message, color = 'success') => {
      snackbar.value = {
        show: true,
        message,
        color
      }
    }

    onMounted(() => {
      loadSubscriptions()
    })

    return {
      loading,
      subscriptions,
      search,
      statusFilter,
      planFilter,
      currentPage,
      itemsPerPage,
      showDetailsDialog,
      showCreateDialog,
      selectedSubscription,
      snackbar,
      headers,
      statusOptions,
      planOptions,
      filteredSubscriptions,
      paginatedSubscriptions,
      totalPages,
      stats,
      viewSubscription,
      pauseSubscription,
      resumeSubscription,
      cancelSubscription,
      exportSubscriptions,
      formatCurrency,
      formatDate,
      getRelativeTime,
      getStatusColor,
      getStatusIcon,
      getStatusText,
      getNextBillingClass
    }
  }
}
</script>

<style scoped>
.payment-subscriptions {
  padding: 20px;
}

.stat-card {
  height: 120px;
}

.stat-card .v-card-text {
  padding: 16px !important;
}

@media (max-width: 600px) {
  .payment-subscriptions {
    padding: 10px;
  }
  
  .stat-card {
    height: auto;
    min-height: 120px;
  }
}
</style>
