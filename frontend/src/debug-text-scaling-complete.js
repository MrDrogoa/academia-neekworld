// =====================================
// DEBUGGING COMPLETO - ESCALADO DE TEXTO
// =====================================

console.log('🔍 INICIANDO DEBUG COMPLETO DEL SISTEMA DE ESCALADO...');

// 1. Verificar si el archivo CSS está cargado
function checkCSSLoaded() {
    const cssFiles = Array.from(document.styleSheets);
    const accessibilityCSS = cssFiles.find(sheet => 
        sheet.href && sheet.href.includes('accessibility.css')
    );
    
    console.log('📊 Archivos CSS cargados:', cssFiles.length);
    console.log('✅ accessibility.css encontrado:', !!accessibilityCSS);
    
    if (accessibilityCSS) {
        console.log('📁 Ruta del CSS:', accessibilityCSS.href);
    }
    
    return !!accessibilityCSS;
}

// 2. Verificar clases en HTML
function checkHTMLClasses() {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    console.log('🏷️ Clases en HTML:', htmlElement.className);
    console.log('🏷️ Clases en BODY:', bodyElement.className);
    
    // Buscar clases de escalado específicas
    const scaleClasses = ['text-scale-80', 'text-scale-90', 'text-scale-100', 'text-scale-110', 'text-scale-120', 'text-scale-130'];
    const activeScaleClass = scaleClasses.find(cls => htmlElement.classList.contains(cls));
    
    console.log('🎯 Clase de escalado activa:', activeScaleClass || 'NINGUNA');
    
    return activeScaleClass;
}

// 3. Verificar estilos computados
function checkComputedStyles() {
    const testElements = [
        { selector: 'p', name: 'Párrafo' },
        { selector: 'h1', name: 'Título H1' },
        { selector: 'h2', name: 'Título H2' },
        { selector: '.v-btn', name: 'Botón Vuetify' },
        { selector: '.v-card-title', name: 'Título de Card' },
        { selector: '.v-card-text', name: 'Texto de Card' }
    ];
    
    console.log('📏 ESTILOS COMPUTADOS:');
    console.log('====================');
    
    testElements.forEach(({ selector, name }) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            const firstElement = elements[0];
            const computedStyle = window.getComputedStyle(firstElement);
            const fontSize = computedStyle.fontSize;
            
            console.log(`${name} (${selector}): ${fontSize}`);
        } else {
            console.log(`${name} (${selector}): NO ENCONTRADO`);
        }
    });
}

// 4. Aplicar escalado de prueba
function testTextScaling() {
    console.log('🧪 PROBANDO ESCALADO DE TEXTO...');
    console.log('===============================');
    
    const scales = ['text-scale-110', 'text-scale-120', 'text-scale-130'];
    let currentIndex = 0;
    
    function applyNextScale() {
        // Limpiar clases anteriores
        document.documentElement.className = document.documentElement.className
            .replace(/text-scale-\d+/g, '').trim();
        
        // Aplicar nueva clase
        const scaleClass = scales[currentIndex];
        document.documentElement.classList.add(scaleClass);
        
        console.log(`✅ Aplicado: ${scaleClass}`);
        console.log('🏷️ Clases actuales en HTML:', document.documentElement.className);
        
        // Verificar estilos después del cambio
        setTimeout(() => {
            checkComputedStyles();
            currentIndex = (currentIndex + 1) % scales.length;
            
            if (currentIndex !== 0) {
                setTimeout(applyNextScale, 3000);
            } else {
                console.log('🏁 Prueba de escalado completada');
            }
        }, 1000);
    }
    
    applyNextScale();
}

// 5. Verificar variables CSS
function checkCSSVariables() {
    const htmlElement = document.documentElement;
    const computedStyle = window.getComputedStyle(htmlElement);
    const scaleVariable = computedStyle.getPropertyValue('--accessibility-text-scale');
    
    console.log('🔢 Variable CSS --accessibility-text-scale:', scaleVariable);
    
    return scaleVariable;
}

