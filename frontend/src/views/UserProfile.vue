<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        <h2 class="title-profile text-center pb-5 display-5 display-lg-4">
          Mi Perfil
        </h2>
      </v-col>
    </v-row>

    <UserInfoComponents />

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
                  <v-list-item-subtitle>{{
                    activity.description
                  }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-list-item-action-text>{{
                    activity.date
                  }}</v-list-item-action-text>
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
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import authService from "@/services/authService";
import UserInfoComponents from "@/components/UserInfoComponents.vue";

export default {
  name: "UserProfile",
  components: {
    UserInfoComponents,
  },
  setup() {
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

    const snackbar = ref({
      show: false,
      message: "",
      color: "success",
      timeout: 4000,
    });

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
      if (!user.value.isAuthenticated) {
        return {
          color: "grey",
          icon: "mdi-account-off",
          text: "No autenticado",
        };
      }

      if (user.value.moodleData) {
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

    const recentActivity = ref([
      {
        icon: "mdi-book-check",
        color: "success",
        title: "Lección completada",
        description: "Matemáticas Básicas - Capítulo 3",
        date: "Hace 2 horas",
      },
      {
        icon: "mdi-shopping",
        color: "primary",
        title: "Curso adquirido",
        description: "Física para Universitarios",
        date: "Hace 1 día",
      },
      {
        icon: "mdi-school",
        color: "info",
        title: "Sincronización con Moodle",
        description: "Datos actualizados correctamente",
        date: "Hace 2 días",
      },
    ]);

    // Methods
    const loadUserProfile = () => {
      if (user.value.userData) {
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

        showSnackbar("Perfil actualizado exitosamente", "success");
        editMode.value = false;
        originalProfileData.value = { ...profileData.value };
      } catch (error) {
        console.error("Error saving profile:", error);
        showSnackbar("Error al guardar el perfil", "error");
      } finally {
        saving.value = false;
      }
    };

    const cancelEdit = () => {
      profileData.value = { ...originalProfileData.value };
      editMode.value = false;
    };

    const openMoodle = () => {
      authService.openMoodleSSO();
      showSnackbar("Abriendo Moodle...", "info");
    };

    const syncWithMoodle = async () => {
      syncing.value = true;

      try {
        // Sync progress and grades from Moodle
        const progressResult = await authService.syncProgressFromMoodle();
        const gradesResult = await authService.syncGradesFromMoodle();

        if (progressResult.success && gradesResult.success) {
          showSnackbar("Sincronización completada exitosamente", "success");
        } else {
          showSnackbar(
            "Sincronización parcial: algunos datos no se pudieron actualizar",
            "warning"
          );
        }
      } catch (error) {
        console.error("Error syncing with Moodle:", error);
        showSnackbar("Error en la sincronización con Moodle", "error");
      } finally {
        syncing.value = false;
      }
    };

    const showSnackbar = (message, color = "success", timeout = 4000) => {
      snackbar.value = {
        show: true,
        message,
        color,
        timeout,
      };
    };

    // Lifecycle
    onMounted(() => {
      loadUserProfile();
    });

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
      syncWithMoodle,
    };
  },
};
</script>

<style scoped>
.title-profile {
  color: #373b8a;
  font-weight: 800;
  font-family: "Montserrat", sans-serif;
}

.v-card {
  border-radius: 12px;
}

.text-h3 {
  line-height: 1.2;
}
</style>
