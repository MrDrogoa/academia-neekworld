<template>
  <div class="accessibility-controls">
    <!-- Menú de Accesibilidad -->
    <v-menu
      offset-y
      :close-on-content-click="false"
      max-width="400"
      :attach="true"
      transition="scale-transition"
      origin="top right"
      min-width="380"
      :z-index="9999"
    >
      <template v-slot:activator="{ props }">
        <v-tooltip bottom>
          <template v-slot:activator="{ props: tooltipProps }">
            <v-btn
              icon
              v-bind="{ ...props, ...tooltipProps }"
              :class="{ 'accessibility-active': hasAnySettingActive }"
              aria-label="Abrir menú de opciones de accesibilidad"
              :style="{
                backgroundColor: hasAnySettingActive
                  ? 'rgba(33, 150, 243, 0.1)'
                  : 'transparent',
              }"
            >
              <v-icon
                :color="
                  hasAnySettingActive
                    ? 'primary'
                    : isDarkTheme
                    ? 'white'
                    : 'default'
                "
              >
                mdi-account-cog
              </v-icon>
            </v-btn>
          </template>
          <span
            >Opciones de Accesibilidad
            {{ hasAnySettingActive ? "(Configuradas)" : "" }}</span
          >
        </v-tooltip>
      </template>

      <v-card
        class="accessibility-menu pa-4"
        min-width="380"
        elevation="8"
        :style="menuCardStyles"
      >
        <v-card-title class="text-h6 pb-3" :style="titleStyles">
          <v-icon left :color="iconColor">mdi-account-cog</v-icon>
          Opciones de Accesibilidad
        </v-card-title>

        <v-divider class="mb-4" :color="dividerColor"></v-divider>

        <!-- Tema Oscuro/Claro -->
        <div class="accessibility-section mb-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="d-flex align-center">
              <v-icon class="mr-2" :color="isDarkTheme ? 'amber' : 'indigo'">
                {{ isDarkTheme ? "mdi-weather-night" : "mdi-weather-sunny" }}
              </v-icon>
              <span class="font-weight-medium" :style="textStyles">Tema</span>
            </div>

            <!-- Botón de tema con transición de icono -->
            <v-btn
              @click="toggleTheme"
              :color="isDarkTheme ? 'amber' : 'indigo'"
              :variant="isDarkTheme ? 'tonal' : 'outlined'"
              size="small"
              :aria-label="
                isDarkTheme ? 'Activar tema claro' : 'Activar tema oscuro'
              "
              class="theme-toggle-btn"
            >
              <v-icon :class="{ 'theme-icon-transition': true }" size="20">
                {{ isDarkTheme ? "mdi-weather-sunny" : "mdi-weather-night" }}
              </v-icon>
            </v-btn>
          </div>
          <div class="text-caption ml-8" :style="captionStyles">
            {{
              isDarkTheme
                ? "Modo oscuro activo - Reduce fatiga visual"
                : "Modo claro activo - Máxima legibilidad"
            }}
          </div>
        </div>

        <!-- Alto Contraste -->
        <div class="accessibility-section mb-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="d-flex align-center">
              <v-icon
                class="mr-2"
                :color="highContrastMode ? 'yellow' : iconColor"
              >
                mdi-theme-light-dark
              </v-icon>
              <span class="font-weight-medium" :style="textStyles"
                >Alto Contraste</span
              >
            </div>

            <!-- Botón de alto contraste con transición -->
            <v-btn
              @click="toggleHighContrast"
              :color="highContrastMode ? 'yellow' : 'grey'"
              :variant="highContrastMode ? 'tonal' : 'outlined'"
              size="small"
              :aria-label="
                highContrastMode
                  ? 'Desactivar alto contraste'
                  : 'Activar alto contraste'
              "
              class="contrast-toggle-btn"
            >
              <v-icon :class="{ 'contrast-icon-transition': true }" size="20">
                {{ highContrastMode ? "mdi-eye" : "mdi-eye-outline" }}
              </v-icon>
            </v-btn>
          </div>
          <div class="text-caption ml-8" :style="captionStyles">
            Mejora la visibilidad con colores de alto contraste
          </div>
        </div>

        <!-- Tamaño de Texto -->
        <div class="accessibility-section mb-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="d-flex align-center">
              <v-icon
                class="mr-2"
                :color="textSize !== 100 ? 'green' : iconColor"
              >
                mdi-format-size
              </v-icon>
              <span class="font-weight-medium" :style="textStyles"
                >Tamaño de Texto</span
              >
            </div>
            <div class="d-flex align-center">
              <v-btn
                icon
                size="small"
                @click="decreaseTextSize"
                :disabled="textSize <= 80"
                aria-label="Reducir tamaño de texto"
                :style="buttonStyles"
              >
                <v-icon size="18" :color="buttonIconColor">mdi-minus</v-icon>
              </v-btn>
              <span
                class="mx-2 text-body-2 font-weight-medium"
                style="min-width: 50px; text-align: center"
                :style="textStyles"
              >
                {{ textSize }}%
              </span>
              <v-btn
                icon
                size="small"
                @click="increaseTextSize"
                :disabled="textSize >= 130"
                aria-label="Aumentar tamaño de texto"
                :style="buttonStyles"
              >
                <v-icon size="18" :color="buttonIconColor">mdi-plus</v-icon>
              </v-btn>
            </div>
          </div>
          <div class="text-caption ml-8" :style="captionStyles">
            {{ textSizeLabel }} - Rango: 80% a 130%
          </div>
          <div class="d-flex justify-center mt-2">
            <v-btn
              size="small"
              variant="outlined"
              @click="resetTextSize"
              :disabled="textSize === 100"
              :style="buttonStyles"
            >
              Restablecer (100%)
            </v-btn>
          </div>
        </div>

        <!-- Movimiento Reducido -->
        <div class="accessibility-section mb-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="d-flex align-center">
              <v-icon
                class="mr-2"
                :color="reducedMotionMode ? 'orange' : iconColor"
              >
                {{ reducedMotionMode ? "mdi-motion-pause" : "mdi-motion-play" }}
              </v-icon>
              <span class="font-weight-medium" :style="textStyles"
                >Reducir Animaciones</span
              >
            </div>

            <!-- Botón de animaciones con transición -->
            <v-btn
              @click="toggleReducedMotion"
              :color="reducedMotionMode ? 'orange' : 'grey'"
              :variant="reducedMotionMode ? 'tonal' : 'outlined'"
              size="small"
              :aria-label="
                reducedMotionMode
                  ? 'Activar animaciones'
                  : 'Reducir animaciones'
              "
              class="motion-toggle-btn"
            >
              <v-icon :class="{ 'motion-icon-transition': true }" size="20">
                {{ reducedMotionMode ? "mdi-pause" : "mdi-play" }}
              </v-icon>
            </v-btn>
          </div>
          <div class="text-caption ml-8" :style="captionStyles">
            Minimiza animaciones para evitar mareos
          </div>
        </div>

        <!-- Enfoque Mejorado -->
        <div class="accessibility-section mb-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="d-flex align-center">
              <v-icon
                class="mr-2"
                :color="enhancedFocusMode ? 'purple' : iconColor"
              >
                {{
                  enhancedFocusMode ? "mdi-keyboard-outline" : "mdi-keyboard"
                }}
              </v-icon>
              <span class="font-weight-medium" :style="textStyles"
                >Enfoque Mejorado</span
              >
            </div>

            <!-- Botón de foco con transición -->
            <v-btn
              @click="toggleEnhancedFocus"
              :color="enhancedFocusMode ? 'purple' : 'grey'"
              :variant="enhancedFocusMode ? 'tonal' : 'outlined'"
              size="small"
              :aria-label="
                enhancedFocusMode
                  ? 'Desactivar foco mejorado'
                  : 'Activar foco mejorado'
              "
              class="focus-toggle-btn"
            >
              <v-icon :class="{ 'focus-icon-transition': true }" size="20">
                {{ enhancedFocusMode ? "mdi-target" : "mdi-target-variant" }}
              </v-icon>
            </v-btn>
          </div>
          <div class="text-caption ml-8" :style="captionStyles">
            <strong>Navegación por teclado:</strong> Resalta mejor los elementos
            al usar Tab. <br /><small
              >Prueba: Presiona Tab repetidamente para ver bordes más gruesos y
              coloridos.</small
            >
          </div>
        </div>

        <v-divider class="my-4" :color="dividerColor"></v-divider>

        <!-- Acciones -->
        <div class="d-flex justify-space-between">
          <v-chip
            :color="hasAnySettingActive ? 'success' : 'grey'"
            size="small"
            variant="outlined"
            :style="chipStyles"
          >
            <v-icon left size="16" :color="chipIconColor">
              {{
                hasAnySettingActive ? "mdi-check-circle" : "mdi-circle-outline"
              }}
            </v-icon>
            {{ hasAnySettingActive ? "Configurado" : "Por defecto" }}
          </v-chip>

          <v-btn
            size="small"
            color="grey"
            variant="outlined"
            @click="resetAllSettings"
            :disabled="!hasAnySettingActive"
            prepend-icon="mdi-refresh"
            :style="buttonStyles"
          >
            Restablecer Todo
          </v-btn>
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useTheme } from "vuetify";
import { useAccessibility } from "@/composables/useAccessibility";

