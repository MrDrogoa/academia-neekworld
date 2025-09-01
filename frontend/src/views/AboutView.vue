<template>
  <div class="about-page">
    <div class="container">
      <h1>Acerca de Nosotros</h1>
      <section class="about-section">
        <h2>Nuestra Misión</h2>
        <p>
          En Academia Virtual, nos dedicamos a proporcionar educación de calidad accesible a todos. 
          Creemos que el aprendizaje debe ser flexible, adaptable y personalizado para satisfacer 
          las necesidades de cada estudiante.
        </p>
      </section>
      
      <section class="about-section">
        <h2>Nuestra Historia</h2>
        <p>
          Fundada en 2023, Academia Virtual surgió como respuesta a la creciente necesidad de 
          soluciones educativas en línea que fueran tanto efectivas como accesibles. Desde 
          entonces, hemos estado comprometidos con la excelencia en la educación digital.
        </p>
      </section>
      
      <section class="about-section">
        <h2>Nuestro Enfoque</h2>
        <p>
          Nos enfocamos en crear experiencias de aprendizaje que combinen teoría con práctica. 
          Nuestros cursos están diseñados por expertos en la materia y utilizan metodologías 
          pedagógicas comprobadas para asegurar que los estudiantes no solo adquieran conocimientos, 
          sino que también desarrollen habilidades aplicables en el mundo real.
        </p>
      </section>
      
      <section class="about-section">
        <h2>Nuestro Equipo</h2>
        <p>
          Contamos con un equipo diverso de educadores, desarrolladores y expertos en diversas 
          disciplinas, todos unidos por la pasión de hacer que el aprendizaje sea accesible, 
          efectivo y agradable para todos.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutView",
};
</script>

<style scoped>
/* ===== ESTILOS BASE ===== */
.about-page {
  padding: 40px 0;
  font-family: "Roboto", sans-serif;
  color: #2a3b5f;
  transition: all 0.3s ease;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  font-family: "Playfair Display", serif;
  font-size: 2.5rem;
  color: #2e8b57;
  margin-bottom: 30px;
  text-align: center;
  transition: color 0.3s ease;
}

.about-section {
  margin-bottom: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 25px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.about-section h2 {
  color: #2e8b57;
  font-size: 1.5rem;
  margin-bottom: 15px;
  font-family: "Playfair Display", serif;
  transition: color 0.3s ease;
}

.about-section p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
  transition: color 0.3s ease;
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
  color: #81C784 !important;
}

.v-theme--dark .about-section {
  background-color: #2d2d2d !important;
  color: #e0e0e0 !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) !important;
  border-color: #404040 !important;
}

.v-theme--dark .about-section h2 {
  color: #81C784 !important;
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
  .container {
    padding: 0 15px;
  }
  
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
