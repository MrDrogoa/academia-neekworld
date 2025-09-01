// ===================================================
// TEST INMEDIATO - SWITCHES MODO OSCURO
// Academia Virtual - Verificación de Contraste
// ===================================================

console.log('🌙 INICIANDO TEST INMEDIATO DE SWITCHES EN MODO OSCURO...');

// Función para aplicar modo oscuro inmediatamente
function applyDarkMode() {
  console.log('🌙 Aplicando modo oscuro...');
  
  const app = document.querySelector('.v-application');
  if (app) {
    app.classList.remove('v-theme--light', 'high-contrast-mode');
    app.classList.add('v-theme--dark');
  }
  
  document.documentElement.classList.remove('v-theme--light', 'high-contrast-mode');
  document.documentElement.classList.add('v-theme--dark');
  
  console.log('✅ Modo oscuro aplicado');
}

// Función para analizar contraste de switches
function analyzeSwitchContrast() {
  console.log('🔍 Analizando contraste de switches...');
  
  const switches = document.querySelectorAll('.accessibility-menu .v-switch');
  
  if (switches.length === 0) {
    console.log('❌ No se encontraron switches. Abriendo menú...');
    openAccessibilityMenu();
    return;
  }
  
  switches.forEach((switchElement, index) => {
    console.log(`\n📋 Switch ${index + 1}:`);
    
    const track = switchElement.querySelector('.v-switch__track');
    const thumb = switchElement.querySelector('.v-switch__thumb');
    const isActive = switchElement.classList.contains('v-switch--active');
    
    if (track) {
      const trackStyles = window.getComputedStyle(track);
      console.log(`  🎨 Track BG: ${trackStyles.backgroundColor}`);
      console.log(`  🔲 Track Border: ${trackStyles.border}`);
      console.log(`  📐 Track Size: ${trackStyles.width} x ${trackStyles.height}`);
    }
    
    if (thumb) {
      const thumbStyles = window.getComputedStyle(thumb);
      console.log(`  ⚪ Thumb BG: ${thumbStyles.backgroundColor}`);
      console.log(`  🔲 Thumb Border: ${thumbStyles.border}`);
      console.log(`  💫 Thumb Shadow: ${thumbStyles.boxShadow}`);
      console.log(`  📐 Thumb Size: ${thumbStyles.width} x ${thumbStyles.height}`);
      
      // Verificar visibilidad
      const isVisible = thumbStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
                       thumbStyles.backgroundColor !== 'transparent' &&
                       thumbStyles.opacity !== '0';
      
      console.log(`  👁️ Visible: ${isVisible ? '✅ SÍ' : '❌ NO'}`);
      
      // Verificar contraste
      const hasGoodContrast = thumbStyles.backgroundColor.includes('255') ||
                             thumbStyles.border.includes('solid') ||
                             thumbStyles.boxShadow !== 'none';
      
      console.log(`  🎯 Buen Contraste: ${hasGoodContrast ? '✅ SÍ' : '❌ NO'}`);
    } else {
      console.log('  ❌ No se encontró thumb');
    }
    
    console.log(`  🔄 Estado: ${isActive ? 'ACTIVO' : 'INACTIVO'}`);
  });
}

// Función para abrir menú de accesibilidad
function openAccessibilityMenu() {
  console.log('📱 Abriendo menú de accesibilidad...');
  
  const menuButton = document.querySelector('[aria-controls="navigation-menu-drawer"]') ||
                     document.querySelector('[aria-label*="menú"]') ||
                     document.querySelector('.v-app-bar .v-btn:last-child');
  
  if (menuButton) {
    menuButton.click();
    console.log('✅ Menú abierto');
    
    setTimeout(() => {
      analyzeSwitchContrast();
    }, 1000);
  } else {
    console.log('❌ No se encontró botón de menú');
  }
}

