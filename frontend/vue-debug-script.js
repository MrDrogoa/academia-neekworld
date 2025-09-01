// =============================================
// SCRIPT DE PRUEBA PARA LA APLICACIÓN VUE
// Ejecutar en la consola del navegador
// =============================================

console.log('🚀 INICIANDO PRUEBA DE ESCALADO EN APLICACIÓN VUE...');

// Función para verificar el estado actual
function checkCurrentState() {
    console.log('📊 VERIFICANDO ESTADO ACTUAL:');
    console.log('============================');
    
    // 1. Verificar clases en HTML
    const htmlClasses = document.documentElement.className;
    const bodyClasses = document.body.className;
    
    console.log('🏷️ Clases HTML:', htmlClasses);
    console.log('🏷️ Clases BODY:', bodyClasses);
    
    // 2. Buscar clases de escalado
    const scaleClasses = ['text-scale-80', 'text-scale-90', 'text-scale-100', 'text-scale-110', 'text-scale-120', 'text-scale-130'];
    const activeScaleClass = scaleClasses.find(cls => document.documentElement.classList.contains(cls));
    
    console.log('🎯 Clase de escalado activa:', activeScaleClass || 'NINGUNA');
    
    // 3. Verificar variable CSS
    const computedStyle = window.getComputedStyle(document.documentElement);
    const scaleVariable = computedStyle.getPropertyValue('--accessibility-text-scale').trim();
    
    console.log('🔢 Variable CSS --accessibility-text-scale:', scaleVariable || 'NO DEFINIDA');
    
    // 4. Verificar estilos en elementos específicos
    const testElements = [
        { selector: 'p', name: 'Párrafo' },
        { selector: 'h1', name: 'H1' },
        { selector: 'h2', name: 'H2' },
        { selector: '.v-btn', name: 'Botón Vuetify' },
        { selector: '.v-card-title', name: 'Título Card' },
        { selector: '.v-card-text', name: 'Texto Card' }
    ];
    
    console.log('📏 TAMAÑOS DE FUENTE ACTUALES:');
    testElements.forEach(({ selector, name }) => {
        const element = document.querySelector(selector);
        if (element) {
            const style = window.getComputedStyle(element);
            console.log(`  ${name}: ${style.fontSize}`);
        } else {
            console.log(`  ${name}: NO ENCONTRADO`);
        }
    });
    
    return {
        htmlClasses,
        activeScaleClass,
        scaleVariable
    };
}

// Función para aplicar escalado manualmente
function testTextScaling(scaleClass) {
    console.log(`🎯 APLICANDO ESCALADO: ${scaleClass}`);
    console.log('================================');
    
    // Remover clases anteriores
    const scaleClasses = ['text-scale-80', 'text-scale-90', 'text-scale-100', 'text-scale-110', 'text-scale-120', 'text-scale-130'];
    scaleClasses.forEach(cls => {
        document.documentElement.classList.remove(cls);
        document.body.classList.remove(cls);
    });
    
    // Aplicar nueva clase
    document.documentElement.classList.add(scaleClass);
    document.body.classList.add(scaleClass);
    
    console.log(`✅ Clase aplicada: ${scaleClass}`);
    console.log(`🏷️ Clases HTML actuales: ${document.documentElement.className}`);
    
    // Verificar después de un momento
    setTimeout(() => {
        console.log('🔍 VERIFICANDO DESPUÉS DEL CAMBIO:');
        
        const computedStyle = window.getComputedStyle(document.documentElement);
        const scaleVariable = computedStyle.getPropertyValue('--accessibility-text-scale').trim();
        console.log(`🔢 Variable CSS: ${scaleVariable}`);
        
        // Verificar un párrafo específico
        const testP = document.querySelector('p');
        if (testP) {
            const pStyle = window.getComputedStyle(testP);
            console.log(`📝 Tamaño párrafo: ${pStyle.fontSize}`);
        }
        
        // Verificar botón Vuetify
        const testBtn = document.querySelector('.v-btn');
        if (testBtn) {
            const btnStyle = window.getComputedStyle(testBtn);
            console.log(`🔘 Tamaño botón: ${btnStyle.fontSize}`);
        }
    }, 500);
}

// Función para probar todos los escalados
function testAllScales() {
    console.log('🧪 PROBANDO TODOS LOS ESCALADOS...');
    
    const scales = ['text-scale-80', 'text-scale-90', 'text-scale-100', 'text-scale-110', 'text-scale-120', 'text-scale-130'];
    let currentIndex = 0;
    
    function nextScale() {
        if (currentIndex < scales.length) {
            const scale = scales[currentIndex];
            console.log(`\n--- PRUEBA ${currentIndex + 1}/6: ${scale} ---`);
            testTextScaling(scale);
            currentIndex++;
            setTimeout(nextScale, 3000);
        } else {
            console.log('🏁 PRUEBA COMPLETA FINALIZADA');
        }
    }
    
    nextScale();
}

