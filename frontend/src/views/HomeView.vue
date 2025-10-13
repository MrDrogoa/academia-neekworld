<template>
  <div class="home-page home-view">
    <!-- hero section -->
    <HeroComponents />

    <section class="container my-5">
      <CardsAcComponents />
    </section>
    <section class="container my-5">
      <CardsCursosComponents />
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
            @click="$router.push('/register')"
            class="btn btn-primary mt-3 border-0 rounded-4 px-4 py-3 fw-medium"
          >
            Comenzar ahora
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import CardsAcComponents from "@/components/CardsAcComponents.vue";
import CardsCursosComponents from "@/components/CardsCursosComponents.vue";
import HeroComponents from "../components/hero/HeroComponents.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "HomeView",
  components: {
    CardsAcComponents,
    CardsCursosComponents,
    HeroComponents,
    FontAwesomeIcon,
  },
};
</script>

<style scoped>
/* ===== ESTILOS BASE RESPONSIVE AL TEMA ===== */
.home-page {
  font-family: "Montserrat", sans-serif;
  background-color: #f8f9fa;
}
/* modo alto contraste */
.high-contrast-mode .home-page {
  background: #000000 !important;
}
/* modo oscuro */
.v-theme--dark .home-page {
  background-color: #2d3748;
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
  background-color: none !important;
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
  color: #fff;
}

/* Alto contraste - Section title */
.high-contrast-mode .section-title {
  color: #000000 !important;
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
  background-color: #252d3a;
}

.v-theme--dark .feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.v-theme--dark .feature-card h3 {
  color: #fff !important;
}

/* Alto contraste - Feature cards */
.high-contrast-mode .feature-card {
  color: #fff !important;
  background-color: #000 !important;
  border: 3px solid #fff !important;
}

.high-contrast-mode .features-section {
  background-color: #000000 !important;
}

.high-contrast-mode .section-title {
  color: #fff !important;
}

.high-contrast-mode .feature-card:hover {
  border-color: #ffff00 !important;
  box-shadow: 0 0 20px #ffff00 !important;
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
  color: #fff !important;
}

.feature-card p {
  line-height: 1.6;
  margin: 0;
}

/* ===== CTA SECTION - ADAPTATIVA A TEMAS ===== */

/* Modo oscuro - CTA */
.v-theme--dark .cta-section {
  background-color: #252d3a;
  color: #000000;
}

/* Alto contraste - CTA */
.high-contrast-mode .cta-section {
  background-color: #000000 !important;
  color: #ffff00 !important;
  border: 3px solid #ffff00 !important;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
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
}

@media (max-width: 480px) {
  .features-section,
  .cta-section {
    padding: 40px 15px;
  }
}

/* ===== MODO MOTION REDUCIDO ===== */
@media (prefers-reduced-motion: reduce) {
  .feature-card,
  .btn,
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
