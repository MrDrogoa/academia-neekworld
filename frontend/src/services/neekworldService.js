/**
 * Servicio para integración con API de Neekworld
 * Obtiene cursos desde https://neekworld.cl/NW/course/
 */

class NeekworldService {
  constructor() {
    this.baseUrl = 'https://neekworld.cl/NW'
    this.apiUrl = `${this.baseUrl}/course/`
    this.apiAlternatives = [
      `${this.baseUrl}/course/index.php`,
      `${this.baseUrl}/webservice/rest/server.php?wstoken=your_token&wsfunction=core_course_get_courses&moodlewsrestformat=json`,
      `${this.baseUrl}/api/courses`,
    ]
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutos
  }

  /**
   * Obtiene todos los cursos desde la API de Neekworld
   */
  async getCourses() {
    try {
      console.log('🔍 Obteniendo cursos desde Neekworld API...')
      
      // Verificar cache
      if (this.cache.has('courses')) {
        const cached = this.cache.get('courses')
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          console.log('📦 Usando cursos desde cache')
          return { success: true, courses: cached.data }
        }
      }

      // Intentar obtener desde API real
      let data = null
      for (const url of [this.apiUrl, ...this.apiAlternatives]) {
        try {
          console.log(`🌐 Intentando: ${url}`)
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            mode: 'cors'
          })

          if (response.ok) {
            const responseData = await response.json()
            if (responseData && Array.isArray(responseData)) {
              data = responseData
              break
            }
          }
        } catch (error) {
          console.warn(`⚠️ Error en ${url}:`, error.message)
          continue
        }
      }

      // Si no se pudo obtener de la API, usar datos simulados basados en Neekworld
      if (!data) {
        console.log('📚 Usando cursos simulados basados en Neekworld')
        data = this.getMockNeekworldCourses()
        console.log('📊 Cursos simulados cargados:', data.length)
      }

      console.log(`✅ ${data.length} cursos obtenidos desde Neekworld`)
      
      // Convertir cursos de Neekworld al formato de la plataforma
      console.log('🔄 Formateando cursos...')
      const formattedCourses = data.map(course => this.formatNeekworldCourse(course))
      console.log('📊 Cursos formateados:', formattedCourses.length)
      console.log('🏷️ Categorías en cursos formateados:', [...new Set(formattedCourses.map(c => c.category))])
      
      // Guardar en cache
      this.cache.set('courses', {
        data: formattedCourses,
        timestamp: Date.now()
      })

      return {
        success: true,
        courses: formattedCourses
      }

    } catch (error) {
      console.error('❌ Error obteniendo cursos de Neekworld:', error)
      return {
        success: false,
        error: error.message,
        courses: []
      }
    }
  }

  /**
   * Convierte un curso de Neekworld al formato de la plataforma
   */
  formatNeekworldCourse(neekworldCourse) {
    // Extraer categoría del curso o usar categoría por defecto
    const category = this.extractCategory(neekworldCourse) || 'General'
    const level = this.extractLevel(neekworldCourse) || 'Intermedio'
    
    // Generar precio basado en la categoría y características del curso
    const pricing = neekworldCourse.price ? 
      { 
        price: neekworldCourse.price, 
        originalPrice: Math.floor(neekworldCourse.price * 1.2) // 20% descuento para cursos reales
      } : 
      this.generatePricing(neekworldCourse, category)

    return {
      id: `neekworld_${neekworldCourse.id || Math.random().toString(36).substr(2, 9)}`,
      neekworldId: neekworldCourse.id,
      title: neekworldCourse.title || neekworldCourse.name || 'Curso sin título',
      description: neekworldCourse.description || neekworldCourse.summary || 'Curso disponible en Neekworld',
      instructor: neekworldCourse.instructor || neekworldCourse.teacher || 'Instructor Neekworld',
      duration: neekworldCourse.duration || this.estimateDuration(),
      level: level,
      category: category,
      price: pricing.price,
      originalPrice: pricing.originalPrice,
      rating: neekworldCourse.rating || this.generateRating(),
      reviewCount: neekworldCourse.reviews || this.generateReviewCount(),
      thumbnail: neekworldCourse.image || this.getImageForCourse(neekworldCourse),
      tags: this.generateTags(neekworldCourse, category),
      source: 'neekworld',
      isRealCourse: typeof neekworldCourse.id === 'number', // Cursos reales tienen ID numérico
      url: neekworldCourse.url || `${this.baseUrl}/course/${neekworldCourse.id}`,
      createdAt: neekworldCourse.created_at || new Date().toISOString(),
      updatedAt: neekworldCourse.updated_at || new Date().toISOString()
    }
  }

  /**
   * Extrae la categoría del curso basada en título, descripción o metadata
   */
  extractCategory(course) {
    const text = `${course.title || ''} ${course.description || ''} ${course.category || ''}`.toLowerCase()
    
    // Palabras clave para categorización automática
    const categoryKeywords = {
      'Desarrollo Web': ['web', 'html', 'css', 'javascript', 'react', 'vue', 'angular', 'node', 'frontend', 'backend', 'fullstack'],
      'Data Science': ['data', 'python', 'pandas', 'machine learning', 'ai', 'artificial intelligence', 'analytics', 'statistics'],
      'Diseño': ['design', 'diseño', 'photoshop', 'illustrator', 'ui', 'ux', 'graphic', 'visual'],
      'Marketing': ['marketing', 'seo', 'sem', 'social media', 'advertising', 'publicidad', 'ventas', 'sales'],
      'DevOps': ['devops', 'docker', 'kubernetes', 'aws', 'cloud', 'infrastructure', 'deployment'],
      'Desarrollo Móvil': ['mobile', 'android', 'ios', 'react native', 'flutter', 'swift', 'kotlin'],
      'Negocios': ['business', 'management', 'leadership', 'entrepreneurship', 'finance', 'accounting'],
      'Idiomas': ['english', 'spanish', 'french', 'language', 'idioma', 'ingles', 'frances'],
      'Fotografía': ['photography', 'photo', 'camera', 'fotografia', 'imagen'],
      'Música': ['music', 'audio', 'sound', 'musica', 'instrument'],
      'Tecnología y Herramientas Digitales': ['tecnología', 'digital', 'herramientas', 'software', 'programación', 'desarrollo'],
      'Educación y Pedagogía': ['educación', 'pedagogía', 'enseñanza', 'docencia', 'curricular', 'evaluación']
    }

    // Si la categoría viene directamente definida, mapearla
    if (course.category) {
      const directCategory = course.category.toLowerCase()
      if (directCategory.includes('educación') || directCategory.includes('pedagogía')) {
        return 'Educación y Pedagogía'
      }
      if (directCategory.includes('tecnología') || directCategory.includes('digital')) {
        return 'Tecnología y Herramientas Digitales'
      }
    }

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category
      }
    }

    return 'General'
  }

  /**
   * Extrae el nivel del curso
   */
  extractLevel(course) {
    const text = `${course.title || ''} ${course.description || ''} ${course.level || ''}`.toLowerCase()
    
    if (text.includes('beginner') || text.includes('principiante') || text.includes('básico') || text.includes('basic')) {
      return 'Principiante'
    }
    if (text.includes('advanced') || text.includes('avanzado') || text.includes('expert') || text.includes('experto')) {
      return 'Avanzado'
    }
    return 'Intermedio'
  }

  /**
   * Estima la duración del curso
   */
  estimateDuration() {
    // Si no hay duración específica, estimar basada en el tipo de curso
    const durationOptions = ['20 horas', '30 horas', '40 horas', '50 horas', '60 horas']
    return durationOptions[Math.floor(Math.random() * durationOptions.length)]
  }

  /**
   * Genera pricing basado en la categoría y características
   */
  generatePricing(course, category) {
    const basePrices = {
      'Desarrollo Web': { min: 89900, max: 129900 },
      'Data Science': { min: 109900, max: 159900 },
      'Diseño': { min: 69900, max: 99900 },
      'Marketing': { min: 59900, max: 89900 },
      'DevOps': { min: 99900, max: 139900 },
      'Desarrollo Móvil': { min: 89900, max: 119900 },
      'Negocios': { min: 79900, max: 109900 },
      'Idiomas': { min: 49900, max: 79900 },
      'Fotografía': { min: 59900, max: 89900 },
      'Música': { min: 49900, max: 79900 },
      'Tecnología y Herramientas Digitales': { min: 99900, max: 149900 },
      'Educación y Pedagogía': { min: 69900, max: 119900 },
      'General': { min: 49900, max: 89900 }
    }

    const priceRange = basePrices[category] || basePrices['General']
    const price = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min
    const originalPrice = Math.floor(price * 1.3) // 30% descuento

    return { price, originalPrice }
  }

  /**
   * Genera rating aleatorio pero realista
   */
  generateRating() {
    // Ratings entre 4.0 y 5.0 con tendencia hacia valores altos
    return Math.round((4.0 + Math.random() * 1.0) * 10) / 10
  }

  /**
   * Genera número de reviews
   */
  generateReviewCount() {
    return Math.floor(Math.random() * 500) + 50
  }

  /**
   * Genera tags relevantes para el curso
   */
  generateTags(course, category) {
    const categoryTags = {
      'Desarrollo Web': ['Frontend', 'Backend', 'JavaScript', 'HTML', 'CSS'],
      'Data Science': ['Python', 'Analytics', 'Machine Learning', 'Estadística'],
      'Diseño': ['Creatividad', 'Visual', 'Herramientas', 'Portfolio'],
      'Marketing': ['Digital', 'Estrategia', 'ROI', 'Conversión'],
      'DevOps': ['Cloud', 'Automatización', 'Infraestructura', 'CI/CD'],
      'Desarrollo Móvil': ['iOS', 'Android', 'Cross-platform', 'UX Mobile'],
      'Negocios': ['Estrategia', 'Liderazgo', 'Finanzas', 'Gestión'],
      'Idiomas': ['Conversación', 'Gramática', 'Vocabulario', 'Fluidez'],
      'Fotografía': ['Composición', 'Iluminación', 'Edición', 'Portfolio'],
      'Música': ['Teoría', 'Práctica', 'Composición', 'Técnica'],
      'Tecnología y Herramientas Digitales': ['Innovación', 'Software', 'Productividad', 'Digitalización'],
      'Educación y Pedagogía': ['Metodología', 'Evaluación', 'Didáctica', 'Competencias'],
      'General': ['Aprendizaje', 'Práctica', 'Certificación', 'Online']
    }

    const tags = categoryTags[category] || categoryTags['General']
    
    // Agregar tag de fuente
    return [...tags.slice(0, 3), 'Neekworld']
  }

  /**
   * Obtiene la imagen correspondiente para un curso basado en su título
   */
  getImageForCourse(course) {
    const title = (course.title || '').toLowerCase()
    
    // Mapeo de palabras clave a imágenes específicas
    const imageMap = {
      'construcción de instrumentos de evaluación': '/img-courses/construccion-de-instrumentos-de-evaluacion.png',
      'neurociencias aplicada a la educación': '/img-courses/neurociencias-aplicada-a-la-educacion.png',
      'formación de jefes utp': '/img-courses/formacion-de-jefes-de-utp-y-sus-equipos-tecnicos.png',
      'autismo': '/img-courses/autismo.png',
      'ia para docentes': '/img-courses/ia-para-docentes.png',
      'creacion de cursos': '/img-courses/creacion-de-cursos-con-metodologia-addie-para-docentes.png',
      'addie': '/img-courses/creacion-de-cursos-con-metodologia-addie-para-docentes.png',
      'introducción práctica a gnu/linux': '/img-courses/introduccion-practica-gnu-linux.png',
      'linux': '/img-courses/introduccion-practica-gnu-linux.png',
      'excel básico': '/img-courses/curso-de-excel-basico.png',
      'excel': '/img-courses/curso-de-excel-basico.png',
      'desarrollo web full stack': '/img-courses/desarrollo-web-fullstack-con react-y-node.png',
      'react': '/img-courses/desarrollo-web-fullstack-con react-y-node.png',
      'node.js': '/img-courses/desarrollo-web-fullstack-con react-y-node.png',
      'inteligencia artificial': '/img-courses/inteligencia-artificial-y-machine-learning.png',
      'machine learning': '/img-courses/inteligencia-artificial-y-machine-learning.png',
      'ciberseguridad': '/img-courses/ciberseguridad-y-ethical-hacking.png',
      'ethical hacking': '/img-courses/ciberseguridad-y-ethical-hacking.png',
      'ux/ui design': '/img-courses/ux-ui-design-para-aplicaciones-web.png',
      'ux': '/img-courses/ux-ui-design-para-aplicaciones-web.png',
      'ui': '/img-courses/ux-ui-design-para-aplicaciones-web.png',
      'metodologías de enseñanza virtual': '/img-courses/metodologias-de-enseñanza-virtual.png',
      'enseñanza virtual': '/img-courses/metodologias-de-enseñanza-virtual.png',
      'psicología del aprendizaje digital': '/img-courses/psicologia-del-aprendizaje-digital.png',
      'psicología': '/img-courses/psicologia-del-aprendizaje-digital.png',
      'marketing digital': '/img-courses/marketing-digital-y-redes-sociales.png',
      'redes sociales': '/img-courses/marketing-digital-y-redes-sociales.png',
      'fotografía digital': '/img-courses/fotografia-digital-y-edicion.png',
      'fotografía': '/img-courses/fotografia-digital-y-edicion.png',
      'emprendimiento': '/img-courses/emprendimiento-e-innovacion.png',
      'innovación': '/img-courses/emprendimiento-e-innovacion.png'
    }

    // Buscar coincidencias en el título
    for (const [keyword, imagePath] of Object.entries(imageMap)) {
      if (title.includes(keyword)) {
        return imagePath
      }
    }

    // Imagen por defecto si no se encuentra coincidencia
    return '/default-course.jpg'
  }

  /**
   * Limpia el cache
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * Obtiene estadísticas del servicio
   */
  getStats() {
    return {
      cacheSize: this.cache.size,
      apiUrl: this.apiUrl,
      cacheTimeout: this.cacheTimeout
    }
  }

  /**
   * Obtiene cursos simulados basados en la estructura real de Neekworld
   */
  getMockNeekworldCourses() {
    return [
      // === CURSOS REALES DE NEEKWORLD (PRIORITARIOS) ===
      
      // Educación y Pedagogía - Cursos Reales
      {
        id: 14,
        title: 'CONSTRUCCIÓN DE INSTRUMENTOS DE EVALUACIÓN',
        description: 'Aprende a construir instrumentos de evaluación efectivos y válidos para el contexto educativo actual.',
        category: 'Educación y Pedagogía',
        instructor: 'Especialista en Evaluación Educativa',
        level: 'Intermedio',
        duration: '40 horas',
        price: 150000,
        url: 'https://neekworld.cl/NW/course/view.php?id=14',
        image: '/img-courses/construccion-de-instrumentos-de-evaluacion.png'
      },
      {
        id: 13,
        title: 'NEUROCIENCIAS APLICADA A LA EDUCACIÓN',
        description: 'Descubre cómo aplicar los conocimientos de neurociencias para mejorar los procesos de enseñanza y aprendizaje.',
        category: 'Educación y Pedagogía',
        instructor: 'Dr. en Neurociencias Educativas',
        level: 'Avanzado',
        duration: '50 horas',
        price: 150000,
        url: 'https://neekworld.cl/NW/course/view.php?id=13',
        image: '/img-courses/neurociencias-aplicada-a-la-educacion.png'
      },
      {
        id: 12,
        title: 'FORMACIÓN DE JEFES UTP Y SUS EQUIPOS TÉCNICOS',
        description: 'Formación especializada para jefes de Unidades Técnico Pedagógicas y sus equipos de trabajo.',
        category: 'Educación y Pedagogía',
        instructor: 'Experto en Gestión Pedagógica',
        level: 'Avanzado',
        duration: '60 horas',
        price: 150000,
        url: 'https://neekworld.cl/NW/course/view.php?id=12',
        image: '/img-courses/formacion-de-jefes-de-utp-y-sus-equipos-tecnicos.png'
      },
      {
        id: 11,
        title: 'Autismo',
        description: 'Comprende las características del autismo y aprende estrategias efectivas de intervención educativa.',
        category: 'Educación y Pedagogía',
        instructor: 'Especialista en Educación Especial',
        level: 'Intermedio',
        duration: '35 horas',
        price: 120000,
        url: 'https://neekworld.cl/NW/course/view.php?id=11',
        image: '/img-courses/autismo.png'
      },
      {
        id: 9,
        title: 'IA para docentes',
        description: 'Aprende a integrar la Inteligencia Artificial en tus prácticas docentes de manera efectiva y ética.',
        category: 'Educación y Pedagogía',
        instructor: 'Especialista en IA Educativa',
        level: 'Principiante',
        duration: '25 horas',
        price: 70000,
        url: 'https://neekworld.cl/NW/course/view.php?id=9',
        image: '/img-courses/ia-para-docentes.png'
      },
      {
        id: 8,
        title: 'Creacion de cursos con metodología ADDIE para docente',
        description: 'Diseña y crea cursos efectivos para la formación docente con metodologías innovadoras.',
        category: 'Educación y Pedagogía',
        instructor: 'Diseñador Instruccional',
        level: 'Intermedio',
        duration: '30 horas',
        price: 80000,
        url: 'https://neekworld.cl/NW/course/view.php?id=8',
        image: '/img-courses/creacion-de-cursos-con-metodologia-addie-para-docentes.png'
      },

      // Tecnología y Herramientas Digitales - Cursos Reales
      {
        id: 10,
        title: 'INTRODUCCIÓN PRÁCTICA A GNU/LINUX',
        description: 'Domina los fundamentos del sistema operativo GNU/Linux con un enfoque práctico y profesional.',
        category: 'Tecnología y Herramientas Digitales',
        instructor: 'Administrador de Sistemas Linux',
        level: 'Intermedio',
        duration: '45 horas',
        price: 150000,
        url: 'https://neekworld.cl/NW/course/view.php?id=10',
        image: '/img-courses/introduccion-practica-gnu-linux.png'
      },
      {
        id: 7,
        title: 'Curso de Excel Básico',
        description: 'Aprende las funciones básicas de Excel para mejorar tu productividad en el trabajo.',
        category: 'Tecnología y Herramientas Digitales',
        instructor: 'Especialista en Office',
        level: 'Principiante',
        duration: '20 horas',
        price: 50000,
        url: 'https://neekworld.cl/NW/course/view.php?id=7',
        image: '/img-courses/curso-de-excel-basico.png'
      },

      // === CURSOS FICTICIOS COMPLEMENTARIOS (SECUNDARIOS) ===

      // Tecnología y Herramientas Digitales - Ficticios
      {
        id: 'nw_comp_001',
        title: 'Desarrollo Web Full Stack con React y Node.js',
        description: 'Conviértete en desarrollador full stack creando aplicaciones web completas y modernas.',
        category: 'Tecnología y Herramientas Digitales',
        instructor: 'Ing. Roberto Vargas',
        level: 'Intermedio',
        duration: '80 horas',
        image: '/img-courses/desarrollo-web-fullstack-con react-y-node.png'
      },
      {
        id: 'nw_comp_002',
        title: 'Inteligencia Artificial y Machine Learning',
        description: 'Explora el mundo de la IA y aprende a crear modelos de machine learning efectivos.',
        category: 'Tecnología y Herramientas Digitales',
        instructor: 'Dr. Elena Gómez',
        level: 'Avanzado',
        duration: '70 horas',
        image: '/img-courses/inteligencia-artificial-y-machine-learning.png'
      },
      {
        id: 'nw_comp_003',
        title: 'Ciberseguridad y Ethical Hacking',
        description: 'Protege sistemas y redes aprendiendo técnicas de seguridad informática y hacking ético.',
        category: 'Tecnología y Herramientas Digitales',
        instructor: 'MSc. Andrés López',
        level: 'Avanzado',
        duration: '65 horas',
        image: '/img-courses/ciberseguridad-y-ethical-hacking.png'
      },
      {
        id: 'nw_comp_004',
        title: 'UX/UI Design para Aplicaciones Web',
        description: 'Diseña experiencias de usuario excepcionales y interfaces atractivas para web.',
        category: 'Tecnología y Herramientas Digitales',
        instructor: 'Dis. Carolina Reyes',
        level: 'Principiante',
        duration: '45 horas',
        image: '/img-courses/ux-ui-design-para-aplicaciones-web.png'
      },

      // Educación y Pedagogía - Ficticios
      {
        id: 'nw_comp_005',
        title: 'Metodologías de Enseñanza Virtual',
        description: 'Aprende las mejores técnicas para enseñar en entornos virtuales modernos.',
        category: 'Educación y Pedagogía',
        instructor: 'Dra. Ana María Rojas',
        level: 'Intermedio',
        duration: '45 horas',
        image: '/img-courses/metodologias-de-enseñanza-virtual.png'
      },
      {
        id: 'nw_comp_006',
        title: 'Psicología del Aprendizaje Digital',
        description: 'Comprende los procesos cognitivos en el aprendizaje digital y presencial.',
        category: 'Educación y Pedagogía',
        instructor: 'Dr. Miguel Torres',
        level: 'Principiante',
        duration: '35 horas',
        image: '/img-courses/psicologia-del-aprendizaje-digital.png'
      },

      // Otras categorías - Ficticios
      {
        id: 'nw_comp_007',
        title: 'Marketing Digital y Redes Sociales',
        description: 'Domina las estrategias de marketing digital y gestión de redes sociales para empresas.',
        category: 'Marketing',
        instructor: 'Mg. Valentina Cruz',
        level: 'Principiante',
        duration: '40 horas',
        image: '/img-courses/marketing-digital-y-redes-sociales.png'
      },
      {
        id: 'nw_comp_008',
        title: 'Fotografía Digital y Edición',
        description: 'Aprende técnicas de fotografía profesional y edición digital con Lightroom y Photoshop.',
        category: 'Fotografía',
        instructor: 'Fotóg. Camilo Sánchez',
        level: 'Principiante',
        duration: '35 horas',
        image: '/img-courses/fotografia-digital-y-edicion.png'
      },
      {
        id: 'nw_comp_009',
        title: 'Emprendimiento e Innovación',
        description: 'Desarrolla tu idea de negocio desde la conceptualización hasta la implementación.',
        category: 'Negocios',
        instructor: 'MBA. Isabella Rodríguez',
        level: 'Intermedio',
        duration: '50 horas',
        image: '/img-courses/emprendimiento-e-innovacion.png'
      }
    ]
  }
}

export default new NeekworldService()