export default {
  name: "AccessibilityControls",
  setup() {
    const vuetifyTheme = useTheme();

    const {
      // Estado
      isDarkTheme,
      highContrastMode,
      textSize,
      reducedMotionMode,
      enhancedFocusMode,

      // Computed
      hasAnySettingActive,
      textSizeLabel,

      // Funciones
      toggleTheme,
      toggleHighContrast,
      increaseTextSize,
      decreaseTextSize,
      resetTextSize,
      toggleReducedMotion,
      toggleEnhancedFocus,
      resetAllSettings,
      loadSavedSettings,
    } = useAccessibility();

    // Cargar configuraciones al montar
    onMounted(() => {
      console.log("🚀 Inicializando AccessibilityControls...");
      loadSavedSettings();
    });

    // Estilos dinámicos basados en el tema actual
    const menuCardStyles = computed(() => {
      if (highContrastMode.value) {
        return {
          backgroundColor: "#000000 !important",
          color: "#FFFFFF !important",
          border: "3px solid #FFFFFF !important",
        };
      } else if (isDarkTheme.value) {
        return {
          backgroundColor: "#1E1E1E !important",
          color: "#ffffff !important",
          border: "1px solid #444444 !important",
        };
      } else {
        return {
          backgroundColor: "#ffffff !important",
          color: "#333333 !important",
          border: "1px solid #e0e0e0 !important",
        };
      }
    });

    const titleStyles = computed(() => {
      if (highContrastMode.value) {
        return { color: "#FFFF00 !important" };
      } else if (isDarkTheme.value) {
        return { color: "#4CAF50 !important" };
      } else {
        return { color: "#2E8B57 !important" };
      }
    });

    const textStyles = computed(() => {
      if (highContrastMode.value) {
        return { color: "#FFFFFF !important" };
      } else if (isDarkTheme.value) {
        return { color: "#ffffff !important" };
      } else {
        return { color: "#333333 !important" };
      }
    });

    const captionStyles = computed(() => {
      if (highContrastMode.value) {
        return { color: "#FFFFFF !important" };
      } else if (isDarkTheme.value) {
        return { color: "#cccccc !important" };
      } else {
        return { color: "#666666 !important" };
      }
    });

    const iconColor = computed(() => {
      if (highContrastMode.value) {
        return "#FFFF00";
      } else if (isDarkTheme.value) {
        return "#ffffff";
      } else {
        return "#333333";
      }
    });

    const buttonIconColor = computed(() => {
      if (highContrastMode.value) {
        return "#000000";
      } else if (isDarkTheme.value) {
        return "#ffffff";
      } else {
        return "#333333";
      }
    });

    const buttonStyles = computed(() => {
      if (highContrastMode.value) {
        return {
          backgroundColor: "#000000 !important",
          color: "#FFFF00 !important",
          border: "2px solid #FFFF00 !important",
        };
      } else if (isDarkTheme.value) {
        return {
          backgroundColor: "#2D2D2D !important",
          color: "#ffffff !important",
          border: "1px solid #444444 !important",
        };
      } else {
        return {
          backgroundColor: "#f8f9fa !important",
          color: "#333333 !important",
          border: "1px solid #e0e0e0 !important",
        };
      }
    });

    const switchStyles = computed(() => {
      if (highContrastMode.value) {
        return { color: "#FFFF00 !important" };
      } else {
        return { color: "#2E8B57 !important" };
      }
    });

    const chipStyles = computed(() => {
      if (highContrastMode.value) {
        return {
          backgroundColor: "#000000 !important",
          color: "#FFFF00 !important",
          border: "2px solid #FFFF00 !important",
        };
      } else if (isDarkTheme.value) {
        return {
          backgroundColor: "#2D2D2D !important",
          color: "#ffffff !important",
          border: "1px solid #444444 !important",
        };
      } else {
        return {
          backgroundColor: "#ffffff !important",
          color: "#333333 !important",
          border: "1px solid #e0e0e0 !important",
        };
      }
    });

    const chipIconColor = computed(() => {
      if (highContrastMode.value) {
        return "#FFFF00";
      } else {
        return "inherit";
      }
    });

    const dividerColor = computed(() => {
      if (highContrastMode.value) {
        return "#FFFFFF";
      } else if (isDarkTheme.value) {
        return "#444444";
      } else {
        return "#e0e0e0";
      }
    });

    // Wrapper functions para pasar el tema
    const handleToggleTheme = () => {
      console.log("🌗 Ejecutando toggleTheme desde componente");
      toggleTheme(vuetifyTheme);
    };

    const handleResetAllSettings = () => {
      console.log("🔄 Ejecutando resetAllSettings desde componente");
      resetAllSettings(vuetifyTheme);
    };

    return {
      // Estado
      isDarkTheme,
      highContrastMode,
      textSize,
      reducedMotionMode,
      enhancedFocusMode,

      // Computed
      hasAnySettingActive,
      textSizeLabel,

      // Estilos dinámicos
      menuCardStyles,
      titleStyles,
      textStyles,
      captionStyles,
      iconColor,
      buttonIconColor,
      buttonStyles,
      switchStyles,
      chipStyles,
      chipIconColor,
      dividerColor,

      // Funciones
      toggleTheme: handleToggleTheme,
      toggleHighContrast,
      increaseTextSize,
      decreaseTextSize,
      resetTextSize,
      toggleReducedMotion,
      toggleEnhancedFocus,
      resetAllSettings: handleResetAllSettings,
    };
  },
};
</script>

