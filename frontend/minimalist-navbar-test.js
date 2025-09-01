// ===================================================
// SCRIPT DE PRUEBA - NAVEGACIÓN MINIMALISTA
// Academia Virtual - Diseño Limpio y Unificado
// ===================================================

console.log('🎨 INICIANDO PRUEBAS DE NAVEGACIÓN MINIMALISTA...');

// Crear controles flotantes para pruebas
function createMinimalistTestControls() {
  // Remover controles anteriores si existen
  const existingControls = document.getElementById('minimalist-test-controls');
  if (existingControls) {
    existingControls.remove();
  }

  const testControls = document.createElement('div');
  testControls.id = 'minimalist-test-controls';
  testControls.style.cssText = `
    position: fixed;
    top: 10px;
    left: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px;
    border-radius: 12px;
    z-index: 10000;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 12px;
    border: none;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(4px);
    min-width: 320px;
  `;

  testControls.innerHTML = `
    <div style="margin-bottom: 15px; text-align: center;">
      <strong>🎨 NAVEGACIÓN MINIMALISTA</strong>
      <div style="font-size: 10px; opacity: 0.8; margin-top: 2px;">Diseño limpio y unificado</div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
      <button onclick="testDesktopView()" style="background: #fff; color: #333; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        🖥️ Vista Desktop
      </button>
      
      <button onclick="testMobileView()" style="background: #fff; color: #333; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        📱 Vista Móvil
      </button>
      
      <button onclick="testMenuToggle()" style="background: #4CAF50; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        🔄 Toggle Menú
      </button>
      
      <button onclick="analyzeNavbarLayout()" style="background: #2196F3; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        📊 Analizar Layout
      </button>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
      <button onclick="testLightTheme()" style="background: #FFF9C4; color: #333; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        ☀️ Modo Claro
      </button>
      
      <button onclick="testDarkTheme()" style="background: #424242; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        🌙 Modo Oscuro
      </button>
    </div>
    
    <button onclick="document.getElementById('minimalist-test-controls').remove()" style="background: #f44336; color: #fff; border: none; padding: 8px 16px; margin: 4px 0; border-radius: 6px; cursor: pointer; width: 100%; font-size: 11px;">
      ❌ Cerrar Controles
    </button>
    
    <div id="test-results" style="margin-top: 12px; font-size: 10px; max-height: 200px; overflow-y: auto; background: rgba(255,255,255,0.1); padding: 8px; border-radius: 6px;"></div>
  `;

  document.body.appendChild(testControls);
}

// Función para probar vista desktop
function testDesktopView() {
  console.log('🖥️ Probando vista desktop...');
  
  // Simular vista desktop
  document.body.style.width = '1200px';
  window.innerWidth = 1200;
  
  // Disparar evento resize
  window.dispatchEvent(new Event('resize'));
  
  setTimeout(() => {
    analyzeNavbarLayout('desktop');
  }, 500);
}

// Función para probar vista móvil
function testMobileView() {
  console.log('📱 Probando vista móvil...');
  
  // Simular vista móvil
  document.body.style.width = '375px';
  window.innerWidth = 375;
  
  // Disparar evento resize
  window.dispatchEvent(new Event('resize'));
  
  setTimeout(() => {
    analyzeNavbarLayout('mobile');
  }, 500);
}

