// ===================================================
// SCRIPT DE PRUEBA - SWITCHES DE ACCESIBILIDAD
// Academia Virtual - Verificación de Visibilidad de Switches
// ===================================================

console.log('🔘 INICIANDO PRUEBAS DE SWITCHES...');

// Crear controles flotantes para pruebas de switches
function createSwitchTestControls() {
  // Remover controles anteriores si existen
  const existingControls = document.getElementById('switch-test-controls');
  if (existingControls) {
    existingControls.remove();
  }

  const testControls = document.createElement('div');
  testControls.id = 'switch-test-controls';
  testControls.style.cssText = `
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #4CAF50 0%, #2E8B57 100%);
    color: white;
    padding: 20px;
    border-radius: 15px;
    z-index: 10001;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 12px;
    border: none;
    box-shadow: 0 10px 40px rgba(76, 175, 80, 0.4);
    backdrop-filter: blur(8px);
    min-width: 380px;
  `;

  testControls.innerHTML = `
    <div style="margin-bottom: 15px; text-align: center;">
      <strong style="font-size: 14px;">🔘 PRUEBA SWITCHES</strong>
      <div style="font-size: 10px; opacity: 0.9; margin-top: 2px;">Verificación de visibilidad en temas</div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px;">
      <button onclick="testLightSwitches()" style="background: #FFF; color: #333; border: none; padding: 10px 8px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 600;">
        ☀️ Switches Claro
      </button>
      
      <button onclick="testDarkSwitches()" style="background: #333; color: #FFF; border: none; padding: 10px 8px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 600;">
        🌙 Switches Oscuro
      </button>
      
      <button onclick="testHighContrastSwitches()" style="background: #000; color: #FFFF00; border: 2px solid #FFFF00; padding: 8px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 600;">
        ⚡ Alto Contraste
      </button>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
      <button onclick="openAccessibilityMenu()" style="background: #2196F3; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        📱 Abrir Menú
      </button>
      
      <button onclick="analyzeSwitches()" style="background: #FF9800; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        🔍 Analizar Switches
      </button>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
      <button onclick="toggleAllSwitches()" style="background: #9C27B0; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        🔄 Toggle Todos
      </button>
      
      <button onclick="testSwitchInteraction()" style="background: #795548; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        🖱️ Test Interacción
      </button>
    </div>
    
    <button onclick="document.getElementById('switch-test-controls').remove()" style="background: #f44336; color: #fff; border: none; padding: 8px 16px; margin: 4px 0; border-radius: 6px; cursor: pointer; width: 100%; font-size: 11px;">
      ❌ Cerrar Controles
    </button>
    
    <div id="switch-test-results" style="margin-top: 15px; font-size: 10px; max-height: 200px; overflow-y: auto; background: rgba(255,255,255,0.15); padding: 10px; border-radius: 8px; line-height: 1.4;"></div>
  `;

  document.body.appendChild(testControls);
}

// Función para probar switches en modo claro
function testLightSwitches() {
  console.log('☀️ Probando switches en modo claro...');
  
  // Activar tema claro
  const app = document.querySelector('.v-application');
  if (app) {
    app.classList.remove('v-theme--dark', 'high-contrast-mode');
    app.classList.add('v-theme--light');
  }
  
  document.documentElement.classList.remove('v-theme--dark', 'high-contrast-mode');
  document.documentElement.classList.add('v-theme--light');
  
  setTimeout(() => {
    analyzeSwitches('light');
  }, 500);
}

// Función para probar switches en modo oscuro
function testDarkSwitches() {
  console.log('🌙 Probando switches en modo oscuro...');
  
  // Activar tema oscuro
  const app = document.querySelector('.v-application');
  if (app) {
    app.classList.remove('v-theme--light', 'high-contrast-mode');
    app.classList.add('v-theme--dark');
  }
  
  document.documentElement.classList.remove('v-theme--light', 'high-contrast-mode');
  document.documentElement.classList.add('v-theme--dark');
  
  setTimeout(() => {
    analyzeSwitches('dark');
  }, 500);
}

// Función para probar switches en alto contraste
function testHighContrastSwitches() {
  console.log('⚡ Probando switches en alto contraste...');
  
  // Activar alto contraste
  const app = document.querySelector('.v-application');
  if (app) {
    app.classList.remove('v-theme--light', 'v-theme--dark');
    app.classList.add('high-contrast-mode');
  }
  
  document.documentElement.classList.remove('v-theme--light', 'v-theme--dark');
  document.documentElement.classList.add('high-contrast-mode');
  
  setTimeout(() => {
    analyzeSwitches('high-contrast');
  }, 500);
}

