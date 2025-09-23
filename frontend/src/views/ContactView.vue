<template>
  <div class="contact-page">
    <!-- Contenedor principal responsive -->
    <div class="container m-auto">
      <div class="row">
        <!-- Columna izquierda - Formulario de contacto -->
        <h2 class="form-title pt-5 display-5 display-lg-4 text-center">
          Contacto
        </h2>
        <div
          class="col-lg-6 col-12 d-flex align-items-center justify-content-center"
        >
          <div class="form-container">
            <!-- Formulario -->
            <div class="contact-form-card">
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                class="contact-form"
              >
                <!-- Campo Nombre -->
                <div class="form-group mb-3">
                  <label class="form-label">Nombre</label>
                  <div class="input-wrapper position-relative">
                    <v-icon class="input-icon position-absolute" size="small"
                      >mdi-account</v-icon
                    >
                    <v-text-field
                      v-model="name"
                      :rules="nameRules"
                      placeholder="escribe tu nombre"
                      variant="outlined"
                      hide-details="auto"
                      class="custom-input"
                      required
                    ></v-text-field>
                    <v-icon
                      v-if="
                        name && nameRules.every((rule) => rule(name) === true)
                      "
                      class="check-icon position-absolute"
                      color="success"
                      size="small"
                    >
                      mdi-check
                    </v-icon>
                  </div>
                </div>

                <!-- Campo Email -->
                <div class="form-group mb-3">
                  <label class="form-label">Correo</label>
                  <div class="input-wrapper position-relative">
                    <v-icon class="input-icon position-absolute" size="small"
                      >mdi-email</v-icon
                    >
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      placeholder="escribe tu correo"
                      variant="outlined"
                      hide-details="auto"
                      class="custom-input"
                      type="email"
                      required
                    ></v-text-field>
                    <v-icon
                      v-if="
                        email &&
                        emailRules.every((rule) => rule(email) === true)
                      "
                      class="check-icon position-absolute"
                      color="success"
                      size="small"
                    >
                      mdi-check
                    </v-icon>
                  </div>
                </div>

                <!-- Campo Mensaje -->
                <div class="form-group mb-4">
                  <label class="form-label">Mensaje</label>
                  <div class="input-wrapper">
                    <v-textarea
                      v-model="message"
                      :rules="messageRules"
                      placeholder="Escribe un mensaje"
                      variant="outlined"
                      hide-details="auto"
                      class="custom-textarea"
                      rows="4"
                      required
                    ></v-textarea>
                  </div>
                </div>

                <!-- Botón enviar -->
                <div class="text-center">
                  <v-btn
                    color="success"
                    size="large"
                    class="send-button px-4 py-2"
                    @click="submit"
                    :disabled="!valid"
                  >
                    Enviar
                  </v-btn>
                </div>
              </v-form>
            </div>
          </div>
        </div>

        <!-- Columna derecha - Información de contacto -->
        <div class="col-lg-6 col-12 d-flex">
          <div class="info-container">
            <div class="contact-info-card bg-light p-5 rounded-3 shadow-sm">
              <h2 class="info-title text-center">Información de contacto</h2>

              <div class="contact-item mb-4">
                <v-icon class="contact-icon" color="primary">mdi-email</v-icon>
                <div class="contact-details">
                  <p>Email:</p>
                  <span class="text-muted">contacto@academia.com</span>
                </div>
              </div>

              <div class="contact-item mb-4">
                <v-icon class="contact-icon" color="primary">mdi-phone</v-icon>
                <div class="contact-details">
                  <p>Teléfono:</p>
                  <span class="text-muted">+56 2 1234 5678</span>
                </div>
              </div>

              <div class="contact-item">
                <v-icon class="contact-icon" color="primary"
                  >mdi-map-marker</v-icon
                >
                <div class="contact-details">
                  <p>Dirección:</p>
                  <span class="text-muted"
                    >Avenida Ejemplo 123, Santiago, Chile</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactView",
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      (v) => !!v || "Nombre es requerido",
      (v) =>
        (v && v.length >= 2) || "El nombre debe tener al menos 2 caracteres",
    ],
    email: "",
    emailRules: [
      (v) => !!v || "E-mail es requerido",
      (v) => /.+@.+\..+/.test(v) || "E-mail debe ser válido",
    ],
    message: "",
    messageRules: [
      (v) => !!v || "Mensaje es requerido",
      (v) =>
        (v && v.length >= 10) || "El mensaje debe tener al menos 10 caracteres",
    ],
  }),

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        // Submit form logic here
        alert("Gracias por tu mensaje. Te contactaremos pronto.");
        this.$refs.form.reset();
      }
    },
  },
};
</script>

