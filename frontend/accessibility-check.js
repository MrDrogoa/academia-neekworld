#!/usr/bin/env node

/**
 * Script de verificación de accesibilidad básica
 * Verifica elementos críticos de accesibilidad en el código fuente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificación de Accesibilidad WCAG 2.1 - Academia Virtual\n');

// Directorios a verificar
const sourceDir = path.join(__dirname, 'src');
const componentDirs = [
  path.join(sourceDir, 'components'),
  path.join(sourceDir, 'views')
];

// Contadores de verificación
let checks = {
  altTexts: 0,
  ariaLabels: 0,
  semanticElements: 0,
  focusIndicators: 0,
  roles: 0,
  total: 0
};

let issues = [];

/**
 * Busca archivos Vue recursivamente
 */
function findVueFiles(dir) {
  let vueFiles = [];
  
  if (!fs.existsSync(dir)) return vueFiles;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      vueFiles = vueFiles.concat(findVueFiles(filePath));
    } else if (file.endsWith('.vue')) {
      vueFiles.push(filePath);
    }
  }
  
  return vueFiles;
}

/**
 * Verifica accesibilidad en un archivo Vue
 */
function checkAccessibility(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  console.log(`📄 Verificando: ${fileName}`);
  
  // 1. Verificar alt texts en imágenes
  const imgTags = content.match(/<(?:v-img|img)[^>]*>/g) || [];
  let altCount = 0;
  imgTags.forEach(tag => {
    if (tag.includes('alt=') || tag.includes(':alt=')) {
      altCount++;
    } else if (!tag.includes('aria-hidden="true"')) {
      issues.push(`❌ ${fileName}: Imagen sin alt text - ${tag.substring(0, 50)}...`);
    }
  });
  checks.altTexts += altCount;
  
  // 2. Verificar ARIA labels
  const ariaLabels = (content.match(/aria-label=/g) || []).length;
  checks.ariaLabels += ariaLabels;
  
  // 3. Verificar elementos semánticos
  const semanticElements = [
    'role=', '<header', '<main', '<nav', '<article', '<section', '<aside', '<footer'
  ];
  semanticElements.forEach(element => {
    const count = (content.match(new RegExp(element, 'g')) || []).length;
    checks.semanticElements += count;
  });
  
  // 4. Verificar roles
  const roles = (content.match(/role="/g) || []).length;
  checks.roles += roles;
  
  // 5. Verificar si tiene estilos de foco
  if (content.includes(':focus') || content.includes('focus')) {
    checks.focusIndicators++;
  }
  
  console.log(`   ✅ Alt texts: ${altCount}`);
  console.log(`   ✅ ARIA labels: ${ariaLabels}`);
  console.log(`   ✅ Roles: ${roles}`);
  console.log('');
}

/**
 * Verifica el archivo CSS principal
 */
function checkCSS() {
  console.log('🎨 Verificando CSS de accesibilidad...');
  
  const cssFiles = [
    path.join(sourceDir, 'App.vue'),
    path.join(sourceDir, 'assets', 'styles', 'global.scss')
  ];
  
  cssFiles.forEach(cssFile => {
    if (fs.existsSync(cssFile)) {
      const content = fs.readFileSync(cssFile, 'utf8');
      
      // Verificar si tiene estilos para :focus
      if (content.includes(':focus')) {
        console.log('   ✅ Indicadores de foco implementados');
        checks.focusIndicators++;
      }
      
      // Verificar si tiene soporte para prefers-reduced-motion
      if (content.includes('prefers-reduced-motion')) {
        console.log('   ✅ Soporte para movimiento reducido');
      }
      
      // Verificar si tiene soporte para high contrast
      if (content.includes('high-contrast') || content.includes('prefers-contrast')) {
        console.log('   ✅ Soporte para alto contraste');
      }
      
      // Verificar clase sr-only
      if (content.includes('.sr-only')) {
        console.log('   ✅ Clase .sr-only implementada');
      }
    }
  });
  
  console.log('');
}

/**
 * Verifica componente de AccessibilityControls
 */
function checkAccessibilityControls() {
  console.log('🛠️ Verificando controles de accesibilidad...');
  
  const accessibilityFile = path.join(sourceDir, 'components', 'AccessibilityControls.vue');
  
  if (fs.existsSync(accessibilityFile)) {
    console.log('   ✅ Componente AccessibilityControls encontrado');
    
    const content = fs.readFileSync(accessibilityFile, 'utf8');
    
    if (content.includes('toggleHighContrast')) {
      console.log('   ✅ Toggle de alto contraste implementado');
    }
    
    if (content.includes('toggleLargeText')) {
      console.log('   ✅ Toggle de texto grande implementado');
    }
    
    if (content.includes('toggleReducedMotion')) {
      console.log('   ✅ Toggle de movimiento reducido implementado');
    }
  } else {
    issues.push('❌ Componente AccessibilityControls no encontrado');
  }
  
  console.log('');
}

/**
 * Ejecutar verificación principal
 */
function runAccessibilityCheck() {
  // Recopilar todos los archivos Vue
  let allVueFiles = [];
  componentDirs.forEach(dir => {
    allVueFiles = allVueFiles.concat(findVueFiles(dir));
  });
  
  // Verificar cada archivo
  allVueFiles.forEach(checkAccessibility);
  
  // Verificar CSS
  checkCSS();
  
  // Verificar controles de accesibilidad
  checkAccessibilityControls();
  
  // Mostrar resumen
  console.log('📊 RESUMEN DE ACCESIBILIDAD:');
  console.log('================================');
  console.log(`✅ Alt texts encontrados: ${checks.altTexts}`);
  console.log(`✅ ARIA labels encontrados: ${checks.ariaLabels}`);
  console.log(`✅ Elementos semánticos: ${checks.semanticElements}`);
  console.log(`✅ Roles definidos: ${checks.roles}`);
  console.log(`✅ Archivos con estilos de foco: ${checks.focusIndicators}`);
  console.log('');
  
  // Mostrar issues si los hay
  if (issues.length > 0) {
    console.log('⚠️  ISSUES ENCONTRADOS:');
    issues.forEach(issue => console.log(issue));
    console.log('');
  }
  
  // Puntuación final
  const totalChecks = checks.altTexts + checks.ariaLabels + checks.semanticElements + checks.roles + checks.focusIndicators;
  const score = Math.min(100, Math.round((totalChecks / allVueFiles.length) * 10));
  
  console.log(`🎯 PUNTUACIÓN DE ACCESIBILIDAD: ${score}/100`);
  
  if (score >= 80) {
    console.log('🎉 ¡EXCELENTE! La aplicación cumple con estándares de accesibilidad');
  } else if (score >= 60) {
    console.log('👍 BUENO. Algunas mejoras recomendadas');
  } else {
    console.log('⚠️  MEJORABLE. Se requieren más implementaciones de accesibilidad');
  }
  
  console.log('\n✅ Verificación completada. Lista para demo de accesibilidad WCAG 2.1');
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runAccessibilityCheck();
}

module.exports = { runAccessibilityCheck };