// Función para forzar estilos CSS
function forceCSS() {
  console.log('🔧 Forzando estilos CSS...');
  
  const style = document.createElement('style');
  style.id = 'force-switch-visibility';
  style.textContent = `
    .v-theme--dark .accessibility-menu .v-switch__thumb {
      background-color: #FFFFFF !important;
      border: 3px solid #E0E0E0 !important;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.8), 0 0 0 2px rgba(255, 255, 255, 1) !important;
      width: 22px !important;
      height: 22px !important;
      opacity: 1 !important;
      display: block !important;
      visibility: visible !important;
      position: relative !important;
      z-index: 10 !important;
    }
    
    .v-theme--dark .accessibility-menu .v-switch--active .v-switch__thumb {
      background-color: #FFFFFF !important;
      border: 3px solid #4CAF50 !important;
      box-shadow: 0 3px 12px rgba(76, 175, 80, 0.8), 0 0 0 2px rgba(255, 255, 255, 1) !important;
    }
    
    .v-theme--dark .accessibility-menu .v-switch .v-switch__track {
      background-color: #1A1A1A !important;
      border: 3px solid #444444 !important;
      opacity: 1 !important;
      min-width: 48px !important;
      height: 28px !important;
    }
    
    .v-theme--dark .accessibility-menu .v-switch--active .v-switch__track {
      background-color: #1B3A1F !important;
      border: 3px solid #4CAF50 !important;
      box-shadow: 0 0 12px rgba(76, 175, 80, 0.5) !important;
    }
  `;
  
  // Remover estilo anterior si existe
  const existingStyle = document.getElementById('force-switch-visibility');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  document.head.appendChild(style);
  console.log('✅ Estilos forzados aplicados');
}

// Función para crear controles de test
function createTestControls() {
  const testDiv = document.createElement('div');
  testDiv.id = 'dark-switch-test';
  testDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #1A1A1A;
    color: #FFFFFF;
    padding: 20px;
    border-radius: 12px;
    z-index: 10002;
    font-family: 'Segoe UI', sans-serif;
    font-size: 12px;
    border: 2px solid #4CAF50;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
    min-width: 280px;
  `;
  
  testDiv.innerHTML = `
    <div style="margin-bottom: 15px; text-align: center;">
      <strong style="color: #4CAF50;">🌙 TEST SWITCHES OSCURO</strong>
    </div>
    
    <button onclick="applyDarkMode(); setTimeout(openAccessibilityMenu, 500);" style="width: 100%; background: #4CAF50; color: white; border: none; padding: 10px; margin: 5px 0; border-radius: 6px; cursor: pointer;">
      🌙 Activar Modo Oscuro + Abrir Menú
    </button>
    
    <button onclick="forceCSS(); setTimeout(analyzeSwitchContrast, 500);" style="width: 100%; background: #FF9800; color: white; border: none; padding: 10px; margin: 5px 0; border-radius: 6px; cursor: pointer;">
      🔧 Forzar Estilos + Analizar
    </button>
    
    <button onclick="analyzeSwitchContrast();" style="width: 100%; background: #2196F3; color: white; border: none; padding: 10px; margin: 5px 0; border-radius: 6px; cursor: pointer;">
      🔍 Analizar Contraste
    </button>
    
    <button onclick="document.getElementById('dark-switch-test').remove();" style="width: 100%; background: #f44336; color: white; border: none; padding: 8px; margin: 5px 0; border-radius: 6px; cursor: pointer;">
      ❌ Cerrar Test
    </button>
  `;
  
  // Remover controles anteriores
  const existing = document.getElementById('dark-switch-test');
  if (existing) existing.remove();
  
  document.body.appendChild(testDiv);
  console.log('✅ Controles de test creados');
}

// Exponer funciones globalmente
window.applyDarkMode = applyDarkMode;
window.analyzeSwitchContrast = analyzeSwitchContrast;
window.openAccessibilityMenu = openAccessibilityMenu;
window.forceCSS = forceCSS;

// Ejecutar test automático
setTimeout(() => {
  console.log('🚀 Iniciando secuencia de test automático...');
  createTestControls();
  
  // Auto-ejecutar en 2 segundos
  setTimeout(() => {
    console.log('⚡ Ejecutando test automático...');
    applyDarkMode();
    setTimeout(() => {
      forceCSS();
      setTimeout(() => {
        openAccessibilityMenu();
      }, 500);
    }, 500);
  }, 2000);
}, 1000);

console.log('✅ TEST DE SWITCHES EN MODO OSCURO INICIADO');
console.log('🎯 Funciones disponibles:');
console.log('   - applyDarkMode() - Activar modo oscuro');
console.log('   - forceCSS() - Forzar estilos mejorados');
console.log('   - analyzeSwitchContrast() - Analizar contraste');
console.log('   - openAccessibilityMenu() - Abrir menú');
