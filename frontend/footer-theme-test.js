// Script de prueba para verificar la integración del tema en el footer
// Ejecutar en la consola del navegador para validar la funcionalidad

console.log('🔧 INICIANDO PRUEBA DE TEMA DEL FOOTER');

// Función para verificar estilos del footer
function checkFooterTheme(themeName) {
  const footer = document.querySelector('footer.footer');
  if (!footer) {
    console.error('❌ Footer no encontrado');
    return false;
  }

  const computedStyles = window.getComputedStyle(footer);
  const backgroundColor = computedStyles.backgroundColor;
  const color = computedStyles.color;
  const borderTopColor = computedStyles.borderTopColor;

  console.log(`📊 Estilos del footer en modo ${themeName}:`);
  console.log(`   - Background: ${backgroundColor}`);
  console.log(`   - Color: ${color}`);
  console.log(`   - Border: ${borderTopColor}`);

  return {
    backgroundColor,
    color,
    borderTopColor
  };
}

// Función para verificar enlaces del footer
function checkFooterLinks(themeName) {
  const links = document.querySelectorAll('footer.footer .footer-link');
  console.log(`🔗 Verificando ${links.length} enlaces del footer en modo ${themeName}`);
  
  links.forEach((link, index) => {
    const styles = window.getComputedStyle(link);
    console.log(`   Link ${index + 1}: ${styles.color}`);
  });
}

// Función principal de prueba
function testFooterThemes() {
  console.log('\n=== PRUEBA 1: MODO CLARO ===');
  
  // Simular cambio a modo claro
  document.documentElement.className = 'v-theme--light';
  document.body.className = 'v-theme--light';
  
  setTimeout(() => {
    checkFooterTheme('CLARO');
    checkFooterLinks('CLARO');
    
    console.log('\n=== PRUEBA 2: MODO OSCURO ===');
    
    // Simular cambio a modo oscuro
    document.documentElement.className = 'v-theme--dark';
    document.body.className = 'v-theme--dark';
    
    setTimeout(() => {
      checkFooterTheme('OSCURO');
      checkFooterLinks('OSCURO');
      
      console.log('\n=== PRUEBA 3: ALTO CONTRASTE ===');
      
      // Simular modo alto contraste
      document.documentElement.className = 'high-contrast-mode v-theme--light';
      document.body.className = 'high-contrast-mode v-theme--light';
      
      setTimeout(() => {
        checkFooterTheme('ALTO CONTRASTE');
        checkFooterLinks('ALTO CONTRASTE');
        
        console.log('\n✅ PRUEBAS DE TEMA DEL FOOTER COMPLETADAS');
        console.log('📝 Verificar que los colores cambien según el tema activo');
        
      }, 500);
    }, 500);
  }, 500);
}

// Verificar que el footer existe antes de ejecutar pruebas
if (document.querySelector('footer.footer')) {
  testFooterThemes();
} else {
  console.log('⏳ Esperando a que se cargue el footer...');
  
  // Observador para detectar cuando se carga el footer
  const observer = new MutationObserver((mutations) => {
    if (document.querySelector('footer.footer')) {
      observer.disconnect();
      console.log('✅ Footer detectado, iniciando pruebas...');
      testFooterThemes();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Función de ayuda para testing manual
window.testFooterTheme = function(theme) {
  console.log(`🔄 Cambiando a tema: ${theme}`);
  
  switch(theme) {
    case 'light':
      document.documentElement.className = 'v-theme--light';
      document.body.className = 'v-theme--light';
      break;
    case 'dark':
      document.documentElement.className = 'v-theme--dark';
      document.body.className = 'v-theme--dark';
      break;
    case 'high-contrast':
      document.documentElement.className = 'high-contrast-mode v-theme--light';
      document.body.className = 'high-contrast-mode v-theme--light';
      break;
  }
  
  setTimeout(() => {
    checkFooterTheme(theme.toUpperCase());
    checkFooterLinks(theme.toUpperCase());
  }, 200);
};

console.log('💡 Funciones disponibles:');
console.log('   - testFooterTheme("light") - Cambiar a modo claro');
console.log('   - testFooterTheme("dark") - Cambiar a modo oscuro');
console.log('   - testFooterTheme("high-contrast") - Cambiar a alto contraste');
