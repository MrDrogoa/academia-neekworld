// ===================================================
// SCRIPT DE PRUEBA - SISTEMA DE TEMAS GLOBAL
// Academia Virtual - Verificación Completa de Temas
// ===================================================

console.log('🎨 INICIANDO PRUEBAS DEL SISTEMA DE TEMAS...');

// Crear controles flotantes para pruebas
function createThemeTestControls() {
  // Remover controles anteriores si existen
  const existingControls = document.getElementById('theme-test-controls');
  if (existingControls) {
    existingControls.remove();
  }

  const testControls = document.createElement('div');
  testControls.id = 'theme-test-controls';
  testControls.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 15px;
    z-index: 10000;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 12px;
    border: none;
    box-shadow: 0 10px 40px rgba(31, 38, 135, 0.4);
    backdrop-filter: blur(8px);
    min-width: 350px;
    max-width: 400px;
  `;

  testControls.innerHTML = `
    <div style="margin-bottom: 15px; text-align: center;">
      <strong style="font-size: 14px;">🎨 SISTEMA DE TEMAS</strong>
      <div style="font-size: 10px; opacity: 0.8; margin-top: 2px;">Verificación completa de temas</div>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 15px;">
      <button onclick="activateLightTheme()" style="background: #FFF; color: #333; border: none; padding: 10px 8px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 600;">
        ☀️ Claro
      </button>
      
      <button onclick="activateDarkTheme()" style="background: #333; color: #FFF; border: none; padding: 10px 8px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 600;">
        🌙 Oscuro
      </button>
      
      <button onclick="activateHighContrast()" style="background: #000; color: #FFFF00; border: 2px solid #FFFF00; padding: 8px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: 600;">
        ⚡ Alto Contraste
      </button>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
      <button onclick="analyzeCurrentTheme()" style="background: #4CAF50; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        🔍 Analizar Tema
      </button>
      
      <button onclick="testAllViews()" style="background: #2196F3; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        📱 Test Vistas
      </button>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
      <button onclick="verifyHomeView()" style="background: #FF9800; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        🏠 Home View
      </button>
      
      <button onclick="checkTransitions()" style="background: #9C27B0; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">
        🔄 Transiciones
      </button>
    </div>
    
    <button onclick="document.getElementById('theme-test-controls').remove()" style="background: #f44336; color: #fff; border: none; padding: 8px 16px; margin: 4px 0; border-radius: 6px; cursor: pointer; width: 100%; font-size: 11px;">
      ❌ Cerrar Controles
    </button>
    
    <div id="theme-test-results" style="margin-top: 15px; font-size: 10px; max-height: 250px; overflow-y: auto; background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; line-height: 1.4;"></div>
  `;

  document.body.appendChild(testControls);
}

// Función para activar tema claro
function activateLightTheme() {
  console.log('☀️ Activando tema claro...');
  
  const app = document.querySelector('.v-application');
  const html = document.documentElement;
  
  if (app) {
    app.classList.remove('v-theme--dark');
    app.classList.add('v-theme--light');
  }
  
  html.classList.remove('v-theme--dark', 'high-contrast-mode');
  html.classList.add('v-theme--light');
  
  document.body.classList.remove('v-theme--dark', 'high-contrast-mode');
  document.body.classList.add('v-theme--light');
  
  // Simular click en el switch de tema si existe
  const themeSwitch = document.querySelector('[aria-label*="Tema"]') || 
                      document.querySelector('[aria-label*="oscuro"]');
  
  setTimeout(() => {
    analyzeCurrentTheme();
    updateResults('✅ Tema claro activado');
  }, 500);
}

// Función para activar tema oscuro
function activateDarkTheme() {
  console.log('🌙 Activando tema oscuro...');
  
  const app = document.querySelector('.v-application');
  const html = document.documentElement;
  
  if (app) {
    app.classList.remove('v-theme--light');
    app.classList.add('v-theme--dark');
  }
  
  html.classList.remove('v-theme--light', 'high-contrast-mode');
  html.classList.add('v-theme--dark');
  
  document.body.classList.remove('v-theme--light', 'high-contrast-mode');
  document.body.classList.add('v-theme--dark');
  
  setTimeout(() => {
    analyzeCurrentTheme();
    updateResults('✅ Tema oscuro activado');
  }, 500);
}

// Función para activar alto contraste
function activateHighContrast() {
  console.log('⚡ Activando alto contraste...');
  
  const app = document.querySelector('.v-application');
  const html = document.documentElement;
  
  if (app) {
    app.classList.remove('v-theme--light', 'v-theme--dark');
    app.classList.add('high-contrast-mode');
  }
  
  html.classList.remove('v-theme--light', 'v-theme--dark');
  html.classList.add('high-contrast-mode');
  
  document.body.classList.remove('v-theme--light', 'v-theme--dark');
  document.body.classList.add('high-contrast-mode');
  
  setTimeout(() => {
    analyzeCurrentTheme();
    updateResults('✅ Alto contraste activado');
  }, 500);
}

// Función para analizar el tema actual
function analyzeCurrentTheme() {
  const app = document.querySelector('.v-application');
  const main = document.querySelector('.v-main');
  const navbar = document.querySelector('.v-app-bar');
  
  if (!app) {
    updateResults('❌ No se encontró la aplicación Vue');
    return;
  }
  
  const currentTheme = app.classList.contains('v-theme--dark') ? 'dark' :
                      app.classList.contains('v-theme--light') ? 'light' :
                      app.classList.contains('high-contrast-mode') ? 'high-contrast' : 'unknown';
  
  const appStyles = window.getComputedStyle(app);
  const mainStyles = main ? window.getComputedStyle(main) : null;
  const navbarStyles = navbar ? window.getComputedStyle(navbar) : null;
  
  let analysis = `
    <div><strong>🎨 ANÁLISIS TEMA ACTUAL</strong></div>
    <div>📊 Tema: <span style="color: #81C784;">${currentTheme.toUpperCase()}</span></div>
    <div>🎨 App BG: ${appStyles.backgroundColor}</div>
    <div>📝 App Color: ${appStyles.color}</div>
  `;
  
  if (mainStyles) {
    analysis += `
      <div>🏠 Main BG: ${mainStyles.backgroundColor}</div>
      <div>📄 Main Color: ${mainStyles.color}</div>
    `;
  }
  
  if (navbarStyles) {
    analysis += `
      <div>🧭 Navbar BG: ${navbarStyles.backgroundColor}</div>
      <div>🔤 Navbar Color: ${navbarStyles.color}</div>
    `;
  }
  
  // Verificar que el tema se aplicó correctamente
  const isCorrectlyApplied = checkThemeApplication(currentTheme, appStyles);
  
  analysis += isCorrectlyApplied ? 
    '<div style="color: #81C784;">✅ Tema aplicado correctamente</div>' : 
    '<div style="color: #ffcdd2;">⚠️ Problemas con aplicación del tema</div>';
  
  updateResults(analysis);
  console.log('🎨 Análisis de tema completado:', currentTheme);
}

// Función para verificar aplicación correcta del tema
function checkThemeApplication(theme, styles) {
  const bg = styles.backgroundColor;
  
  switch (theme) {
    case 'light':
      return bg.includes('255') || bg.includes('white');
    case 'dark':
      return bg.includes('18') || bg.includes('12') || bg.includes('black');
    case 'high-contrast':
      return bg.includes('255') || bg.includes('white');
    default:
      return false;
  }
}

// Función para probar todas las vistas
function testAllViews() {
  console.log('📱 Probando todas las vistas...');
  
  const views = [
    'home', 'courses', 'about', 'contact', 'login', 'register'
  ];
  
  let testResults = '<div><strong>📱 TEST DE VISTAS</strong></div>';
  
  views.forEach(view => {
    const elements = document.querySelectorAll(`[class*="${view}"], #${view}, .${view}-view, .${view}-page`);
    const found = elements.length > 0;
    
    testResults += `<div>${found ? '✅' : '❌'} ${view}: ${elements.length} elementos</div>`;
  });
  
  // Verificar elementos de home específicamente
  const homeElements = {
    'hero-section': document.querySelector('.hero-section'),
    'features-section': document.querySelector('.features-section'),
    'cta-section': document.querySelector('.cta-section'),
    'feature-card': document.querySelectorAll('.feature-card')
  };
  
  testResults += '<div><strong>🏠 ELEMENTOS HOME:</strong></div>';
  Object.entries(homeElements).forEach(([name, element]) => {
    const exists = element && (element.length ? element.length > 0 : true);
    testResults += `<div>${exists ? '✅' : '❌'} ${name}: ${exists ? 'OK' : 'No encontrado'}</div>`;
  });
  
  updateResults(testResults);
}