// Función para abrir el menú de accesibilidad
function openAccessibilityMenu() {
  console.log('📱 Intentando abrir menú de accesibilidad...');
  
  // Buscar el botón del menú
  const menuButton = document.querySelector('[aria-controls="navigation-menu-drawer"]') ||
                     document.querySelector('[aria-label*="menú"]') ||
                     document.querySelector('.v-app-bar .v-btn:last-child');
  
  if (menuButton) {
    console.log('✅ Botón de menú encontrado, haciendo clic...');
    menuButton.click();
    
    setTimeout(() => {
      updateResults('✅ Menú de accesibilidad abierto');
      analyzeSwitches();
    }, 500);
  } else {
    console.log('❌ No se encontró el botón del menú');
    updateResults('❌ No se pudo abrir el menú de accesibilidad');
  }
}

// Función para analizar switches
function analyzeSwitches(theme = 'current') {
  console.log('🔍 Analizando switches...');
  
  const switches = document.querySelectorAll('.accessibility-menu .v-switch, .v-switch');
  
  if (switches.length === 0) {
    updateResults('❌ No se encontraron switches. Abre el menú de accesibilidad primero.');
    return;
  }
  
  let analysis = `<div><strong>🔍 ANÁLISIS SWITCHES (${theme.toUpperCase()})</strong></div>`;
  analysis += `<div>📊 Switches encontrados: ${switches.length}</div>`;
  
  switches.forEach((switchElement, index) => {
    const track = switchElement.querySelector('.v-switch__track');
    const thumb = switchElement.querySelector('.v-switch__thumb');
    const isActive = switchElement.classList.contains('v-switch--active');
    
    if (track) {
      const trackStyles = window.getComputedStyle(track);
      const thumbStyles = thumb ? window.getComputedStyle(thumb) : null;
      
      analysis += `
        <div><strong>Switch ${index + 1} ${isActive ? '(ACTIVO)' : '(INACTIVO)'}</strong></div>
        <div>🎨 Track BG: ${trackStyles.backgroundColor}</div>
        <div>🔲 Track Border: ${trackStyles.border}</div>
        <div>👁️ Track Opacity: ${trackStyles.opacity}</div>
      `;
      
      if (thumbStyles) {
        analysis += `
          <div>⚪ Thumb BG: ${thumbStyles.backgroundColor}</div>
          <div>🔲 Thumb Border: ${thumbStyles.border}</div>
          <div>💫 Thumb Shadow: ${thumbStyles.boxShadow}</div>
        `;
      }
      
      // Verificar visibilidad
      const isVisible = trackStyles.opacity !== '0' && 
                       trackStyles.display !== 'none' &&
                       trackStyles.visibility !== 'hidden';
      
      analysis += `<div>${isVisible ? '✅' : '❌'} Visible: ${isVisible ? 'SÍ' : 'NO'}</div>`;
      
      // Verificar contraste
      const hasContrast = trackStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                         trackStyles.backgroundColor !== 'transparent';
      
      analysis += `<div>${hasContrast ? '✅' : '❌'} Contraste: ${hasContrast ? 'OK' : 'PROBLEMA'}</div>`;
      
      analysis += '<div style="margin-bottom: 8px;">---</div>';
    }
  });
  
  updateResults(analysis);
  console.log('🔍 Análisis de switches completado');
}

// Función para hacer toggle de todos los switches
function toggleAllSwitches() {
  console.log('🔄 Haciendo toggle de todos los switches...');
  
  const switches = document.querySelectorAll('.accessibility-menu .v-switch, .v-switch');
  
  if (switches.length === 0) {
    updateResults('❌ No se encontraron switches para toggle');
    return;
  }
  
  let toggledCount = 0;
  
  switches.forEach((switchElement, index) => {
    setTimeout(() => {
      const input = switchElement.querySelector('input[type="checkbox"]');
      if (input) {
        input.click();
        toggledCount++;
        console.log(`🔄 Toggle switch ${index + 1}`);
      }
    }, index * 200);
  });
  
  setTimeout(() => {
    updateResults(`✅ ${toggledCount} switches toggleados`);
    analyzeSwitches();
  }, switches.length * 200 + 500);
}

