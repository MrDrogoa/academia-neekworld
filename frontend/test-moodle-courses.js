// Test para probar la obtención de cursos desde Moodle QA
import moodleIntegrationService from '../src/services/moodleIntegrationService'

async function testMoodleCourses() {
  console.log('🔍 Probando obtención de cursos desde Moodle QA...')
  console.log('📍 URL:', moodleIntegrationService.config.baseUrl)
  
  try {
    // Primero probar conexión básica
    console.log('\n1. Probando conexión básica...')
    
    // Probar obtener cursos
    console.log('\n2. Obteniendo cursos desde Moodle QA...')
    const coursesResult = await moodleIntegrationService.getCoursesFromMoodle()
    
    console.log('\n📊 Resultado:')
    console.log('Success:', coursesResult.success)
    
    if (coursesResult.success) {
      console.log('✅ Cursos obtenidos exitosamente!')
      console.log('📚 Cantidad de cursos:', coursesResult.courses.length)
      
      console.log('\n📋 Lista de cursos:')
      coursesResult.courses.forEach((course, index) => {
        console.log(`${index + 1}. ${course.fullname} (ID: ${course.id})`)
        console.log(`   - Categoría: ${course.categoryname || 'Sin categoría'}`)
        console.log(`   - Resumen: ${course.summary ? course.summary.substring(0, 100) + '...' : 'Sin resumen'}`)
        console.log('')
      })
      
      return coursesResult.courses
    } else {
      console.log('❌ Error al obtener cursos:', coursesResult.message)
      return null
    }
    
  } catch (error) {
    console.error('💥 Error en test:', error)
    return null
  }
}

// Ejecutar test si se ejecuta directamente
if (typeof window !== 'undefined') {
  window.testMoodleCourses = testMoodleCourses
  console.log('🧪 Test function loaded. Run window.testMoodleCourses() in console.')
}

export default testMoodleCourses
