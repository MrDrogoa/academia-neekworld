// ===================================================
// TEST DE ALTO CONTRASTE - NAVIGATION BAR
// Academia Virtual - Verificación de Menú Emergente
// ===================================================

console.log('⚡ INICIANDO TEST DE ALTO CONTRASTE...');

// Crear controles de test para alto contraste
function createHighContrastTestControls() {
  const existingControls = document.getElementById('high-contrast-test-controls');
  if (existingControls) {
    existingControls.remove();
  }

  const testControls = document.createElement('div');
  testControls.id = 'high-contrast-test-controls';
  testControls.style.cssText = `
    position: fixed;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    background: linear-gradient(135deg, #000000 0%, #333333 100%);
    color: #FFFF00;
    padding: 20px;
    border: 3px solid #FFFF00;
    border-radius: 15px;
    z-index: 10004;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 12px;
    box-shadow: 0 10px 40px rgba(255, 255, 0, 0.4);
    min-width: 280px;
    max-height: 80vh;
    overflow-y: auto;
  `;

  testControls.innerHTML = `
    <div style="margin-bottom: 15px; text-align: center;">
      <strong style="font-size: 14px; color: #FFFF00;">⚡ TEST ALTO CONTRASTE</strong>
      <div style="font-size: 10px; opacity: 0.9; margin-top: 2px; color: #FFFFFF;">Verificación de menú emergente</div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 15px;">
      <button onclick="activateHighContrast()" style="background: #FFFF00; color: #000000; border: 2px solid #FFFF00; padding: 10px 8px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 600;">
        ⚡ Activar Alto Contraste
      </button>
      
      <button onclick="deactivateHighContrast()" style="background: #000000; color: #FFFF00; border: 2px solid #FFFF00; padding: 10px 8px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 600;">
        🔄 Desactivar Alto Contraste
      </button>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 15px;">
      <button onclick="openNavigationMenu()" style="background: #FFFF00; color: #000000; border: 2px solid #FFFF00; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        📱 Abrir Menú Navegación
      </button>
      
      <button onclick="analyzeMenuStyles()" style="background: #000000; color: #FFFF00; border: 2px solid #FFFF00; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        🔍 Analizar Estilos
      </button>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 15px;">
      <button onclick="testAllThemes()" style="background: #FFFF00; color: #000000; border: 2px solid #FFFF00; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        🌈 Test Todos los Temas
      </button>
      
      <button onclick="checkContrastCompliance()" style="background: #000000; color: #FFFF00; border: 2px solid #FFFF00; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        ✅ Verificar Cumplimiento
      </button>
    </div>
    
    <button onclick="document.getElementById('high-contrast-test-controls').remove()" style="background: #FF0000; color: #FFFFFF; border: 2px solid #FF0000; padding: 8px 16px; margin: 4px 0; border-radius: 6px; cursor: pointer; width: 100%; font-size: 11px;">
      ❌ Cerrar Test
    </button>
    
    <div id="contrast-test-results" style="margin-top: 15px; font-size: 10px; max-height: 300px; overflow-y: auto; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; line-height: 1.4; color: #FFFFFF; border: 1px solid #FFFF00;"></div>
  `;

  document.body.appendChild(testControls);
}

// Función para activar alto contraste
function activateHighContrast() {
  console.log('⚡ Activando alto contraste...');
  
  // Activar alto contraste en el HTML
  document.documentElement.classList.add('high-contrast-mode');
  document.documentElement.classList.remove('v-theme--light', 'v-theme--dark');
  
  // Activar en la aplicación Vue
  const app = document.querySelector('.v-application');
  if (app) {
    app.classList.add('high-contrast-mode');
    app.classList.remove('v-theme--light', 'v-theme--dark');
  }
  
  // Buscar y activar el toggle de alto contraste si existe
  const contrastButton = document.querySelector('.contrast-toggle-btn');
  if (contrastButton && contrastButton.getAttribute('variant') !== 'tonal') {
    contrastButton.click();
  }
  
  setTimeout(() => {
    updateContrastTestResults('⚡ Alto contraste activado');
    analyzeMenuStyles();
  }, 500);
}

// Función para desactivar alto contraste
function deactivateHighContrast() {
  console.log('🔄 Desactivando alto contraste...');
  
  // Desactivar alto contraste
  document.documentElement.classList.remove('high-contrast-mode');
  document.documentElement.classList.add('v-theme--light');
  
  const app = document.querySelector('.v-application');
  if (app) {
    app.classList.remove('high-contrast-mode');
    app.classList.add('v-theme--light');
  }
  
  // Buscar y desactivar el toggle de alto contraste si está activo
  const contrastButton = document.querySelector('.contrast-toggle-btn');
  if (contrastButton && contrastButton.getAttribute('variant') === 'tonal') {
    contrastButton.click();
  }
  
  setTimeout(() => {
    updateContrastTestResults('🔄 Alto contraste desactivado');
    analyzeMenuStyles();
  }, 500);
}