// Función específica para verificar HomeView
function verifyHomeView() {
  console.log('🏠 Verificando HomeView...');
  
  const heroSection = document.querySelector('.hero-section');
  const featuresSection = document.querySelector('.features-section');
  const ctaSection = document.querySelector('.cta-section');
  
  if (!heroSection) {
    updateResults('❌ No se encontró la sección hero');
    return;
  }
  
  const heroStyles = window.getComputedStyle(heroSection);
  const featuresStyles = featuresSection ? window.getComputedStyle(featuresSection) : null;
  const ctaStyles = ctaSection ? window.getComputedStyle(ctaSection) : null;
  
  let homeAnalysis = `
    <div><strong>🏠 ANÁLISIS HOME VIEW</strong></div>
    <div>🎭 Hero BG: ${heroStyles.backgroundColor}</div>
    <div>📝 Hero Color: ${heroStyles.color}</div>
  `;
  
  if (featuresStyles) {
    homeAnalysis += `
      <div>🔧 Features BG: ${featuresStyles.backgroundColor}</div>
      <div>📄 Features Color: ${featuresStyles.color}</div>
    `;
  }
  
  if (ctaStyles) {
    homeAnalysis += `
      <div>📢 CTA BG: ${ctaStyles.backgroundColor}</div>
      <div>🔤 CTA Color: ${ctaStyles.color}</div>
    `;
  }
  
  // Verificar feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  homeAnalysis += `<div>🎴 Feature Cards: ${featureCards.length}</div>`;
  
  if (featureCards.length > 0) {
    const cardStyles = window.getComputedStyle(featureCards[0]);
    homeAnalysis += `
      <div>🎨 Card BG: ${cardStyles.backgroundColor}</div>
      <div>📝 Card Color: ${cardStyles.color}</div>
    `;
  }
  
  updateResults(homeAnalysis);
}