<style scoped>
.accessibility-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.theme-active,
.high-contrast-active,
.large-text-active,
.reduced-motion-active,
.enhanced-focus-active {
  background-color: rgba(46, 139, 87, 0.2) !important;
  border: 2px solid #2e8b57 !important;
  transform: scale(1.05);
}

.theme-active {
  border-color: #ffa726 !important;
  background-color: rgba(255, 167, 38, 0.2) !important;
}

.enhanced-focus-active {
  border-color: #9c27b0 !important;
  background-color: rgba(156, 39, 176, 0.2) !important;
}
</style>

<style>
/* Estilos globales para modo de alto contraste */
.high-contrast-mode {
  --v-theme-background: #000000 !important;
  --v-theme-surface: #000000 !important;
  --v-theme-primary: #ffff00 !important;
  --v-theme-secondary: #00ffff !important;
  --v-theme-on-background: #ffffff !important;
  --v-theme-on-surface: #ffffff !important;
  --v-theme-on-primary: #000000 !important;
}

.high-contrast-mode .v-btn {
  border: 2px solid currentColor !important;
}

.high-contrast-mode .v-text-field input,
.high-contrast-mode .v-select__selection {
  color: #ffffff !important;
}

.high-contrast-mode .v-app-bar {
  border-bottom: 3px solid #ffffff !important;
}