// Función para abrir el menú de navegación
function openNavigationMenu() {
  console.log('📱 Abriendo menú de navegación...');
  
  const menuButton = document.querySelector('[aria-controls="navigation-menu-drawer"]') ||
                     document.querySelector('[aria-label*="menú"]') ||
                     document.querySelector('.v-app-bar .v-btn:last-child');
  
  if (menuButton) {
    menuButton.click();
    console.log('✅ Menú abierto');
    updateContrastTestResults('✅ Menú de navegación abierto');
    
    setTimeout(() => {
      analyzeMenuStyles();
    }, 1000);
  } else {
    console.log('❌ No se encontró botón de menú');
    updateContrastTestResults('❌ No se pudo abrir el menú de navegación');
  }
}

// Función para analizar estilos del menú
function analyzeMenuStyles() {
  console.log('🔍 Analizando estilos del menú...');
  
  const drawer = document.querySelector('#navigation-menu-drawer') ||
                 document.querySelector('.v-navigation-drawer');
  
  if (!drawer) {
    updateContrastTestResults('❌ Menú no encontrado. Ábrelo primero.');
    return;
  }
  
  const computedStyle = window.getComputedStyle(drawer);
  const isHighContrast = document.documentElement.classList.contains('high-contrast-mode');
  
  let analysis = `<div><strong>🔍 ANÁLISIS DEL MENÚ</strong></div>`;
  analysis += `<div>🎨 Modo: ${isHighContrast ? 'ALTO CONTRASTE' : 'NORMAL'}</div>`;
  analysis += `<div>📱 Drawer BG: ${computedStyle.backgroundColor}</div>`;
  analysis += `<div>🎯 Drawer Color: ${computedStyle.color}</div>`;
  analysis += `<div>🔲 Border: ${computedStyle.border}</div>`;
  
  // Analizar elementos específicos
  const header = drawer.querySelector('.d-flex.align-center.pa-4');
  if (header) {
    const headerStyle = window.getComputedStyle(header);
    analysis += `<div><strong>📋 HEADER:</strong></div>`;
    analysis += `<div>🎨 Header BG: ${headerStyle.backgroundColor}</div>`;
    analysis += `<div>🎯 Header Color: ${headerStyle.color}</div>`;
  }
  
  const listItems = drawer.querySelectorAll('.v-list-item');
  if (listItems.length > 0) {
    const firstItemStyle = window.getComputedStyle(listItems[0]);
    analysis += `<div><strong>📝 LISTA (${listItems.length} items):</strong></div>`;
    analysis += `<div>🎨 Item BG: ${firstItemStyle.backgroundColor}</div>`;
    analysis += `<div>🎯 Item Color: ${firstItemStyle.color}</div>`;
  }
  
  // Verificar clases de alto contraste
  const hasHighContrastClass = drawer.classList.contains('high-contrast-drawer');
  analysis += `<div><strong>🏷️ CLASES:</strong></div>`;
  analysis += `<div>${hasHighContrastClass ? '✅' : '❌'} high-contrast-drawer: ${hasHighContrastClass ? 'SÍ' : 'NO'}</div>`;
  
  // Verificar contraste
  const hasGoodContrast = isHighContrast ? 
    (computedStyle.backgroundColor.includes('0, 0, 0') && computedStyle.color.includes('255, 255, 255')) :
    true;
  
  analysis += `<div>${hasGoodContrast ? '✅' : '❌'} Contraste: ${hasGoodContrast ? 'OK' : 'PROBLEMA'}</div>`;
  
  updateContrastTestResults(analysis);
  console.log('🔍 Análisis de menú completado');
}

// Función para probar todos los temas
function testAllThemes() {
  console.log('🌈 Probando todos los temas...');
  
  updateContrastTestResults('🌈 Iniciando test de temas...');
  
  // Test modo claro
  setTimeout(() => {
    deactivateHighContrast();
    updateContrastTestResults('☀️ Modo claro aplicado');
  }, 500);
  
  // Test modo oscuro
  setTimeout(() => {
    document.documentElement.classList.remove('v-theme--light');
    document.documentElement.classList.add('v-theme--dark');
    const app = document.querySelector('.v-application');
    if (app) {
      app.classList.remove('v-theme--light');
      app.classList.add('v-theme--dark');
    }
    updateContrastTestResults('🌙 Modo oscuro aplicado');
  }, 1500);
  
  // Test alto contraste
  setTimeout(() => {
    activateHighContrast();
    updateContrastTestResults('⚡ Alto contraste aplicado');
  }, 2500);
  
  // Análisis final
  setTimeout(() => {
    analyzeMenuStyles();
    updateContrastTestResults('✅ Test de temas completado');
  }, 3500);
}