// Función para probar interacción de switches
function testSwitchInteraction() {
  console.log('🖱️ Probando interacción de switches...');
  
  const switches = document.querySelectorAll('.accessibility-menu .v-switch, .v-switch');
  
  if (switches.length === 0) {
    updateResults('❌ No se encontraron switches para probar');
    return;
  }
  
  let interactionResults = '<div><strong>🖱️ TEST INTERACCIÓN</strong></div>';
  
  switches.forEach((switchElement, index) => {
    const input = switchElement.querySelector('input[type="checkbox"]');
    const track = switchElement.querySelector('.v-switch__track');
    const thumb = switchElement.querySelector('.v-switch__thumb');
    
    const hasInput = !!input;
    const hasTrack = !!track;
    const hasThumb = !!thumb;
    const isClickable = switchElement.style.pointerEvents !== 'none';
    
    interactionResults += `
      <div><strong>Switch ${index + 1}:</strong></div>
      <div>${hasInput ? '✅' : '❌'} Input: ${hasInput ? 'OK' : 'Falta'}</div>
      <div>${hasTrack ? '✅' : '❌'} Track: ${hasTrack ? 'OK' : 'Falta'}</div>
      <div>${hasThumb ? '✅' : '❌'} Thumb: ${hasThumb ? 'OK' : 'Falta'}</div>
      <div>${isClickable ? '✅' : '❌'} Clickable: ${isClickable ? 'SÍ' : 'NO'}</div>
      <div style="margin-bottom: 6px;">---</div>
    `;
  });
  
  updateResults(interactionResults);
}

// Función para actualizar resultados
function updateResults(content) {
  const resultsDiv = document.getElementById('switch-test-results');
  if (resultsDiv) {
    resultsDiv.innerHTML = content;
  }
}

// Función para resaltar switches
function highlightSwitches() {
  console.log('✨ Resaltando switches...');
  
  const switches = document.querySelectorAll('.v-switch');
  
  switches.forEach(switchElement => {
    switchElement.style.outline = '3px solid #FF0080';
    switchElement.style.outlineOffset = '2px';
    
    setTimeout(() => {
      switchElement.style.outline = '';
      switchElement.style.outlineOffset = '';
    }, 3000);
  });
  
  updateResults(`✨ ${switches.length} switches resaltados por 3 segundos`);
}

// Función para verificar estilos CSS aplicados
function verifyCSS() {
  console.log('📋 Verificando CSS de switches...');
  
  const switchElement = document.querySelector('.v-switch');
  
  if (!switchElement) {
    updateResults('❌ No se encontró ningún switch para verificar CSS');
    return;
  }
  
  const track = switchElement.querySelector('.v-switch__track');
  const thumb = switchElement.querySelector('.v-switch__thumb');
  
  if (!track) {
    updateResults('❌ No se encontró track del switch');
    return;
  }
  
  const trackStyles = window.getComputedStyle(track);
  const thumbStyles = thumb ? window.getComputedStyle(thumb) : null;
  
  let cssResults = '<div><strong>📋 VERIFICACIÓN CSS</strong></div>';
  
  // Verificar propiedades importantes
  const importantProps = [
    'backgroundColor',
    'border',
    'opacity',
    'display',
    'visibility',
    'boxShadow'
  ];
  
  importantProps.forEach(prop => {
    const value = trackStyles[prop];
    cssResults += `<div>Track ${prop}: ${value}</div>`;
  });
  
  if (thumbStyles) {
    importantProps.forEach(prop => {
      const value = thumbStyles[prop];
      cssResults += `<div>Thumb ${prop}: ${value}</div>`;
    });
  }
  
  updateResults(cssResults);
}

// Crear controles al cargar
createSwitchTestControls();

// Ejecutar análisis inicial después de un breve delay
setTimeout(() => {
  console.log('🔘 Análisis inicial de switches...');
  updateResults('ℹ️ Abre el menú de accesibilidad para analizar switches');
}, 1000);

// Exponer funciones globalmente
window.testLightSwitches = testLightSwitches;
window.testDarkSwitches = testDarkSwitches;
window.testHighContrastSwitches = testHighContrastSwitches;
window.openAccessibilityMenu = openAccessibilityMenu;
window.analyzeSwitches = analyzeSwitches;
window.toggleAllSwitches = toggleAllSwitches;
window.testSwitchInteraction = testSwitchInteraction;
window.highlightSwitches = highlightSwitches;
window.verifyCSS = verifyCSS;

console.log('✅ SCRIPT DE PRUEBA DE SWITCHES CARGADO');
console.log('💡 Funciones disponibles:');
console.log('   - openAccessibilityMenu() - Abrir menú de accesibilidad');
console.log('   - testDarkSwitches() - Probar switches en modo oscuro');
console.log('   - analyzeSwitches() - Analizar visibilidad de switches');
console.log('   - toggleAllSwitches() - Hacer toggle de todos los switches');
console.log('   - highlightSwitches() - Resaltar switches por 3 segundos');