// Función para toggle del menú
function testMenuToggle() {
  console.log('🔄 Probando toggle del menú...');
  
  const menuButton = document.querySelector('[aria-controls="navigation-menu-drawer"]') ||
                     document.querySelector('[aria-label*="menú"]') ||
                     document.querySelector('.v-app-bar .v-btn[aria-expanded]');
  
  if (menuButton) {
    console.log('✅ Botón de menú encontrado, haciendo clic...');
    menuButton.click();
    
    setTimeout(() => {
      const drawer = document.querySelector('#navigation-menu-drawer') ||
                     document.querySelector('.v-navigation-drawer');
      
      if (drawer) {
        const isVisible = window.getComputedStyle(drawer).display !== 'none';
        console.log('📋 Estado del menú:', isVisible ? 'Abierto' : 'Cerrado');
        
        updateResults(`
          <div><strong>🔄 TOGGLE MENÚ</strong></div>
          <div>Estado: ${isVisible ? '✅ Abierto' : '❌ Cerrado'}</div>
          <div>Display: ${window.getComputedStyle(drawer).display}</div>
          <div>Visibility: ${window.getComputedStyle(drawer).visibility}</div>
        `);
      } else {
        console.log('❌ No se encontró el drawer del menú');
        updateResults('<div style="color: #ffcdd2;">❌ Drawer no encontrado</div>');
      }
    }, 300);
  } else {
    console.log('❌ No se encontró el botón del menú');
    updateResults('<div style="color: #ffcdd2;">❌ Botón de menú no encontrado</div>');
  }
}

// Función para analizar el layout del navbar
function analyzeNavbarLayout(viewType = 'current') {
  const navbar = document.querySelector('.v-app-bar');
  
  if (!navbar) {
    updateResults('<div style="color: #ffcdd2;">❌ Navbar no encontrado</div>');
    return;
  }
  
  // Analizar elementos del navbar
  const logo = navbar.querySelector('.navbar-title');
  const menuButton = navbar.querySelector('[aria-controls="navigation-menu-drawer"]');
  const desktopNav = navbar.querySelector('.d-none.d-md-flex');
  const mobileButton = navbar.querySelector('.d-md-none');
  
  // Verificar que solo estén visibles los elementos correctos
  const logoVisible = logo && window.getComputedStyle(logo).display !== 'none';
  const menuButtonVisible = menuButton && window.getComputedStyle(menuButton).display !== 'none';
  const desktopNavHidden = !desktopNav || window.getComputedStyle(desktopNav).display === 'none';
  
  let result = `
    <div><strong>📊 ANÁLISIS LAYOUT (${viewType.toUpperCase()})</strong></div>
    <div>🏷️ Logo: ${logoVisible ? '✅ Visible' : '❌ Oculto'}</div>
    <div>🔘 Botón Menú: ${menuButtonVisible ? '✅ Visible' : '❌ Oculto'}</div>
    <div>📋 Nav Desktop: ${desktopNavHidden ? '✅ Oculto' : '❌ Visible'}</div>
    <div>📐 Ancho: ${navbar.offsetWidth}px</div>
  `;
  
  // Verificar limpieza del diseño
  const children = navbar.children.length;
  const visibleChildren = Array.from(navbar.children).filter(child => 
    window.getComputedStyle(child).display !== 'none'
  ).length;
  
  result += `
    <div>👶 Elementos totales: ${children}</div>
    <div>👁️ Elementos visibles: ${visibleChildren}</div>
  `;
  
  // Verificar diseño minimalista
  if (logoVisible && menuButtonVisible && desktopNavHidden && visibleChildren <= 3) {
    result += '<div style="color: #c8e6c9;">✅ DISEÑO MINIMALISTA CORRECTO</div>';
  } else {
    result += '<div style="color: #ffcdd2;">⚠️ Revisar elementos visibles</div>';
  }
  
  updateResults(result);
  console.log('📊 Análisis de layout completado');
}

// Función para probar tema claro
function testLightTheme() {
  console.log('☀️ Activando modo claro...');
  
  const app = document.querySelector('.v-application');
  if (app) {
    app.classList.remove('v-theme--dark');
    app.classList.add('v-theme--light');
  }
  
  document.documentElement.classList.remove('v-theme--dark');
  document.documentElement.classList.add('v-theme--light');
  
  setTimeout(() => {
    verifyThemeApplication('light');
  }, 500);
}

