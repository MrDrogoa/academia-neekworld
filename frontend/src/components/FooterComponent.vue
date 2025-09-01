<template>
  <footer class="footer" role="contentinfo" aria-label="Pie de p�gina">
    <div class="container">
      <p class="footer-text">
         {{ currentYear }} Academia Virtual. Todos los derechos reservados.
      </p>
      <nav role="navigation" aria-label="Enlaces del pie de p�gina">
        <ul class="footer-links">
          <li>
            <router-link 
              to="/about" 
              class="footer-link"
              aria-label="Ir a p�gina Acerca de"
            >
              Acerca de
            </router-link>
          </li>
          <li>
            <a 
              href="#" 
              class="footer-link" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Visitar sitio principal de Academia Virtual (abre en nueva ventana)"
            >
              Academia Virtual
            </a>
          </li>
          <li>
            <router-link 
              to="/contact" 
              class="footer-link"
              aria-label="Ir a p�gina de contacto"
            >
              Contacto
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
  data() {
    return {
      currentYear: new Date().getFullYear()
    };
  }
};
</script>

<style scoped>
.footer {
  background-color: #2A3B5F;
  color: #ffffff;
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.footer-text {
  margin: 0;
  font-size: 14px;
  color: #ffffff;
  opacity: 1;
  order: 1;
}

.footer-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  order: 2;
}

.footer-link {
  color: #FFA500;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  opacity: 0.9;
  font-weight: 500;
}

.footer-link:hover {
  color: #FFB84D;
  opacity: 1;
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    gap: 10px;
  }
  
  .footer-links {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 15px 0;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 10px;
  }
}

/* Tema oscuro */
.v-theme--dark .footer {
  background-color: #1a1a1a !important;
  color: #ffffff !important;
  border-top-color: #404040 !important;
}

.v-theme--dark .footer .footer-text {
  color: #ffffff !important;
}

.v-theme--dark .footer .footer-link {
  color: #64b5f6 !important;
}

.v-theme--dark .footer .footer-link:hover {
  color: #90CAF9 !important;
}

/* Alto contraste */
.high-contrast-mode .footer {
  background-color: #000000 !important;
  color: #ffffff !important;
  border-top: 3px solid #ffffff !important;
}

.high-contrast-mode .footer .footer-text {
  color: #ffffff !important;
  opacity: 1 !important;
  font-weight: 600;
}

.high-contrast-mode .footer .footer-link {
  color: #FFFF00 !important;
  opacity: 1 !important;
  font-weight: 600;
  text-decoration: underline;
}

.high-contrast-mode .footer .footer-link:hover,
.high-contrast-mode .footer .footer-link:focus {
  background-color: #FFFF00 !important;
  color: #000000 !important;
  padding: 4px 8px;
  border-radius: 3px;
  outline: 3px solid #FFFF00;
  outline-offset: 2px;
  text-decoration: none;
}
</style>
