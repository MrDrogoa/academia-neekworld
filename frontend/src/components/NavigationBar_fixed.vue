<template>
  <div>
    <v-app-bar app color="primary" dark elevation="4" role="banner">
      <div 
        class="d-flex align-center" 
        style="cursor:pointer" 
        @click="navigateTo('home')"
        @keydown.enter="navigateTo('home')"
        @keydown.space="navigateTo('home')"
        tabindex="0"
        role="button"
        aria-label="Ir a página de inicio"
      >
        <v-img
          alt="Logo de NeekWorld - Plataforma educativa"
          class="shrink mr-2"
          contain
          src="/logo2.ico"
          transition="scale-transition"
          width="36"
          height="36"
          style="border-radius: 8px; margin-right: 8px;"
          role="img"
        />
        <span class="navbar-title">NeekWorld</span>
      </div>

      <v-spacer></v-spacer>

      <!-- Navigation Links (desktop) -->
      <nav class="d-none d-md-flex" role="navigation" aria-label="Navegación principal">
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
              <v-icon left aria-hidden="true">mdi-book-open-page-variant</v-icon>
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

      <!-- Desktop: Accessibility Controls, Cart, Notifications, User Menu -->
      <div class="d-none d-md-flex align-center">
        <!-- Accessibility Controls -->
        <AccessibilityControls class="mr-2" />

        <!-- Shopping Cart -->
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
                  <v-icon :color="moodleStatusColor">{{ moodleStatusIcon }}</v-icon>
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

      <!-- Mobile menu button -->
      <v-tooltip bottom>
        <template v-slot:activator="{ props }">
          <v-btn 
            icon 
            v-bind="props"
            class="d-md-none" 
            @click="toggleMobileMenu"
            aria-label="Abrir menú de navegación móvil"
            :aria-expanded="mobileMenuOpen"
            aria-controls="mobile-menu-drawer"
          >
            <v-icon aria-hidden="true">mdi-menu</v-icon>
          </v-btn>
        </template>
        <span>{{ mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación' }}</span>
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
          <v-btn text v-bind="attrs" @click="snackbar.show = false">Cerrar</v-btn>
        </template>
      </v-snackbar>
    </v-app-bar>

    <!-- Mobile Navigation Drawer - FUERA del app-bar -->
    <v-navigation-drawer 
      v-model="mobileMenuOpen" 
      temporary 
      location="right"
      id="mobile-menu-drawer"
      role="navigation"
      aria-label="Menú de navegación móvil"
      width="280"
      :style="{ zIndex: 9999 }"
    >
      <!-- Mobile menu header -->
      <div class="d-flex align-center pa-4 primary white--text">
        <v-avatar size="40" class="mr-3">
          <v-icon color="white">mdi-account-circle</v-icon>
        </v-avatar>
        <div v-if="user.isAuthenticated">
          <div class="font-weight-bold">{{ user.userData?.name || userName }}</div>
          <div class="text-caption">{{ user.userData?.role || 'Usuario' }}</div>
        </div>
        <div v-else>
          <div class="font-weight-bold">Visitante</div>
          <div class="text-caption">No autenticado</div>
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

        <!-- Mobile: Cart and Accessibility -->
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

        <!-- Mobile Accessibility Controls -->
        <v-list-item>
          <template v-slot:prepend>
            <v-icon>mdi-eye-settings</v-icon>
          </template>
          <v-list-item-title>
            <AccessibilityControls />
          </v-list-item-title>
        </v-list-item>

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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/authService'
import cartService from '@/services/cartService'
import AuthDialog from './AuthDialog.vue'
import RealTimeNotifications from './dashboard/RealTimeNotifications.vue'
import AccessibilityControls from './AccessibilityControls.vue'

export default {
  name: 'NavigationBar',
  components: {
    AuthDialog,
    RealTimeNotifications,
    AccessibilityControls
  },
  emits: ['toggle-cart'],
  setup(props, { emit }) {
    const router = useRouter()

    // Reactive data
    const user = computed(() => authService.getCurrentUser())
    const cartItemCount = computed(() => cartService.getItemCount())
    const mobileMenuOpen = ref(false)
    const userMenuOpen = ref(false)

    const authDialog = ref({
      visible: false,
      mode: 'login'
    })

    const snackbar = ref({
      show: false,
      message: '',
      color: 'success',
      timeout: 4000
    })

    // Computed properties for Moodle status
    const moodleStatusColor = computed(() => 'success')
    const moodleStatusIcon = computed(() => 'mdi-check-circle')
    const moodleStatusText = computed(() => 'Disponible')
    const userName = computed(() => user.value?.userData?.name || 'Usuario')

    // Navigation function
    const navigateTo = (routeName) => {
      console.log(`🔄 Navegando a: ${routeName}`)
      closeMenus()
      router.push({ name: routeName }).catch(err => {
        console.error('Error navigating:', err)
      })
    }

    // Cart function
    const toggleCart = () => {
      console.log('🛒 Toggling cart')
      closeMenus()
      emit('toggle-cart')
    }

    // Auth functions
    const openAuthDialog = (mode) => {
      console.log(`🔐 Opening auth dialog: ${mode}`)
      closeMenus()
      authDialog.value.visible = true
      authDialog.value.mode = mode
    }

    const handleAuthSuccess = (userData) => {
      console.log('✅ Auth success:', userData)
      authDialog.value.visible = false
      showSnackbar('¡Bienvenido! Has iniciado sesión correctamente.', 'success')
    }

    const handleAuthError = (error) => {
      console.error('❌ Auth error:', error)
      showSnackbar(error.message || 'Error de autenticación', 'error')
    }

    const logout = async () => {
      console.log('👋 Logging out')
      closeMenus()
      try {
        await authService.logout()
        showSnackbar('Has cerrado sesión correctamente.', 'info')
        router.push({ name: 'home' })
      } catch (error) {
        console.error('Error during logout:', error)
        showSnackbar('Error al cerrar sesión', 'error')
      }
    }

    // Mobile menu function with extensive debugging
    const toggleMobileMenu = () => {
      const oldValue = mobileMenuOpen.value
      mobileMenuOpen.value = !mobileMenuOpen.value
      console.log(`📱 Toggle menú móvil: ${oldValue} -> ${mobileMenuOpen.value}`)
      console.log(`📱 Estado final: mobileMenuOpen=${mobileMenuOpen.value}`)
      
      // Cerrar otros menús
      userMenuOpen.value = false
      
      // Forzar actualización del DOM
      setTimeout(() => {
        console.log(`📱 Verificación después de timeout: mobileMenuOpen=${mobileMenuOpen.value}`)
      }, 100)
    }

    const closeMenus = () => {
      console.log('🔄 Cerrando todos los menús')
      mobileMenuOpen.value = false
      userMenuOpen.value = false
    }

    // Moodle function
    const openMoodle = () => {
      console.log('🎓 Opening Moodle')
      closeMenus()
      const moodleUrl = process.env.VUE_APP_MOODLE_URL || 'https://neekworld.unimayor.edu.co'
      window.open(moodleUrl, '_blank')
    }

    // Notification handlers
    const handleNewNotification = (notification) => {
      console.log('🔔 Nueva notificación:', notification)
      showSnackbar(`Nueva notificación: ${notification.title}`, 'info')
    }

    const handleNotificationRead = (notificationId) => {
      console.log('📖 Notificación leída:', notificationId)
    }

    const handleAllNotificationsRead = () => {
      console.log('📖 Todas las notificaciones marcadas como leídas')
    }

    // Snackbar function
    const showSnackbar = (message, color = 'success', timeout = 4000) => {
      snackbar.value = {
        show: true,
        message,
        color,
        timeout
      }
    }

    // Lifecycle
    onMounted(() => {
      console.log('🔧 NavigationBar mounted')
      console.log('👤 Current user:', user.value)
      console.log('🛒 Cart items:', cartItemCount.value)
    })

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
      handleAllNotificationsRead
    }
  }
}
</script>

<style scoped>
/* Logo vertical alignment fix */
.navbar-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-left: 8px;
}

/* Ensure proper mobile menu display */
.v-navigation-drawer {
  z-index: 9999 !important;
}

/* Mobile menu debug styles */
@media (max-width: 767px) {
  .mobile-menu-debug {
    border: 2px solid red;
    background-color: rgba(255, 0, 0, 0.1);
  }
}

/* Accessibility enhancements */
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

/* Focus indicators */
.v-btn:focus,
.v-list-item:focus {
  outline: 2px solid #2196F3;
  outline-offset: 2px;
}

/* High contrast support */
@media (prefers-contrast: high) {
  .v-app-bar {
    border-bottom: 2px solid currentColor;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .v-navigation-drawer {
    transition: none !important;
  }
}
</style>
