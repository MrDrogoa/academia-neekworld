// Script de prueba para verificar la visibilidad de botones del carrito
// Ejecutar en la consola del navegador en la página de cursos

console.log('🔧 INICIANDO PRUEBA DE BOTONES DEL CARRITO');

// Función para verificar estilos de botones
function checkCartButtonStyles(themeName) {
  const addButtons = document.querySelectorAll('.v-btn--variant-elevated');
  const cartButtons = document.querySelectorAll('.v-btn--variant-outlined.v-btn--disabled');
  
  console.log(`📊 Botones del carrito en modo ${themeName}:`);
  console.log(`   - Botones "Agregar": ${addButtons.length}`);
  console.log(`   - Botones "En carrito": ${cartButtons.length}`);
  
  // Verificar botones "Agregar"
  if (addButtons.length > 0) {
    const firstAddButton = addButtons[0];
    const addStyles = window.getComputedStyle(firstAddButton);
    
    console.log('🔵 Botón "Agregar":');
    console.log(`   - Background: ${addStyles.backgroundColor}`);
    console.log(`   - Color: ${addStyles.color}`);
    console.log(`   - Border: ${addStyles.border}`);
    console.log(`   - Font Weight: ${addStyles.fontWeight}`);
    
    // Verificar colores según tema
    if (themeName === 'CLARO') {
      const expectedBg = 'rgb(46, 139, 87)'; // #2E8B57
      const isCorrect = addStyles.backgroundColor === expectedBg;
      console.log(`   - ✅ Color correcto: ${isCorrect ? 'Sí' : 'No'}`);
    } else if (themeName === 'OSCURO') {
      const expectedBg = 'rgb(76, 175, 80)'; // #4CAF50
      const isCorrect = addStyles.backgroundColor === expectedBg;
      console.log(`   - ✅ Color correcto: ${isCorrect ? 'Sí' : 'No'}`);
    }
  }
  
  // Verificar botones "En carrito"
  if (cartButtons.length > 0) {
    const firstCartButton = cartButtons[0];
    const cartStyles = window.getComputedStyle(firstCartButton);
    
    console.log('🟢 Botón "En carrito":');
    console.log(`   - Background: ${cartStyles.backgroundColor}`);
    console.log(`   - Color: ${cartStyles.color}`);
    console.log(`   - Border: ${cartStyles.borderColor}`);
    console.log(`   - Opacity: ${cartStyles.opacity}`);
  }
  
  return { addButtons: addButtons.length, cartButtons: cartButtons.length };
}

// Función para simular hover en botones
function testButtonHover() {
  const addButtons = document.querySelectorAll('.v-btn--variant-elevated');
  if (addButtons.length > 0) {
    const button = addButtons[0];
    console.log('🎯 Probando hover en botón "Agregar"...');
    
    // Simular hover
    button.dispatchEvent(new MouseEvent('mouseenter', {
      view: window,
      bubbles: true,
      cancelable: true
    }));
    
    setTimeout(() => {
      const hoverStyles = window.getComputedStyle(button);
      console.log('📊 Estilos en hover:');
      console.log(`   - Background: ${hoverStyles.backgroundColor}`);
      console.log(`   - Transform: ${hoverStyles.transform}`);
      console.log(`   - Box Shadow: ${hoverStyles.boxShadow}`);
      
      // Remover hover
      button.dispatchEvent(new MouseEvent('mouseleave', {
        view: window,
        bubbles: true,
        cancelable: true
      }));
    }, 200);
  }
}

// Función para cambiar temas y probar
function testAllCartButtonThemes() {
  console.log('\n=== PRUEBA 1: MODO CLARO ===');
  
  // Aplicar modo claro
  document.documentElement.className = 'v-theme--light';
  document.body.className = 'v-theme--light';
  
  setTimeout(() => {
    checkCartButtonStyles('CLARO');
    
    console.log('\n=== PRUEBA 2: MODO OSCURO ===');
    
    // Aplicar modo oscuro
    document.documentElement.className = 'v-theme--dark';
    document.body.className = 'v-theme--dark';
    
    setTimeout(() => {
      checkCartButtonStyles('OSCURO');
      
      console.log('\n=== PRUEBA 3: ALTO CONTRASTE ===');
      
      // Aplicar alto contraste
      document.documentElement.className = 'high-contrast-mode v-theme--light';
      document.body.className = 'high-contrast-mode v-theme--light';
      
      setTimeout(() => {
        checkCartButtonStyles('ALTO CONTRASTE');
        testButtonHover();
        
        console.log('\n✅ PRUEBAS DE BOTONES COMPLETADAS');
        console.log('📝 Verificar que:');
        console.log('   - Botones "Agregar" se vean claramente');
        console.log('   - Botones "En carrito" tengan buen contraste');
        console.log('   - Hover funcione correctamente');
        
      }, 500);
    }, 500);
  }, 500);
}

// Función para contar cursos visibles
function checkCourseCards() {
  const courseCards = document.querySelectorAll('.course-card, .v-card');
  const coursesWithButtons = Array.from(courseCards).filter(card => 
    card.querySelector('.v-btn--variant-elevated, .v-btn--variant-outlined')
  );
  
  console.log(`🎓 Cursos encontrados: ${courseCards.length}`);
  console.log(`🛒 Cursos con botones de carrito: ${coursesWithButtons.length}`);
  
  return coursesWithButtons.length;
}

// Ejecutar pruebas
function runCartButtonTests() {
  console.log('=== INICIANDO PRUEBAS DE BOTONES DEL CARRITO ===\n');
  
  const coursesFound = checkCourseCards();
  
  if (coursesFound > 0) {
    testAllCartButtonThemes();
  } else {
    console.log('❌ No se encontraron cursos con botones de carrito');
    console.log('💡 Asegúrate de estar en la página de catálogo de cursos');
  }
}

// Verificar si estamos en la página correcta
const isCoursePage = window.location.pathname.includes('/courses') || 
                    document.querySelector('.course-card, .v-card') !== null;

if (isCoursePage) {
  runCartButtonTests();
} else {
  console.log('⚠️  No pareces estar en la página de cursos');
  console.log('🔄 Navega a /courses para ejecutar las pruebas');
}

// Funciones globales para testing manual
window.testCartButtons = testAllCartButtonThemes;
window.checkCartButtonStyles = checkCartButtonStyles;
window.testButtonHover = testButtonHover;

console.log('\n💡 Funciones disponibles:');
console.log('   - testCartButtons() - Probar todos los temas');
console.log('   - checkCartButtonStyles("TEMA") - Verificar tema específico');
console.log('   - testButtonHover() - Probar efecto hover');