/* Estilos para texto grande */
.large-text-mode {
  font-size: 120% !important;
}

.large-text-mode .text-h1 {
  font-size: 7.2rem !important;
}
.large-text-mode .text-h2 {
  font-size: 4.8rem !important;
}
.large-text-mode .text-h3 {
  font-size: 3.6rem !important;
}
.large-text-mode .text-h4 {
  font-size: 2.4rem !important;
}
.large-text-mode .text-h5 {
  font-size: 1.8rem !important;
}
.large-text-mode .text-h6 {
  font-size: 1.5rem !important;
}
.large-text-mode .text-body-1 {
  font-size: 1.2rem !important;
}
.large-text-mode .text-body-2 {
  font-size: 1.05rem !important;
}
.large-text-mode .v-btn {
  font-size: 1.1rem !important;
}
.large-text-mode .v-list-item-title {
  font-size: 1.1rem !important;
}

/* Estilos para movimiento reducido */
.reduced-motion-mode * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}

.reduced-motion-mode .v-btn {
  transition: none !important;
}

.reduced-motion-mode .v-card {
  transition: none !important;
}

/* Tooltips más accesibles */
.v-tooltip .v-overlay__content {
  background-color: rgba(0, 0, 0, 0.9) !important;
  color: white !important;
  font-size: 0.9rem !important;
  padding: 8px 12px !important;
  border-radius: 4px !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
  max-width: 250px !important;
  text-align: center !important;
  line-height: 1.3 !important;
}

/* Estilos para estabilizar el menú de accesibilidad */
.accessibility-controls {
  position: relative;
}

.accessibility-menu {
  position: relative !important;
  z-index: 2000 !important;
  max-height: 90vh !important;
  overflow-y: auto !important;
}

/* Estabilizar el menú dropdown */
.v-menu > .v-overlay__content {
  position: fixed !important;
  transform-origin: top right !important;
  max-width: 400px !important;
  min-width: 380px !important;
}

.accessibility-section {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 16px;
}

.accessibility-section:last-of-type {
  border-bottom: none;
}

.accessibility-active {
  background-color: rgba(33, 150, 243, 0.1) !important;
}

