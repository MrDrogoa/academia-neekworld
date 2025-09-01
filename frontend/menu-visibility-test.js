// =============================================
// SCRIPT DE VERIFICACIÓN - MENÚ DE ACCESIBILIDAD
// Para probar visibilidad en todos los modos
// =============================================

console.log('🔍 VERIFICANDO VISIBILIDAD DEL MENÚ DE ACCESIBILIDAD...');

function createMenuVisibilityTest() {
    // Remover test existente
    const existingTest = document.getElementById('menu-visibility-test');
    if (existingTest) {
        existingTest.remove();
    }
    
    // Crear overlay de prueba
    const testOverlay = document.createElement('div');
    testOverlay.id = 'menu-visibility-test';
    testOverlay.style.cssText = `
        position: fixed;
        top: 80px;
        left: 20px;
        width: 300px;
        background: rgba(255, 255, 255, 0.98);
        border: 3px solid #2E8B57;
        border-radius: 12px;
        padding: 20px;
        z-index: 10000;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 14px;
        backdrop-filter: blur(10px);
    `;
    
    testOverlay.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0; color: #2E8B57; font-size: 16px;">🔍 Test Visibilidad Menú</h3>
            <button onclick="document.getElementById('menu-visibility-test').remove()" 
                    style="margin-left: auto; background: #dc3545; color: white; border: none; 
                           border-radius: 4px; padding: 4px 8px; cursor: pointer;">✕</button>
        </div>
        
        <div style="margin-bottom: 15px; padding: 10px; background: #e3f2fd; border-radius: 6px; border-left: 4px solid #2196f3;">
            <strong>📋 Problemas a verificar:</strong><br>
            • Modo claro: texto invisible<br>
            • Móvil: menú transparente<br>
            • Modo oscuro: switches perdidos
        </div>
        
        <div style="margin-bottom: 15px;">
            <strong>Modo actual:</strong> <span id="current-theme-display" style="font-weight: bold;">Verificando...</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 15px;">
            <button onclick="testThemeMode('light')" style="padding: 8px; background: #ffc107; color: black; border: none; border-radius: 4px; cursor: pointer;">☀️ Claro</button>
            <button onclick="testThemeMode('dark')" style="padding: 8px; background: #343a40; color: white; border: none; border-radius: 4px; cursor: pointer;">🌙 Oscuro</button>
            <button onclick="testThemeMode('contrast')" style="padding: 8px; background: #000; color: #ffff00; border: none; border-radius: 4px; cursor: pointer;">⚡ Contraste</button>
            <button onclick="testMobileView()" style="padding: 8px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer;">📱 Móvil</button>
        </div>
        
        <div style="margin-bottom: 15px;">
            <button onclick="openAccessibilityMenu()" style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                🎛️ Abrir Menú Accesibilidad
            </button>
        </div>
        
        <div style="margin-bottom: 15px;">
            <button onclick="analyzeMenuElements()" style="width: 100%; padding: 10px; background: #6f42c1; color: white; border: none; border-radius: 4px; cursor: pointer;">
                🔍 Analizar Elementos del Menú
            </button>
        </div>
        
        <div id="analysis-results" style="font-size: 11px; background: #f8f9fa; padding: 10px; border-radius: 4px; max-height: 200px; overflow-y: auto;">
            Haz clic en "Analizar Elementos" para ver los problemas del menú
        </div>
    `;
    
    document.body.appendChild(testOverlay);
    
    // Hacer funciones globales
    window.testThemeMode = testThemeMode;
    window.testMobileView = testMobileView;
    window.openAccessibilityMenu = openAccessibilityMenu;
    window.analyzeMenuElements = analyzeMenuElements;
    
    console.log('✅ Test de visibilidad del menú creado');
    updateThemeDisplay();
}

function testThemeMode(mode) {
    console.log(`🎨 PROBANDO MODO: ${mode}`);
    
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Limpiar clases anteriores
    htmlElement.classList.remove('v-theme--light', 'v-theme--dark', 'high-contrast-mode');
    bodyElement.classList.remove('v-theme--light', 'v-theme--dark', 'high-contrast-mode');
    
    // Aplicar modo solicitado
    switch(mode) {
        case 'light':
            htmlElement.classList.add('v-theme--light');
            bodyElement.classList.add('v-theme--light');
            console.log('☀️ Modo claro aplicado');
            break;
        case 'dark':
            htmlElement.classList.add('v-theme--dark');
            bodyElement.classList.add('v-theme--dark');
            console.log('🌙 Modo oscuro aplicado');
            break;
        case 'contrast':
            htmlElement.classList.add('high-contrast-mode');
            bodyElement.classList.add('high-contrast-mode');
            console.log('⚡ Alto contraste aplicado');
            break;
    }
    
    updateThemeDisplay();
    
    // Verificar después de un momento
    setTimeout(() => {
        analyzeMenuStyles();
    }, 500);
}

function testMobileView() {
    console.log('📱 SIMULANDO VISTA MÓVIL...');
    
    // Simular viewport móvil
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Agregar clase móvil al body
    document.body.classList.add('mobile-test');
    
    // Agregar estilos temporales para simular móvil
    const mobileStyles = document.createElement('style');
    mobileStyles.id = 'mobile-test-styles';
    mobileStyles.textContent = `
        .mobile-test {
            width: 375px;
            height: 667px;
            overflow: hidden;
        }
        .mobile-test .v-menu > .v-overlay__content {
            position: fixed !important;
            top: 60px !important;
            right: 10px !important;
            left: 10px !important;
            width: auto !important;
            max-width: none !important;
            min-width: 300px !important;
        }
    `;
    document.head.appendChild(mobileStyles);
    
    console.log('✅ Vista móvil simulada');
    updateThemeDisplay();
}

function openAccessibilityMenu() {
    console.log('🎛️ INTENTANDO ABRIR MENÚ DE ACCESIBILIDAD...');
    
    // Buscar el botón de accesibilidad
    const accessibilityButton = document.querySelector('[aria-label*="accesibilidad"], .accessibility-controls button, button[aria-label*="Opciones"]');
    
    if (accessibilityButton) {
        console.log('✅ Botón de accesibilidad encontrado');
        accessibilityButton.click();
        
        setTimeout(() => {
            const menu = document.querySelector('.accessibility-menu');
            if (menu) {
                console.log('✅ Menú abierto correctamente');
                analyzeMenuVisibility(menu);
            } else {
                console.log('❌ Menú no encontrado después del clic');
            }
        }, 500);
    } else {
        console.log('❌ Botón de accesibilidad no encontrado');
        
        // Buscar botones alternativos
        const allButtons = document.querySelectorAll('button');
        console.log(`🔍 Botones encontrados: ${allButtons.length}`);
        
        allButtons.forEach((btn, index) => {
            const ariaLabel = btn.getAttribute('aria-label') || '';
            const title = btn.getAttribute('title') || '';
            const text = btn.textContent || '';
            
            if (ariaLabel.includes('accesibilidad') || title.includes('accesibilidad') || text.includes('accesibilidad')) {
                console.log(`🎯 Botón candidato ${index}: "${ariaLabel}" "${title}" "${text}"`);
            }
        });
    }
}

function analyzeMenuElements() {
    console.log('🔍 ANALIZANDO ELEMENTOS DEL MENÚ...');
    
    const resultsDiv = document.getElementById('analysis-results');
    if (!resultsDiv) return;
    
    let html = '<strong>📊 Análisis del menú de accesibilidad:</strong><br><br>';
    
    // Buscar menú
    const menu = document.querySelector('.accessibility-menu');
    const menuCard = document.querySelector('.accessibility-menu');
    const switches = document.querySelectorAll('.accessibility-menu .v-switch');
    const buttons = document.querySelectorAll('.accessibility-menu .v-btn');
    const icons = document.querySelectorAll('.accessibility-menu .v-icon');
    
    html += `🎛️ <strong>Menú principal:</strong> ${menu ? 'Encontrado' : 'NO ENCONTRADO'}<br>`;
    
    if (menu) {
        const menuStyles = window.getComputedStyle(menu);
        const bgColor = menuStyles.backgroundColor;
        const textColor = menuStyles.color;
        const borderColor = menuStyles.borderColor;
        
        html += `&nbsp;&nbsp;• Fondo: ${bgColor}<br>`;
        html += `&nbsp;&nbsp;• Texto: ${textColor}<br>`;
        html += `&nbsp;&nbsp;• Borde: ${borderColor}<br>`;
    }
    
    html += `🔄 <strong>Switches:</strong> ${switches.length} encontrados<br>`;
    switches.forEach((sw, index) => {
        const swStyles = window.getComputedStyle(sw);
        const opacity = swStyles.opacity;
        const visibility = swStyles.visibility;
        html += `&nbsp;&nbsp;• Switch ${index + 1}: opacity=${opacity}, visibility=${visibility}<br>`;
    });
    
    html += `🔘 <strong>Botones:</strong> ${buttons.length} encontrados<br>`;
    buttons.forEach((btn, index) => {
        const btnStyles = window.getComputedStyle(btn);
        const bgColor = btnStyles.backgroundColor;
        const textColor = btnStyles.color;
        html += `&nbsp;&nbsp;• Botón ${index + 1}: fondo=${bgColor}, texto=${textColor}<br>`;
    });
    
    html += `🔸 <strong>Iconos:</strong> ${icons.length} encontrados<br>`;
    icons.forEach((icon, index) => {
        const iconStyles = window.getComputedStyle(icon);
        const color = iconStyles.color;
        const opacity = iconStyles.opacity;
        html += `&nbsp;&nbsp;• Icono ${index + 1}: color=${color}, opacity=${opacity}<br>`;
    });
    
    resultsDiv.innerHTML = html;
}

function analyzeMenuStyles() {
    console.log('🎨 ANALIZANDO ESTILOS DEL MENÚ...');
    
    const menu = document.querySelector('.accessibility-menu');
    if (!menu) {
        console.log('❌ Menú no encontrado para análisis');
        return;
    }
    
    const menuStyles = window.getComputedStyle(menu);
    console.log('📊 ESTILOS DEL MENÚ:');
    console.log(`  Fondo: ${menuStyles.backgroundColor}`);
    console.log(`  Texto: ${menuStyles.color}`);
    console.log(`  Borde: ${menuStyles.border}`);
    console.log(`  Visibilidad: ${menuStyles.visibility}`);
    console.log(`  Opacidad: ${menuStyles.opacity}`);
    console.log(`  Z-index: ${menuStyles.zIndex}`);
}

function analyzeMenuVisibility(menu) {
    console.log('👁️ ANALIZANDO VISIBILIDAD DEL MENÚ...');
    
    const menuStyles = window.getComputedStyle(menu);
    const parentOverlay = menu.closest('.v-overlay__content');
    
    console.log('📊 ANÁLISIS DE VISIBILIDAD:');
    console.log(`  Menú visible: ${menuStyles.visibility}`);
    console.log(`  Opacidad menú: ${menuStyles.opacity}`);
    console.log(`  Color fondo: ${menuStyles.backgroundColor}`);
    console.log(`  Color texto: ${menuStyles.color}`);
    
    if (parentOverlay) {
        const overlayStyles = window.getComputedStyle(parentOverlay);
        console.log(`  Overlay visible: ${overlayStyles.visibility}`);
        console.log(`  Opacidad overlay: ${overlayStyles.opacity}`);
        console.log(`  Fondo overlay: ${overlayStyles.backgroundColor}`);
    }
    
    // Verificar contraste
    const textElements = menu.querySelectorAll('span, div');
    textElements.forEach((el, index) => {
        const elStyles = window.getComputedStyle(el);
        const textColor = elStyles.color;
        const bgColor = elStyles.backgroundColor;
        
        if (textColor && bgColor && textColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'rgba(0, 0, 0, 0)') {
            console.log(`  Elemento ${index}: texto=${textColor}, fondo=${bgColor}`);
        }
    });
}

function updateThemeDisplay() {
    const displayElement = document.getElementById('current-theme-display');
    if (!displayElement) return;
    
    const htmlClasses = document.documentElement.className;
    let currentTheme = '🔍 Verificando...';
    
    if (htmlClasses.includes('high-contrast-mode')) {
        currentTheme = '⚡ Alto Contraste';
    } else if (htmlClasses.includes('v-theme--dark')) {
        currentTheme = '🌙 Modo Oscuro';
    } else if (htmlClasses.includes('v-theme--light')) {
        currentTheme = '☀️ Modo Claro';
    } else {
        currentTheme = '❓ Sin tema específico';
    }
    
    displayElement.textContent = currentTheme;
}

// Ejecutar automáticamente
console.log('🚀 Iniciando test de visibilidad del menú...');
createMenuVisibilityTest();

console.log('\n📝 INSTRUCCIONES:');
console.log('================');
console.log('1. Usa los botones para cambiar entre modos');
console.log('2. Haz clic en "Abrir Menú" para abrir el menú de accesibilidad');
console.log('3. Usa "Analizar Elementos" para ver problemas específicos');
console.log('4. Verifica que todos los elementos sean visibles en cada modo');
