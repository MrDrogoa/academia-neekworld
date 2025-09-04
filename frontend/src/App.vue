<template>
  <v-app>
    <NavigationBar @toggle-cart="toggleCart" />
    <v-main role="main" aria-label="Contenido principal">
      <router-view />
    </v-main>
    <FooterComponent />

    <!-- Shopping Cart Component - Botón flotante -->
    <ShoppingCart ref="shoppingCart" :is-floating="true" />

    <!-- Skip to main content link for screen readers -->
    <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
  </v-app>
</template>

<script>
import { ref } from "vue";
import NavigationBar from "@/components/NavigationBar.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import ShoppingCart from "@/components/ShoppingCart.vue";

export default {
  name: "App",
  components: {
    NavigationBar,
    FooterComponent,
    ShoppingCart,
  },
  setup() {
    const shoppingCart = ref(null);

    const toggleCart = () => {
      if (shoppingCart.value) {
        shoppingCart.value.showCartDialog = true;
      }
    };

    return {
      shoppingCart,
      toggleCart,
    };
  },
};
</script>

<style>
/* Google Fonts Import */
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Playfair+Display:wght@400;500;700&display=swap");

/* Import global styles */
@import "./assets/styles/global.scss";

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  transition: background-color 0.3s ease, color 0.3s ease;
}

#app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  transition: all 0.3s ease;
}

/* ===== TEMA CLARO - GLOBAL ===== */
.v-theme--light {
  --v-theme-background: #ffffff;
  --v-theme-surface: #ffffff;
  --v-theme-primary: #2e8b57;
  --v-theme-secondary: #424242;
  --v-theme-on-background: #000000;
  --v-theme-on-surface: #000000;
}

.v-theme--light body {
  background-color: #ffffff;
  color: #000000;
}

.v-theme--light .v-application {
  background: #ffffff !important;
  color: #000000 !important;
}

/* ===== TEMA OSCURO - GLOBAL ===== */
.v-theme--dark {
  --v-theme-background: #121212;
  --v-theme-surface: #1e1e1e;
  --v-theme-primary: #4caf50;
  --v-theme-secondary: #616161;
  --v-theme-on-background: #ffffff;
  --v-theme-on-surface: #ffffff;
}

.v-theme--dark body {
  background-color: #121212;
  color: #e2e8f0;
}

.v-theme--dark .v-application {
  background: #121212 !important;
  color: #e2e8f0 !important;
}

/* ===== ALTO CONTRASTE - GLOBAL ===== */
.high-contrast-mode {
  --v-theme-background: #ffffff !important;
  --v-theme-surface: #ffffff !important;
  --v-theme-primary: #000000 !important;
  --v-theme-secondary: #000000 !important;
  --v-theme-on-background: #000000 !important;
  --v-theme-on-surface: #000000 !important;
}

.high-contrast-mode body {
  background-color: #ffffff !important;
  color: #000000 !important;
}

.high-contrast-mode .v-application {
  background: #ffffff !important;
  color: #000000 !important;
}

.v-card {
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

/* ===== CARDS RESPONSIVE A TEMAS ===== */
.v-theme--light .v-card {
  background-color: #ffffff;
  color: #000000;
}

.v-theme--dark .v-card {
  background-color: #1e1e1e;
  color: #e2e8f0;
}

.high-contrast-mode .v-card {
  background-color: #ffffff !important;
  color: #000000 !important;
  border: 2px solid #000000 !important;
}

/* Accessibility improvements */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 9999;
  border-radius: 4px;
}

