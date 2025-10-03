<script setup>
import "@/assets/styles/hero.css";
import ImgHero from "@/assets/img/hero-image.webp";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import authService from "@/services/authService";
import AuthDialog from "@/components/AuthDialog.vue";
import { useAccessibility } from "@/composables/useAccessibility";

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
</script>

<template>
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
            <p class="hero-subtitle w-75 m-auto mb-4 text-center text-md-start">
              "Aprende en línea, a tu ritmo y desde cualquier lugar, con cursos
              diseñados para adaptarse a tu estilo de vida."
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

  <!-- Auth Dialog -->
  <AuthDialog
    v-model:visible="authDialog.visible"
    :mode="authDialog.mode"
    @auth-success="handleAuthSuccess"
    @auth-error="handleAuthError"
  />
</template>

<style lang="scss" scoped></style>
