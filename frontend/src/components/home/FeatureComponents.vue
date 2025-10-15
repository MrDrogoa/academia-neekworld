<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// Datos reactivos para las características
const features = [
  {
    icon: "fa-solid fa-note-sticky",
    title: "Variedad de Cursos",
    description: "Descubre cursos en numerosas áreas de conocimiento",
  },
  {
    icon: "fa-solid fa-gear",
    title: "Instructores Expertos",
    description: "Aprende de profesionales con experiencia en la industria",
  },
  {
    icon: "fa-solid fa-magnifying-glass",
    title: "Aprendizaje Flexible",
    description: "Estudia a tu propio ritmo, cuando y donde quieras",
  },
  {
    icon: "fa-solid fa-medal",
    title: "Certificaciones",
    description: "Obtén certificados que validen tus nuevas habilidades",
  },
  {
    icon: "fa-solid fa-circle-check",
    title: "Integración Moodle",
    description: "Acceso directo a Moodle con sincronización automática",
  },
  {
    icon: "fa-solid fa-bolt",
    title: "Inscripción Automática",
    description: "Al comprar un curso, quedas inscrito automáticamente",
  },
  {
    icon: "fa-solid fa-earth-americas",
    title: "Convenio Pasantías Internacionales",
    description: "Próximamente: Oportunidades de pasantías en el extranjero",
  },
  {
    icon: "fa-solid fa-brain",
    title: "Convenio con Terapias",
    description:
      "Próximamente: Servicios de psicología, terapia de pareja y familia",
  },
];
</script>

<template>
  <section class="features-section">
    <div class="container">
      <!-- Título de la sección -->
      <h2 class="section-title text-center pb-5 display-5 display-lg-4">
        ¿Por qué elegirnos?
      </h2>

      <div class="features-grid py-4 gap-4">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="feature-card rounded-4 text-center p-4"
        >
          <div class="icon-main mb-3">
            <FontAwesomeIcon :icon="feature.icon" class="fs-1" />
          </div>
          <h3 class="title-main mb-3 fs-5 fw-bold">{{ feature.title }}</h3>
          <p class="txt-main">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped></style>
