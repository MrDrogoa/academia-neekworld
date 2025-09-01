// Test del servicio de Neekworld
import neekworldService from './src/services/neekworldService.js'

async function testNeekworldService() {
  console.log('🧪 Probando servicio de Neekworld...')
  
  try {
    const result = await neekworldService.getCourses()
    
    if (result.success) {
      console.log(`✅ Éxito: ${result.courses.length} cursos obtenidos`)
      console.log('📋 Primeros 3 cursos:')
      result.courses.slice(0, 3).forEach((course, index) => {
        console.log(`${index + 1}. ${course.title} - ${course.category} - ${course.price}`)
      })
      
      // Verificar categorías únicas
      const categories = [...new Set(result.courses.map(c => c.category))]
      console.log('🏷️ Categorías encontradas:', categories)
      
    } else {
      console.error('❌ Error:', result.error)
    }
    
    // Stats del servicio
    console.log('📊 Stats del servicio:', neekworldService.getStats())
    
  } catch (error) {
    console.error('💥 Error en la prueba:', error)
  }
}

// Ejecutar la prueba
testNeekworldService()