// Función para verificar transiciones
function checkTransitions() {
  console.log('🔄 Verificando transiciones...');
  
  const elements = [
    { name: 'App', element: document.querySelector('.v-application') },
    { name: 'Main', element: document.querySelector('.v-main') },
    { name: 'Hero', element: document.querySelector('.hero-section') },
    { name: 'Features', element: document.querySelector('.features-section') }
  ];
  
  let transitionResults = '<div><strong>🔄 TRANSICIONES</strong></div>';
  
  elements.forEach(({ name, element }) => {
    if (element) {
      const styles = window.getComputedStyle(element);
      const hasTransition = styles.transition !== 'all 0s ease 0s';
      
      transitionResults += `<div>${hasTransition ? '✅' : '❌'} ${name}: ${hasTransition ? 'Con transición' : 'Sin transición'}</div>`;
    } else {
      transitionResults += `<div>❌ ${name}: No encontrado</div>`;
    }
  });
  
  updateResults(transitionResults);
}

// Función para actualizar resultados
function updateResults(content) {
  const resultsDiv = document.getElementById('theme-test-results');
  if (resultsDiv) {
    resultsDiv.innerHTML = content;
  }
}

// Función para ciclo automático de temas
function cycleThemes() {
  console.log('🔄 Iniciando ciclo automático de temas...');
  
  let themeIndex = 0;
  const themes = [
    { name: 'Claro', func: activateLightTheme },
    { name: 'Oscuro', func: activateDarkTheme },
    { name: 'Alto Contraste', func: activateHighContrast }
  ];
  
  const interval = setInterval(() => {
    console.log(`🎨 Cambiando a tema: ${themes[themeIndex].name}`);
    themes[themeIndex].func();
    
    themeIndex = (themeIndex + 1) % themes.length;
    
    if (themeIndex === 0) {
      clearInterval(interval);
      console.log('✅ Ciclo de temas completado');
      updateResults('✅ Ciclo automático de temas completado');
    }
  }, 2000);
}

// Crear controles al cargar
createThemeTestControls();

// Ejecutar análisis inicial
setTimeout(() => {
  console.log('🎨 Análisis inicial del sistema de temas...');
  analyzeCurrentTheme();
}, 1000);

// Exponer funciones globalmente
window.activateLightTheme = activateLightTheme;
window.activateDarkTheme = activateDarkTheme;
window.activateHighContrast = activateHighContrast;
window.analyzeCurrentTheme = analyzeCurrentTheme;
window.testAllViews = testAllViews;
window.verifyHomeView = verifyHomeView;
window.checkTransitions = checkTransitions;
window.cycleThemes = cycleThemes;

console.log('✅ SCRIPT DE PRUEBA DE TEMAS CARGADO');
console.log('💡 Funciones disponibles:');
console.log('   - activateLightTheme() - Activar tema claro');
console.log('   - activateDarkTheme() - Activar tema oscuro');
console.log('   - activateHighContrast() - Activar alto contraste');
console.log('   - analyzeCurrentTheme() - Analizar tema actual');
console.log('   - verifyHomeView() - Verificar HomeView específicamente');
console.log('   - cycleThemes() - Ciclo automático de todos los temas');
