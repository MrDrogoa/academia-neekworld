// =============================================
// SCRIPT DE VERIFICACIÓN DE ESCALADO CONSERVADOR
// Para aplicación Vue - Sistema de accesibilidad mejorado
// =============================================

console.log('🔍 VERIFICANDO SISTEMA DE ESCALADO CONSERVADOR...');

function createVisualTestOverlay() {
    // Remover overlay existente
    const existingOverlay = document.getElementById('accessibility-test-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }
    
    // Crear overlay de prueba
    const overlay = document.createElement('div');
    overlay.id = 'accessibility-test-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
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
    
    overlay.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <h3 style="margin: 0; color: #2E8B57; font-size: 16px;">🔍 Test Escalado Conservador</h3>
            <button onclick="document.getElementById('accessibility-test-overlay').remove()" 
                    style="margin-left: auto; background: #dc3545; color: white; border: none; 
                           border-radius: 4px; padding: 4px 8px; cursor: pointer;">✕</button>
        </div>
        
        <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #28a745;">
            <strong>✅ Qué DEBE cambiar:</strong><br>
            • Párrafos de contenido<br>
            • Títulos H1/H2 de contenido<br>
            • Texto de campos de entrada<br>
            • Texto dentro de .v-card-text
        </div>
        
        <div style="margin-bottom: 15px; padding: 10px; background: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;">
            <strong>🚫 Qué NO debe cambiar:</strong><br>
            • Botones (.v-btn)<br>
            • Navegación (navbar, drawer)<br>
            • Títulos de cards (.v-card-title)<br>
            • Iconos y elementos de UI
        </div>
        
        <div style="margin-bottom: 15px;">
            <strong>Escalado actual:</strong> <span id="current-scale-display" style="font-weight: bold; color: #2E8B57;">100%</span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 15px;">
            <button onclick="testConservativeScaling('text-scale-100')" style="padding: 8px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">100%</button>
            <button onclick="testConservativeScaling('text-scale-110')" style="padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">110%</button>
            <button onclick="testConservativeScaling('text-scale-120')" style="padding: 8px; background: #ffc107; color: black; border: none; border-radius: 4px; cursor: pointer;">120%</button>
            <button onclick="testConservativeScaling('text-scale-130')" style="padding: 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">130%</button>
        </div>
        
        <div style="margin-bottom: 15px;">
            <button onclick="analyzeCurrentElements()" style="width: 100%; padding: 10px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer;">
                📊 Analizar Elementos Actuales
            </button>
        </div>
        
        <div id="analysis-results" style="font-size: 12px; background: #f8f9fa; padding: 10px; border-radius: 4px; max-height: 200px; overflow-y: auto;">
            Haz clic en "Analizar Elementos" para ver qué elementos hay en la página
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Hacer funciones globales
    window.testConservativeScaling = testConservativeScaling;
    window.analyzeCurrentElements = analyzeCurrentElements;
    
    console.log('✅ Overlay de prueba creado');
}

function testConservativeScaling(scaleClass) {
    console.log(`🎯 APLICANDO ESCALADO CONSERVADOR: ${scaleClass}`);
    
    // Remover clases anteriores
    const scaleClasses = ['text-scale-80', 'text-scale-90', 'text-scale-100', 'text-scale-110', 'text-scale-120', 'text-scale-130'];
    scaleClasses.forEach(cls => {
        document.documentElement.classList.remove(cls);
        document.body.classList.remove(cls);
    });
    
    // Aplicar nueva clase
    document.documentElement.classList.add(scaleClass);
    document.body.classList.add(scaleClass);
    
    // Actualizar display
    const percentage = scaleClass.replace('text-scale-', '') + '%';
    const displayElement = document.getElementById('current-scale-display');
    if (displayElement) {
        displayElement.textContent = percentage;
        displayElement.style.color = scaleClass === 'text-scale-100' ? '#6c757d' : 
                                   scaleClass === 'text-scale-110' ? '#28a745' :
                                   scaleClass === 'text-scale-120' ? '#ffc107' : '#dc3545';
    }
    
    console.log(`✅ Escalado aplicado: ${percentage}`);
    console.log(`🏷️ Clases HTML: ${document.documentElement.className}`);
    
    // Verificar después de un momento
    setTimeout(() => {
        verifyScalingResults(scaleClass);
    }, 500);
}

function analyzeCurrentElements() {
    console.log('📊 ANALIZANDO ELEMENTOS EN LA PÁGINA...');
    
    const analysisResults = document.getElementById('analysis-results');
    if (!analysisResults) return;
    
    let html = '<strong>Análisis de elementos:</strong><br><br>';
    
    // Elementos que DEBEN cambiar
    const shouldChange = [
        { selector: '.v-main p', name: 'Párrafos principales', icon: '📝' },
        { selector: '.v-card-text p', name: 'Párrafos en cards', icon: '📄' },
        { selector: '.v-main h1:not(.v-toolbar-title)', name: 'Títulos H1', icon: '📌' },
        { selector: '.v-main h2:not(.v-toolbar-title)', name: 'Títulos H2', icon: '📎' },
        { selector: '.v-text-field input', name: 'Campos de entrada', icon: '📝' },
        { selector: '.content-area', name: 'Áreas de contenido', icon: '📋' }
    ];
    
    // Elementos que NO deben cambiar
    const shouldNotChange = [
        { selector: '.v-btn', name: 'Botones', icon: '🔘' },
        { selector: '.v-app-bar', name: 'Barra de navegación', icon: '🧭' },
        { selector: '.v-card-title', name: 'Títulos de cards', icon: '🏷️' },
        { selector: '.v-navigation-drawer', name: 'Drawer lateral', icon: '📂' },
        { selector: '.v-icon', name: 'Iconos', icon: '🔸' },
        { selector: '.v-toolbar', name: 'Toolbars', icon: '🔧' }
    ];
    
    html += '<div style="color: #28a745;"><strong>✅ Elementos que DEBEN cambiar:</strong></div>';
    shouldChange.forEach(({ selector, name, icon }) => {
        const elements = document.querySelectorAll(selector);
        const count = elements.length;
        const fontSize = count > 0 ? window.getComputedStyle(elements[0]).fontSize : 'N/A';
        html += `${icon} ${name}: ${count} encontrados (${fontSize})<br>`;
    });
    
    html += '<br><div style="color: #dc3545;"><strong>🚫 Elementos que NO deben cambiar:</strong></div>';
    shouldNotChange.forEach(({ selector, name, icon }) => {
        const elements = document.querySelectorAll(selector);
        const count = elements.length;
        const fontSize = count > 0 ? window.getComputedStyle(elements[0]).fontSize : 'N/A';
        html += `${icon} ${name}: ${count} encontrados (${fontSize})<br>`;
    });
    
    analysisResults.innerHTML = html;
    console.log('✅ Análisis completado');
}

function verifyScalingResults(scaleClass) {
    console.log('🔍 VERIFICANDO RESULTADOS DEL ESCALADO...');
    
    const expectedSizes = {
        'text-scale-100': { p: '16px', h1: '32px', h2: '24px' },
        'text-scale-110': { p: '17.6px', h1: '35.2px', h2: '26.4px' },
        'text-scale-120': { p: '19.2px', h1: '38.4px', h2: '28.8px' },
        'text-scale-130': { p: '20.8px', h1: '41.6px', h2: '31.2px' }
    };
    
    const expected = expectedSizes[scaleClass];
    if (!expected) return;
    
    // Verificar párrafos principales
    const mainP = document.querySelector('.v-main p');
    if (mainP) {
        const actualSize = window.getComputedStyle(mainP).fontSize;
        const match = actualSize === expected.p;
        console.log(`📝 Párrafo principal: ${actualSize} (esperado: ${expected.p}) ${match ? '✅' : '❌'}`);
    }
    
    // Verificar botones (NO deben cambiar)
    const btn = document.querySelector('.v-btn');
    if (btn) {
        const actualSize = window.getComputedStyle(btn).fontSize;
        console.log(`🔘 Botón: ${actualSize} (debe mantener tamaño original)`);
    }
    
    // Verificar títulos de cards (NO deben cambiar)
    const cardTitle = document.querySelector('.v-card-title');
    if (cardTitle) {
        const actualSize = window.getComputedStyle(cardTitle).fontSize;
        console.log(`🏷️ Título de card: ${actualSize} (debe mantener tamaño original)`);
    }
}

// Ejecutar automáticamente
console.log('🚀 Iniciando verificación de escalado conservador...');
createVisualTestOverlay();

console.log('\n📋 INSTRUCCIONES:');
console.log('================');
console.log('1. Usa los botones del overlay para probar diferentes escalados');
console.log('2. Verifica que solo el CONTENIDO cambie de tamaño');
console.log('3. Los botones, navegación y UI deben mantener su tamaño');
console.log('4. Haz clic en "Analizar Elementos" para ver qué hay en la página');
