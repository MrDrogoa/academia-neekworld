// ========================================
// MAINCSS.JS - IMPORTACIÓN CENTRALIZADA DE ESTILOS
// ========================================
// Este archivo centraliza todas las importaciones de CSS/SCSS
// del proyecto para mantener un orden y facilitar el mantenimiento
// ========================================

// ========================================
// 1. VARIABLES - Deben cargarse primero
// ========================================
// Contiene: Variables de colores, espaciados, fuentes, etc.
import "./styles/variables.scss";

// ========================================
// 2. ESTILOS GLOBALES BASE
// ========================================
// Contiene: Reset CSS, estilos base de HTML, body, tipografía
import "./styles/global.scss";

// ========================================
// 3. ACCESIBILIDAD Y TEMAS
// ========================================
// Contiene: Temas (light/dark/high-contrast), escalado de texto,
// motion reducido, y otros ajustes de accesibilidad
import "./css/accessibility.css";

// ========================================
// 4. COMPONENTES ESPECÍFICOS (Orden alfabético)
// ========================================

// About - Página "Sobre Nosotros"
// Contiene: Estilos para la página About, secciones de equipo, valores
import "./styles/about.css";

// Cards Home - Tarjetas en la página principal
// Contiene: Estilos de tarjetas de cursos, botón "Agregar al carrito"
import "./styles/cardshome.css";

// Dashboard - Panel de usuario
// Contiene: Estilos del dashboard, grid de estadísticas
import "./styles/dashStyle.css";

// Footer - Pie de página global
// Contiene: Estilos del footer, links, redes sociales, responsive
import "./styles/footer.css";

// Hero - Sección principal de Home
// Contiene: Hero section, botones primary/secondary, iconos flotantes
import "./styles/hero.css";

// Home - Estilos generales de la página principal
// Contiene: Features, CTA section, grid de características
import "./styles/home.css";

// Navbar - Barra de navegación
// Contiene: Estilos del menú de navegación, responsive, drawer
import "./styles/navbar.css";

// User Info - Perfil de usuario
// Contiene: Estilos del perfil, botones de edición, avatar
import "./styles/userinfo.css";

// ========================================
// NOTAS DE USO:
// ========================================
// 1. Este archivo debe importarse en main.js:
//    import './assets/maincss.js';
//
// 2. El orden de importación es IMPORTANTE:
//    - Variables primero (se usan en otros archivos)
//    - Global después (estilos base)
//    - Accessibility (sobrescribe con temas)
//    - Componentes específicos al final
//
// 3. Si agregas un nuevo archivo CSS/SCSS:
//    - Agrégalo en orden alfabético en la sección 4
//    - Agrega un comentario explicando qué contiene
//
// 4. Archivos NO incluidos aquí (se cargan en componentes):
//    - Estilos scoped de componentes Vue
//    - CSS de librerías externas (Bootstrap, Vuetify)
// ========================================

export default {};