<style scoped>
/* Página principal */
.contact-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

/* Contenedor del formulario */
.form-container {
  width: 100%;
  max-width: 450px;
  padding: 20px;
}

/* Tarjeta del formulario */
.contact-form-card {
  background: white;
  border-radius: 20px;
  padding: 40px 35px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 2;
}

/* Título del formulario */
.form-title {
  color: #373b8a;
  font-weight: 800;
  font-family: "Montserrat", sans-serif;
}

/* Etiquetas de campos */
.form-label {
  display: block;
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
  font-family: "Dm Sans", sans-serif;
}

/* Wrapper de inputs */
.input-wrapper {
  margin-bottom: 5px;
}

.input-icon {
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  color: #999;
}

.check-icon {
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
}

/* Estilos personalizados para inputs */
:deep(.custom-input .v-field) {
  background-color: #f8f9fa;
  border-radius: 12px;
}

:deep(.custom-input .v-field__input) {
  padding-left: 45px;
  font-size: 0.95rem;
  color: #333;
}

:deep(.custom-input .v-field__outline) {
  --v-field-border-opacity: 0.15;
}

:deep(.custom-input .v-field--focused .v-field__outline) {
  --v-field-border-width: 2px;
  --v-border-color: #20b2aa;
}

:deep(.custom-textarea .v-field) {
  background-color: #f8f9fa;
  border-radius: 12px;
}

:deep(.custom-textarea .v-field__input) {
  font-size: 0.95rem;
  min-height: 100px;
  color: #333;
}

:deep(.custom-textarea .v-field__outline) {
  --v-field-border-opacity: 0.15;
}

:deep(.custom-textarea .v-field--focused .v-field__outline) {
  --v-field-border-width: 2px;
  --v-border-color: #20b2aa;
}

/* Placeholder styles */
:deep(.v-field__input::placeholder) {
  color: #aaa !important;
  opacity: 1;
}

/* Botón de envío */
.send-button {
  color: white !important;
  border-radius: 25px !important;
  font-weight: 600 !important;
  font-family: "Dm Sans", sans-serif;
  min-width: 120px !important;
  height: 48px !important;
  text-transform: none !important;
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.25) !important;
  transition: all 0.3s ease !important;
}

.send-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(40, 167, 69, 0.35) !important;
}

/* Contenedor de información */
.info-container {
  padding: 20px;
}

.info-title {
  color: #20b2aa;
  font-size: 1.8rem;
  font-weight: 700;
  font-family: "Montserrat", sans-serif;
}

/* Items de contacto */
.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.contact-icon {
  margin-top: 5px;
  font-size: 1.3rem !important;
}

.contact-details {
  font-family: "Dm Sans", sans-serif;
}

/* Responsive */
@media (max-width: 992px) {
  .form-container {
    max-width: 100%;
  }

  .contact-form-card {
    padding: 30px 25px;
    margin-bottom: 20px;
  }

  .form-title {
    font-size: 2rem;
    text-align: center;
  }

  .info-container {
    max-width: 100%;
  }

  .contact-info-card {
    padding: 30px 25px;
  }
}

@media (max-width: 768px) {
  .decoration {
    display: none;
  }

  .contact-form-card {
    padding: 25px 20px;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .contact-info-card {
    padding: 25px 20px;
  }

  .info-title {
    font-size: 1.5rem;
  }
}

/* Fondo de la columna derecha */
.bg-light {
  background-color: #f8f9fa !important;
}

/* Override Vuetify error states */
:deep(.v-messages) {
  color: #dc3545 !important;
  font-size: 0.85rem;
  margin-top: 5px;
}
</style>
