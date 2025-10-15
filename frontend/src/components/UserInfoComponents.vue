<script setup>
import { ref, computed, onMounted } from "vue";
import authService from "@/services/authService";
import "@/assets/styles/userinfo.css";

// Reactive data
const user = computed(() => authService.getCurrentUser());
const editMode = ref(false);
const formValid = ref(true);
const saving = ref(false);
const syncing = ref(false);

const profileData = ref({
  firstName: "",
  lastName: "",
  email: "",
  country: "CL",
});

const originalProfileData = ref({});

// Countries list
const countries = ref([
  { name: "Chile", code: "CL" },
  { name: "Argentina", code: "AR" },
  { name: "Perú", code: "PE" },
  { name: "Colombia", code: "CO" },
  { name: "México", code: "MX" },
  { name: "España", code: "ES" },
  { name: "Otro", code: "OTHER" },
]);

// Validation rules
const nameRules = [
  (v) => !!v || "Este campo es requerido",
  (v) => (v && v.length >= 2) || "Debe tener al menos 2 caracteres",
];

// Computed properties
const moodleStatus = computed(() => {
  if (!user.value?.isAuthenticated) {
    return {
      color: "grey",
      icon: "mdi-account-off",
      text: "No autenticado",
    };
  }

  if (user.value?.moodleData) {
    return {
      color: "success",
      icon: "mdi-check-circle",
      text: "Conectado y sincronizado",
    };
  }

  return {
    color: "warning",
    icon: "mdi-alert-circle",
    text: "Conexión pendiente",
  };
});

const lastSync = computed(() => {
  // Mock data - en producción vendría del backend
  return new Date().toLocaleDateString("es-CL");
});

const stats = computed(() => {
  // Mock data - en producción vendría del backend/Moodle
  return {
    totalCourses: 5,
    completedCourses: 2,
    totalHours: 47,
    progressPercentage: 65,
  };
});

// Methods
const loadUserProfile = () => {
  if (user.value?.userData) {
    profileData.value = {
      firstName: user.value.userData.firstName || "",
      lastName: user.value.userData.lastName || "",
      email: user.value.userData.email || "",
      country: user.value.userData.country || "CL",
    };

    // Keep original data for cancel functionality
    originalProfileData.value = { ...profileData.value };
  }
};

const saveProfile = async () => {
  if (!formValid.value) return;

  saving.value = true;

  try {
    // TODO: Implement actual save to backend
    // const result = await authService.updateProfile(profileData.value)

    // Mock success
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Perfil actualizado exitosamente");
    editMode.value = false;
    originalProfileData.value = { ...profileData.value };
  } catch (error) {
    console.error("Error saving profile:", error);
  } finally {
    saving.value = false;
  }
};

const cancelEdit = () => {
  profileData.value = { ...originalProfileData.value };
  editMode.value = false;
};

const openMoodle = () => {
  if (authService.openMoodleSSO) {
    authService.openMoodleSSO();
  }
  console.log("Abriendo Moodle...");
};

const syncWithMoodle = async () => {
  syncing.value = true;

  try {
    // Mock sync - en producción usaría authService
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Sincronización completada exitosamente");
  } catch (error) {
    console.error("Error syncing with Moodle:", error);
  } finally {
    syncing.value = false;
  }
};

// Lifecycle
onMounted(() => {
  loadUserProfile();
});
</script>

<template>
  <div>
    <!-- User Information Card -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-6 card-profile">
          <v-card-title class="d-flex align-center gap-2">
            <v-icon left color="primary">mdi-account</v-icon>
            Información Personal
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click="editMode = !editMode"
              class="fw-semibold bg-primary text-white btn-pencil"
            >
              <v-icon>{{ editMode ? "mdi-check" : "mdi-pencil" }}</v-icon>
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
                    @click="saveProfile"
                    :loading="saving"
                    :disabled="!formValid"
                    class="btn btn-profile mr-2 text-white fw-semibold"
                  >
                    Guardar Cambios
                  </v-btn>
                  <v-btn
                    class="btn btn-profile text-white fw-semibold"
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
        <v-card class="mb-6 card-profile">
          <v-card-title class="d-flex align-center gap-2">
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
              <p>
                <strong>ID Moodle:</strong>
                {{ user.moodleData.moodleUserId || "N/A" }}
              </p>
              <p><strong>Última sincronización:</strong> {{ lastSync }}</p>
            </div>

            <div class="mt-4">
              <v-btn
                color="primary"
                block
                @click="openMoodle"
                class="profile-bt text-white fw-semibold"
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
                class="mt-2 profile-bt text-white fw-semibold"
              >
                <v-icon left>mdi-sync</v-icon>
                Sincronizar datos
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Account Statistics -->
        <v-card class="card-profile">
          <v-card-title class="d-flex align-center gap-2">
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
  </div>
</template>

<style lang="scss" scoped></style>
