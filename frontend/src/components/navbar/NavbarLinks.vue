<template>
  <div class="navbar-links" :class="{ 'show': isMenuOpen }">
    <router-link to="/" class="nav-link">
      <v-icon size="small" class="nav-icon">mdi-home</v-icon>
      Inicio
    </router-link>
    
    <router-link to="/catalog" class="nav-link">
      <v-icon size="small" class="nav-icon">mdi-storefront</v-icon>
      Catálogo
    </router-link>
    
    <router-link to="/courses" class="nav-link">
      <v-icon size="small" class="nav-icon">mdi-book-open-variant</v-icon>
      Cursos
    </router-link>
    
    <!-- Aula Virtual Dropdown -->
    <AulaVirtualDropdown 
      :isOpen="aulaVirtualOpen" 
      @toggle="toggleAulaVirtual" 
    />
    
    <!-- Links for authenticated users -->
    <template v-if="isLoggedIn">
      <!-- Student links -->
      <router-link 
        v-if="userRole === 'student'" 
        to="/my-courses" 
        class="nav-link"
      >
        <v-icon size="small" class="nav-icon">mdi-school</v-icon>
        Mis cursos
      </router-link>
      
      <!-- Teacher links -->
      <router-link 
        v-if="userRole === 'teacher' || userRole === 'admin'" 
        to="/courses/manage" 
        class="nav-link"
      >
        <v-icon size="small" class="nav-icon">mdi-teach</v-icon>
        Gestión de cursos
      </router-link>
      
      <!-- Advanced Course Management (Day 3) -->
      <router-link 
        v-if="userRole === 'teacher' || userRole === 'admin'" 
        to="/courses/advanced-management" 
        class="nav-link"
      >
        <v-icon size="small" class="nav-icon">mdi-school-outline</v-icon>
        Gestión Avanzada
      </router-link>
      
      <!-- Admin links -->
      <router-link 
        v-if="userRole === 'admin'" 
        to="/dashboard" 
        class="nav-link"
      >
        <v-icon size="small" class="nav-icon">mdi-view-dashboard</v-icon>
        Administración
      </router-link>
      
      <!-- Payment System - Phase 4 -->
      <div v-if="userRole === 'admin'" class="payments-dropdown">
        <button 
          class="nav-link dropdown-toggle"
          @click="togglePaymentsDropdown"
        >
          <v-icon size="small" class="nav-icon">mdi-credit-card</v-icon>
          Pagos
          <v-icon size="small" class="dropdown-icon">mdi-chevron-down</v-icon>
        </button>
        
        <div v-if="paymentsDropdownOpen" class="dropdown-menu">
          <router-link to="/admin/payments" class="dropdown-item">
            <v-icon size="small" class="nav-icon">mdi-view-dashboard</v-icon>
            Dashboard de Pagos
          </router-link>
          <router-link to="/admin/payments/plans" class="dropdown-item">
            <v-icon size="small" class="nav-icon">mdi-package-variant</v-icon>
            Planes de Pago
          </router-link>
          <router-link to="/admin/payments/history" class="dropdown-item">
            <v-icon size="small" class="nav-icon">mdi-history</v-icon>
            Historial
          </router-link>
          <router-link to="/admin/payments/subscriptions" class="dropdown-item">
            <v-icon size="small" class="nav-icon">mdi-account-multiple</v-icon>
            Suscripciones
          </router-link>
          <router-link to="/admin/payments/analytics" class="dropdown-item">
            <v-icon size="small" class="nav-icon">mdi-chart-box</v-icon>
            Analytics
          </router-link>
        </div>
      </div>
      
      <!-- User Payment Options -->
      <router-link 
        v-if="isLoggedIn && userRole !== 'admin'" 
        to="/my-payments" 
        class="nav-link"
      >
        <v-icon size="small" class="nav-icon">mdi-wallet</v-icon>
        Mis Pagos
      </router-link>
    </template>
    
    <router-link to="/about" class="nav-link">
      <v-icon size="small" class="nav-icon">mdi-information</v-icon>
      Acerca de
    </router-link>
  </div>
</template>

<script>
import AulaVirtualDropdown from './AulaVirtualDropdown.vue';

export default {
  name: 'NavbarLinks',
  components: {
    AulaVirtualDropdown
  },
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true
    },
    userRole: {
      type: String,
      default: ''
    },
    isMenuOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      aulaVirtualOpen: false,
      paymentsDropdownOpen: false
    };
  },
  methods: {
    toggleAulaVirtual() {
      this.aulaVirtualOpen = !this.aulaVirtualOpen;
      this.paymentsDropdownOpen = false; // Close other dropdowns
    },
    togglePaymentsDropdown() {
      this.paymentsDropdownOpen = !this.paymentsDropdownOpen;
      this.aulaVirtualOpen = false; // Close other dropdowns
    }
  },
  watch: {
    // Close dropdown when mobile menu closes
    isMenuOpen(newVal) {
      if (!newVal) {
        this.aulaVirtualOpen = false;
        this.paymentsDropdownOpen = false;
      }
    }
  }
}
</script>

<style scoped>
.navbar-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #2A3B5F;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 4px;
  transition: color 0.3s, background-color 0.3s;
  display: flex;
  align-items: center;
}

.nav-icon {
  margin-right: 6px;
}

.nav-link:hover, .nav-link.router-link-active {
  color: #2E8B57;
  background-color: rgba(46, 139, 87, 0.1);
}

/* Payments Dropdown Styles */
.payments-dropdown {
  position: relative;
}

.dropdown-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
}

.dropdown-icon {
  margin-left: 4px;
  transition: transform 0.3s ease;
}

.dropdown-toggle:hover .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  padding: 8px 0;
  margin-top: 4px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  text-decoration: none;
  color: #2A3B5F;
  font-weight: 400;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.dropdown-item:hover {
  background-color: rgba(46, 139, 87, 0.1);
  color: #2E8B57;
}

.dropdown-item .nav-icon {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .navbar-links {
    display: none;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background-color: white;
    flex-direction: column;
    padding: 10px 0;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .navbar-links.show {
    display: flex;
  }
  
  .nav-link {
    width: 100%;
    text-align: center;
    padding: 12px 0;
    justify-content: center;
  }
  
  .payments-dropdown {
    width: 100%;
  }
  
  .dropdown-toggle {
    width: 100%;
    text-align: center;
    padding: 12px 0;
    justify-content: center;
  }
  
  .dropdown-menu {
    position: static;
    box-shadow: none;
    border: none;
    border-radius: 0;
    background: rgba(46, 139, 87, 0.05);
    margin: 0;
    padding: 0;
  }
  
  .dropdown-item {
    padding: 8px 20px;
    justify-content: center;
  }
}
</style>
