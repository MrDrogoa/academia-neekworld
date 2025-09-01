<template>
  <div class="payment-plans">
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              <v-icon left>mdi-package-variant</v-icon>
              Planes de Pago
            </h1>
            <p class="text-body-1">Gestiona los planes y precios de suscripción</p>
          </div>
          <v-btn
            color="primary"
            size="large"
            @click="showCreateDialog = true"
          >
            <v-icon left>mdi-plus</v-icon>
            Crear Plan
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Estadísticas de planes -->
    <v-row class="mb-6">
      <v-col cols="12" sm="3">
        <v-card class="text-center">
          <v-card-text>
            <v-icon size="40" color="primary" class="mb-2">mdi-package-variant</v-icon>
            <div class="text-h5 font-weight-bold">{{ totalPlans }}</div>
            <div class="text-caption">Planes Totales</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="3">
        <v-card class="text-center">
          <v-card-text>
            <v-icon size="40" color="success" class="mb-2">mdi-check-circle</v-icon>
            <div class="text-h5 font-weight-bold">{{ activePlans }}</div>
            <div class="text-caption">Planes Activos</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="3">
        <v-card class="text-center">
          <v-card-text>
            <v-icon size="40" color="info" class="mb-2">mdi-account-multiple</v-icon>
            <div class="text-h5 font-weight-bold">{{ totalSubscriptions }}</div>
            <div class="text-caption">Suscripciones</div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="3">
        <v-card class="text-center">
          <v-card-text>
            <v-icon size="40" color="warning" class="mb-2">mdi-cash</v-icon>
            <div class="text-h5 font-weight-bold">{{ formatCurrency(totalRevenue) }}</div>
            <div class="text-caption">Ingresos MRR</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Lista de planes -->
    <v-card>
      <v-card-title>
        <v-icon left>mdi-format-list-bulleted</v-icon>
        Lista de Planes
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          label="Buscar planes"
          single-line
          hide-details
          density="compact"
          style="max-width: 300px;"
        ></v-text-field>
      </v-card-title>
      
      <v-card-text>
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
          <div class="mt-3">Cargando planes...</div>
        </div>
        
        <div v-else-if="filteredPlans.length === 0" class="text-center py-8">
          <v-icon size="80" color="grey">mdi-package-variant-closed</v-icon>
          <div class="text-h6 mt-3">No se encontraron planes</div>
          <div class="text-body-2 text-grey">
            {{ search ? 'Intenta con otros términos de búsqueda' : 'Crea tu primer plan de pago' }}
          </div>
        </div>
        
        <v-row v-else>
          <v-col 
            v-for="plan in filteredPlans" 
            :key="plan.id"
            cols="12" 
            md="6" 
            lg="4"
          >
            <v-card 
              class="plan-card"
              :class="{ 'plan-featured': plan.featured }"
              elevation="2"
              hover
            >
              <!-- Badge para plan destacado -->
              <div v-if="plan.featured" class="featured-badge">
                <v-chip color="orange" size="small" variant="flat">
                  <v-icon left size="16">mdi-star</v-icon>
                  Destacado
                </v-chip>
              </div>

              <v-card-title class="pb-2">
                <div class="w-100">
                  <div class="d-flex justify-space-between align-center">
                    <span>{{ plan.name }}</span>
                    <v-chip 
                      :color="plan.isActive ? 'success' : 'grey'"
                      size="small"
                      variant="flat"
                    >
                      {{ plan.isActive ? 'Activo' : 'Inactivo' }}
                    </v-chip>
                  </div>
                  <div class="text-caption text-grey">{{ plan.description }}</div>
                </div>
              </v-card-title>

              <v-card-text>
                <!-- Precio -->
                <div class="text-center mb-4">
                  <div class="text-h4 font-weight-bold text-primary">
                    {{ formatCurrency(plan.amount) }}
                  </div>
                  <div class="text-caption">
                    por {{ plan.interval === 'monthly' ? 'mes' : 'año' }}
                  </div>
                  <div v-if="plan.discountPercentage" class="text-success text-caption">
                    {{ plan.discountPercentage }}% de descuento
                  </div>
                </div>

                <!-- Características -->
                <v-list density="compact" class="bg-transparent">
                  <v-list-item
                    v-for="feature in plan.features"
                    :key="feature"
                    class="px-0"
                  >
                    <template #prepend>
                      <v-icon size="16" color="success">mdi-check</v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">
                      {{ feature }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>

                <!-- Estadísticas del plan -->
                <div class="mt-4 pt-3 border-t">
                  <div class="d-flex justify-space-between text-caption">
                    <span>Suscripciones:</span>
                    <span class="font-weight-bold">{{ plan.subscriptions || 0 }}</span>
                  </div>
                  <div class="d-flex justify-space-between text-caption">
                    <span>Creado:</span>
                    <span>{{ formatDate(plan.createdAt) }}</span>
                  </div>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="primary"
                  variant="outlined"
                  size="small"
                  @click="editPlan(plan)"
                >
                  <v-icon left size="16">mdi-pencil</v-icon>
                  Editar
                </v-btn>
                
                <v-btn
                  :color="plan.isActive ? 'warning' : 'success'"
                  variant="outlined"
                  size="small"
                  @click="togglePlanStatus(plan)"
                >
                  <v-icon left size="16">
                    {{ plan.isActive ? 'mdi-pause' : 'mdi-play' }}
                  </v-icon>
                  {{ plan.isActive ? 'Pausar' : 'Activar' }}
                </v-btn>
                
                <v-spacer></v-spacer>
                
                <v-btn
                  color="error"
                  variant="text"
                  size="small"
                  @click="confirmDelete(plan)"
                >
                  <v-icon size="16">mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Dialog para crear/editar plan -->
    <v-dialog v-model="showCreateDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <v-icon left>{{ editingPlan ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          {{ editingPlan ? 'Editar Plan' : 'Crear Nuevo Plan' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="planForm" v-model="formValid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="planForm.name"
                  label="Nombre del Plan"
                  :rules="[rules.required]"
                  required
                ></v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-textarea
                  v-model="planForm.description"
                  label="Descripción"
                  :rules="[rules.required]"
                  required
                  rows="3"
                ></v-textarea>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="planForm.amount"
                  label="Precio"
                  type="number"
                  :rules="[rules.required, rules.positive]"
                  required
                  prefix="$"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-select
                  v-model="planForm.interval"
                  label="Intervalo"
                  :items="intervalOptions"
                  :rules="[rules.required]"
                  required
                ></v-select>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-select
                  v-model="planForm.currency"
                  label="Moneda"
                  :items="currencyOptions"
                  :rules="[rules.required]"
                  required
                ></v-select>
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="planForm.discountPercentage"
                  label="Descuento (%)"
                  type="number"
                  min="0"
                  max="100"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12">
                <v-combobox
                  v-model="planForm.features"
                  label="Características"
                  multiple
                  chips
                  clearable
                  hint="Presiona Enter para agregar una característica"
                  persistent-hint
                ></v-combobox>
              </v-col>
              
              <v-col cols="12">
                <v-switch
                  v-model="planForm.featured"
                  label="Plan destacado"
                  color="orange"
                  hide-details
                ></v-switch>
              </v-col>
              
              <v-col cols="12">
                <v-switch
                  v-model="planForm.isActive"
                  label="Plan activo"
                  color="success"
                  hide-details
                ></v-switch>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="closeDialog"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            :loading="saving"
            :disabled="!formValid"
            @click="savePlan"
          >
            {{ editingPlan ? 'Guardar Cambios' : 'Crear Plan' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de confirmación para eliminar -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon left color="error">mdi-delete</v-icon>
          Confirmar Eliminación
        </v-card-title>
        
        <v-card-text>
          ¿Estás seguro de que quieres eliminar el plan <strong>{{ planToDelete?.name }}</strong>?
          Esta acción no se puede deshacer.
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="showDeleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            :loading="deleting"
            @click="deletePlan"
          >
            Eliminar
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
  name: 'PaymentPlans',
  setup() {
    const loading = ref(true)
    const saving = ref(false)
    const deleting = ref(false)
    const plans = ref([])
    const search = ref('')
    const showCreateDialog = ref(false)
    const showDeleteDialog = ref(false)
    const editingPlan = ref(null)
    const planToDelete = ref(null)
    const formValid = ref(false)
    const planForm = ref({
      name: '',
      description: '',
      amount: null,
      currency: 'CLP',
      interval: 'monthly',
      features: [],
      discountPercentage: null,
      featured: false,
      isActive: true
    })

    const snackbar = ref({
      show: false,
      message: '',
      color: 'success'
    })

    // Opciones para formulario
    const intervalOptions = [
      { title: 'Mensual', value: 'monthly' },
      { title: 'Anual', value: 'yearly' }
    ]

    const currencyOptions = [
      { title: 'Peso Chileno (CLP)', value: 'CLP' },
      { title: 'Dólar (USD)', value: 'USD' }
    ]

    // Reglas de validación
    const rules = {
      required: value => !!value || 'Este campo es requerido',
      positive: value => (value > 0) || 'Debe ser un valor positivo'
    }

    // Computadas
    const filteredPlans = computed(() => {
      if (!search.value) return plans.value
      
      return plans.value.filter(plan =>
        plan.name.toLowerCase().includes(search.value.toLowerCase()) ||
        plan.description.toLowerCase().includes(search.value.toLowerCase())
      )
    })

    const totalPlans = computed(() => plans.value.length)
    const activePlans = computed(() => plans.value.filter(p => p.isActive).length)
    const totalSubscriptions = computed(() => 
      plans.value.reduce((sum, plan) => sum + (plan.subscriptions || 0), 0)
    )
    const totalRevenue = computed(() => 
      plans.value.reduce((sum, plan) => 
        sum + (plan.amount * (plan.subscriptions || 0)), 0
      )
    )

    // Métodos
    const loadPlans = async () => {
      try {
        loading.value = true
        const response = await advancedPaymentService.getPaymentPlans()
        plans.value = response || []
      } catch (error) {
        console.error('Error loading plans:', error)
        showSnackbar('Error al cargar los planes', 'error')
      } finally {
        loading.value = false
      }
    }

    const editPlan = (plan) => {
      editingPlan.value = plan
      planForm.value = { ...plan }
      showCreateDialog.value = true
    }

    const savePlan = async () => {
      try {
        saving.value = true
        
        if (editingPlan.value) {
          await advancedPaymentService.updatePaymentPlan(editingPlan.value.id, planForm.value)
          const index = plans.value.findIndex(p => p.id === editingPlan.value.id)
          if (index !== -1) {
            plans.value[index] = { ...planForm.value, id: editingPlan.value.id }
          }
          showSnackbar('Plan actualizado exitosamente')
        } else {
          const newPlan = await advancedPaymentService.createPaymentPlan(planForm.value)
          plans.value.push(newPlan)
          showSnackbar('Plan creado exitosamente')
        }
        
        closeDialog()
      } catch (error) {
        console.error('Error saving plan:', error)
        showSnackbar('Error al guardar el plan', 'error')
      } finally {
        saving.value = false
      }
    }

    const togglePlanStatus = async (plan) => {
      try {
        const updatedPlan = { ...plan, isActive: !plan.isActive }
        await advancedPaymentService.updatePaymentPlan(plan.id, updatedPlan)
        
        const index = plans.value.findIndex(p => p.id === plan.id)
        if (index !== -1) {
          plans.value[index] = updatedPlan
        }
        
        showSnackbar(`Plan ${updatedPlan.isActive ? 'activado' : 'pausado'} exitosamente`)
      } catch (error) {
        console.error('Error toggling plan status:', error)
        showSnackbar('Error al cambiar estado del plan', 'error')
      }
    }

    const confirmDelete = (plan) => {
      planToDelete.value = plan
      showDeleteDialog.value = true
    }

    const deletePlan = async () => {
      try {
        deleting.value = true
        await advancedPaymentService.deletePaymentPlan(planToDelete.value.id)
        
        const index = plans.value.findIndex(p => p.id === planToDelete.value.id)
        if (index !== -1) {
          plans.value[index].isActive = false
        }
        
        showDeleteDialog.value = false
        showSnackbar('Plan eliminado exitosamente')
      } catch (error) {
        console.error('Error deleting plan:', error)
        showSnackbar('Error al eliminar el plan', 'error')
      } finally {
        deleting.value = false
      }
    }

    const closeDialog = () => {
      showCreateDialog.value = false
      editingPlan.value = null
      planForm.value = {
        name: '',
        description: '',
        amount: null,
        currency: 'CLP',
        interval: 'monthly',
        features: [],
        discountPercentage: null,
        featured: false,
        isActive: true
      }
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

    const showSnackbar = (message, color = 'success') => {
      snackbar.value = {
        show: true,
        message,
        color
      }
    }

    onMounted(() => {
      loadPlans()
    })

    return {
      loading,
      saving,
      deleting,
      plans,
      search,
      showCreateDialog,
      showDeleteDialog,
      editingPlan,
      planToDelete,
      formValid,
      planForm,
      snackbar,
      intervalOptions,
      currencyOptions,
      rules,
      filteredPlans,
      totalPlans,
      activePlans,
      totalSubscriptions,
      totalRevenue,
      editPlan,
      savePlan,
      togglePlanStatus,
      confirmDelete,
      deletePlan,
      closeDialog,
      formatCurrency,
      formatDate
    }
  }
}
</script>

<style scoped>
.payment-plans {
  padding: 20px;
}

.plan-card {
  position: relative;
  height: 100%;
  transition: all 0.3s ease;
}

.plan-card:hover {
  transform: translateY(-2px);
}

.plan-featured {
  border: 2px solid #ff9800;
}

.featured-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.border-t {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

@media (max-width: 600px) {
  .payment-plans {
    padding: 10px;
  }
}
</style>
