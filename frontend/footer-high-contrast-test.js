// Script de prueba específico para el footer en alto contraste
// Ejecutar en la consola del navegador para validar la funcionalidad

console.log('🔧 INICIANDO PRUEBA ESPECÍFICA DEL FOOTER');

// Función para aplicar alto contraste de diferentes maneras
function applyHighContrast() {
  console.log('🎨 Aplicando alto contraste...');
  
  // Método 1: Clase en documentElement
  document.documentElement.classList.add('high-contrast-mode');
  document.documentElement.classList.add('v-theme--light');
  
  // Método 2: Clase en body
  document.body.classList.add('high-contrast-mode');
  document.body.classList.add('v-theme--light');
  
  // Método 3: Atributo style directo
  const footer = document.querySelector('footer.footer');
  if (footer) {
    footer.setAttribute('data-theme', 'high-contrast');
  }
}

// Función para verificar estilos aplicados
function checkFooterHighContrast() {
  const footer = document.querySelector('footer.footer');
  if (!footer) {
    console.error('❌ Footer no encontrado');
    return false;
  }

  const computedStyles = window.getComputedStyle(footer);
  const backgroundColor = computedStyles.backgroundColor;
  const color = computedStyles.color;
  const borderTop = computedStyles.borderTop;
  
  console.log('📊 Estilos del footer en alto contraste:');
  console.log(`   - Background: ${backgroundColor}`);
  console.log(`   - Color: ${color}`);
  console.log(`   - Border Top: ${borderTop}`);
  
  // Verificar si tiene los estilos correctos
  const isBlackBackground = backgroundColor.includes('0, 0, 0') || backgroundColor === 'rgb(0, 0, 0)';
  const isWhiteText = color.includes('255, 255, 255') || color === 'rgb(255, 255, 255)';
  
  console.log(`   - ✅ Fondo negro: ${isBlackBackground ? 'Sí' : 'No'}`);
  console.log(`   - ✅ Texto blanco: ${isWhiteText ? 'Sí' : 'No'}`);
  
  // Verificar enlaces
  const links = footer.querySelectorAll('.footer-link');
  console.log(`🔗 Verificando ${links.length} enlaces:`);
  
  links.forEach((link, index) => {
    const linkStyles = window.getComputedStyle(link);
    const linkColor = linkStyles.color;
    console.log(`   Link ${index + 1}: ${linkColor}`);
    
    const isYellowLink = linkColor.includes('255, 255, 0') || linkColor === 'rgb(255, 255, 0)';
    console.log(`   - ✅ Color amarillo: ${isYellowLink ? 'Sí' : 'No'}`);
  });
  
  return { backgroundColor, color, borderTop };
}

// Función para probar hover en enlaces
function testLinkHover() {
  const links = document.querySelectorAll('footer.footer .footer-link');
  if (links.length > 0) {
    const firstLink = links[0];
    console.log('🎯 Probando hover en primer enlace...');
    
    // Simular hover
    firstLink.dispatchEvent(new MouseEvent('mouseenter', {
      view: window,
      bubbles: true,
      cancelable: true
    }));
    
    setTimeout(() => {
      const hoverStyles = window.getComputedStyle(firstLink);
      console.log('📊 Estilos en hover:');
      console.log(`   - Background: ${hoverStyles.backgroundColor}`);
      console.log(`   - Color: ${hoverStyles.color}`);
      console.log(`   - Padding: ${hoverStyles.padding}`);
      
      // Remover hover
      firstLink.dispatchEvent(new MouseEvent('mouseleave', {
        view: window,
        bubbles: true,
        cancelable: true
      }));
    }, 200);
  }
}

// Función principal
function testFooterHighContrast() {
  console.log('=== INICIANDO PRUEBA DE FOOTER EN ALTO CONTRASTE ===\n');
  
  // Aplicar alto contraste
  applyHighContrast();
  
  // Esperar un momento para que se apliquen los estilos
  setTimeout(() => {
    checkFooterHighContrast();
    testLinkHover();
    
    console.log('\n✅ PRUEBA DE FOOTER COMPLETADA');
    console.log('📝 Si el footer no se ve en alto contraste, verificar:');
    console.log('   1. Que la clase .high-contrast-mode esté aplicada');
    console.log('   2. Que los estilos CSS estén cargados correctamente');
    console.log('   3. Que no haya otros estilos sobrescribiendo');
    
  }, 500);
}

// Función para limpiar clases y probar de nuevo
function resetAndTest() {
  console.log('🔄 Limpiando clases anteriores...');
  
  // Limpiar clases
  document.documentElement.className = '';
  document.body.className = '';
  
  const footer = document.querySelector('footer.footer');
  if (footer) {
    footer.removeAttribute('data-theme');
  }
  
  setTimeout(() => {
    testFooterHighContrast();
  }, 200);
}

// Ejecutar la prueba
if (document.querySelector('footer.footer')) {
  testFooterHighContrast();
} else {
  console.log('⏳ Esperando a que se cargue el footer...');
  
  const observer = new MutationObserver((mutations) => {
    if (document.querySelector('footer.footer')) {
      observer.disconnect();
      console.log('✅ Footer detectado, iniciando prueba...');
      testFooterHighContrast();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Funciones globales para testing manual
window.testFooterHighContrast = testFooterHighContrast;
window.resetAndTestFooter = resetAndTest;

console.log('💡 Funciones disponibles:');
console.log('   - testFooterHighContrast() - Probar footer en alto contraste');
console.log('   - resetAndTestFooter() - Limpiar y probar de nuevo');
