<script setup></script>

<template>
  <section class="py-5">
    <div class="container">
      <h2 class="title-card text-center pb-5 display-5 display-lg-4">
        Impulsa tu futuro
      </h2>
      <div class="row g-4">
        <!-- Tarjeta 1 -->
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card-step">
            <div class="step-number text-white">01</div>
            <div class="step-content">
              <h3 class="step-title text-white">
                Descubre cursos desde cero y construye tu carrera profesional
                con bases sólidas.
              </h3>
            </div>
          </div>
        </div>

        <!-- Tarjeta 2 -->
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card-step">
            <div class="step-number text-white">02</div>
            <div class="step-content">
              <h3 class="step-title text-white">
                Perfecciona tus habilidades con cursos especializados y
                destácate en el mercado laboral.
              </h3>
            </div>
          </div>
        </div>

        <!-- Tarjeta 3 -->
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card-step">
            <div class="step-number text-white">03</div>
            <div class="step-content">
              <h3 class="step-title text-white">
                Transforma tu carrera con cursos de tecnología y accede a
                mejores oportunidades laborales.
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

  //   &::before {
  //     content: "";
  //     position: absolute;
  //     top: -2px;
  //     left: -2px;
  //     right: -2px;
  //     bottom: -2px;
  //     background: linear-gradient(45deg, #00d9ff, #0099cc, #00d9ff);
  //     border-radius: 16px;
  //     z-index: -1;
  //     opacity: 0;
  //     transition: opacity 0.3s ease;
  //   }

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