// Función para verificar si el composable está funcionando
function checkVueComposable() {
    console.log('🔍 VERIFICANDO COMPOSABLE VUE...');
    
    // Intentar acceder al store de Vue o variables globales
    if (window.Vue) {
        console.log('✅ Vue detectado globalmente');
    } else {
        console.log('❌ Vue no detectado globalmente');
    }
    
    // Verificar si hay elementos Vue
    const vueElements = document.querySelectorAll('[data-v-*], .v-application');
    console.log(`📦 Elementos Vue encontrados: ${vueElements.length}`);
    
    // Buscar en localStorage
    const savedTheme = localStorage.getItem('accessibility-theme');
    const savedTextSize = localStorage.getItem('accessibility-text-size');
    const savedHighContrast = localStorage.getItem('accessibility-high-contrast');
    
    console.log('💾 DATOS EN LOCALSTORAGE:');
    console.log('  Tema:', savedTheme || 'NO GUARDADO');
    console.log('  Tamaño texto:', savedTextSize || 'NO GUARDADO');
    console.log('  Alto contraste:', savedHighContrast || 'NO GUARDADO');
}

// Función para crear controles de prueba en la página
function createTestControls() {
    console.log('🏗️ CREANDO CONTROLES DE PRUEBA...');
    
    // Remover controles existentes
    const existingControls = document.getElementById('debug-text-controls');
    if (existingControls) {
        existingControls.remove();
    }
    
    // Crear contenedor
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'debug-text-controls';
    controlsContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        background: white;
        border: 3px solid #2E8B57;
        border-radius: 8px;
        padding: 20px;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
        font-size: 14px;
    `;
    
    controlsContainer.innerHTML = `
        <h3 style="margin: 0 0 15px 0; color: #2E8B57;">🔍 Debug Escalado</h3>
        <div style="margin-bottom: 15px;">
            <button onclick="testTextScaling('text-scale-80')" style="margin: 2px; padding: 5px 8px; font-size: 12px;">80%</button>
            <button onclick="testTextScaling('text-scale-90')" style="margin: 2px; padding: 5px 8px; font-size: 12px;">90%</button>
            <button onclick="testTextScaling('text-scale-100')" style="margin: 2px; padding: 5px 8px; font-size: 12px;">100%</button>
            <button onclick="testTextScaling('text-scale-110')" style="margin: 2px; padding: 5px 8px; font-size: 12px;">110%</button>
            <button onclick="testTextScaling('text-scale-120')" style="margin: 2px; padding: 5px 8px; font-size: 12px;">120%</button>
            <button onclick="testTextScaling('text-scale-130')" style="margin: 2px; padding: 5px 8px; font-size: 12px;">130%</button>
        </div>
        <div style="margin-bottom: 10px;">
            <button onclick="checkCurrentState()" style="width: 100%; padding: 8px; background: #2E8B57; color: white; border: none; border-radius: 4px; margin-bottom: 5px;">Verificar Estado</button>
            <button onclick="testAllScales()" style="width: 100%; padding: 8px; background: #ff6b35; color: white; border: none; border-radius: 4px; margin-bottom: 5px;">Probar Todos</button>
            <button onclick="document.getElementById('debug-text-controls').remove()" style="width: 100%; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 4px;">Cerrar</button>
        </div>
        <div id="debug-status" style="font-size: 11px; background: #f8f9fa; padding: 8px; border-radius: 4px; border: 1px solid #dee2e6;">
            Estado: Listo para pruebas
        </div>
    `;
    
    document.body.appendChild(controlsContainer);
    
    // Hacer las funciones globales
    window.testTextScaling = testTextScaling;
    window.checkCurrentState = checkCurrentState;
    window.testAllScales = testAllScales;
    
    console.log('✅ Controles de prueba creados');
}

// EJECUTAR VERIFICACIÓN INICIAL
console.log('🚀 EJECUTANDO VERIFICACIÓN INICIAL...');
checkCurrentState();
checkVueComposable();
createTestControls();

console.log('\n📝 INSTRUCCIONES:');
console.log('================');
console.log('1. Usa los controles flotantes para probar escalado');
console.log('2. Ejecuta checkCurrentState() para ver el estado actual');
console.log('3. Ejecuta testTextScaling("text-scale-120") para probar escalado específico');
console.log('4. Ejecuta testAllScales() para probar todos los escalados automáticamente');
console.log('5. Abre las herramientas de desarrollador para ver todos los logs');

// Hacer las funciones disponibles globalmente
window.debugTextScaling = {
    checkCurrentState,
    testTextScaling,
    testAllScales,
    checkVueComposable,
    createTestControls
};