// Función para verificar cumplimiento de contraste
function checkContrastCompliance() {
  console.log('✅ Verificando cumplimiento de contraste...');
  
  const isHighContrast = document.documentElement.classList.contains('high-contrast-mode');
  
  if (!isHighContrast) {
    updateContrastTestResults('❌ Activa alto contraste primero');
    return;
  }
  
  const drawer = document.querySelector('#navigation-menu-drawer');
  if (!drawer) {
    updateContrastTestResults('❌ Abre el menú primero');
    return;
  }
  
  let compliance = '<div><strong>✅ CUMPLIMIENTO DE CONTRASTE</strong></div>';
  
  // Verificar elementos críticos
  const elements = [
    { selector: '#navigation-menu-drawer', name: 'Drawer Principal' },
    { selector: '.d-flex.align-center.pa-4', name: 'Header' },
    { selector: '.v-list-item', name: 'Items de Lista' },
    { selector: '.v-expansion-panel', name: 'Panel de Expansión' }
  ];
  
  elements.forEach(element => {
    const el = drawer.querySelector(element.selector) || document.querySelector(element.selector);
    if (el) {
      const style = window.getComputedStyle(el);
      const bgIsBlack = style.backgroundColor.includes('0, 0, 0') || style.backgroundColor === 'rgb(0, 0, 0)';
      const textIsYellow = style.color.includes('255, 255, 0') || style.color.includes('255, 255, 255');
      
      const isCompliant = bgIsBlack || textIsYellow;
      compliance += `<div>${isCompliant ? '✅' : '❌'} ${element.name}: ${isCompliant ? 'OK' : 'FALLA'}</div>`;
    } else {
      compliance += `<div>⚠️ ${element.name}: NO ENCONTRADO</div>`;
    }
  });
  
  // Verificar bordes amarillos
  const hasYellowBorders = drawer.style.border.includes('#FFFF00') || 
                          drawer.style.borderColor.includes('#FFFF00') ||
                          getComputedStyle(drawer).borderColor.includes('255, 255, 0');
  
  compliance += `<div>${hasYellowBorders ? '✅' : '❌'} Bordes Amarillos: ${hasYellowBorders ? 'OK' : 'FALTA'}</div>`;
  
  updateContrastTestResults(compliance);
}

// Función para actualizar resultados
function updateContrastTestResults(content) {
  const resultsDiv = document.getElementById('contrast-test-results');
  if (resultsDiv) {
    resultsDiv.innerHTML = content;
  }
}

// Función para destacar elementos del menú
function highlightMenuElements() {
  console.log('✨ Destacando elementos del menú...');
  
  const drawer = document.querySelector('#navigation-menu-drawer');
  if (!drawer) {
    updateContrastTestResults('❌ Abre el menú primero');
    return;
  }
  
  const elements = drawer.querySelectorAll('.v-list-item, .d-flex.align-center.pa-4, .v-expansion-panel');
  
  elements.forEach(element => {
    element.style.outline = '3px solid #FF0080';
    element.style.outlineOffset = '2px';
    
    setTimeout(() => {
      element.style.outline = '';
      element.style.outlineOffset = '';
    }, 3000);
  });
  
  updateContrastTestResults(`✨ ${elements.length} elementos destacados por 3 segundos`);
}

// Crear controles al cargar
createHighContrastTestControls();

// Ejecutar análisis inicial después de un breve delay
setTimeout(() => {
  console.log('⚡ Análisis inicial de alto contraste...');
  updateContrastTestResults('ℹ️ Activa alto contraste y abre el menú para analizar');
}, 1000);

// Exponer funciones globalmente
window.activateHighContrast = activateHighContrast;
window.deactivateHighContrast = deactivateHighContrast;
window.openNavigationMenu = openNavigationMenu;
window.analyzeMenuStyles = analyzeMenuStyles;
window.testAllThemes = testAllThemes;
window.checkContrastCompliance = checkContrastCompliance;
window.highlightMenuElements = highlightMenuElements;

console.log('✅ TEST DE ALTO CONTRASTE CARGADO');
console.log('💡 Funciones disponibles:');
console.log('   - activateHighContrast() - Activar alto contraste');
console.log('   - openNavigationMenu() - Abrir menú de navegación');
console.log('   - analyzeMenuStyles() - Analizar estilos del menú');
console.log('   - testAllThemes() - Probar todos los temas');
console.log('   - checkContrastCompliance() - Verificar cumplimiento');