.skip-link:focus {
  top: 6px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .v-btn {
    border: 2px solid currentColor !important;
  }

  .v-card {
    border: 1px solid currentColor !important;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus indicators - Solo aplicar cuando foco mejorado NO está activo */
:not(.enhanced-focus-mode) *:focus {
  outline: 2px solid #2e8b57;
  outline-offset: 2px;
}

:not(.enhanced-focus-mode) button:focus,
:not(.enhanced-focus-mode) .v-btn:focus {
  box-shadow: 0 0 0 3px rgba(46, 139, 87, 0.3);
}

/* ===== TRANSICIONES SUAVES PARA CAMBIOS DE TEMA ===== */
* {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

/* Mejorar transiciones para elementos Vuetify */
.v-btn,
.v-card,
.v-app-bar,
.v-navigation-drawer,
.v-main,
.v-application {
  transition: all 0.3s ease !important;
}

/* ===== BOTÓN FLOTANTE DEL CARRITO ===== */
.floating-cart-button {
  position: fixed !important;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  width: 64px !important;
  height: 64px !important;
  min-width: 64px !important;
  border-radius: 50% !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
  transition: all 0.3s ease !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.floating-cart-button:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4) !important;
}

/* Estado vacío - Verde */
.floating-cart-button.cart-empty {
  /* background-color: #2e8b57 !important; */
}

.v-theme--dark .floating-cart-button.cart-empty {
  /* background-color: #4caf50 !important; */
}

/* Estado con items - Rojo con animación pulsante */
.floating-cart-button.cart-has-items {
  background-color: #f44336 !important;
  animation: cartPulse 2s infinite;
}

.v-theme--dark .floating-cart-button.cart-has-items {
  background-color: #ff5252 !important;
  animation: cartPulse 2s infinite;
}

/* Animación de pulso */
@keyframes cartPulse {
  0% {
    box-shadow: 0 6px 20px rgba(244, 67, 54, 0.3),
      0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  50% {
    box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4),
      0 0 0 10px rgba(244, 67, 54, 0);
  }
  100% {
    box-shadow: 0 6px 20px rgba(244, 67, 54, 0.3), 0 0 0 0 rgba(244, 67, 54, 0);
  }
}

/* Animación para tema oscuro */
@keyframes cartPulseDark {
  0% {
    box-shadow: 0 6px 20px rgba(255, 82, 82, 0.3),
      0 0 0 0 rgba(255, 82, 82, 0.7);
  }
  50% {
    box-shadow: 0 6px 20px rgba(255, 82, 82, 0.4),
      0 0 0 10px rgba(255, 82, 82, 0);
  }
  100% {
    box-shadow: 0 6px 20px rgba(255, 82, 82, 0.3), 0 0 0 0 rgba(255, 82, 82, 0);
  }
}

.v-theme--dark .floating-cart-button.cart-has-items {
  animation: cartPulseDark 2s infinite;
}

/* Responsive para móvil */
@media (max-width: 768px) {
  .floating-cart-button {
    bottom: 16px;
    right: 16px;
    width: 56px !important;
    height: 56px !important;
    min-width: 56px !important;
  }
}

/* Alto contraste para botón flotante */
.high-contrast-mode .floating-cart-button.cart-empty {
  background-color: #000000 !important;
  color: #ffffff !important;
  border: 3px solid #ffffff !important;
}

.high-contrast-mode .floating-cart-button.cart-has-items {
  background-color: #ff0000 !important;
  color: #ffffff !important;
  border: 3px solid #ffffff !important;
  animation: cartPulseHighContrast 2s infinite;
}

/* Animación para alto contraste */
@keyframes cartPulseHighContrast {
  0% {
    box-shadow: 0 6px 20px rgba(255, 0, 0, 0.5), 0 0 0 0 rgba(255, 0, 0, 0.8);
  }
  50% {
    box-shadow: 0 6px 20px rgba(255, 0, 0, 0.7), 0 0 0 12px rgba(255, 0, 0, 0);
  }
  100% {
    box-shadow: 0 6px 20px rgba(255, 0, 0, 0.5), 0 0 0 0 rgba(255, 0, 0, 0);
  }
}

/* Asegurar que el icono y badge se centren correctamente */
.floating-cart-button .v-btn__content {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Badge positioning para botón flotante */
.floating-cart-button .v-badge {
  width: 100% !important;
  height: 100% !important;
}

.floating-cart-button .v-badge__wrapper {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* .v-badge__wrapper {
  margin: 0 !important;
} */
</style>
