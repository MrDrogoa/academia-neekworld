<template>
  <div class="home-page home-view">
    <!-- hero section -->
    <HeroComponents />

    <!-- Cards Section -->
    <section class="container m-auto my-5">
      <CardsAcComponents />
    </section>
    <!-- Cards de Cursos -->
    <section class="container m-auto my-5">
      <CardsCursosComponents />
    </section>

    <!-- features  Section -->
    <FeatureComponents />

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container py-4">
        <div class="text-center py-5">
          <h2
            class="title-action text-white w-75 display-5 display-lg-4 m-auto sr-left"
          >
            ¿Listo para empezar tu viaje de aprendizaje?
          </h2>
          <p class="txt-action text-white w-75 my-3 lh-1.5 m-auto">
            Únete hoy a nuestra comunidad de estudiantes y transforma tu futuro
          </p>
          <button
            v-if="!user.isAuthenticated"
            @click="openAuthDialog('register')"
            class="btn btn-primary mt-3 border-0 rounded-4 px-4 py-3 fw-semibold sr-right"
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

<script setup>
import CardsAcComponents from "@/components/CardsAcComponents.vue";
import CardsCursosComponents from "@/components/CardsCursosComponents.vue";
import HeroComponents from "../components/hero/HeroComponents.vue";
import FeatureComponents from "@/components/home/FeatureComponents.vue";
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

<style scoped>
@import "../assets/styles/home.css";
</style>