/* ===================================================
   ESTILOS PARA BOTONES DE ACCESIBILIDAD CON ICONOS
   ================================================== */

/* Transiciones suaves para iconos */
.theme-icon-transition,
.contrast-icon-transition,
.motion-icon-transition,
.focus-icon-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

/* Efectos hover para botones de accesibilidad */
.theme-toggle-btn:hover .theme-icon-transition {
  transform: rotate(15deg) scale(1.1);
}

.contrast-toggle-btn:hover .contrast-icon-transition {
  transform: scale(1.2);
}

.motion-toggle-btn:hover .motion-icon-transition {
  transform: scale(1.1);
}

.focus-toggle-btn:hover .focus-icon-transition {
  transform: scale(1.1) rotate(5deg);
}

/* Efectos de activación/click */
.theme-toggle-btn:active .theme-icon-transition {
  transform: rotate(360deg) scale(0.9);
  transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.contrast-toggle-btn:active .contrast-icon-transition {
  transform: scale(0.8);
  transition: transform 0.2s ease-out;
}

.motion-toggle-btn:active .motion-icon-transition {
  transform: scale(0.8);
  transition: transform 0.2s ease-out;
}

.focus-toggle-btn:active .focus-icon-transition {
  transform: scale(0.8) rotate(15deg);
  transition: transform 0.2s ease-out;
}

/* Estilos específicos para estados activos */
.theme-toggle-btn[variant="tonal"] {
  background-color: rgba(255, 193, 7, 0.12) !important;
  border: 1px solid rgba(255, 193, 7, 0.3) !important;
}

.contrast-toggle-btn[variant="tonal"] {
  background-color: rgba(255, 235, 59, 0.12) !important;
  border: 1px solid rgba(255, 235, 59, 0.3) !important;
}

.motion-toggle-btn[variant="tonal"] {
  background-color: rgba(255, 152, 0, 0.12) !important;
  border: 1px solid rgba(255, 152, 0, 0.3) !important;
}

.focus-toggle-btn[variant="tonal"] {
  background-color: rgba(156, 39, 176, 0.12) !important;
  border: 1px solid rgba(156, 39, 176, 0.3) !important;
}

/* Efectos de brillo para estados activos */
.theme-toggle-btn[variant="tonal"] .theme-icon-transition {
  filter: drop-shadow(0 0 4px rgba(255, 193, 7, 0.5));
}

.contrast-toggle-btn[variant="tonal"] .contrast-icon-transition {
  filter: drop-shadow(0 0 4px rgba(255, 235, 59, 0.5));
}

.motion-toggle-btn[variant="tonal"] .motion-icon-transition {
  filter: drop-shadow(0 0 4px rgba(255, 152, 0, 0.5));
}

.focus-toggle-btn[variant="tonal"] .focus-icon-transition {
  filter: drop-shadow(0 0 4px rgba(156, 39, 176, 0.5));
}

/* Animación de pulso para indicar cambio de estado */
@keyframes accessibility-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Aplicar pulso cuando cambia el estado */
.theme-toggle-btn.state-changed .theme-icon-transition,
.contrast-toggle-btn.state-changed .contrast-icon-transition,
.motion-toggle-btn.state-changed .motion-icon-transition,
.focus-toggle-btn.state-changed .focus-icon-transition {
  animation: accessibility-pulse 0.6s ease-in-out;
}

/* Mejorar visibilidad en modo oscuro */
.v-theme--dark .theme-toggle-btn[variant="outlined"],
.v-theme--dark .contrast-toggle-btn[variant="outlined"],
.v-theme--dark .motion-toggle-btn[variant="outlined"],
.v-theme--dark .focus-toggle-btn[variant="outlined"] {
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: rgba(255, 255, 255, 0.8) !important;
}

.v-theme--dark .theme-toggle-btn[variant="outlined"]:hover,
.v-theme--dark .contrast-toggle-btn[variant="outlined"]:hover,
.v-theme--dark .motion-toggle-btn[variant="outlined"]:hover,
.v-theme--dark .focus-toggle-btn[variant="outlined"]:hover {
  border-color: rgba(255, 255, 255, 0.6) !important;
  color: rgba(255, 255, 255, 1) !important;
  background-color: rgba(255, 255, 255, 0.05) !important;
}

/* Tamaño uniforme para todos los botones de accesibilidad */
.theme-toggle-btn,
.contrast-toggle-btn,
.motion-toggle-btn,
.focus-toggle-btn {
  min-width: 40px !important;
  height: 40px !important;
  border-radius: 8px !important;
}
</style>
