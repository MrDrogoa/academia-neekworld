<script setup>
// Importar la imagen correctamente
import imgA from "@/assets/img/AcercaDe.webp";

// Importar los estilos CSS
import "@/assets/styles/about.css";

// ===== INFORMACIÓN DINÁMICA DEL COMPONENTE =====

// Información principal de la sección "Nosotros"
const aboutSection = {
  title: "Nosotros",
  description:
    "En Academia Virtual, nos apasiona la educación y creemos en su poder transformador. Nuestro objetivo es crear un entorno de aprendizaje inclusivo y accesible para todos, donde cada estudiante pueda alcanzar su máximo potencial.",
  buttonText: "Contáctanos",
  buttonLink: "/contact",
  image: {
    src: imgA,
    alt: "Acerca de nosotros - Academia NeekWorld",
  },
};

// Información de las 4 tarjetas
const infoCards = [
  {
    id: 1,
    title: "Nuestra Misión",
    icon: "mdi-target",
    cssClass: "card-mission",
    content:
      "En Academia Virtual, nos dedicamos a proporcionar educación de calidad accesible a todos. Creemos que el aprendizaje debe ser flexible, adaptable y personalizado para satisfacer las necesidades de cada estudiante.",
  },
  {
    id: 2,
    title: "Nuestra Historia",
    icon: "mdi-history",
    cssClass: "card-history",
    content:
      "Fundada en 2023, Academia Virtual surgió como respuesta a la creciente necesidad de soluciones educativas en línea que fueran tanto efectivas como accesibles. Desde entonces, hemos estado comprometidos con la excelencia en la educación digital.",
  },
  {
    id: 3,
    title: "Nuestro Enfoque",
    icon: "mdi-lightbulb-on",
    cssClass: "card-approach",
    content:
      "Nos enfocamos en crear experiencias de aprendizaje que combinen teoría con práctica. Nuestros cursos están diseñados por expertos en la materia y utilizan metodologías pedagógicas comprobadas para asegurar que los estudiantes no solo adquieran conocimientos, sino que también desarrollen habilidades aplicables en el mundo real.",
  },
  {
    id: 4,
    title: "Nuestro Equipo",
    icon: "mdi-account-group",
    cssClass: "card-team",
    content:
      "Contamos con un equipo diverso de educadores, desarrolladores y expertos en diversas disciplinas, todos unidos por la pasión de hacer que el aprendizaje sea accesible, efectivo y agradable para todos.",
  },
];
</script>
<template>
  <div class="about-page">
    <div class="container m-auto pt-4">
      <div class="row">
        <section
          class="d-flex flex-column gap-2 justify-content-center flex-lg-row align-items-center gap-4 mb-5 mb-lg-0"
        >
          <div
            class="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center text-center"
          >
            <h2 class="title-card display-5 display-lg-4 title-about">
              {{ aboutSection.title }}
            </h2>
            <p class="m-auto py-3 w-75 w-lg-100">
              {{ aboutSection.description }}
            </p>

            <router-link
              :to="aboutSection.buttonLink"
              class="btn btn-link text-decoration-none border-0 rounded-4 px-4 py-3 fw-medium"
            >
              {{ aboutSection.buttonText }}
            </router-link>
          </div>
          <div class="col-12 col-lg-6">
            <img
              :src="aboutSection.image.src"
              :alt="aboutSection.image.alt"
              class="img-fluid rounded-3"
            />
          </div>
        </section>

        <!-- Grid de 4 tarjetas dinámicas -->
        <div class="col-12 my-5">
          <div class="row g-4 mb-3">
            <div
              v-for="card in infoCards"
              :key="card.id"
              class="col-12 col-md-6 col-lg-3"
            >
              <div
                class="info-card h-100 p-4 rounded-4 shadow-sm position-relative overflow-hidden"
                :class="card.cssClass"
              >
                <div class="card-icon-container mb-3">
                  <v-icon size="48" class="card-icon">{{ card.icon }}</v-icon>
                </div>
                <h3 class="card-title mb-3">{{ card.title }}</h3>
                <p class="card-text">
                  {{ card.content }}
                </p>
                <div class="card-decoration"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
/* Los estilos se importan desde about.css */
/* Aquí puedes agregar estilos específicos del componente si es necesario */
</style>
