// Lighthouse accessibility testing script
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runAccessibilityTest() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['accessibility'],
    port: chrome.port
  };

  // URLs a probar
  const urls = [
    'http://localhost:8080/',
    'http://localhost:8080/courses',
    'http://localhost:8080/dashboard',
    'http://localhost:8080/about'
  ];

  console.log('🔍 Iniciando pruebas de accesibilidad con Lighthouse...\n');

  for (const url of urls) {
    try {
      console.log(`📊 Probando: ${url}`);
      const runnerResult = await lighthouse(url, options);
      
      // Extraer puntuación de accesibilidad
      const accessibilityScore = runnerResult.lhr.categories.accessibility.score * 100;
      const auditResults = runnerResult.lhr.audits;
      
      console.log(`✅ Puntuación de accesibilidad: ${accessibilityScore}/100`);
      
      // Mostrar auditorías fallidas
      const failedAudits = Object.keys(auditResults)
        .filter(key => auditResults[key].score !== null && auditResults[key].score < 1)
        .map(key => ({
          id: key,
          title: auditResults[key].title,
          description: auditResults[key].description
        }));
      
      if (failedAudits.length > 0) {
        console.log('❌ Auditorías que requieren atención:');
        failedAudits.forEach(audit => {
          console.log(`   - ${audit.title}: ${audit.description}`);
        });
      } else {
        console.log('✅ Todas las auditorías de accesibilidad pasaron');
      }
      
      console.log('---\n');
      
    } catch (error) {
      console.error(`❌ Error probando ${url}:`, error.message);
    }
  }

  await chrome.kill();
  console.log('🎉 Pruebas de accesibilidad completadas');
}

if (require.main === module) {
  runAccessibilityTest().catch(console.error);
}

module.exports = { runAccessibilityTest };
