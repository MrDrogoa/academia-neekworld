// Servicio para gestión de cursos avanzada
import backendService from './backendService'

const API_BASE = '/courses-advanced'

class CourseManagementService {
  // Dashboard y estadísticas
  async getCourseDashboard() {
    try {
      const response = await backendService.get(`${API_BASE}/dashboard`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using local data:', error.message)
      // Fallback con datos locales
      return this.getLocalDashboardData()
    }
  }

  // CRUD de cursos
  async createCourse(courseData) {
    try {
      const response = await backendService.post(`${API_BASE}/advanced`, courseData)
      
      // Guardar localmente también
      this.saveCourseLocally(response.data)
      
      return response.data
    } catch (error) {
      console.warn('Backend not available, saving locally:', error.message)
      return this.createCourseLocally(courseData)
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      const response = await backendService.put(`${API_BASE}/advanced/${courseId}`, courseData)
      
      // Actualizar localmente también
      this.updateCourseLocally(courseId, courseData)
      
      return response.data
    } catch (error) {
      console.warn('Backend not available, updating locally:', error.message)
      return this.updateCourseLocally(courseId, courseData)
    }
  }

  async deleteCourse(courseId) {
    try {
      await backendService.delete(`${API_BASE}/advanced/${courseId}`)
      
      // Eliminar localmente también
      this.deleteCourseLocally(courseId)
      
      return { success: true }
    } catch (error) {
      console.warn('Backend not available, deleting locally:', error.message)
      return this.deleteCourseLocally(courseId)
    }
  }

  async getCourseById(courseId) {
    try {
      const response = await backendService.get(`${API_BASE}/advanced/${courseId}`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, getting local data:', error.message)
      return this.getCourseLocallyById(courseId)
    }
  }

  // Analytics
  async getCourseAnalytics(courseId) {
    try {
      const response = await backendService.get(`${API_BASE}/analytics/${courseId}`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using local analytics:', error.message)
      return this.getLocalAnalytics(courseId)
    }
  }

  // Gestión de estudiantes
  async getCourseStudents(courseId) {
    try {
      const response = await backendService.get(`${API_BASE}/students/${courseId}`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using local students:', error.message)
      return this.getLocalStudents(courseId)
    }
  }

  async addStudentToCourse(courseId, studentData) {
    try {
      const response = await backendService.post(`${API_BASE}/students/${courseId}`, studentData)
      
      // Actualizar localmente
      this.addStudentLocallyToCourse(courseId, studentData)
      
      return response.data
    } catch (error) {
      console.warn('Backend not available, adding student locally:', error.message)
      return this.addStudentLocallyToCourse(courseId, studentData)
    }
  }

  async removeStudentFromCourse(courseId, studentId) {
    try {
      await backendService.delete(`${API_BASE}/students/${courseId}/${studentId}`)
      
      // Remover localmente
      this.removeStudentLocallyFromCourse(courseId, studentId)
      
      return { success: true }
    } catch (error) {
      console.warn('Backend not available, removing student locally:', error.message)
      return this.removeStudentLocallyFromCourse(courseId, studentId)
    }
  }

  // Gestión de módulos
  async addCourseModule(courseId, moduleData) {
    try {
      const response = await backendService.post(`${API_BASE}/modules/${courseId}`, moduleData)
      
      // Actualizar localmente
      this.addModuleLocally(courseId, moduleData)
      
      return response.data
    } catch (error) {
      console.warn('Backend not available, adding module locally:', error.message)
      return this.addModuleLocally(courseId, moduleData)
    }
  }

  async updateCourseModule(courseId, moduleId, moduleData) {
    try {
      const response = await backendService.put(`${API_BASE}/modules/${courseId}/${moduleId}`, moduleData)
      
      // Actualizar localmente
      this.updateModuleLocally(courseId, moduleId, moduleData)
      
      return response.data
    } catch (error) {
      console.warn('Backend not available, updating module locally:', error.message)
      return this.updateModuleLocally(courseId, moduleId, moduleData)
    }
  }

  async deleteCourseModule(courseId, moduleId) {
    try {
      await backendService.delete(`${API_BASE}/modules/${courseId}/${moduleId}`)
      
      // Eliminar localmente
      this.deleteModuleLocally(courseId, moduleId)
      
      return { success: true }
    } catch (error) {
      console.warn('Backend not available, deleting module locally:', error.message)
      return this.deleteModuleLocally(courseId, moduleId)
    }
  }

  // Moderación
  async moderateCourse(courseId, moderationData) {
    try {
      const response = await backendService.post(`${API_BASE}/moderate/${courseId}`, moderationData)
      
      // Actualizar estado localmente
      this.updateCourseStatusLocally(courseId, moderationData.status)
      
      return response.data
    } catch (error) {
      console.warn('Backend not available, moderating locally:', error.message)
      return this.moderateCourseLocally(courseId, moderationData)
    }
  }

  // ===== MÉTODOS LOCALES (FALLBACK) =====

  getLocalDashboardData() {
    const courses = this.getLocalCourses()
    const summary = this.calculateSummary(courses)
    
    return { courses, summary }
  }

  getLocalCourses() {
    const stored = localStorage.getItem('advanced_courses')
    if (stored) {
      return JSON.parse(stored)
    }
    
    // Datos de ejemplo si no hay nada almacenado
    const defaultCourses = [
      {
        id: 'course-1',
        title: 'Curso de Vue.js Avanzado',
        description: 'Aprende Vue.js desde conceptos básicos hasta avanzados',
        category: 'programming',
        price: 89990,
        thumbnail: '/default-course.jpg',
        status: 'approved',
        instructorId: 'instructor-1',
        instructorName: 'Juan Pérez',
        createdAt: new Date().toISOString(),
        stats: {
          studentsCount: 45,
          completionRate: 78,
          totalRevenue: 4049550,
          averageRating: 4.5
        },
        modules: []
      },
      {
        id: 'course-2',
        title: 'Diseño UX/UI Profesional',
        description: 'Domina el diseño de experiencias digitales',
        category: 'design',
        price: 79990,
        thumbnail: '/default-course.jpg',
        status: 'pending',
        instructorId: 'instructor-2',
        instructorName: 'María González',
        createdAt: new Date().toISOString(),
        stats: {
          studentsCount: 23,
          completionRate: 65,
          totalRevenue: 1839770,
          averageRating: 4.3
        },
        modules: []
      }
    ]
    
    localStorage.setItem('advanced_courses', JSON.stringify(defaultCourses))
    return defaultCourses
  }

  saveCourseLocally(course) {
    const courses = this.getLocalCourses()
    courses.push(course)
    localStorage.setItem('advanced_courses', JSON.stringify(courses))
  }

  createCourseLocally(courseData) {
    const course = {
      id: `course-${Date.now()}`,
      ...courseData,
      createdAt: new Date().toISOString(),
      status: courseData.status || 'pending',
      stats: {
        studentsCount: 0,
        completionRate: 0,
        totalRevenue: 0,
        averageRating: 0
      },
      modules: []
    }
    
    this.saveCourseLocally(course)
    return course
  }

  updateCourseLocally(courseId, courseData) {
    const courses = this.getLocalCourses()
    const index = courses.findIndex(c => c.id === courseId)
    
    if (index !== -1) {
      courses[index] = { ...courses[index], ...courseData }
      localStorage.setItem('advanced_courses', JSON.stringify(courses))
      return courses[index]
    }
    
    throw new Error('Course not found')
  }

  deleteCourseLocally(courseId) {
    const courses = this.getLocalCourses()
    const filtered = courses.filter(c => c.id !== courseId)
    localStorage.setItem('advanced_courses', JSON.stringify(filtered))
    return { success: true }
  }

  getCourseLocallyById(courseId) {
    const courses = this.getLocalCourses()
    return courses.find(c => c.id === courseId)
  }

  getLocalAnalytics(courseId) {
    const course = this.getCourseLocallyById(courseId)
    if (!course) throw new Error('Course not found')
    
    // Generar analytics simulados
    return {
      courseId,
      title: course.title,
      overview: {
        totalStudents: course.stats.studentsCount,
        completionRate: course.stats.completionRate,
        averageRating: course.stats.averageRating,
        totalRevenue: course.stats.totalRevenue
      },
      studentsOverTime: this.generateStudentsOverTime(),
      completionRates: this.generateCompletionRates(),
      revenueOverTime: this.generateRevenueOverTime(),
      topModules: this.generateTopModules()
    }
  }

  getLocalStudents() {
    // Simular estudiantes del curso
    return [
      {
        id: 'student-1',
        name: 'Ana Silva',
        email: 'ana@email.com',
        enrolledAt: new Date().toISOString(),
        progress: 75,
        lastAccess: new Date().toISOString()
      },
      {
        id: 'student-2',
        name: 'Carlos Ruiz',
        email: 'carlos@email.com',
        enrolledAt: new Date().toISOString(),
        progress: 45,
        lastAccess: new Date().toISOString()
      }
    ]
  }

  addStudentLocallyToCourse(courseId, studentData) {
    // En implementación real, esto manejaría la relación estudiante-curso
    return {
      id: `student-${Date.now()}`,
      ...studentData,
      enrolledAt: new Date().toISOString(),
      progress: 0
    }
  }

  removeStudentLocallyFromCourse() {
    // En implementación real, esto eliminaría la relación estudiante-curso
    return { success: true }
  }

  addModuleLocally(courseId, moduleData) {
    const course = this.getCourseLocallyById(courseId)
    if (!course) throw new Error('Course not found')
    
    const module = {
      id: `module-${Date.now()}`,
      ...moduleData,
      createdAt: new Date().toISOString()
    }
    
    course.modules = course.modules || []
    course.modules.push(module)
    
    this.updateCourseLocally(courseId, course)
    return module
  }

  updateModuleLocally(courseId, moduleId, moduleData) {
    const course = this.getCourseLocallyById(courseId)
    if (!course) throw new Error('Course not found')
    
    const moduleIndex = course.modules.findIndex(m => m.id === moduleId)
    if (moduleIndex === -1) throw new Error('Module not found')
    
    course.modules[moduleIndex] = { ...course.modules[moduleIndex], ...moduleData }
    this.updateCourseLocally(courseId, course)
    
    return course.modules[moduleIndex]
  }

  deleteModuleLocally(courseId, moduleId) {
    const course = this.getCourseLocallyById(courseId)
    if (!course) throw new Error('Course not found')
    
    course.modules = course.modules.filter(m => m.id !== moduleId)
    this.updateCourseLocally(courseId, course)
    
    return { success: true }
  }

  moderateCourseLocally(courseId, moderationData) {
    return this.updateCourseLocally(courseId, { 
      status: moderationData.status,
      moderationNotes: moderationData.notes,
      moderatedAt: new Date().toISOString()
    })
  }

  updateCourseStatusLocally(courseId, status) {
    return this.updateCourseLocally(courseId, { status })
  }

  calculateSummary(courses) {
    return {
      totalCourses: courses.length,
      totalStudents: courses.reduce((sum, course) => sum + (course.stats?.studentsCount || 0), 0),
      totalRevenue: courses.reduce((sum, course) => sum + (course.stats?.totalRevenue || 0), 0),
      avgCompletionRate: Math.round(
        courses.reduce((sum, course) => sum + (course.stats?.completionRate || 0), 0) / 
        (courses.length || 1)
      )
    }
  }

  // Métodos para generar datos simulados de analytics
  generateStudentsOverTime() {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      data.push({
        date: date.toISOString().slice(0, 7), // YYYY-MM
        count: Math.floor(Math.random() * 20) + 5
      })
    }
    return data
  }

  generateCompletionRates() {
    return [
      { module: 'Introducción', rate: 95 },
      { module: 'Conceptos Básicos', rate: 87 },
      { module: 'Práctica', rate: 72 },
      { module: 'Proyecto Final', rate: 58 }
    ]
  }

  generateRevenueOverTime() {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      data.push({
        date: date.toISOString().slice(0, 7),
        amount: Math.floor(Math.random() * 500000) + 100000
      })
    }
    return data
  }

  generateTopModules() {
    return [
      { name: 'Introducción a Vue.js', views: 450, rating: 4.8 },
      { name: 'Componentes Avanzados', views: 380, rating: 4.6 },
      { name: 'Estado y Vuex', views: 320, rating: 4.4 },
      { name: 'Routing y Navegación', views: 290, rating: 4.5 }
    ]
  }
}

export default new CourseManagementService()
