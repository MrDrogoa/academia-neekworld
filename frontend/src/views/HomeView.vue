<template>
  <div class="home-page home-view">
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Bienvenido a Academia Virtual</h1>
        <p class="hero-subtitle">
          Potencia tus conocimientos con nuestros cursos diseñados por expertos
        </p>
        <div class="hero-buttons">
          <router-link to="/courses" class="btn btn-primary">Explorar Cursos</router-link>
          <button 
            v-if="!user.isAuthenticated" 
            @click="openAuthDialog('register')"
            class="btn btn-secondary"
          >
            Registrarse Gratis
          </button>
        </div>
      </div>
    </section>

    <section class="features-section">
      <div class="container">
        <h2 class="section-title">¿Por qué elegirnos?</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📚</div>
            <h3>Variedad de Cursos</h3>
            <p>Descubre cursos en numerosas áreas de conocimiento</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">👨‍🏫</div>
            <h3>Instructores Expertos</h3>
            <p>Aprende de profesionales con experiencia en la industria</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Aprendizaje Flexible</h3>
            <p>Estudia a tu propio ritmo, cuando y donde quieras</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🏅</div>
            <h3>Certificaciones</h3>
            <p>Obtén certificados que validen tus nuevas habilidades</p>
          </div>

          <!-- Nueva feature sobre integración Moodle -->
          <div class="feature-card">
            <div class="feature-icon">🎓</div>
            <h3>Integración Moodle</h3>
            <p>Acceso directo a Moodle con sincronización automática</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Inscripción Automática</h3>
            <p>Al comprar un curso, quedas inscrito automáticamente</p>
          </div>

          <!-- Nueva feature sobre pasantías internacionales -->
          <div class="feature-card">
            <div class="feature-icon">🌍</div>
            <h3>Convenio Pasantías Internacionales</h3>
            <p>Próximamente: Oportunidades de pasantías en el extranjero</p>
          </div>
          
          <!-- Nueva feature sobre terapias -->
          <div class="feature-card">
            <div class="feature-icon">🧠</div>
            <h3>Convenio con Terapias</h3>
            <p>Próximamente: Servicios de psicología, terapia de pareja y familia</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>¿Listo para empezar tu viaje de aprendizaje?</h2>
          <p>Únete hoy a nuestra comunidad de estudiantes y transforma tu futuro</p>
          <button 
            @click="openAuthDialog('register')"
            class="btn btn-primary"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import authService from '@/services/authService'
import AuthDialog from '@/components/AuthDialog.vue'
import { useAccessibility } from '@/composables/useAccessibility'

export default {
  name: 'HomeView',
  components: {
    AuthDialog
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    // Reactive data
    const user = computed(() => authService.getCurrentUser())

    // Accessibility composable
    const { loadSavedSettings } = useAccessibility()

    const authDialog = ref({
      visible: false,
      mode: 'login'
    })

    // Methods
    const openAuthDialog = (mode) => {
      authDialog.value.mode = mode
      authDialog.value.visible = true
    }

    const handleAuthSuccess = () => {
      // Si hay una ruta de redirección, ir ahí
      const redirectPath = route.query.redirect
      if (redirectPath) {
        router.push(redirectPath)
      }
    }

    const handleAuthError = (error) => {
      console.error('Auth error:', error)
    }

    // Watch for query parameters to auto-open auth dialog
    watch(() => route.query.showAuth, (showAuth) => {
      if (showAuth && (showAuth === 'login' || showAuth === 'register')) {
        openAuthDialog(showAuth)
        
        // Clean query parameters
        const query = { ...route.query }
        delete query.showAuth
        router.replace({ query })
      }
    }, { immediate: true })

    // Lifecycle
    onMounted(() => {
      // Cargar configuraciones de accesibilidad guardadas
      loadSavedSettings()
      
      // Check if auth dialog should be opened based on query params
      if (route.query.showAuth) {
        openAuthDialog(route.query.showAuth)
      }
    })

    return {
      // Computed
      user,

      // Reactive data
      authDialog,

      // Methods
      openAuthDialog,
      handleAuthSuccess,
      handleAuthError
    }
  }
}
</script>

<style scoped>
/* ===== ESTILOS BASE RESPONSIVE AL TEMA ===== */
.home-page {
  font-family: 'Roboto', sans-serif;
  transition: all 0.3s ease;
}

