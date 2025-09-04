<template>
  <div class="home-page home-view">
    <section class="hero-section">
      <div class="container-fluid px-4">
        <div class="row justify-content-center align-items-center">
          <!-- Imagen - En pantallas grandes a la izquierda, en móviles arriba -->
          <div
            class="col-12 col-lg-6 order-1 order-md-1 text-center mb-4 mb-md-0"
          >
            <div class="hero-image-container">
              <img
                :src="ImgHero"
                alt="img-hero"
                class="hero-image img-fluid rounded-3"
              />
            </div>
          </div>

          <!-- Contenido - En pantallas grandes a la derecha, en móviles abajo -->
          <div class="col-12 col-lg-6 order-2 order-md-2">
            <div class="hero-content px-3 px-md-4 position-relative">
              <h1
                class="hero-title display-4 display-lg-3 display-xl-2 lh-1 mb-3 mt-md-4 text-center text-md-start"
              >
                Academia Digital de NeekWorld
              </h1>
              <p
                class="hero-subtitle w-75 m-auto mb-4 text-center text-md-start"
              >
                "Aprende en línea, a tu ritmo y desde cualquier lugar, con
                cursos diseñados para adaptarse a tu estilo de vida."
              </p>
              <!-- Iconos de características -->
              <div class="feature-icon-1 position-absolute">
                <FontAwesomeIcon
                  icon=" fa-solid fa-scissors"
                  class="fs-2 opacity-75"
                />
              </div>
              <div class="feature-icon-2 position-absolute">
                <FontAwesomeIcon
                  icon="fa-solid fa-award"
                  class="fs-1 opacity-75"
                />
              </div>
              <!-- <div class="feature-icon-3 position-absolute">
                <FontAwesomeIcon
                  icon="fa-solid fa-graduation-cap"
                  class="fs-2 opacity-75"
                />
              </div>
              <div class="feature-icon-4 position-absolute">
                <FontAwesomeIcon
                  icon="fa-solid fa-ruler"
                  class="fs-2 opacity-100"
                />
              </div> -->
              <div
                class="hero-buttons d-flex flex-column flex-sm-row gap-3 justify-content-md-center justify-content-md-start"
              >
                <router-link
                  to="/courses"
                  class="btn btn-primary text-decoration-none border-0 rounded-4 px-4 py-3 fw-medium"
                >
                  Cursos
                </router-link>
                <button
                  v-if="!user.isAuthenticated"
                  @click="openAuthDialog('register')"
                  class="btn btn-secondary border-0 rounded-4 px-4 py-3 fw-medium"
                >
                  Regístrate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <h2 class="section-title text-center pb-5 display-5 display-lg-4">
          ¿Por qué elegirnos?
        </h2>

        <div class="features-grid py-4">
          <div class="feature-card cursor-pointer">
            <div class="icon-main mb-3">
              <FontAwesomeIcon icon="fa-solid fa-note-sticky" class="fs-1" />
            </div>
            <h3 class="title-main fw-bold">Variedad de Cursos</h3>
            <p class="txt-main">
              Descubre cursos en numerosas áreas de conocimiento
            </p>
          </div>

          <div class="feature-card cursor-pointer">
            <div class="icon-main mb-3">
              <FontAwesomeIcon icon="fa-solid fa-gear" class="fs-1" />
            </div>
            <h3 class="title-main fw-bold">Instructores Expertos</h3>
            <p class="txt-main">
              Aprende de profesionales con experiencia en la industria
            </p>
          </div>

          <div class="feature-card cursor-pointer">
            <div class="icon-main mb-3">
              <FontAwesomeIcon
                icon="fa-solid fa-magnifying-glass"
                class="fs-1"
              />
            </div>
            <h3 class="title-main fw-bold">Aprendizaje Flexible</h3>
            <p class="txt-main">
              Estudia a tu propio ritmo, cuando y donde quieras
            </p>
          </div>

          <div class="feature-card cursor-pointer">
            <div class="icon-main mb-3">
              <FontAwesomeIcon icon="fa-solid fa-medal" class="fs-1" />
            </div>
            <h3 class="title-main fw-bold">Certificaciones</h3>
            <p class="txt-main">
              Obtén certificados que validen tus nuevas habilidades
            </p>
          </div>

          <!-- Nueva feature sobre integración Moodle -->
          <div class="feature-card cursor-pointer">
            <div class="icon-main mb-3">
              <FontAwesomeIcon icon="fa-solid fa-circle-check" class="fs-1" />
            </div>
            <h3 class="title-main fw-bold">Integración Moodle</h3>
            <p class="txt-main">
              Acceso directo a Moodle con sincronización automática
            </p>
          </div>

          <div class="feature-card cursor-pointer">
            <div class="icon-main mb-3">
              <FontAwesomeIcon icon="fa-solid fa-bolt" class="fs-1" />
            </div>
            <h3 class="title-main fw-bold">Inscripción Automática</h3>
            <p class="txt-main">
              Al comprar un curso, quedas inscrito automáticamente
            </p>
          </div>

          <!-- Nueva feature sobre pasantías internacionales -->
          <div class="feature-card cursor-pointer">
            <div class="icon-main mb-3">
              <FontAwesomeIcon icon="fa-solid fa-earth-americas" class="fs-1" />
            </div>
            <h3 class="title-main fw-bold">
              Convenio Pasantías Internacionales
            </h3>
            <p class="txt-main">
              Próximamente: Oportunidades de pasantías en el extranjero
            </p>
          </div>

          <!-- Nueva feature sobre terapias -->
          <div class="feature-card cursor-pointer">
            <div class="icon-main mb-3">
              <FontAwesomeIcon icon="fa-solid fa-brain" class="fs-1" />
            </div>
            <h3 class="title-main fw-bold">Convenio con Terapias</h3>
            <p class="txt-main">
              Próximamente: Servicios de psicología, terapia de pareja y familia
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container py-4">
        <div class="cta-content text-center py-5">
          <h2
            class="title-action text-white w-75 display-5 display-lg-4 m-auto"
          >
            ¿Listo para empezar tu viaje de aprendizaje?
          </h2>
          <p class="txt-action text-white w-75 my-3 lh-1.5 m-auto">
            Únete hoy a nuestra comunidad de estudiantes y transforma tu futuro
          </p>
          <button
            @click="openAuthDialog('register')"
            class="btn btn-primary mt-3 border-0 btn btn-primary border-0 rounded-4 px-4 py-3 fw-medium"
          >
            Comenzar ahora
          </button>
        </div>
      </div>
    </section>

    <!-- Auth Dialog -->
    <AuthDialog
      v-model:visible="authDialog.visible"
      :mode="authDialog.mode"
      @auth-success="handleAuthSuccess"
      @auth-error="handleAuthError"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import authService from "@/services/authService";
