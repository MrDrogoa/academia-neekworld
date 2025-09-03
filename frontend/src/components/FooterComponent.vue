<template>
  <footer
    class="bg-footer text-white"
    role="contentinfo"
    aria-label="Pie de p�gina"
  >
    <!-- Contenido principal del footer -->
    <div
      role="navigation"
      class="container-fluid container-1 py-5"
      aria-label="Enlaces del pie de p�gina"
    >
      <div class="row justify-content-center py-5">
        <!-- Aprende -->
        <div class="col-12 col-sm-6 col-md-4 mb-4 mb-md-0">
          <div class="text-center text-md-start">
            <h5 class="fw-semibold mb-3 text-white txt-footer">Aprende</h5>
            <ul class="list-unstyled txt-footer">
              <li class="mb-2">
                <router-link
                  to="/courses"
                  class="text-decoration-none footer-link"
                  >Cursos</router-link
                >
              </li>
              <li class="mb-2">
                <a href="/scholarships" class="text-decoration-none footer-link"
                  >Becas</a
                >
              </li>
              <li class="mb-2">
                <a
                  href="https://neekworld.cl/NW/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-decoration-none footer-link"
                  >Aula Virtual</a
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- Información (se oculta en móviles sm) -->
        <div class="col-12 col-sm-6 col-md-4 mb-4 mb-md-0 d-none d-sm-block">
          <div class="text-center text-md-start">
            <h5 class="fw-semibold mb-3 text-white txt-footer">Información</h5>
            <ul class="list-unstyled txt-footer">
              <li class="mb-2">
                <a href="/terms" class="text-decoration-none footer-link"
                  >Términos y Condiciones</a
                >
              </li>
              <li class="mb-2">
                <RouterLink to="/about" class="text-decoration-none footer-link"
                  >Acerca de</RouterLink
                >
              </li>
              <li class="mb-2">
                <a href="/contact" class="text-decoration-none footer-link"
                  >Contacto</a
                >
              </li>
            </ul>
          </div>
        </div>

        <!-- Contáctanos -->
        <div class="col-12 col-sm-6 col-md-4">
          <div class="text-center text-md-start">
            <h5 class="fw-semibold mb-3 text-white txt-footer">
              ¡Contáctanos!
            </h5>
            <div class="d-flex gap-3 justify-content-center">
              <a
                href="https://instagram.com"
                target="_blank"
                class="social-icon rounded-3 d-flex align-items-center justify-content-center"
                aria-label="Instagram"
              >
                <FontAwesomeIcon
                  icon="fa-brands fa-instagram"
                  class="text-white fs-4"
                />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                class="social-icon rounded-3 d-flex align-items-center justify-content-center"
                aria-label="Facebook"
              >
                <FontAwesomeIcon
                  icon="fa-brands fa-facebook"
                  class="text-white fs-4"
                />
              </a>
              <a
                href="tel:+1234567890"
                class="social-icon rounded-3 d-flex align-items-center justify-content-center"
                aria-label="Teléfono"
              >
                <FontAwesomeIcon
                  icon="fa-solid fa-phone"
                  class="text-white fs-4"
                />
              </a>
              <a
                href="mailto:info@academia.com"
                class="social-icon rounded-3 d-flex align-items-center justify-content-center"
                aria-label="Email"
              >
                <FontAwesomeIcon
                  icon="fa-solid fa-envelope"
                  class="text-white fs-4"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        class="border-top border-warning border-3 border-md-2 d-flex mt-4"
      ></div>
    </div>

    <!-- Footer bottom con línea y derechos -->
    <div class="pb-4">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12 text-center">
            <p class="mb-0 small txt-footer text-white">
              © {{ currentYear }} Derechos reservados - Academia Virtual
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>

<style scoped>
.footer {
  background-color: #2a3b5f;
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

.container-1 {
  max-width: 1200px;
  margin: 0 auto;
}

.txt-footer {
  font-family: "Dm Sans", sans-serif;
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
  color: #ffa500;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s ease;
  opacity: 0.9;
  font-weight: 500;
}

.footer-link:hover {
  color: #ffb84d;
  opacity: 1;
  text-decoration: underline;
}

/* color footer */
.bg-footer {
  background-color: #21234a;
}

/* Enlaces del footer */
.footer-link {
  color: #b8c5d6 !important;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #ffa500 !important;
}

/* Iconos sociales */
.social-icon {
  width: 40px;
  height: 40px;
  text-decoration: none !important;
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.social-icon:hover {
  background-color: #ffa500 !important;
  color: white !important;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
}

/* Responsive para iconos sociales en móviles */
@media (max-width: 575.98px) {
  .social-icon {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
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
  color: #90caf9 !important;
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
  color: #ffff00 !important;
  opacity: 1 !important;
  font-weight: 600;
  text-decoration: underline;
}

.high-contrast-mode .footer .footer-link:hover,
.high-contrast-mode .footer .footer-link:focus {
  background-color: #ffff00 !important;
  color: #000000 !important;
  padding: 4px 8px;
  border-radius: 3px;
  outline: 3px solid #ffff00;
  outline-offset: 2px;
  text-decoration: none;
}
</style>
