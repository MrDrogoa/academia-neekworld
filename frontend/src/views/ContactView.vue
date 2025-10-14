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
                    class="send-button px-4 py-2 text-white"
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
            <div
              class="contact-info-card bg-light bg-contactForm p-5 rounded-3 shadow-sm"
            >
              <h2 class="info-title text-center">Información de contacto</h2>

              <div class="contact-item mb-4">
                <v-icon class="contact-icon" color="primary">mdi-email</v-icon>
                <div class="contact-details">
                  <p>Email:</p>
                  <span class="text-muted text-contact"
                    >contacto@academia.com</span
                  >
                </div>
              </div>

              <div class="contact-item mb-4">
                <v-icon class="contact-icon" color="primary">mdi-phone</v-icon>
                <div class="contact-details">
                  <p>Teléfono:</p>
                  <span class="text-muted text-contact">+56 2 1234 5678</span>
                </div>
              </div>

              <div class="contact-item">
                <v-icon class="contact-icon" color="primary"
                  >mdi-map-marker</v-icon
                >
                <div class="contact-details">
                  <p>Dirección:</p>
                  <span class="text-muted text-contact"
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
    nameRules: [(v) => !!v || "Nombre es requerido"],
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
  position: relative;
}

/* Altura específica solo para inputs de texto, no para textarea */
.input-wrapper:has(.custom-input) {
  height: 56px; /* Altura fija solo para inputs de texto */
}

/* Textarea mantiene altura automática */
.input-wrapper:has(.custom-textarea) {
  height: auto; /* Altura automática para textarea */
}

/* Asegurar que los iconos se mantengan centrados en todos los estados */
:deep(.custom-input .v-field) {
  position: relative;
  height: 56px !important;
  min-height: 56px !important;
}

:deep(.custom-input .v-field__field) {
  position: relative;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.custom-input .v-field__input) {
  position: relative;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
}

/* Textarea mantiene altura natural */
:deep(.custom-textarea .v-field) {
  position: relative;
  height: auto !important;
  min-height: auto !important;
}

:deep(.custom-textarea .v-field__field) {
  position: relative;
  height: auto !important;
}

:deep(.custom-textarea .v-field__input) {
  position: relative;
  height: auto !important;
}

.input-icon {
  left: 12px;
  top: 50% !important;
  transform: translateY(-50%) !important;
  z-index: 10 !important;
  color: #999;
  pointer-events: none;
  position: absolute !important;
  height: 20px !important;
  width: 20px !important;
  line-height: 1 !important;
}

.check-icon {
  right: 12px;
  top: 50% !important;
  transform: translateY(-50%) !important;
  z-index: 10 !important;
  pointer-events: none;
  position: absolute !important;
  height: 20px !important;
  width: 20px !important;
  line-height: 1 !important;
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

/* Evitar que los iconos se muevan durante las transiciones */
:deep(.custom-input .v-field__overlay),
:deep(.custom-input .v-field__outline),
:deep(.custom-input .v-field__loader) {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

:deep(.custom-input.v-field--focused),
:deep(.custom-input.v-field--active),
:deep(.custom-input.v-field--dirty) {
  transform: none !important;
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
  min-height: 120px !important; /* Altura más natural para textarea */
  color: #333;
  resize: none !important; /* Deshabilitar el resize del textarea */
  padding: 12px !important; /* Padding interno adecuado */
}

:deep(.custom-textarea textarea) {
  resize: none !important; /* Asegurar que el textarea no sea redimensionable */
  min-height: 120px !important;
  padding: 12px !important;
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
  border-radius: 25px !important;
  font-weight: 600 !important;
  font-family: "Dm Sans", sans-serif;
  min-width: 120px !important;
  height: 48px !important;
  text-transform: none !important;

  transition: all 0.3s ease !important;
}

.send-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(40, 167, 69, 0.35) !important;
}

.v-theme--dark .send-button {
  color: #000 !important;
}

.v-theme--dark .send-button:hover {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3) !important;
}

.v-theme--dark .bg-contactForm {
  background-color: var(--v-theme-primary-1) !important;
}

.v-theme--dark .info-title,
.v-theme--dark .text-contact {
  color: var(--v-theme-text) !important;
}

.high-contrast-mode .bg-contactForm {
  background-color: #000 !important;
  border: 3px solid #fff !important;
  color: #fff !important;
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
  text-align: right !important; /* Alinear mensajes de error a la derecha */
  padding-right: 8px !important;
}

:deep(.v-messages__message) {
  text-align: right !important;
}

/* Estabilizar posición de iconos - Solución completa */
.input-wrapper .v-icon {
  transition: none !important;
  will-change: auto !important;
}

/* Mantener iconos centrados en todos los estados */
.input-wrapper .input-icon,
.input-wrapper .check-icon {
  position: absolute !important;
  top: 28px !important; /* Mitad de 56px altura del campo */
  transform: translateY(-50%) !important;
}

/* Forzar posición estable durante estados del campo */
:deep(.input-wrapper .v-field--focused) .input-icon,
:deep(.input-wrapper .v-field--active) .input-icon,
:deep(.input-wrapper .v-field--dirty) .input-icon,
:deep(.input-wrapper .v-field--error) .input-icon {
  top: 28px !important;
  transform: translateY(-50%) !important;
}

:deep(.input-wrapper .v-field--focused) .check-icon,
:deep(.input-wrapper .v-field--active) .check-icon,
:deep(.input-wrapper .v-field--dirty) .check-icon,
:deep(.input-wrapper .v-field--error) .check-icon {
  top: 28px !important;
  transform: translateY(-50%) !important;
}
</style>
