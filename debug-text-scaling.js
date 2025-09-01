// Debug script para verificar escalado de texto en la app real
console.log('=== DEBUG ESCALADO DE TEXTO ===');

// 1. Verificar si las clases se están aplicando
function checkTextScaling() {
  const html = document.documentElement;
  const body = document.body;
  
  console.log('HTML classes:', html.className);
  console.log('Body classes:', body.className);
  
  // Verificar variable CSS
  const computedStyle = getComputedStyle(html);
  const cssVar = computedStyle.getPropertyValue('--accessibility-text-scale');
  console.log('CSS Variable --accessibility-text-scale:', cssVar);
  
  // Verificar si hay elementos con las clases aplicadas
  const elementsWithScale = document.querySelectorAll('[class*="text-scale-"]');
  console.log('Elementos con text-scale-*:', elementsWithScale.length);
  
  // Verificar si el CSS de accessibility está cargado
  const stylesheets = Array.from(document.styleSheets);
  const accessibilitySheet = stylesheets.find(sheet => {
    try {
      const rules = Array.from(sheet.cssRules || []);
      return rules.some(rule => rule.selectorText && rule.selectorText.includes('text-scale-'));
    } catch (e) {
      return false;
    }
  });
  
  console.log('CSS de accessibility cargado:', !!accessibilitySheet);
  
  // Verificar algunos elementos específicos
  const testElements = document.querySelectorAll('p, h1, h2, h3, .v-card-text, .v-btn');
  console.log('Elementos de prueba encontrados:', testElements.length);
  
  testElements.forEach((el, index) => {
    if (index < 3) { // Solo primeros 3 para no spam
      const computedFontSize = getComputedStyle(el).fontSize;
      console.log(`Elemento ${el.tagName}:`, computedFontSize);
    }
  });
}

// 2. Simular cambio de escala para debug
function testScaling() {
  console.log('Probando escalado...');
  
  // Remover clases existentes
  const html = document.documentElement;
  const body = document.body;
  
  html.className = html.className.replace(/text-scale-\w+/g, '');
  body.className = body.className.replace(/text-scale-\w+/g, '');
  
  // Aplicar nueva clase
  html.classList.add('text-scale-120');
  body.classList.add('text-scale-120');
  
  console.log('Aplicado text-scale-120');
  
  // Verificar después de aplicar
  setTimeout(() => {
    checkTextScaling();
  }, 100);
}

// Ejecutar verificación inicial
checkTextScaling();

// Exponer funciones para uso manual
window.debugTextScaling = checkTextScaling;
window.testTextScaling = testScaling;

console.log('Para verificar manualmente: debugTextScaling() o testTextScaling()');
