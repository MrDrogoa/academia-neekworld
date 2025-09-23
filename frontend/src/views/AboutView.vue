<template>
  <div class="about-page">
    <div class="container m-auto pt-4">
      <div class="row">
        <section
          class="d-flex flex-column justify-content-center flex-lg-row align-items-center gap-4 mb-5 mb-lg-0"
        >
          <div class="col-12 col-lg-6">
            <img
              :src="imgA"
              alt="Acerca de nosotros - Academia NeekWorld"
              class="img-fluid rounded-3"
            />
          </div>
          <div class="col-12 col-lg-6">
            <h2
              class="title-card text-center py-4 py-lg-5 display-5 display-lg-4"
            >
              Nosotros
            </h2>
            <div class="bg-white p-4 rounded-3 shadow-sm mb-4">
              <h2 class="title-section">Nuestra Misión</h2>
              <p class="paragraph-section">
                En Academia Virtual, nos dedicamos a proporcionar educación de
                calidad accesible a todos. Creemos que el aprendizaje debe ser
                flexible, adaptable y personalizado para satisfacer las
                necesidades de cada estudiante.
              </p>
            </div>
            <div class="bg-white p-4 rounded-3 shadow-sm mb-4">
              <h2 class="title-section">Nuestra Historia</h2>
              <p class="paragraph-section">
                Fundada en 2023, Academia Virtual surgió como respuesta a la
                creciente necesidad de soluciones educativas en línea que fueran
                tanto efectivas como accesibles. Desde entonces, hemos estado
                comprometidos con la excelencia en la educación digital.
              </p>
            </div>
          </div>
        </section>
        <article class="col-12 mb-5">
          <div class="bg-white p-4 rounded-3 shadow-sm mb-4">
            <h2 class="title-section">Nuestro Enfoque</h2>
            <p class="paragraph-section">
              Nos enfocamos en crear experiencias de aprendizaje que combinen
              teoría con práctica. Nuestros cursos están diseñados por expertos
              en la materia y utilizan metodologías pedagógicas comprobadas para
              asegurar que los estudiantes no solo adquieran conocimientos, sino
              que también desarrollen habilidades aplicables en el mundo real.
            </p>
          </div>
          <div class="bg-white p-4 rounded-3 shadow-sm mb-4">
            <h2 class="title-section">Nuestro Equipo</h2>
            <p class="paragraph-section">
              Contamos con un equipo diverso de educadores, desarrolladores y
              expertos en diversas disciplinas, todos unidos por la pasión de
              hacer que el aprendizaje sea accesible, efectivo y agradable para
              todos.
            </p>
          </div>
        </article>
      </div>

      <!-- <section class="about-section">
      </section>
      
      <section class="about-section">
        
      </section>
      
      <section class="about-section">
        
      </section>
      
      <section class="about-section">
        
      </section> -->
    </div>
  </div>
</template>

<script>
// Importar la imagen correctamente
import imgA from "@/assets/img/AcercaDe.webp";

export default {
  name: "AboutView",
  data() {
    return {
      imgA,
    };
  },
};
</script>

<style scoped>
.title-card {
  color: #373b8a;
  font-weight: 800;
  font-family: "Montserrat", sans-serif;
}

.title-section {
  color: #29acb9;
  font-weight: 700;
  font-family: "Montserrat", sans-serif;
}

.paragraph-section {
  font-family: "Dm Sans", sans-serif;
  color: #666666;
  line-height: 1.5;
}
/* ===== MODO CLARO ===== */
.v-theme--light .about-page {
  background-color: #f8f9fa;
  color: #2a3b5f;
}

.v-theme--light .about-page h1 {
  color: #2e8b57;
}

.v-theme--light .about-section {
  background-color: white;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-color: #e0e0e0;
}

.v-theme--light .about-section h2 {
  color: #2e8b57;
}

.v-theme--light .about-section p {
  color: #555;
}

/* ===== MODO OSCURO ===== */
.v-theme--dark .about-page {
  background-color: #1e1e1e !important;
  color: #e0e0e0 !important;
}

.v-theme--dark .about-page h1 {
  color: #81c784 !important;
}

.v-theme--dark .about-section {
  background-color: #2d2d2d !important;
  color: #e0e0e0 !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) !important;
  border-color: #404040 !important;
}

.v-theme--dark .about-section h2 {
  color: #81c784 !important;
}

.v-theme--dark .about-section p {
  color: #e0e0e0 !important;
}

/* ===== ALTO CONTRASTE ===== */
.high-contrast-mode .about-page {
  background-color: #ffffff !important;
  color: #000000 !important;
}

.high-contrast-mode .about-page h1 {
  color: #000000 !important;
  text-decoration: underline !important;
  font-weight: 700 !important;
}

.high-contrast-mode .about-section {
  background-color: #ffffff !important;
  color: #000000 !important;
  border: 3px solid #000000 !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}

.high-contrast-mode .about-section h2 {
  color: #000000 !important;
  text-decoration: underline !important;
  font-weight: 700 !important;
}

.high-contrast-mode .about-section p {
  color: #000000 !important;
  font-weight: 500 !important;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .about-page {
    padding: 20px 0;
  }

  h1 {
    font-size: 2rem;
  }

  .about-section {
    padding: 20px;
    margin-bottom: 30px;
  }

  .about-section h2 {
    font-size: 1.3rem;
  }

  .about-section p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.75rem;
  }

  .about-section {
    padding: 15px;
  }

  .about-section h2 {
    font-size: 1.2rem;
  }
}

/* ===== MODO MOTION REDUCIDO ===== */
@media (prefers-reduced-motion: reduce) {
  .about-page,
  .about-section,
  .about-section h2,
  .about-section p,
  h1 {
    transition: none !important;
  }
}

/* ===== FOCUS ACCESSIBILITY ===== */
.about-section:focus {
  outline: 3px solid #2e8b57;
  outline-offset: 2px;
}

.high-contrast-mode .about-section:focus {
  outline: 3px solid #000000 !important;
  outline-offset: 2px;
}
</style>