import AuthDialog from "@/components/AuthDialog.vue";
import { useAccessibility } from "@/composables/useAccessibility";

const ImgHero = require("@/assets/img/hero-image.webp");

// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "HomeView",
  components: {
    AuthDialog,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    // Reactive data
    const user = computed(() => authService.getCurrentUser());

    // Accessibility composable
    const { loadSavedSettings } = useAccessibility();

    const authDialog = ref({
      visible: false,
      mode: "login",
    });

    // Methods
    const openAuthDialog = (mode) => {
      authDialog.value.mode = mode;
      authDialog.value.visible = true;
    };

    const handleAuthSuccess = () => {
      // Si hay una ruta de redirección, ir ahí
      const redirectPath = route.query.redirect;
      if (redirectPath) {
        router.push(redirectPath);
      }
    };

    const handleAuthError = (error) => {
      console.error("Auth error:", error);
    };

    // Watch for query parameters to auto-open auth dialog
    watch(
      () => route.query.showAuth,
      (showAuth) => {
        if (showAuth && (showAuth === "login" || showAuth === "register")) {
          openAuthDialog(showAuth);

          // Clean query parameters
          const query = { ...route.query };
          delete query.showAuth;
          router.replace({ query });
        }
      },
      { immediate: true }
    );

    // Lifecycle
    onMounted(() => {
      // Cargar configuraciones de accesibilidad guardadas
      loadSavedSettings();

      // Check if auth dialog should be opened based on query params
      if (route.query.showAuth) {
        openAuthDialog(route.query.showAuth);
      }
    });

    return {
      // Computed
      user,
      ImgHero,

      // Reactive data
      authDialog,

      // Methods
      openAuthDialog,
      handleAuthSuccess,
      handleAuthError,
    };
  },
};
</script>