/* ===== HERO SECTION - ADAPTATIVA A TEMAS ===== */
.hero-section {
  text-align: center;
  padding: 80px 20px;
  background-image: linear-gradient(135deg, #2A3B5F, #2A3B5F);
  background-size: cover;
  background-position: center;
  color: white;
  position: relative;
}

/* Modo claro - Hero section */
.v-theme--light .hero-section {
  background-image: linear-gradient(135deg, #2A3B5F 0%, #2A3B5F 100%);
  color: white;
}

/* Modo oscuro - Hero section */
.v-theme--dark .hero-section {
  background-image: linear-gradient(135deg, #1A202C 0%, #2D3748 50%, #4A5568 100%);
  color: #E2E8F0;
}

/* Alto contraste - Hero section */
.high-contrast-mode .hero-section {
  background: #000000 !important;
  background-image: none !important;
  color: #FFFFFF !important;
  border: 3px solid #FFFFFF !important;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 48px;
  margin-bottom: 20px;
  color: inherit;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 20px;
  margin-bottom: 40px;
  line-height: 1.5;
  opacity: 0.95;
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;
}

/* ===== BOTONES ADAPTATIVOS ===== */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background-color: #2E8B57;
  color: white;
  border-color: #2E8B57;
}

.btn-primary:hover {
  background-color: #3aa870;
  border-color: #3aa870;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 139, 87, 0.3);
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border-color: white;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

/* Alto contraste - Botones */
.high-contrast-mode .btn-primary {
  background-color: #FFFF00 !important;
  color: #000000 !important;
  border-color: #FFFF00 !important;
}

.high-contrast-mode .btn-secondary {
  background-color: transparent !important;
  color: #FFFF00 !important;
  border-color: #FFFF00 !important;
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
  background-color: #1E1E1E;
  color: #E2E8F0;
}

/* Alto contraste - Features */
.high-contrast-mode .features-section {
  background-color: #FFFFFF !important;
  color: #000000 !important;
  border-top: 3px solid #000000 !important;
  border-bottom: 3px solid #000000 !important;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  margin-bottom: 50px;
  font-weight: 700;
  transition: color 0.3s ease;
}

/* Modo claro - Section title */
.v-theme--light .section-title {
  color: #2A3B5F;
}

/* Modo oscuro - Section title */
.v-theme--dark .section-title {
  color: #81C784;
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
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid transparent;
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
  background-color: #2D2D2D;
  color: #E2E8F0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border-color: #404040;
}

.v-theme--dark .feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  border-color: #4CAF50;
}

/* Alto contraste - Feature cards */
.high-contrast-mode .feature-card {
  background-color: #FFFFFF !important;
  color: #000000 !important;
  border: 3px solid #000000 !important;
  box-shadow: none !important;
}

.high-contrast-mode .feature-card:hover {
  background-color: #FFFF00 !important;
  transform: none !important;
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 20px;
  display: block;
}

.feature-card h3 {
  font-size: 20px;
  margin-bottom: 15px;
  font-weight: 600;
  transition: color 0.3s ease;
}

/* Modo claro - Feature card titles */
.v-theme--light .feature-card h3 {
  color: #2E8B57;
}

/* Modo oscuro - Feature card titles */
.v-theme--dark .feature-card h3 {
  color: #81C784;
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
.cta-section {
  padding: 60px 20px;
  text-align: center;
  transition: all 0.3s ease;
}

/* Modo claro - CTA */
.v-theme--light .cta-section {
  background-color: #FFA500;
  color: white;
}

.v-theme--light .cta-section .btn-primary {
  background-color: #81C784;
  color: white;
  border-color: #81C784;
}

.v-theme--light .cta-section .btn-primary:hover {
  background-color: #66BB6A;
  border-color: #66BB6A;
}

/* Modo oscuro - CTA */
.v-theme--dark .cta-section {
  background-image: linear-gradient(135deg, #1A202C 0%, #2D3748 50%, #4A5568 100%);
  color: #000000;
}

/* Alto contraste - CTA */
.high-contrast-mode .cta-section {
  background-color: #000000 !important;
  color: #FFFF00 !important;
  border: 3px solid #FFFF00 !important;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
}

.cta-content h2 {
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  margin-bottom: 20px;
  color: inherit;
  font-weight: 700;
}

.cta-content p {
  font-size: 18px;
  margin-bottom: 30px;
  line-height: 1.5;
  opacity: 0.95;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 18px;
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
}

@media (max-width: 480px) {
  .hero-section {
    padding: 60px 15px;
  }
  
  .features-section,
  .cta-section {
    padding: 40px 15px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .hero-subtitle {
    font-size: 16px;
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
