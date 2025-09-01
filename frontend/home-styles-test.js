// Script de prueba para verificar los estilos del footer y hero section
// Ejecutar en la consola del navegador para validar la funcionalidad

console.log('🔧 INICIANDO PRUEBA DE ESTILOS FOOTER Y HERO');

// Función para verificar estilos del footer
function checkFooterStyles(themeName) {
  const footer = document.querySelector('footer.footer');
  if (!footer) {
    console.error('❌ Footer no encontrado');
    return false;
  }

  const computedStyles = window.getComputedStyle(footer);
  const backgroundColor = computedStyles.backgroundColor;
  const color = computedStyles.color;
  
  console.log(`📊 Footer en modo ${themeName}:`);
  console.log(`   - Background: ${backgroundColor}`);
  console.log(`   - Color: ${color}`);
  
  // Verificar que en modo claro use #2A3B5F
  if (themeName === 'CLARO') {
    const expectedBg = 'rgb(42, 59, 95)'; // #2A3B5F en RGB
    const success = backgroundColor === expectedBg;
    console.log(`   - ✅ Background correcto: ${success ? 'Sí' : 'No'}`);
  }

  return { backgroundColor, color };
}

// Función para verificar estilos del hero
function checkHeroStyles(themeName) {
  const hero = document.querySelector('.hero-section');
  if (!hero) {
    console.error('❌ Hero section no encontrado');
    return false;
  }

  const computedStyles = window.getComputedStyle(hero);
  const backgroundColor = computedStyles.backgroundColor;
  const backgroundImage = computedStyles.backgroundImage;
  
  console.log(`🎯 Hero en modo ${themeName}:`);
  console.log(`   - Background: ${backgroundColor}`);
  console.log(`   - Background Image: ${backgroundImage}`);

  return { backgroundColor, backgroundImage };
}

// Función para verificar estilos de CTA
function checkCTAStyles(themeName) {
  const cta = document.querySelector('.cta-section');
  if (!cta) {
    console.error('❌ CTA section no encontrado');
    return false;
  }

  const computedStyles = window.getComputedStyle(cta);
  const backgroundColor = computedStyles.backgroundColor;
  const color = computedStyles.color;
  
  console.log(`📢 CTA en modo ${themeName}:`);
  console.log(`   - Background: ${backgroundColor}`);
  console.log(`   - Color: ${color}`);
  
  // Verificar que en modo claro use #2A3B5F
  if (themeName === 'CLARO') {
    const expectedBg = 'rgb(42, 59, 95)'; // #2A3B5F en RGB
    const success = backgroundColor === expectedBg;
    console.log(`   - ✅ Background correcto: ${success ? 'Sí' : 'No'}`);
  }

  return { backgroundColor, color };
}

// Función principal de prueba
function testAllStyles() {
  console.log('\n=== PRUEBA 1: MODO CLARO ===');
  
  // Simular cambio a modo claro
  document.documentElement.className = 'v-theme--light';
  document.body.className = 'v-theme--light';
  
  setTimeout(() => {
    checkFooterStyles('CLARO');
    checkHeroStyles('CLARO');
    checkCTAStyles('CLARO');
    
    console.log('\n=== PRUEBA 2: MODO OSCURO ===');
    
    // Simular cambio a modo oscuro
    document.documentElement.className = 'v-theme--dark';
    document.body.className = 'v-theme--dark';
    
    setTimeout(() => {
      checkFooterStyles('OSCURO');
      checkHeroStyles('OSCURO');
      checkCTAStyles('OSCURO');
      
      console.log('\n=== PRUEBA 3: ALTO CONTRASTE ===');
      
      // Simular modo alto contraste
      document.documentElement.className = 'high-contrast-mode v-theme--light';
      document.body.className = 'high-contrast-mode v-theme--light';
      
      setTimeout(() => {
        checkFooterStyles('ALTO CONTRASTE');
        checkHeroStyles('ALTO CONTRASTE');
        checkCTAStyles('ALTO CONTRASTE');
        
        console.log('\n✅ PRUEBAS DE ESTILOS COMPLETADAS');
        console.log('📝 Verificar que:');
        console.log('   - Footer usa #2A3B5F en modo claro');
        console.log('   - Hero mantiene #2A3B5F');
        console.log('   - CTA usa #2A3B5F en modo claro');
        
      }, 500);
    }, 500);
  }, 500);
}

// Verificar que los elementos existen antes de ejecutar pruebas
const footerExists = document.querySelector('footer.footer');
const heroExists = document.querySelector('.hero-section');
const ctaExists = document.querySelector('.cta-section');

if (footerExists && heroExists && ctaExists) {
  testAllStyles();
} else {
  console.log('⏳ Esperando a que se carguen los elementos...');
  
  // Observador para detectar cuando se cargan los elementos
  const observer = new MutationObserver((mutations) => {
    const allLoaded = document.querySelector('footer.footer') && 
                     document.querySelector('.hero-section') && 
                     document.querySelector('.cta-section');
    
    if (allLoaded) {
      observer.disconnect();
      console.log('✅ Elementos detectados, iniciando pruebas...');
      testAllStyles();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Función de ayuda para testing manual
window.testHomeStyles = function(theme) {
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
    checkFooterStyles(theme.toUpperCase());
    checkHeroStyles(theme.toUpperCase());
    checkCTAStyles(theme.toUpperCase());
  }, 200);
};

console.log('💡 Funciones disponibles:');
console.log('   - testHomeStyles("light") - Cambiar a modo claro');
console.log('   - testHomeStyles("dark") - Cambiar a modo oscuro');
console.log('   - testHomeStyles("high-contrast") - Cambiar a alto contraste');
