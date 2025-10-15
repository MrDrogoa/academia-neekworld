<script setup>
import { ref, reactive, nextTick } from "vue";
import ScrollReveal from "scrollreveal";

// Datos reactivos para el título principal
const mainTitle = ref("Impulsa tu futuro");

// Datos reactivos para las tarjetas
const cards = reactive([
  {
    id: 1,
    number: "01",
    title:
      "Descubre cursos desde cero y construye tu carrera profesional con bases sólidas.",
  },
  {
    id: 2,
    number: "02",
    title:
      "Perfecciona tus habilidades con cursos especializados y destácate en el mercado laboral.",
  },
  {
    id: 3,
    number: "03",
    title:
      "Transforma tu carrera con cursos de tecnología y accede a mejores oportunidades laborales.",
  },
]);

// Inicializar animaciones ScrollReveal después de que el DOM esté listo
nextTick(() => {
  // Pequeño delay para asegurar que el DOM está completamente renderizado
  setTimeout(() => {
    const sr = ScrollReveal();

    sr.reveal(".sr-right", {
      origin: "right",
      distance: "80px",
      duration: 700,
      delay: 50,
      opacity: 0,
    });
  }, 100);
});
</script>

<template>
  <section class="py-5">
    <div class="container pb-5">
      <h2 class="title-card text-center pb-5 display-5 display-lg-4 sr-right">
        {{ mainTitle }}
      </h2>
      <div class="row justify-content-center g-4">
        <!-- Tarjetas dinámicas -->
        <div
          v-for="card in cards"
          :key="card.id"
          class="col-12 col-md-6 col-lg-4"
        >
          <div class="card-step">
            <div class="step-number text-white">
              {{ card.number }}
            </div>
            <div class="step-content">
              <h3 class="step-title text-white">
                {{ card.title }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
// title card
.title-card {
  color: #373b8a;
  font-weight: 800;
  font-family: "Montserrat", sans-serif;
}

.card-step {
  background-color: #373b8a;
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    text-shadow: 0 0 20px #00d9ff;

    &::before {
      opacity: 1;
    }

    .step-number {
      transform: scale(1.1);
    }
  }
}

.step-number {
  font-size: 4rem;
  font-weight: 800;
  text-align: left;
  margin-bottom: 1rem;
  line-height: 1;
  font-family: "Montserrat", sans-serif;
  transition: all 0.3s ease;
}

.step-content {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.step-title {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0;
  font-family: "DM Sans", sans-serif;
  text-align: left;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-step {
    padding: 1.5rem;
    min-height: 180px;
  }

  .step-number {
    font-size: 3rem;
    margin-bottom: 0.75rem;
  }

  .step-title {
    font-size: 1rem;
  }
}

@media (max-width: 576px) {
  .card-step {
    padding: 1.25rem;
    min-height: 160px;
  }

  .step-number {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .step-title {
    font-size: 0.95rem;
    line-height: 1.3;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .card-step {
    border-width: 3px;
    background: #000000;
  }

  .step-number {
    color: #ffffff;
    text-shadow: none;
  }

  .step-title {
    color: #ffffff;
    font-weight: 700;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .card-step {
    transition: none;

    &:hover {
      transform: none;
    }
  }

  .step-number {
    transition: none;
  }
}
</style>