// Función para probar tema oscuro
function testDarkTheme() {
  console.log('🌙 Activando modo oscuro...');
  
  const app = document.querySelector('.v-application');
  if (app) {
    app.classList.remove('v-theme--light');
    app.classList.add('v-theme--dark');
  }
  
  document.documentElement.classList.remove('v-theme--light');
  document.documentElement.classList.add('v-theme--dark');
  
  setTimeout(() => {
    verifyThemeApplication('dark');
  }, 500);
}

// Función para verificar aplicación del tema
function verifyThemeApplication(theme) {
  const navbar = document.querySelector('.v-app-bar');
  const drawer = document.querySelector('.v-navigation-drawer');
  
  if (!navbar) {
    updateResults('<div style="color: #ffcdd2;">❌ No se pudo verificar el tema</div>');
    return;
  }
  
  const navbarBg = window.getComputedStyle(navbar).backgroundColor;
  const navbarColor = window.getComputedStyle(navbar).color;
  
  let result = `
    <div><strong>🎨 VERIFICACIÓN TEMA ${theme.toUpperCase()}</strong></div>
    <div>🎨 Navbar BG: ${navbarBg}</div>
    <div>📝 Navbar Color: ${navbarColor}</div>
  `;
  
  if (drawer) {
    const drawerBg = window.getComputedStyle(drawer).backgroundColor;
    result += `<div>🗂️ Drawer BG: ${drawerBg}</div>`;
  }
  
  // Verificar que el tema se aplicó correctamente
  const isCorrectTheme = theme === 'light' ? 
    navbarBg.includes('255') : // Blanco para light
    navbarBg.includes('30') || navbarBg.includes('46') || navbarBg.includes('66'); // Oscuro para dark
  
  result += isCorrectTheme ? 
    '<div style="color: #c8e6c9;">✅ Tema aplicado correctamente</div>' : 
    '<div style="color: #ffcdd2;">⚠️ Verificar aplicación del tema</div>';
  
  updateResults(result);
}

// Función para actualizar resultados
function updateResults(content) {
  const resultsDiv = document.getElementById('test-results');
  if (resultsDiv) {
    resultsDiv.innerHTML = content;
  }
}

// Función para verificar elementos ocultos
function verifyHiddenElements() {
  console.log('🔍 Verificando elementos ocultos...');
  
  const hiddenElements = document.querySelectorAll('.d-none, .d-md-none');
  const results = Array.from(hiddenElements).map(el => {
    const isHidden = window.getComputedStyle(el).display === 'none';
    return {
      element: el.tagName.toLowerCase(),
      classes: el.className,
      hidden: isHidden
    };
  });
  
  console.log('🔍 Elementos ocultos encontrados:', results);
  
  let resultText = '<div><strong>🔍 ELEMENTOS OCULTOS</strong></div>';
  results.forEach(item => {
    resultText += `<div>${item.element}: ${item.hidden ? '✅' : '❌'}</div>`;
  });
  
  updateResults(resultText);
}

// Crear controles al cargar
createMinimalistTestControls();

// Ejecutar verificación inicial
setTimeout(() => {
  console.log('🎨 Verificación inicial del diseño minimalista...');
  analyzeNavbarLayout('initial');
}, 1000);

// Exponer funciones globalmente
window.testDesktopView = testDesktopView;
window.testMobileView = testMobileView;
window.testMenuToggle = testMenuToggle;
window.analyzeNavbarLayout = analyzeNavbarLayout;
window.testLightTheme = testLightTheme;
window.testDarkTheme = testDarkTheme;
window.verifyHiddenElements = verifyHiddenElements;

console.log('✅ SCRIPT DE PRUEBA MINIMALISTA CARGADO');
console.log('💡 Funciones disponibles:');
console.log('   - testDesktopView() - Probar vista desktop');
console.log('   - testMobileView() - Probar vista móvil');
console.log('   - testMenuToggle() - Abrir/cerrar menú');
console.log('   - analyzeNavbarLayout() - Analizar layout');
console.log('   - verifyHiddenElements() - Verificar elementos ocultos');
