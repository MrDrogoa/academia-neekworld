<template>
  <v-dialog
    v-model="localVisible"
    class="form-dialog"
    @click:outside="closeDialog"
  >
    <v-card class="pa-4 card-login rounded-lg position-relative">
      <!-- Botón de cerrar en la esquina superior derecha -->
      <v-btn
        icon
        size="small"
        class="close-btn"
        @click="closeDialog"
        variant="text"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-card-title class="text-center">
        <h3 class="txt-color fs-4">
          {{ isLogin ? "Ingresar" : "Registrate" }}
        </h3>
      </v-card-title>

      <v-card-text>
        <v-alert
          v-if="alertMessage"
          :type="alertType"
          dismissible
          @input="alertMessage = ''"
          class="mb-4"
        >
          {{ alertMessage }}
        </v-alert>

        <v-form ref="authForm" v-model="formValid" lazy-validation>
          <!-- Campos para registro -->
          <div v-if="!isLogin">
            <label class="form-label fw-medium label-color">Nombre</label>
            <v-text-field
              v-model="formData.firstName"
              label="escribe tu nombre"
              class="input-text"
              :rules="nameRules"
              required
              outlined
              dense
            ></v-text-field>
            <label class="form-label fw-medium label-color">Apellido</label>

            <v-text-field
              v-model="formData.lastName"
              label="escribe tu apellido"
              :rules="nameRules"
              class="input-text"
              required
              outlined
              dense
            ></v-text-field>
          </div>

          <!-- Email (común para login y registro) -->
          <label class="form-label fw-medium label-color">Email</label>
          <v-text-field
            v-model="formData.email"
            label="Email"
            class="input-text"
            :rules="emailRules"
            required
            outlined
            dense
            type="email"
          ></v-text-field>

          <!-- Password (común para login y registro) -->
          <label class="form-label fw-medium label-color">Contraseña</label>
          <v-text-field
            v-model="formData.password"
            :label="isLogin ? 'Contraseña' : 'Contraseña'"
            class="input-text"
            :rules="passwordRules"
            required
            outlined
            dense
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          ></v-text-field>

          <!-- Confirmar password solo para registro -->
          <div v-if="!isLogin">
            <label class="form-label fw-medium label-color"
              >Confirmar Contraseña</label
            >
            <v-text-field
              v-model="formData.confirmPassword"
              label="Confirmar Contraseña"
              class="input-text"
              :rules="confirmPasswordRules"
              required
              outlined
              dense
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
            ></v-text-field>
          </div>

          <!-- Campos adicionales para registro -->
          <div v-if="!isLogin">
            <v-checkbox
              v-model="formData.acceptTerms"
              :rules="termsRules"
              required
            >
              <template v-slot:label>
                <div>
                  Acepto los
                  <a href="#" @click.stop="showTerms = true"
                    >términos y condiciones</a
                  >
                </div>
              </template>
            </v-checkbox>
          </div>
        </v-form>

        <!-- Información sobre integración con Moodle -->
        <v-expansion-panels v-if="!isLogin" flat>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-school</v-icon>
                <span class="text-body-2">Integración con Moodle</span>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="text-caption">
                <p><strong>Al registrarte:</strong></p>
                <ul>
                  <li>Se creará tu cuenta automáticamente en Moodle</li>
                  <li>Podrás acceder directamente a tus cursos</li>
                  <li>Tu progreso se sincronizará automáticamente</li>
                  <li>Recibirás tus calificaciones en tiempo real</li>
                </ul>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text
          @click="closeDialog"
          class="text-cancel btn btn-danger text-white"
          :disabled="loading"
        >
          Cancelar
        </v-btn>

        <v-btn
          color="primary"
          class="text-seRe"
          @click="submitForm"
          :loading="loading"
          :disabled="!formValid || loading"
        >
          {{ isLogin ? "Iniciar Sesión" : "Registrarse" }}
        </v-btn>
      </v-card-actions>

      <v-divider></v-divider>

      <v-card-actions class="justify-center text-cuestion">
        <v-btn text color="primary" @click="toggleMode" :disabled="loading">
          {{
            isLogin
              ? "¿No tienes cuenta? Regístrate"
              : "¿Ya tienes cuenta? Inicia sesión"
          }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Dialog de términos y condiciones -->
    <v-dialog v-model="showTerms" max-width="600px">
      <v-card>
        <v-card-title>Términos y Condiciones</v-card-title>
        <v-card-text>
          <div class="text-body-2">
            <h3>Academia de Preparación para Exámenes</h3>
            <p>
              Al utilizar nuestra plataforma, aceptas los siguientes términos:
            </p>

            <h4>1. Uso de la Plataforma</h4>
            <p>
              La plataforma está diseñada para la preparación de exámenes y el
              aprendizaje en línea.
            </p>

            <h4>2. Integración con Moodle</h4>
            <p>
              Tu cuenta se sincronizará automáticamente con nuestro sistema
              Moodle para una experiencia de aprendizaje integrada.
            </p>

            <h4>3. Privacidad</h4>
            <p>
              Tus datos personales serán protegidos y utilizados únicamente para
              fines educativos.
            </p>

            <h4>4. Cursos y Contenido</h4>
            <p>El acceso a los cursos es personal e intransferible.</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="showTerms = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import { ref, computed, watch } from "vue";
import authService from "@/services/authService";

export default {
  name: "AuthDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "login", // 'login' o 'register'
    },
  },
  emits: ["update:visible", "auth-success", "auth-error"],
  setup(props, { emit }) {
    // Reactive data
    const localVisible = computed({
      get: () => props.visible,
      set: (value) => emit("update:visible", value),
    });

    const isLogin = ref(props.mode === "login");
    const loading = ref(false);
    const formValid = ref(false);
    const showPassword = ref(false);
    const showTerms = ref(false);
    const alertMessage = ref("");
    const alertType = ref("success");

    const formData = ref({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    });

    // Países disponibles
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

    const emailRules = [
      (v) => !!v || "Email es requerido",
      (v) => /.+@.+\..+/.test(v) || "Email debe ser válido",
    ];

    const passwordRules = [
      (v) => !!v || "Contraseña es requerida",
      (v) =>
        (v && v.length >= 6) || "Contraseña debe tener al menos 6 caracteres",
    ];

    const confirmPasswordRules = computed(() => [
      (v) => !!v || "Confirmar contraseña es requerido",
      (v) => v === formData.value.password || "Las contraseñas no coinciden",
    ]);

    const termsRules = [(v) => v || "Debes aceptar los términos y condiciones"];

    // Methods
    const resetForm = () => {
      formData.value = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
      };
      alertMessage.value = "";
    };

    const closeDialog = () => {
      localVisible.value = false;
      resetForm();
    };

    const toggleMode = () => {
      isLogin.value = !isLogin.value;
      resetForm();
    };

    const showAlert = (message, type = "error") => {
      alertMessage.value = message;
      alertType.value = type;
    };

    const submitForm = async () => {
      if (!formValid.value) return;

      loading.value = true;

      try {
        let result;

        if (isLogin.value) {
          // Login
          result = await authService.login({
            email: formData.value.email,
            password: formData.value.password,
          });
        } else {
          // Register
          result = await authService.register({
            firstName: formData.value.firstName,
            lastName: formData.value.lastName,
            email: formData.value.email,
            password: formData.value.password,
          });
        }

        if (result.success) {
          showAlert(result.message, "success");

          // Mostrar advertencia sobre Moodle si es necesario
          if (result.moodleWarning) {
            setTimeout(() => {
              showAlert(result.moodleWarning, "warning");
            }, 2000);
          }

          emit("auth-success", {
            mode: isLogin.value ? "login" : "register",
            userData: result.userData,
            moodleData: result.moodleData,
          });

          // Cerrar dialog después de un breve delay
          setTimeout(() => {
            closeDialog();
          }, 1500);
        } else {
          showAlert(result.message, "error");
          emit("auth-error", result);
        }
      } catch (error) {
        console.error("Auth error:", error);
        showAlert("Error inesperado. Intenta nuevamente.", "error");
        emit("auth-error", { message: error.message });
      } finally {
        loading.value = false;
      }
    };

    // Watch for mode changes
    watch(
      () => props.mode,
      (newMode) => {
        isLogin.value = newMode === "login";
      }
    );

    return {
      // Computed
      localVisible,
      confirmPasswordRules,

      // Reactive data
      isLogin,
      loading,
      formValid,
      showPassword,
      showTerms,
      alertMessage,
      alertType,
      formData,
      countries,

      // Validation rules
      nameRules,
      emailRules,
      passwordRules,
      termsRules,

      // Methods
      closeDialog,
      toggleMode,
      submitForm,
    };
  },
};
</script>

<style scoped>
.card-login {
  margin: 0 !important;
  position: relative;
}

.card-login {
  transform: translateY(0);
}

/* Botón de cerrar */
.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  color: #666 !important;
  transition: all 0.2s ease;
}

/* form */

.form-dialog {
  max-width: 500px;
}

.text-cancel,
.text-seRe,
.text-cuestion,
.label-color,
.input-text {
  font-family: "Dm Sans", sans-serif;
}

.close-btn:hover {
  color: #373b8a !important;
  background-color: rgba(55, 59, 138, 0.1) !important;
  transform: scale(1.1);
}

.text-caption ul {
  margin-left: 16px;
}

/* color texto */
.txt-color {
  color: #373b8a;
}

.label-color {
  color: #333;
}

:deep(.v-field__field) {
  padding: 2px !important;
}
</style>