// 6. Crear elementos de prueba
function createTestElements() {
    console.log('🏗️ CREANDO ELEMENTOS DE PRUEBA...');
    
    // Eliminar elementos de prueba existentes
    const existingTest = document.getElementById('debug-test-container');
    if (existingTest) {
        existingTest.remove();
    }
    
    // Crear contenedor de prueba
    const testContainer = document.createElement('div');
    testContainer.id = 'debug-test-container';
    testContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 300px;
        padding: 20px;
        background: white;
        border: 2px solid #333;
        z-index: 9999;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    
    testContainer.innerHTML = `
        <h3>Prueba de Escalado</h3>
        <p>Texto normal de párrafo</p>
        <button class="v-btn" style="padding: 8px 16px; margin: 5px;">Botón</button>
        <div style="margin-top: 10px;">
            <button onclick="window.debugTextScaling.applyScale('text-scale-110')">110%</button>
            <button onclick="window.debugTextScaling.applyScale('text-scale-120')">120%</button>
            <button onclick="window.debugTextScaling.applyScale('text-scale-130')">130%</button>
            <button onclick="window.debugTextScaling.resetScale()">Reset</button>
        </div>
        <button onclick="window.debugTextScaling.removeTestElements()" style="margin-top: 10px; background: red; color: white;">Cerrar</button>
    `;
    
    document.body.appendChild(testContainer);
    
    console.log('✅ Elementos de prueba creados');
}

// 7. Funciones de control para las pruebas
window.debugTextScaling = {
    applyScale: function(scaleClass) {
        // Limpiar clases anteriores
        document.documentElement.className = document.documentElement.className
            .replace(/text-scale-\d+/g, '').trim();
        
        // Aplicar nueva clase
        document.documentElement.classList.add(scaleClass);
        
        console.log(`🎯 Escalado aplicado: ${scaleClass}`);
        console.log('🏷️ Clases en HTML:', document.documentElement.className);
        
        // Verificar después de un momento
        setTimeout(() => {
            checkComputedStyles();
            checkCSSVariables();
        }, 500);
    },
    
    resetScale: function() {
        document.documentElement.className = document.documentElement.className
            .replace(/text-scale-\d+/g, '').trim();
        document.documentElement.classList.add('text-scale-100');
        
        console.log('🔄 Escalado reseteado a 100%');
        setTimeout(() => {
            checkComputedStyles();
        }, 500);
    },
    
    removeTestElements: function() {
        const testContainer = document.getElementById('debug-test-container');
        if (testContainer) {
            testContainer.remove();
        }
        console.log('🗑️ Elementos de prueba eliminados');
    }
};

// EJECUTAR DEBUG COMPLETO
function runCompleteDebug() {
    console.clear();
    console.log('🚀 EJECUTANDO DEBUG COMPLETO...');
    console.log('================================');
    
    // Paso 1: Verificar CSS
    const cssLoaded = checkCSSLoaded();
    
    // Paso 2: Verificar clases
    const activeClass = checkHTMLClasses();
    
    // Paso 3: Verificar variables CSS
    const scaleVar = checkCSSVariables();
    
    // Paso 4: Verificar estilos computados
    checkComputedStyles();
    
    // Paso 5: Crear elementos de prueba
    createTestElements();
    
    // Paso 6: Resumen
    console.log('📋 RESUMEN DEL DEBUG:');
    console.log('===================');
    console.log('CSS Cargado:', cssLoaded ? '✅' : '❌');
    console.log('Clase Activa:', activeClass || '❌ NINGUNA');
    console.log('Variable CSS:', scaleVar || '❌ NO DEFINIDA');
    
    return {
        cssLoaded,
        activeClass,
        scaleVar
    };
}

// Ejecutar automáticamente
runCompleteDebug();