<style scoped>
/* ===== ESTILOS BASE RESPONSIVE AL TEMA ===== */
.home-page {
  font-family: "Montserrat", sans-serif;
  background-color: #f8f9fa;
}

/* ===== HERO SECTION - ADAPTATIVA A TEMAS ===== */
.hero-section {
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
  text-align: center;
  padding: 60px 20px;
  /* background-image: linear-gradient(135deg, #2a3b5f, #2a3b5f); */
}

/* Modo oscuro - Hero section */
.v-theme--dark .hero-section {
  background-image: linear-gradient(
    135deg,
    #1a202c 0%,
    #2d3748 50%,
    #4a5568 100%
  );
  color: #e2e8f0;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-family: "Montserrat", serif;
  margin-bottom: 10px;
  color: #373b8a;
  font-weight: 800;
}

.hero-subtitle {
  font-family: "Dm Sans", sans-serif;
  font-size: 18px;
  color: #666666;
  line-height: 1.5;
}

/* icons flotantes feature-icon-1 */
.feature-icon-1 {
  top: -35px;
  left: -7px;
  rotate: 50deg;
  color: #6a0dad;
}

/* icons flotantes feature-icon-2 */
.feature-icon-2 {
  top: 40px;
  right: -8px;
  color: #ba0100;
  rotate: -8deg;
  filter: drop-shadow(1px 5px 4px #0000004d);
}

/* icons flotantes feature-icon-3 */
.feature-icon-3 {
  bottom: -60px;
  left: 100px;
  color: #d834a4;
  rotate: -30deg;
}

/* icons flotantes feature-icon-4 */
.feature-icon-4 {
  bottom: -10px;
  right: 80px;
  color: #3b6bd4;
}

/* botones de hero */
.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

/* icon-main */
.icon-main {
  color: #29acb9;
}

/* texto y titulo main */
.title-main {
  font-family: "Montserrat", serif;
  color: #373b8a !important;
  font-weight: 800;
}

.txt-main {
  font-family: "Dm Sans", sans-serif;
  color: #666666;
}

/* texto y titulo action */
.title-action {
  font-family: "Montserrat", serif;
  font-weight: 800;
}

.txt-action {
  font-family: "Dm Sans", sans-serif;
  color: #666666;
}

/* texto y titulo de acción */
.cta-section {
  background-color: #ffa500;
}

.title-action {
  font-family: "Montserrat", serif;
  font-weight: 800;
}

.txt-action {
  font-family: "Dm Sans", sans-serif;
}

/* ===== BOTONES ADAPTATIVOS ===== */
.btn {
  font-family: "Montserrat", sans-serif;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #29acb9;
  /* background-color: #21234a; */
  color: white;
}

.btn-primary:hover {
  background-color: #32c4d2;
  transform: translateY(-5px);
  box-shadow: 0 4px 12px #32c4d2;
}

.btn-secondary {
  background-color: #ffa500;
  color: white;
}

.btn-secondary:hover {
  background-color: #ffb733;
  transform: translateY(-5px);
  box-shadow: 0 4px 12px #ffb733;
}

/* Alto contraste - Hero section */
.high-contrast-mode .hero-section {
  background: #000000 !important;
  background-image: none !important;
  color: #ffffff !important;
  border: 3px solid #ffffff !important;
}

/* Alto contraste - Botones */
.high-contrast-mode .btn-primary {
  background-color: #ffff00 !important;
  color: #000000 !important;
  border-color: #ffff00 !important;
}

.high-contrast-mode .btn-secondary {
  background-color: transparent !important;
  color: #ffff00 !important;
  border-color: #ffff00 !important;
}

/* ===== FEATURES SECTION - ADAPTATIVA A TEMAS ===== */
.features-section {
  padding: 80px 20px;
  transition: all 0.3s ease;
}

/* Modo claro - Features */
.v-theme--light .features-section {
  background-color: #f8f9fa;
  color: #333333;
}

/* Modo oscuro - Features */
.v-theme--dark .features-section {
  background-color: #1e1e1e;
  color: #e2e8f0;
}

/* Alto contraste - Features */
.high-contrast-mode .features-section {
  background-color: #ffffff !important;
  color: #000000 !important;
  border-top: 3px solid #000000 !important;
  border-bottom: 3px solid #000000 !important;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* titulo section-1 */
.section-title {
  font-weight: 800;
  color: #373b8a;
  font-family: "Montserrat", serif;
}

/* Modo oscuro - Section title */
.v-theme--dark .section-title {
  color: #81c784;
}

/* Alto contraste - Section title */
.high-contrast-mode .section-title {
  color: #000000 !important;
  text-decoration: underline !important;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

/* ===== FEATURE CARDS - ADAPTATIVAS A TEMAS ===== */
.feature-card {
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
}

/* Modo claro - Feature cards */
.v-theme--light .feature-card {
  background-color: white;
  color: #333333;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.v-theme--light .feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Modo oscuro - Feature cards */
.v-theme--dark .feature-card {
  background-color: #2d2d2d;
  color: #e2e8f0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border-color: #404040;
}

.v-theme--dark .feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  border-color: #4caf50;
}

/* Alto contraste - Feature cards */
.high-contrast-mode .feature-card {
  background-color: #ffffff !important;
  color: #000000 !important;
  border: 3px solid #000000 !important;
  box-shadow: none !important;
}

.high-contrast-mode .feature-card:hover {
  background-color: #ffff00 !important;
  transform: none !important;
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  font-weight: 600;
  transition: color 0.3s ease;
}

/* Modo claro - Feature card titles */
.v-theme--light .feature-card h3 {
  color: #2e8b57;
}

/* Modo oscuro - Feature card titles */
.v-theme--dark .feature-card h3 {
  color: #81c784;
}

/* Alto contraste - Feature card titles */
.high-contrast-mode .feature-card h3 {
  color: #000000 !important;
  text-decoration: underline !important;
}

.feature-card p {
  line-height: 1.6;
  margin: 0;
}

/* ===== CTA SECTION - ADAPTATIVA A TEMAS ===== */

/* Modo oscuro - CTA */
.v-theme--dark .cta-section {
  background-image: linear-gradient(
    135deg,
    #1a202c 0%,
    #2d3748 50%,
    #4a5568 100%
  );
  color: #000000;
}

/* Alto contraste - CTA */
.high-contrast-mode .cta-section {
  background-color: #000000 !important;
  color: #ffff00 !important;
  border: 3px solid #ffff00 !important;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1173px) {
  .feature-icon-1 {
    left: 70px;
  }
  .feature-icon-2 {
    right: 40px;
    top: 130px;
  }
}

@media (max-width: 992px) {
  .feature-icon-1 {
    left: 60px;
    top: -20px;
  }
  .feature-icon-2 {
    right: 180px;
    top: 60px;
  }
  .feature-icon-3 {
    opacity: 0;
  }
  .feature-icon-4 {
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .hero-subtitle {
    font-size: 16px;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    max-width: 300px;
  }

  .section-title {
    font-size: 28px;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .feature-card {
    padding: 20px;
  }

  .cta-content h2 {
    font-size: 24px;
  }

  .cta-content p {
    font-size: 16px;
  }

  .feature-icon-1 {
    opacity: 0;
  }
  .feature-icon-2 {
    opacity: 0;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 60px 15px;
  }

  .features-section,
  .cta-section {
    padding: 40px 15px;
  }
}

/* ===== MODO MOTION REDUCIDO ===== */
@media (prefers-reduced-motion: reduce) {
  .feature-card,
  .btn,
  .hero-section,
  .features-section,
  .cta-section {
    transition: none !important;
  }

  .feature-card:hover,
  .btn:hover {
    transform: none !important;
  }
}
</style>
