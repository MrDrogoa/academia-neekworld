// ===================================================
// TEST DE BOTONES DE ACCESIBILIDAD CON ICONOS
// Academia Virtual - Verificación de Transiciones
// ===================================================

console.log('🎯 INICIANDO TEST DE BOTONES CON ICONOS...');

// Crear controles de test para botones con iconos
function createIconButtonTestControls() {
  const existingControls = document.getElementById('icon-button-test-controls');
  if (existingControls) {
    existingControls.remove();
  }

  const testControls = document.createElement('div');
  testControls.id = 'icon-button-test-controls';
  testControls.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 15px;
    z-index: 10003;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 12px;
    border: none;
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
    backdrop-filter: blur(8px);
    min-width: 320px;
    max-height: 80vh;
    overflow-y: auto;
  `;

  testControls.innerHTML = `
    <div style="margin-bottom: 15px; text-align: center;">
      <strong style="font-size: 14px;">🎯 TEST BOTONES ICONOS</strong>
      <div style="font-size: 10px; opacity: 0.9; margin-top: 2px;">Verificación de transiciones y estados</div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
      <button onclick="openAccessibilityMenu()" style="background: #4CAF50; color: white; border: none; padding: 10px 8px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 600;">
        📱 Abrir Menú
      </button>
      
      <button onclick="testAllButtons()" style="background: #FF9800; color: white; border: none; padding: 10px 8px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 600;">
        🔍 Test Todos
      </button>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
      <button onclick="testThemeButton()" style="background: #FFC107; color: #333; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        ☀️ Test Tema
      </button>
      
      <button onclick="testContrastButton()" style="background: #FFEB3B; color: #333; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        👁️ Test Contraste
      </button>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
      <button onclick="testMotionButton()" style="background: #FF5722; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        🎬 Test Animación
      </button>
      
      <button onclick="testFocusButton()" style="background: #9C27B0; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        🎯 Test Foco
      </button>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
      <button onclick="analyzeButtonStates()" style="background: #2196F3; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        📊 Analizar Estados
      </button>
      
      <button onclick="testTransitions()" style="background: #795548; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        ⚡ Test Transiciones
      </button>
    </div>
    
    <button onclick="document.getElementById('icon-button-test-controls').remove()" style="background: #f44336; color: white; border: none; padding: 8px 16px; margin: 4px 0; border-radius: 6px; cursor: pointer; width: 100%; font-size: 11px;">
      ❌ Cerrar Test
    </button>
    
    <div id="icon-test-results" style="margin-top: 15px; font-size: 10px; max-height: 300px; overflow-y: auto; background: rgba(255,255,255,0.15); padding: 10px; border-radius: 8px; line-height: 1.4;"></div>
  `;

  document.body.appendChild(testControls);
}

// Función para abrir el menú de accesibilidad
function openAccessibilityMenu() {
  console.log('📱 Abriendo menú de accesibilidad...');
  
  const menuButton = document.querySelector('[aria-controls="navigation-menu-drawer"]') ||
                     document.querySelector('[aria-label*="menú"]') ||
                     document.querySelector('.v-app-bar .v-btn:last-child') ||
                     document.querySelector('.accessibility-controls .v-btn');
  
  if (menuButton) {
    menuButton.click();
    console.log('✅ Menú abierto');
    updateIconTestResults('✅ Menú de accesibilidad abierto');
    
    setTimeout(() => {
      analyzeButtonStates();
    }, 1000);
  } else {
    console.log('❌ No se encontró el botón del menú');
    updateIconTestResults('❌ No se pudo abrir el menú de accesibilidad');
  }
}

// Función para probar el botón de tema
function testThemeButton() {
  console.log('☀️ Probando botón de tema...');
  
  const themeButton = document.querySelector('.theme-toggle-btn');
  if (themeButton) {
    const initialState = themeButton.getAttribute('variant');
    themeButton.click();
    
    setTimeout(() => {
      const newState = themeButton.getAttribute('variant');
      const changed = initialState !== newState;
      
      updateIconTestResults(`☀️ Botón tema: ${changed ? '✅ CAMBIÓ' : '❌ NO CAMBIÓ'} (${initialState} → ${newState})`);
      console.log(`Tema cambió: ${changed}, Estado: ${initialState} → ${newState}`);
    }, 300);
  } else {
    updateIconTestResults('❌ No se encontró botón de tema');
  }
}

// Función para probar el botón de contraste
function testContrastButton() {
  console.log('👁️ Probando botón de contraste...');
  
  const contrastButton = document.querySelector('.contrast-toggle-btn');
  if (contrastButton) {
    const initialState = contrastButton.getAttribute('variant');
    contrastButton.click();
    
    setTimeout(() => {
      const newState = contrastButton.getAttribute('variant');
      const changed = initialState !== newState;
      
      updateIconTestResults(`👁️ Botón contraste: ${changed ? '✅ CAMBIÓ' : '❌ NO CAMBIÓ'} (${initialState} → ${newState})`);
      console.log(`Contraste cambió: ${changed}, Estado: ${initialState} → ${newState}`);
    }, 300);
  } else {
    updateIconTestResults('❌ No se encontró botón de contraste');
  }
}

// Función para probar el botón de animación
function testMotionButton() {
  console.log('🎬 Probando botón de animación...');
  
  const motionButton = document.querySelector('.motion-toggle-btn');
  if (motionButton) {
    const initialState = motionButton.getAttribute('variant');
    motionButton.click();
    
    setTimeout(() => {
      const newState = motionButton.getAttribute('variant');
      const changed = initialState !== newState;
      
      updateIconTestResults(`🎬 Botón animación: ${changed ? '✅ CAMBIÓ' : '❌ NO CAMBIÓ'} (${initialState} → ${newState})`);
      console.log(`Animación cambió: ${changed}, Estado: ${initialState} → ${newState}`);
    }, 300);
  } else {
    updateIconTestResults('❌ No se encontró botón de animación');
  }
}

// Función para probar el botón de foco
function testFocusButton() {
  console.log('🎯 Probando botón de foco...');
  
  const focusButton = document.querySelector('.focus-toggle-btn');
  if (focusButton) {
    const initialState = focusButton.getAttribute('variant');
    focusButton.click();
    
    setTimeout(() => {
      const newState = focusButton.getAttribute('variant');
      const changed = initialState !== newState;
      
      updateIconTestResults(`🎯 Botón foco: ${changed ? '✅ CAMBIÓ' : '❌ NO CAMBIÓ'} (${initialState} → ${newState})`);
      console.log(`Foco cambió: ${changed}, Estado: ${initialState} → ${newState}`);
    }, 300);
  } else {
    updateIconTestResults('❌ No se encontró botón de foco');
  }
}

// Función para analizar estados de botones
function analyzeButtonStates() {
  console.log('📊 Analizando estados de botones...');
  
  const buttons = [
    { selector: '.theme-toggle-btn', name: 'Tema', icon: '☀️' },
    { selector: '.contrast-toggle-btn', name: 'Contraste', icon: '👁️' },
    { selector: '.motion-toggle-btn', name: 'Animación', icon: '🎬' },
    { selector: '.focus-toggle-btn', name: 'Foco', icon: '🎯' }
  ];
  
  let analysis = '<div><strong>📊 ANÁLISIS DE BOTONES</strong></div>';
  
  buttons.forEach(button => {
    const element = document.querySelector(button.selector);
    if (element) {
      const variant = element.getAttribute('variant');
      const color = element.getAttribute('color');
      const ariaLabel = element.getAttribute('aria-label');
      const iconElement = element.querySelector('.v-icon');
      const iconText = iconElement ? iconElement.textContent : 'N/A';
      
      const isActive = variant === 'tonal';
      
      analysis += `
        <div><strong>${button.icon} ${button.name}:</strong></div>
        <div>🎨 Variant: ${variant}</div>
        <div>🎯 Color: ${color}</div>
        <div>🔘 Estado: ${isActive ? 'ACTIVO' : 'INACTIVO'}</div>
        <div>🏷️ Label: ${ariaLabel}</div>
        <div>📱 Icono: ${iconText}</div>
        <div style="margin-bottom: 8px;">---</div>
      `;
    } else {
      analysis += `<div>❌ ${button.icon} ${button.name}: NO ENCONTRADO</div>`;
    }
  });
  
  updateIconTestResults(analysis);
}

// Función para probar transiciones
function testTransitions() {
  console.log('⚡ Probando transiciones...');
  
  const buttons = document.querySelectorAll('.theme-toggle-btn, .contrast-toggle-btn, .motion-toggle-btn, .focus-toggle-btn');
  
  if (buttons.length === 0) {
    updateIconTestResults('❌ No se encontraron botones para probar transiciones');
    return;
  }
  
  let transitionResults = '<div><strong>⚡ TEST TRANSICIONES</strong></div>';
  
  buttons.forEach((button, index) => {
    const icon = button.querySelector('.v-icon');
    const className = button.className.includes('theme') ? 'Tema' :
                     button.className.includes('contrast') ? 'Contraste' :
                     button.className.includes('motion') ? 'Animación' : 'Foco';
    
    if (icon) {
      const computedStyle = window.getComputedStyle(icon);
      const transition = computedStyle.transition;
      const transform = computedStyle.transform;
      
      transitionResults += `
        <div><strong>${className}:</strong></div>
        <div>🔄 Transition: ${transition !== 'none' ? '✅ SÍ' : '❌ NO'}</div>
        <div>📐 Transform: ${transform !== 'none' ? '✅ SÍ' : '❌ NO'}</div>
        <div style="margin-bottom: 6px;">---</div>
      `;
      
      // Simular hover para probar la transición
      setTimeout(() => {
        button.dispatchEvent(new MouseEvent('mouseenter'));
        setTimeout(() => {
          button.dispatchEvent(new MouseEvent('mouseleave'));
        }, 200);
      }, index * 300);
    }
  });
  
  updateIconTestResults(transitionResults);
}

// Función para probar todos los botones
function testAllButtons() {
  console.log('🔍 Probando todos los botones...');
  
  updateIconTestResults('🔍 Iniciando test completo...');
  
  setTimeout(() => testThemeButton(), 500);
  setTimeout(() => testContrastButton(), 1000);
  setTimeout(() => testMotionButton(), 1500);
  setTimeout(() => testFocusButton(), 2000);
  setTimeout(() => analyzeButtonStates(), 2500);
  setTimeout(() => testTransitions(), 3000);
}

// Función para actualizar resultados
function updateIconTestResults(content) {
  const resultsDiv = document.getElementById('icon-test-results');
  if (resultsDiv) {
    resultsDiv.innerHTML = content;
  }
}

// Función para resaltar botones
function highlightButtons() {
  console.log('✨ Resaltando botones...');
  
  const buttons = document.querySelectorAll('.theme-toggle-btn, .contrast-toggle-btn, .motion-toggle-btn, .focus-toggle-btn');
  
  buttons.forEach(button => {
    button.style.outline = '3px solid #FF0080';
    button.style.outlineOffset = '2px';
    
    setTimeout(() => {
      button.style.outline = '';
      button.style.outlineOffset = '';
    }, 3000);
  });
  
  updateIconTestResults(`✨ ${buttons.length} botones resaltados por 3 segundos`);
}

// Crear controles al cargar
createIconButtonTestControls();

// Ejecutar análisis inicial después de un breve delay
setTimeout(() => {
  console.log('🎯 Análisis inicial de botones con iconos...');
  updateIconTestResults('ℹ️ Abre el menú de accesibilidad para analizar botones');
}, 1000);

// Exponer funciones globalmente
window.openAccessibilityMenu = openAccessibilityMenu;
window.testThemeButton = testThemeButton;
window.testContrastButton = testContrastButton;
window.testMotionButton = testMotionButton;
window.testFocusButton = testFocusButton;
window.testAllButtons = testAllButtons;
window.analyzeButtonStates = analyzeButtonStates;
window.testTransitions = testTransitions;
window.highlightButtons = highlightButtons;

console.log('✅ TEST DE BOTONES CON ICONOS CARGADO');
console.log('💡 Funciones disponibles:');
console.log('   - openAccessibilityMenu() - Abrir menú de accesibilidad');
console.log('   - testAllButtons() - Probar todos los botones');
console.log('   - analyzeButtonStates() - Analizar estados actuales');
console.log('   - testTransitions() - Verificar transiciones');
console.log('   - highlightButtons() - Resaltar botones por 3 segundos');
