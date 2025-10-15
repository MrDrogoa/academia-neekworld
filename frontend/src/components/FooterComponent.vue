<template>
  <footer
    class="bg-footer text-white"
    role="contentinfo"
    aria-label="Pie de p�gina"
  >
    <!-- Contenido principal del footer -->
    <div
      role="navigation"
      class="container m-auto py-5"
      aria-label="Enlaces del pie de p�gina"
    >
      <div class="row justify-content-center py-5">
        <!-- Secciones dinámicas de enlaces -->
        <div
          v-for="(section, index) in footerSections"
          :key="index"
          :class="[
            'col-12 col-sm-6 col-md-4 mb-4 mb-md-0',
            { 'd-none d-sm-block': section.hideOnMobile },
          ]"
        >
          <div class="text-center text-md-start">
            <h5 class="fw-semibold mb-3 text-white txt-footer">
              {{ section.title }}
            </h5>
            <ul class="list-unstyled txt-footer">
              <li
                v-for="(link, linkIndex) in section.links"
                :key="linkIndex"
                class="mb-2"
              >
                <router-link
                  v-if="link.isRouter"
                  :to="link.to"
                  class="text-decoration-none footer-link"
                >
                  {{ link.text }}
                </router-link>
                <a
                  v-else
                  :href="link.to"
                  :target="link.external ? '_blank' : '_self'"
                  :rel="link.external ? 'noopener noreferrer' : null"
                  class="text-decoration-none footer-link"
                >
                  {{ link.text }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Sección de redes sociales -->
        <div class="col-12 col-sm-6 col-md-4">
          <div class="text-center text-md-start">
            <h5 class="fw-semibold mb-3 text-white txt-footer">
              ¡Contáctanos!
            </h5>
            <div class="d-flex gap-3 justify-content-center">
              <a
                v-for="(social, index) in socialLinks"
                :key="index"
                :href="social.url"
                :target="social.url.startsWith('http') ? '_blank' : '_self'"
                :rel="
                  social.url.startsWith('http') ? 'noopener noreferrer' : null
                "
                class="social-icon text-white fs-5 rounded-3 d-flex align-items-center justify-content-center"
                :aria-label="social.label"
              >
                <FontAwesomeIcon :icon="social.icon" class="fs-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <!-- Línea divisoria -->
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

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const currentYear = new Date().getFullYear();

const footerSections = [
  {
    title: "Aprende",
    visible: true,
    links: [
      { text: "Cursos", to: "/courses", isRouter: true },
      { text: "Becas", to: "/scholarships", isRouter: false },
      {
        text: "Aula Virtual",
        to: "https://neekworld.cl/NW/",
        isRouter: false,
        external: true,
      },
    ],
  },
  {
    title: "Información",
    visible: true,
    hideOnMobile: true,
    links: [
      { text: "Términos y Condiciones", to: "/terms", isRouter: true },
      { text: "Acerca de", to: "/about", isRouter: true },
      { text: "Contacto", to: "/contact", isRouter: true },
    ],
  },
];

const socialLinks = [
  {
    icon: "fa-brands fa-instagram",
    url: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: "fa-brands fa-facebook",
    url: "https://facebook.com",
    label: "Facebook",
  },
  {
    icon: "fa-solid fa-phone",
    url: "tel:+1234567890",
    label: "Teléfono",
  },
  {
    icon: "fa-solid fa-envelope",
    url: "mailto:info@academia.com",
    label: "Email",
  },
];
</script>

<style scoped>
@import "../assets/styles/footer.css";
</style>
