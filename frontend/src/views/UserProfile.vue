<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Mi Perfil</h1>
      </v-col>
    </v-row>

    <!-- User Information Card -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon left color="primary">mdi-account</v-icon>
            Información Personal
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="editMode = !editMode"
              :color="editMode ? 'primary' : 'grey'"
            >
              <v-icon>{{ editMode ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-form v-model="formValid" :disabled="!editMode">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="profileData.firstName"
                    label="Nombre"
                    :readonly="!editMode"
                    :outlined="editMode"
                    :dense="!editMode"
                    :rules="editMode ? nameRules : []"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="profileData.lastName"
                    label="Apellido"
                    :readonly="!editMode"
                    :outlined="editMode"
                    :dense="!editMode"
                    :rules="editMode ? nameRules : []"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="profileData.email"
                    label="Email"
                    readonly
                    dense
                    hint="El email no se puede modificar"
                    persistent-hint
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="profileData.country"
                    :items="countries"
                    label="País"
                    :readonly="!editMode"
                    :outlined="editMode"
                    :dense="!editMode"
                    item-text="name"
                    item-value="code"
                    return-object="false"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row v-if="editMode">
                <v-col cols="12">
                  <v-btn
                    color="primary"
                    @click="saveProfile"
                    :loading="saving"
                    :disabled="!formValid"
                    class="mr-2"
                  >
                    Guardar Cambios
                  </v-btn>
                  <v-btn
                    color="grey"
                    text
                    @click="cancelEdit"
                  >
                    Cancelar
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Moodle Integration Card -->
      <v-col cols="12" md="4">
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon left color="primary">mdi-school</v-icon>
            Integración Moodle
          </v-card-title>

          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-icon :color="moodleStatus.color" class="mr-2">
                {{ moodleStatus.icon }}
              </v-icon>
              <span :class="`text-${moodleStatus.color}`">
                {{ moodleStatus.text }}
              </span>
            </div>

            <div v-if="user.moodleData" class="text-body-2">
              <p><strong>ID Moodle:</strong> {{ user.moodleData.moodleUserId || 'N/A' }}</p>
              <p><strong>Última sincronización:</strong> {{ lastSync }}</p>
            </div>

            <div class="mt-4">
              <v-btn
                color="primary"
                block
                @click="openMoodle"
                :disabled="!user.isAuthenticated"
              >
                <v-icon left>mdi-open-in-new</v-icon>
                Abrir Moodle
              </v-btn>

              <v-btn
                color="secondary"
                block
                text
                @click="syncWithMoodle"
                :loading="syncing"
                class="mt-2"
              >
                <v-icon left>mdi-sync</v-icon>
                Sincronizar datos
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Account Statistics -->
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon left color="primary">mdi-chart-line</v-icon>
            Estadísticas
          </v-card-title>

          <v-card-text>
            <div class="text-center">
              <div class="mb-4">
                <div class="text-h3 primary--text font-weight-bold">
                  {{ stats.totalCourses }}
                </div>
                <div class="text-body-2 grey--text">Cursos Inscritos</div>
              </div>

              <div class="mb-4">
                <div class="text-h3 success--text font-weight-bold">
                  {{ stats.completedCourses }}
                </div>
                <div class="text-body-2 grey--text">Cursos Completados</div>
              </div>

              <div class="mb-4">
                <div class="text-h3 info--text font-weight-bold">
                  {{ stats.totalHours }}
                </div>
                <div class="text-body-2 grey--text">Horas de Estudio</div>
              </div>

              <v-progress-linear
                :value="stats.progressPercentage"
                color="primary"
                height="8"
                rounded
                class="mt-4"
              ></v-progress-linear>
              <div class="text-caption mt-1">
                {{ stats.progressPercentage }}% Progreso General
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Activity -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon left color="primary">mdi-history</v-icon>
            Actividad Reciente
          </v-card-title>

          <v-card-text>
            <v-list v-if="recentActivity.length > 0">
              <v-list-item
                v-for="(activity, index) in recentActivity"
                :key="index"
              >
                <v-list-item-avatar>
                  <v-icon :color="activity.color">{{ activity.icon }}</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ activity.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ activity.description }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text>{{ activity.date }}</v-list-item-action-text>
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <div v-else class="text-center py-8">
              <v-icon size="64" color="grey lighten-2">mdi-history</v-icon>
              <p class="text-grey mt-4">No hay actividad reciente</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Success/Error Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import authService from '@/services/authService'

export default {
  name: 'UserProfile',
  setup() {
    // Reactive data
    const user = computed(() => authService.getCurrentUser())
    const editMode = ref(false)
    const formValid = ref(true)
    const saving = ref(false)
    const syncing = ref(false)

    const profileData = ref({
      firstName: '',
      lastName: '',
      email: '',
      country: 'CL'
    })

    const originalProfileData = ref({})

    const snackbar = ref({
      show: false,
      message: '',
      color: 'success',
      timeout: 4000
    })

    // Countries list
    const countries = ref([
      { name: 'Chile', code: 'CL' },
      { name: 'Argentina', code: 'AR' },
      { name: 'Perú', code: 'PE' },
      { name: 'Colombia', code: 'CO' },
      { name: 'México', code: 'MX' },
      { name: 'España', code: 'ES' },
      { name: 'Otro', code: 'OTHER' }
    ])

    // Validation rules
    const nameRules = [
      v => !!v || 'Este campo es requerido',
      v => (v && v.length >= 2) || 'Debe tener al menos 2 caracteres'
    ]

    // Computed properties
    const moodleStatus = computed(() => {
      if (!user.value.isAuthenticated) {
        return {
          color: 'grey',
          icon: 'mdi-account-off',
          text: 'No autenticado'
        }
      }

      if (user.value.moodleData) {
        return {
          color: 'success',
          icon: 'mdi-check-circle',
          text: 'Conectado y sincronizado'
        }
      }

      return {
        color: 'warning',
        icon: 'mdi-alert-circle',
        text: 'Conexión pendiente'
      }
    })

    const lastSync = computed(() => {
      // Mock data - en producción vendría del backend
      return new Date().toLocaleDateString('es-CL')
    })

    const stats = computed(() => {
      // Mock data - en producción vendría del backend/Moodle
      return {
        totalCourses: 5,
        completedCourses: 2,
        totalHours: 47,
        progressPercentage: 65
      }
    })

    const recentActivity = ref([
      {
        icon: 'mdi-book-check',
        color: 'success',
        title: 'Lección completada',
        description: 'Matemáticas Básicas - Capítulo 3',
        date: 'Hace 2 horas'
      },
      {
        icon: 'mdi-shopping',
        color: 'primary',
        title: 'Curso adquirido',
        description: 'Física para Universitarios',
        date: 'Hace 1 día'
      },
      {
        icon: 'mdi-school',
        color: 'info',
        title: 'Sincronización con Moodle',
        description: 'Datos actualizados correctamente',
        date: 'Hace 2 días'
      }
    ])

    // Methods
    const loadUserProfile = () => {
      if (user.value.userData) {
        profileData.value = {
          firstName: user.value.userData.firstName || '',
          lastName: user.value.userData.lastName || '',
          email: user.value.userData.email || '',
          country: user.value.userData.country || 'CL'
        }
        
        // Keep original data for cancel functionality
        originalProfileData.value = { ...profileData.value }
      }
    }

    const saveProfile = async () => {
      if (!formValid.value) return

      saving.value = true

      try {
        // TODO: Implement actual save to backend
        // const result = await authService.updateProfile(profileData.value)
        
        // Mock success
        await new Promise(resolve => setTimeout(resolve, 1000))

        showSnackbar('Perfil actualizado exitosamente', 'success')
        editMode.value = false
        originalProfileData.value = { ...profileData.value }

      } catch (error) {
        console.error('Error saving profile:', error)
        showSnackbar('Error al guardar el perfil', 'error')
      } finally {
        saving.value = false
      }
    }

    const cancelEdit = () => {
      profileData.value = { ...originalProfileData.value }
      editMode.value = false
    }

    const openMoodle = () => {
      authService.openMoodleSSO()
      showSnackbar('Abriendo Moodle...', 'info')
    }

    const syncWithMoodle = async () => {
      syncing.value = true

      try {
        // Sync progress and grades from Moodle
        const progressResult = await authService.syncProgressFromMoodle()
        const gradesResult = await authService.syncGradesFromMoodle()

        if (progressResult.success && gradesResult.success) {
          showSnackbar('Sincronización completada exitosamente', 'success')
        } else {
          showSnackbar('Sincronización parcial: algunos datos no se pudieron actualizar', 'warning')
        }

      } catch (error) {
        console.error('Error syncing with Moodle:', error)
        showSnackbar('Error en la sincronización con Moodle', 'error')
      } finally {
        syncing.value = false
      }
    }

    const showSnackbar = (message, color = 'success', timeout = 4000) => {
      snackbar.value = {
        show: true,
        message,
        color,
        timeout
      }
    }

    // Lifecycle
    onMounted(() => {
      loadUserProfile()
    })

    return {
      // Computed
      user,
      moodleStatus,
      lastSync,
      stats,

      // Reactive data
      editMode,
      formValid,
      saving,
      syncing,
      profileData,
      countries,
      recentActivity,
      snackbar,

      // Validation rules
      nameRules,

      // Methods
      saveProfile,
      cancelEdit,
      openMoodle,
      syncWithMoodle
    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}

.text-h3 {
  line-height: 1.2;
}
</style>
