<template>
  <div class="navigation-bg">
    <v-app-bar
      app
      elevation="4"
      role="banner"
      class="bg-nav"
      :color="appBarColor"
      :theme="appBarTheme"
      :class="appBarClasses"
    >
      <!-- Wrapper para limitar el ancho del contenido -->
      <div class="toolbar-content-wrapper">
        <div
          style="cursor: pointer"
          @click="navigateTo('home')"
          @keydown.enter="navigateTo('home')"
          @keydown.space="navigateTo('home')"
          tabindex="0"
          role="button"
          aria-label="Ir a página de inicio"
        >
          <v-img
            alt="Logo de NeekWorld - Plataforma educativa"
            class="shrink"
            contain
            src="/logo.webp"
            transition="scale-transition"
            width="45"
            height="45"
            role="img"
          />
        </div>

        <v-spacer></v-spacer>

        <!-- Navigation Links (ahora siempre ocultas - se usan en el menú desplegable) -->
        <nav class="d-none" role="navigation" aria-label="Navegación principal">
          <v-tooltip bottom>
            <template v-slot:activator="{ props }">
              <v-btn
                text
                v-bind="props"
                @click="navigateTo('home')"
                class="mr-2"
                role="menuitem"
                aria-label="Ir a página de inicio"
              >
                <v-icon left aria-hidden="true">mdi-home</v-icon>
                Inicio
              </v-btn>
            </template>
            <span>Ir a la página principal</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ props }">
              <v-btn
                text
                v-bind="props"
                @click="navigateTo('courses')"
                class="mr-2"
                role="menuitem"
                aria-label="Ver catálogo de cursos"
              >
                <v-icon left aria-hidden="true"
                  >mdi-book-open-page-variant</v-icon
                >
                Cursos
              </v-btn>
            </template>
            <span>Explorar cursos disponibles</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ props }">
              <v-btn
                text
                v-bind="props"
                @click="navigateTo('about')"
                class="mr-2"
                role="menuitem"
                aria-label="Información sobre la plataforma"
              >
                <v-icon left aria-hidden="true">mdi-information-outline</v-icon>
                Acerca de
              </v-btn>
            </template>
            <span>Información sobre la plataforma</span>
          </v-tooltip>
        </nav>

        <!-- Desktop: Controles ahora movidos al menú desplegable -->
        <div class="d-none align-center">
          <!-- Accessibility Controls -->
          <AccessibilityControls class="mr-2" />

          <!-- Shopping Cart - Removido (ahora es botón flotante) -->
          <!-- 
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <v-btn 
              icon 
              v-bind="props"
              @click="toggleCart" 
              class="mr-2"
              aria-label="Abrir carrito de compras"
              :aria-describedby="cartItemCount > 0 ? 'cart-count' : null"
            >
              <v-badge 
                :content="cartItemCount" 
                :value="cartItemCount > 0" 
                color="red" 
                overlap
                :aria-label="`${cartItemCount} productos en el carrito`"
              >
                <v-icon aria-hidden="true">mdi-cart</v-icon>
              </v-badge>
              <span v-if="cartItemCount > 0" id="cart-count" class="sr-only">
                {{ cartItemCount }} productos en el carrito
              </span>
            </v-btn>
          </template>
          <span>
            {{ cartItemCount > 0 
              ? `Carrito (${cartItemCount} producto${cartItemCount > 1 ? 's' : ''})` 
              : 'Carrito de compras vacío' 
            }}
          </span>
        </v-tooltip>
        -->

          <!-- Real-time Notifications (only for logged in users) -->
          <template v-if="user.isAuthenticated">
            <RealTimeNotifications
              :userRole="user.userData?.role"
              @new-notification="handleNewNotification"
              @notification-read="handleNotificationRead"
              @all-notifications-read="handleAllNotificationsRead"
              class="mr-2"
            />
          </template>

          <!-- Desktop User Menu / Auth Buttons -->
          <template v-if="!user.isAuthenticated">
            <!-- Guest User Menu -->
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn text v-bind="props" class="mr-2">
                  <v-icon left>mdi-account-outline</v-icon>
                  Cuenta
                  <v-icon right>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="openAuthDialog('login')">
                  <template v-slot:prepend>
                    <v-icon>mdi-login</v-icon>
                  </template>
                  <v-list-item-title>Iniciar Sesión</v-list-item-title>
                </v-list-item>
                <v-list-item @click="openAuthDialog('register')">
                  <template v-slot:prepend>
                    <v-icon>mdi-account-plus</v-icon>
                  </template>
                  <v-list-item-title>Registrarse</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>

          <template v-else>
            <!-- Academic Tools Menu -->
            <v-menu offset-y>
              <template v-slot:activator="{ props }">
                <v-btn text v-bind="props" class="mr-2" color="accent">
                  <v-icon left>mdi-school</v-icon>
                  Académico
                  <v-icon right>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="navigateTo('dashboard')">
                  <template v-slot:prepend>
                    <v-icon>mdi-view-dashboard</v-icon>
                  </template>
                  <v-list-item-title>Dashboard</v-list-item-title>
                </v-list-item>
                <v-list-item @click="openMoodle">
                  <template v-slot:prepend>
                    <v-icon color="accent">mdi-school</v-icon>
                  </template>
                  <v-list-item-title>Aula Virtual / Moodle</v-list-item-title>
                </v-list-item>
                <v-list-item @click="navigateTo('my-courses')">
                  <template v-slot:prepend>
                    <v-icon>mdi-book-account</v-icon>
                  </template>
                  <v-list-item-title>Mis Cursos</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item disabled>
                  <template v-slot:prepend>
                    <v-icon :color="moodleStatusColor">{{
                      moodleStatusIcon
                    }}</v-icon>
                  </template>
                  <v-list-item-title class="text-caption">
                    Moodle: {{ moodleStatusText }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <!-- User Profile Menu -->
            <v-menu offset-y v-model="userMenuOpen">
              <template v-slot:activator="{ props }">
                <v-btn text v-bind="props" class="text-none">
                  <v-avatar size="32" class="mr-2">
                    <v-icon>mdi-account-circle</v-icon>
                  </v-avatar>
                  {{ user.userData?.name || userName }}
                  <v-icon right>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="navigateTo('profile')">
                  <template v-slot:prepend>
                    <v-icon>mdi-account</v-icon>
                  </template>
                  <v-list-item-title>Mi Perfil</v-list-item-title>
                </v-list-item>
                <v-list-item @click="navigateTo('purchases')">
                  <template v-slot:prepend>
                    <v-icon>mdi-shopping</v-icon>
                  </template>
                  <v-list-item-title>Mis Compras</v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="logout">
                  <template v-slot:prepend>
                    <v-icon color="red">mdi-logout</v-icon>
                  </template>
                  <v-list-item-title>Cerrar Sesión</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </div>

        <!-- Menu toggle button - Siempre visible para diseño minimalista -->
        <v-tooltip bottom>
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              v-bind="props"
              @click="toggleMobileMenu"
              aria-label="Abrir menú de navegación"
              :aria-expanded="mobileMenuOpen"
              aria-controls="navigation-menu-drawer"
              class="icon-menu"
            >
              <v-icon aria-hidden="true">mdi-menu</v-icon>
            </v-btn>
          </template>
          <span>{{
            mobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"
          }}</span>
        </v-tooltip>

        <!-- Auth Dialog -->
        <AuthDialog
          v-model:visible="authDialog.visible"
          :mode="authDialog.mode"
          @auth-success="handleAuthSuccess"
          @auth-error="handleAuthError"
        />

        <!-- Success/Error Snackbars -->
        <v-snackbar
          v-model="snackbar.show"
          :color="snackbar.color"
          :timeout="snackbar.timeout"
          top
        >
          {{ snackbar.message }}
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="snackbar.show = false"
              >Cerrar</v-btn
            >
          </template>
        </v-snackbar>
      </div>
      <!-- Cierre del toolbar-content-wrapper -->
    </v-app-bar>

    <!-- Navigation Drawer - Menú unificado para todos los dispositivos -->
    <v-navigation-drawer
      v-model="mobileMenuOpen"
      temporary
      location="right"
      id="navigation-menu-drawer"
      role="navigation"
      aria-label="Menú de navegación principal"
      width="320"
      :style="{ zIndex: 9999 }"
      :color="drawerColor"
      :theme="drawerTheme"
      :class="drawerClasses"
    >
      <!-- Header del menú - Diseño limpio y moderno -->
      <div class="d-flex align-center pa-4" :class="headerClasses">
        <v-avatar size="40" class="mr-3" :color="avatarColor">
          <v-icon :color="avatarIconColor">mdi-account-circle</v-icon>
        </v-avatar>
        <div v-if="user.isAuthenticated">
          <div class="font-weight-bold" :class="userNameClasses">
            {{ user.userData?.name || userName }}
          </div>
          <div class="text-caption" :class="userRoleClasses">
            {{ user.userData?.role || "Usuario" }}
          </div>
        </div>
        <div v-else>
          <div class="font-weight-bold" :class="userNameClasses">Visitante</div>
          <div class="text-caption" :class="userRoleClasses">
            No autenticado
          </div>
        </div>
      </div>

      <v-list dense>
        <!-- Navigation Links -->
        <v-list-item
          @click="navigateTo('home')"
          role="menuitem"
          tabindex="0"
          aria-label="Ir a página de inicio"
        >
          <template v-slot:prepend>
            <v-icon aria-hidden="true">mdi-home</v-icon>
          </template>
          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>

        <v-list-item
          @click="navigateTo('courses')"
          role="menuitem"
          tabindex="0"
          aria-label="Ver catálogo de cursos"
        >
          <template v-slot:prepend>
            <v-icon aria-hidden="true">mdi-book-open-page-variant</v-icon>
          </template>
          <v-list-item-title>Cursos</v-list-item-title>
        </v-list-item>

        <v-list-item
          @click="navigateTo('dashboard')"
          role="menuitem"
          tabindex="0"
          aria-label="Ir al panel de control"
        >
          <template v-slot:prepend>
            <v-icon aria-hidden="true">mdi-view-dashboard</v-icon>
          </template>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item
          @click="openMoodle"
          role="menuitem"
          tabindex="0"
          aria-label="Acceder al aula virtual Moodle"
        >
          <template v-slot:prepend>
            <v-icon color="accent" aria-hidden="true">mdi-school</v-icon>
          </template>
          <v-list-item-title>Aula Virtual</v-list-item-title>
        </v-list-item>

        <v-list-item
          @click="navigateTo('about')"
          role="menuitem"
          tabindex="0"
          aria-label="Información sobre la plataforma"
        >
          <template v-slot:prepend>
            <v-icon aria-hidden="true">mdi-information-outline</v-icon>
          </template>
          <v-list-item-title>Acerca de</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2"></v-divider>

        <!-- Mobile: Cart removido (ahora es botón flotante) -->
        <!-- 
        <v-list-item @click="toggleCart">
          <template v-slot:prepend>
            <v-badge 
              :content="cartItemCount" 
              :value="cartItemCount > 0" 
              color="red" 
              overlap
            >
              <v-icon>mdi-cart</v-icon>
            </v-badge>
          </template>
          <v-list-item-title>
            Carrito
            <span v-if="cartItemCount > 0" class="text-caption ml-1">
              ({{ cartItemCount }})
            </span>
          </v-list-item-title>
        </v-list-item>
        -->

        <!-- Mobile Accessibility Controls - Integrado para mejor usabilidad -->
        <v-divider class="my-2"></v-divider>

        <!-- Expansion Panel para Accesibilidad -->
        <v-expansion-panels flat>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <v-icon
                  class="mr-3"
                  :color="hasAnyAccessibilityActive ? 'primary' : 'default'"
                >
                  mdi-eye-settings
                </v-icon>
                <span>Opciones de Accesibilidad</span>
                <v-chip
                  v-if="hasAnyAccessibilityActive"
                  size="x-small"
                  color="primary"
                  class="ml-2"
                >
                  Activo
                </v-chip>
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="mobile-accessibility-controls pa-2">
                <!-- Tema Oscuro/Claro -->
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="d-flex align-center">
                    <v-icon
                      class="mr-2"
                      size="small"
                      :color="isDarkTheme ? 'amber' : 'indigo'"
                    >
                      {{
                        isDarkTheme ? "mdi-weather-night" : "mdi-weather-sunny"
                      }}
                    </v-icon>
                    <span class="text-body-2"
                      >Tema {{ isDarkTheme ? "Oscuro" : "Claro" }}</span
                    >
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
                    <v-icon
                      :class="{ 'theme-icon-transition': true }"
                      size="20"
                    >
                      {{
                        isDarkTheme ? "mdi-weather-sunny" : "mdi-weather-night"
                      }}
                    </v-icon>
                  </v-btn>
                </div>

                <!-- Alto Contraste -->
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="d-flex align-center">
                    <v-icon
                      class="mr-2"
                      size="small"
                      :color="highContrastMode ? 'yellow' : 'default'"
                    >
                      mdi-theme-light-dark
                    </v-icon>
                    <span class="text-body-2">Alto Contraste</span>
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
                    <v-icon
                      :class="{ 'contrast-icon-transition': true }"
                      size="20"
                    >
                      {{ highContrastMode ? "mdi-eye" : "mdi-eye-outline" }}
                    </v-icon>
                  </v-btn>
                </div>

                <!-- Tamaño de Texto -->
                <div class="mb-3">
                  <div class="d-flex align-center mb-2">
                    <v-icon class="mr-2" size="small">mdi-format-size</v-icon>
                    <span class="text-body-2"
                      >Tamaño de Texto: {{ textSize }}%</span
                    >
                  </div>
                  <div class="d-flex align-center justify-space-between">
                    <v-btn
                      size="small"
                      variant="outlined"
                      @click="decreaseTextSize"
                      :disabled="textSize <= 80"
                      aria-label="Reducir tamaño de texto"
                    >
                      <v-icon size="small">mdi-minus</v-icon>
                    </v-btn>
                    <span class="mx-3 text-caption">{{ textSize }}%</span>
                    <v-btn
                      size="small"
                      variant="outlined"
                      @click="increaseTextSize"
                      :disabled="textSize >= 130"
                      aria-label="Aumentar tamaño de texto"
                    >
                      <v-icon size="small">mdi-plus</v-icon>
                    </v-btn>
                  </div>
                </div>

                <!-- Reducir Animaciones -->
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="d-flex align-center">
                    <v-icon
                      class="mr-2"
                      size="small"
                      :color="reducedMotionMode ? 'green' : 'default'"
                    >
                      mdi-run-fast
                    </v-icon>
                    <span class="text-body-2">Reducir Animaciones</span>
                  </div>

                  <!-- Botón de animaciones con transición -->
                  <v-btn
                    @click="toggleReducedMotion"
                    :color="reducedMotionMode ? 'green' : 'grey'"
                    :variant="reducedMotionMode ? 'tonal' : 'outlined'"
                    size="small"
                    :aria-label="
                      reducedMotionMode
                        ? 'Activar animaciones'
                        : 'Reducir animaciones'
                    "
                    class="motion-toggle-btn"
                  >
                    <v-icon
                      :class="{ 'motion-icon-transition': true }"
                      size="20"
                    >
                      {{ reducedMotionMode ? "mdi-pause" : "mdi-play" }}
                    </v-icon>
                  </v-btn>
                </div>

                <!-- Foco Mejorado -->
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="d-flex align-center">
                    <v-icon
                      class="mr-2"
                      size="small"
                      :color="enhancedFocusMode ? 'purple' : 'default'"
                    >
                      mdi-crosshairs-gps
                    </v-icon>
                    <span class="text-body-2">Foco Mejorado</span>
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
                    <v-icon
                      :class="{ 'focus-icon-transition': true }"
                      size="20"
                    >
                      {{
                        enhancedFocusMode ? "mdi-target" : "mdi-target-variant"
                      }}
                    </v-icon>
                  </v-btn>
                </div>

                <!-- Botón de Reset -->
                <v-divider class="my-3"></v-divider>
                <v-btn
                  block
                  size="small"
                  variant="text"
                  color="error"
                  @click="resetAllSettings"
                  prepend-icon="mdi-restore"
                >
                  Restaurar por Defecto
                </v-btn>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-divider v-if="user.isAuthenticated" class="my-2"></v-divider>

        <!-- Authenticated user options -->
        <template v-if="user.isAuthenticated">
          <v-list-item @click="navigateTo('profile')">
            <template v-slot:prepend>
              <v-icon>mdi-account</v-icon>
            </template>
            <v-list-item-title>Mi Perfil</v-list-item-title>
          </v-list-item>

          <v-list-item @click="navigateTo('my-courses')">
            <template v-slot:prepend>
              <v-icon>mdi-book-account</v-icon>
            </template>
            <v-list-item-title>Mis Cursos</v-list-item-title>
          </v-list-item>

          <v-list-item @click="navigateTo('purchases')">
            <template v-slot:prepend>
              <v-icon>mdi-shopping</v-icon>
            </template>
            <v-list-item-title>Mis Compras</v-list-item-title>
          </v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-item @click="logout">
            <template v-slot:prepend>
              <v-icon color="red">mdi-logout</v-icon>
            </template>
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item>
        </template>

        <!-- Non-authenticated user options -->
        <template v-else>
          <v-list-item @click="openAuthDialog('login')">
            <template v-slot:prepend>
              <v-icon>mdi-login</v-icon>
            </template>
            <v-list-item-title>Iniciar Sesión</v-list-item-title>
          </v-list-item>

          <v-list-item @click="openAuthDialog('register')">
            <template v-slot:prepend>
              <v-icon>mdi-account-plus</v-icon>
            </template>
            <v-list-item-title>Registrarse</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import authService from "@/services/authService";
import cartService from "@/services/cartService";
import AuthDialog from "./AuthDialog.vue";
import RealTimeNotifications from "./dashboard/RealTimeNotifications.vue";
import AccessibilityControls from "./AccessibilityControls.vue";
import { useAccessibility } from "@/composables/useAccessibility";
import "@/assets/styles/navbar.css";

export default {
  name: "NavigationBar",
  components: {
    AuthDialog,
    RealTimeNotifications,
    AccessibilityControls,
  },
  emits: ["toggle-cart"],
  setup(props, { emit }) {
    const router = useRouter();

    // Reactive data
    const user = computed(() => authService.getCurrentUser());
    const cartItemCount = computed(() => cartService.getItemCount());
    const mobileMenuOpen = ref(false);
    const userMenuOpen = ref(false);

    // Accessibility composable for mobile controls
    const accessibility = useAccessibility();
    const {
      // Theme
      isDarkTheme,
      toggleTheme,
      // High contrast
      highContrastMode,
      toggleHighContrast,
      // Text size
      textSize,
      increaseTextSize,
      decreaseTextSize,
      // Reduced motion
      reducedMotionMode,
      toggleReducedMotion,
      // Enhanced focus
      enhancedFocusMode,
      toggleEnhancedFocus,
      // Reset
      resetAllSettings,
      // Load settings
      loadSavedSettings,
    } = accessibility;

    // Computed for accessibility status
    const hasAnyAccessibilityActive = computed(() => {
      return (
        isDarkTheme.value ||
        highContrastMode.value ||
        textSize.value !== 100 ||
        reducedMotionMode.value ||
        enhancedFocusMode.value
      );
    });

    const authDialog = ref({
      visible: false,
      mode: "login",
    });

    const snackbar = ref({
      show: false,
      message: "",
      color: "success",
      timeout: 4000,
    });

    // Computed properties for Moodle status
    const moodleStatusColor = computed(() => "success");
    const moodleStatusIcon = computed(() => "mdi-check-circle");
    const moodleStatusText = computed(() => "Disponible");
    const userName = computed(() => user.value?.userData?.name || "Usuario");

    // Navigation function
    const navigateTo = (routeName) => {
      console.log(`🔄 Navegando a: ${routeName}`);
      closeMenus();
      router.push({ name: routeName }).catch((err) => {
        console.error("Error navigating:", err);
      });
    };

    // Cart function
    const toggleCart = () => {
      console.log("🛒 Toggling cart");
      closeMenus();
      emit("toggle-cart");
    };

    // Auth functions
    const openAuthDialog = (mode) => {
      console.log(`🔐 Opening auth dialog: ${mode}`);
      closeMenus();
      authDialog.value.visible = true;
      authDialog.value.mode = mode;
    };

    const handleAuthSuccess = (userData) => {
      console.log("✅ Auth success:", userData);
      authDialog.value.visible = false;
      showSnackbar(
        "¡Bienvenido! Has iniciado sesión correctamente.",
        "success"
      );
    };

    const handleAuthError = (error) => {
      console.error("❌ Auth error:", error);
      showSnackbar(error.message || "Error de autenticación", "error");
    };

    const logout = async () => {
      console.log("👋 Logging out");
      closeMenus();
      try {
        await authService.logout();
        showSnackbar("Has cerrado sesión correctamente.", "info");
        router.push({ name: "home" });
      } catch (error) {
        console.error("Error during logout:", error);
        showSnackbar("Error al cerrar sesión", "error");
      }
    };

    // Mobile menu function with extensive debugging
    const toggleMobileMenu = () => {
      const oldValue = mobileMenuOpen.value;
      mobileMenuOpen.value = !mobileMenuOpen.value;
      console.log(
        `📱 Toggle menú móvil: ${oldValue} -> ${mobileMenuOpen.value}`
      );
      console.log(`📱 Estado final: mobileMenuOpen=${mobileMenuOpen.value}`);

      // Cerrar otros menús
      userMenuOpen.value = false;

      // Forzar actualización del DOM
      setTimeout(() => {
        console.log(
          `📱 Verificación después de timeout: mobileMenuOpen=${mobileMenuOpen.value}`
        );
      }, 100);
    };

    const closeMenus = () => {
      console.log("🔄 Cerrando todos los menús");
      mobileMenuOpen.value = false;
      userMenuOpen.value = false;
    };

    // Moodle function
    const openMoodle = () => {
      console.log("🎓 Opening Moodle");
      closeMenus();
      const moodleUrl =
        process.env.VUE_APP_MOODLE_URL || "https://neekworld.cl/NW";
      window.open(moodleUrl, "_blank");
    };

    // Notification handlers
    const handleNewNotification = (notification) => {
      console.log("🔔 Nueva notificación:", notification);
      showSnackbar(`Nueva notificación: ${notification.title}`, "info");
    };

    const handleNotificationRead = (notificationId) => {
      console.log("📖 Notificación leída:", notificationId);
    };

    const handleAllNotificationsRead = () => {
      console.log("📖 Todas las notificaciones marcadas como leídas");
    };

    // Snackbar function
    const showSnackbar = (message, color = "success", timeout = 4000) => {
      snackbar.value = {
        show: true,
        message,
        color,
        timeout,
      };
    };

    // Lifecycle
    onMounted(() => {
      console.log("🔧 NavigationBar mounted");
      console.log("👤 Current user:", user.value);
      console.log("🛒 Cart items:", cartItemCount.value);

      // Initialize accessibility settings
      console.log("🎨 Initializing accessibility settings...");
      loadSavedSettings();

      // Log current accessibility state after initialization
      setTimeout(() => {
        console.log("🎨 Accessibility state after init:", {
          isDarkTheme: isDarkTheme.value,
          highContrastMode: highContrastMode.value,
          textSize: textSize.value,
          reducedMotionMode: reducedMotionMode.value,
          enhancedFocusMode: enhancedFocusMode.value,
        });
      }, 500);
    });

    // Computed properties para el navigation drawer
    const drawerColor = computed(() => {
      if (highContrastMode.value) {
        return "black";
      }
      return isDarkTheme.value ? "primary" : "white";
    });

    const drawerTheme = computed(() => {
      if (highContrastMode.value) {
        return "dark";
      }
      return isDarkTheme.value ? "dark" : "light";
    });

    const drawerClasses = computed(() => {
      const classes = [];
      if (highContrastMode.value) {
        classes.push("high-contrast-drawer");
      }
      return classes.join(" ");
    });

    const headerClasses = computed(() => {
      if (highContrastMode.value) {
        return "high-contrast-header";
      }
      return isDarkTheme.value;
    });

    const avatarColor = computed(() => {
      if (highContrastMode.value) {
        return "yellow";
      }
      return isDarkTheme.value ? "white" : "primary";
    });

    const avatarIconColor = computed(() => {
      if (highContrastMode.value) {
        return "black";
      }
      return isDarkTheme.value ? "primary" : "blue";
    });

    const userNameClasses = computed(() => {
      if (highContrastMode.value) {
        return "text-yellow";
      }
      return isDarkTheme.value ? "text-white" : "text-grey-darken-4";
    });

    const userRoleClasses = computed(() => {
      if (highContrastMode.value) {
        return "text-white";
      }
      return isDarkTheme.value ? "text-grey-lighten-1" : "text-grey-darken-1";
    });

    const appBarColor = computed(() => {
      if (highContrastMode.value) {
        return "black";
      }
      return isDarkTheme.value ? "primary" : "#21234A";
    });

    const appBarTheme = computed(() => {
      if (highContrastMode.value) {
        return "dark";
      }
      return isDarkTheme.value ? "dark" : "light";
    });

    const appBarClasses = computed(() => {
      const classes = [];
      if (highContrastMode.value) {
        classes.push("high-contrast-app-bar");
      }
      return classes.join(" ");
    });

    return {
      // Reactive data
      user,
      cartItemCount,
      mobileMenuOpen,
      userMenuOpen,
      authDialog,
      snackbar,

      // Computed
      moodleStatusColor,
      moodleStatusIcon,
      moodleStatusText,
      userName,
      drawerColor,
      drawerTheme,
      drawerClasses,
      headerClasses,
      avatarColor,
      avatarIconColor,
      userNameClasses,
      userRoleClasses,
      appBarColor,
      appBarTheme,
      appBarClasses,

      // Accessibility Mobile Controls
      isDarkTheme,
      toggleTheme,
      highContrastMode,
      toggleHighContrast,
      textSize,
      increaseTextSize,
      decreaseTextSize,
      reducedMotionMode,
      toggleReducedMotion,
      enhancedFocusMode,
      toggleEnhancedFocus,
      resetAllSettings,
      hasAnyAccessibilityActive,

      // Methods
      navigateTo,
      toggleCart,
      openAuthDialog,
      openMoodle,
      logout,
      handleAuthSuccess,
      handleAuthError,
      toggleMobileMenu,
      closeMenus,
      handleNewNotification,
      handleNotificationRead,
      handleAllNotificationsRead,
    };
  },
};
</script>

<style scoped></style>
