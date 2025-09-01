// ===================================================
// SCRIPT DE PRUEBA - NAVBAR Y NAVIGATION DRAWER
// Academia Virtual - Verificación de Visibilidad
// ===================================================

console.log('🔧 INICIANDO PRUEBAS DE NAVBAR Y NAVIGATION DRAWER...');

// Crear controles flotantes para pruebas
function createNavbarTestControls() {
  // Remover controles anteriores si existen
  const existingControls = document.getElementById('navbar-test-controls');
  if (existingControls) {
    existingControls.remove();
  }

  const testControls = document.createElement('div');
  testControls.id = 'navbar-test-controls';
  testControls.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: #000;
    color: white;
    padding: 15px;
    border-radius: 8px;
    z-index: 10000;
    font-family: monospace;
    font-size: 12px;
    border: 2px solid #fff;
    min-width: 300px;
  `;

  testControls.innerHTML = `
    <div style="margin-bottom: 10px;">
      <strong>🧪 PRUEBAS NAVBAR</strong>
    </div>
    
    <button onclick="testLightTheme()" style="background: #fff; color: #000; border: none; padding: 5px 10px; margin: 2px; border-radius: 4px; cursor: pointer;">
      🌞 Modo Claro
    </button>
    
    <button onclick="testDarkTheme()" style="background: #333; color: #fff; border: none; padding: 5px 10px; margin: 2px; border-radius: 4px; cursor: pointer;">
      🌙 Modo Oscuro
    </button>
    
    <button onclick="testMobileMenu()" style="background: #007bff; color: #fff; border: none; padding: 5px 10px; margin: 2px; border-radius: 4px; cursor: pointer;">
      📱 Menú Móvil
    </button>
    
    <button onclick="analyzeNavbarStyles()" style="background: #28a745; color: #fff; border: none; padding: 5px 10px; margin: 2px; border-radius: 4px; cursor: pointer;">
      🔍 Analizar Estilos
    </button>
    
    <button onclick="document.getElementById('navbar-test-controls').remove()" style="background: #dc3545; color: #fff; border: none; padding: 5px 10px; margin: 2px; border-radius: 4px; cursor: pointer;">
      ❌ Cerrar
    </button>
    
    <div id="test-results" style="margin-top: 10px; font-size: 11px; max-height: 200px; overflow-y: auto;"></div>
  `;

  document.body.appendChild(testControls);
}

// Función para probar modo claro
function testLightTheme() {
  console.log('🌞 Probando modo claro...');
  
  // Activar tema claro
  const vuetifyTheme = document.querySelector('.v-application');
  if (vuetifyTheme) {
    vuetifyTheme.classList.remove('v-theme--dark');
    vuetifyTheme.classList.add('v-theme--light');
  }
  
  // Cambiar clase en html
  document.documentElement.classList.remove('v-theme--dark');
  document.documentElement.classList.add('v-theme--light');
  
  setTimeout(() => {
    analyzeNavbarStyles('light');
  }, 500);
}

// Función para probar modo oscuro
function testDarkTheme() {
  console.log('🌙 Probando modo oscuro...');
  
  // Activar tema oscuro
  const vuetifyTheme = document.querySelector('.v-application');
  if (vuetifyTheme) {
    vuetifyTheme.classList.remove('v-theme--light');
    vuetifyTheme.classList.add('v-theme--dark');
  }
  
  // Cambiar clase en html
  document.documentElement.classList.remove('v-theme--light');
  document.documentElement.classList.add('v-theme--dark');
  
  setTimeout(() => {
    analyzeNavbarStyles('dark');
  }, 500);
}

// Función para probar menú móvil
function testMobileMenu() {
  console.log('📱 Probando menú móvil...');
  
  // Simular vista móvil
  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, user-scalable=no');
  }
  
  // Cambiar el ancho de la ventana virtualmente
  document.body.style.width = '375px';
  
  // Buscar botón del menú móvil
  const mobileMenuButton = document.querySelector('[aria-label*="menú"]') || 
                           document.querySelector('[aria-label*="Menú"]') ||
                           document.querySelector('.v-app-bar .v-btn:last-child');
  
  if (mobileMenuButton) {
    console.log('📱 Botón de menú móvil encontrado, haciendo clic...');
    mobileMenuButton.click();
    
    setTimeout(() => {
      const drawer = document.querySelector('.v-navigation-drawer');
      if (drawer) {
        console.log('✅ Menú móvil abierto correctamente');
        analyzeDrawerStyles();
      } else {
        console.log('❌ No se pudo abrir el menú móvil');
      }
    }, 500);
  } else {
    console.log('❌ No se encontró el botón del menú móvil');
  }
}

// Función para analizar estilos del navbar
function analyzeNavbarStyles(themeType = 'current') {
  const resultsDiv = document.getElementById('test-results');
  const navbar = document.querySelector('.v-app-bar');
  
  if (!navbar) {
    resultsDiv.innerHTML = '<div style="color: red;">❌ Navbar no encontrado</div>';
    return;
  }
  
  const computedStyle = window.getComputedStyle(navbar);
  const backgroundColor = computedStyle.backgroundColor;
  const color = computedStyle.color;
  const border = computedStyle.borderBottom;
  
  let result = `
    <div><strong>📊 ANÁLISIS NAVBAR (${themeType.toUpperCase()})</strong></div>
    <div>🎨 Background: ${backgroundColor}</div>
    <div>📝 Color: ${color}</div>
    <div>🔲 Border: ${border}</div>
    <div>📐 Display: ${computedStyle.display}</div>
    <div>🔍 Visibility: ${computedStyle.visibility}</div>
    <div>🌐 Z-Index: ${computedStyle.zIndex}</div>
  `;
  
  // Verificar si es transparente
  if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
    result += '<div style="color: red;">⚠️ PROBLEMA: Fondo transparente detectado</div>';
  } else {
    result += '<div style="color: green;">✅ Fondo sólido OK</div>';
  }
  
  // Verificar contraste
  if (color === backgroundColor) {
    result += '<div style="color: red;">⚠️ PROBLEMA: Sin contraste texto/fondo</div>';
  } else {
    result += '<div style="color: green;">✅ Contraste OK</div>';
  }
  
  resultsDiv.innerHTML = result;
  console.log('📊 Análisis de navbar completado:', { backgroundColor, color, border });
}

// Función para analizar estilos del drawer
function analyzeDrawerStyles() {
  const drawer = document.querySelector('.v-navigation-drawer');
  
  if (!drawer) {
    console.log('❌ Navigation drawer no encontrado');
    return;
  }
  
  const computedStyle = window.getComputedStyle(drawer);
  const backgroundColor = computedStyle.backgroundColor;
  const color = computedStyle.color;
  
  console.log('📊 Análisis de drawer:', {
    backgroundColor,
    color,
    display: computedStyle.display,
    visibility: computedStyle.visibility,
    zIndex: computedStyle.zIndex
  });
  
  // Verificar elementos internos
  const listItems = drawer.querySelectorAll('.v-list-item');
  console.log(`📋 Elementos encontrados en drawer: ${listItems.length}`);
  
  listItems.forEach((item, index) => {
    const itemStyle = window.getComputedStyle(item);
    console.log(`📄 Item ${index + 1}:`, {
      color: itemStyle.color,
      backgroundColor: itemStyle.backgroundColor
    });
  });
}

// Función para forzar actualización de estilos
function forceStyleUpdate() {
  console.log('🔄 Forzando actualización de estilos...');
  
  const navbar = document.querySelector('.v-app-bar');
  const drawer = document.querySelector('.v-navigation-drawer');
  
  if (navbar) {
    navbar.style.display = 'none';
    setTimeout(() => {
      navbar.style.display = '';
    }, 100);
  }
  
  if (drawer) {
    drawer.style.display = 'none';
    setTimeout(() => {
      drawer.style.display = '';
    }, 100);
  }
}

// Función para verificar clases de tema
function checkThemeClasses() {
  const app = document.querySelector('.v-application');
  const html = document.documentElement;
  
  console.log('🎨 Clases de tema actuales:');
  console.log('HTML classes:', html.classList.toString());
  console.log('App classes:', app ? app.classList.toString() : 'No encontrado');
  
  // Verificar tema activo
  if (app) {
    if (app.classList.contains('v-theme--light')) {
      console.log('✅ Modo claro activo');
    } else if (app.classList.contains('v-theme--dark')) {
      console.log('✅ Modo oscuro activo');
    } else {
      console.log('❓ Tema no identificado');
    }
  }
}

// Crear controles al cargar
createNavbarTestControls();

// Ejecutar verificación inicial
setTimeout(() => {
  console.log('🔍 Verificación inicial...');
  checkThemeClasses();
  analyzeNavbarStyles();
}, 1000);

// Exponer funciones globalmente para uso en consola
window.testLightTheme = testLightTheme;
window.testDarkTheme = testDarkTheme;
window.testMobileMenu = testMobileMenu;
window.analyzeNavbarStyles = analyzeNavbarStyles;
window.analyzeDrawerStyles = analyzeDrawerStyles;
window.forceStyleUpdate = forceStyleUpdate;
window.checkThemeClasses = checkThemeClasses;

console.log('✅ SCRIPT DE PRUEBA NAVBAR CARGADO');
console.log('💡 Usa los botones flotantes o las funciones en consola:');
console.log('   - testLightTheme()');
console.log('   - testDarkTheme()');
console.log('   - testMobileMenu()');
console.log('   - analyzeNavbarStyles()');
console.log('   - checkThemeClasses()');
