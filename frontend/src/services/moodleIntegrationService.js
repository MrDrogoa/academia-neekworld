// Servicio completo de integración bidireccional con Moodle
import axios from 'axios'

class MoodleIntegrationService {
  /**
   * Obtener lista de cursos desde Moodle QA
   */
  async getCoursesFromMoodle() {
    try {
      const response = await this.callMoodleAPI('core_course_get_courses', {})
      if (response.data && Array.isArray(response.data)) {
        // Filtrar cursos visibles y con nombre
        return {
          success: true,
          courses: response.data.filter(c => c.visible && c.fullname)
        }
      }
      throw new Error('No se pudo obtener la lista de cursos')
    } catch (error) {
      console.error('Error obteniendo cursos de Moodle QA:', error)
      return {
        success: false,
        message: 'Error al obtener cursos de Moodle QA: ' + error.message
      }
    }
  }
  constructor() {
    this.config = {
      baseUrl: 'https://neekworld.cl/QA', // Instancia QA
      wsEndpoint: '/webservice/rest/server.php',
      token: process.env.VUE_APP_MOODLE_TOKEN || 'TOKEN_PENDIENTE',
      defaultPassword: 'AcademiaTemp2024!'
    }
  }

  // =====================================================
  // 1. GESTIÓN DE USUARIOS
  // =====================================================

  /**
   * Crear usuario en Moodle cuando se registra en la plataforma
   */
  async createUserInMoodle(userData) {
    try {
      const moodleUser = {
        username: userData.email.split('@')[0], // Usar parte del email como username
        password: this.config.defaultPassword,
        firstname: userData.firstName || userData.name?.split(' ')[0] || 'Usuario',
        lastname: userData.lastName || userData.name?.split(' ')[1] || 'Academia',
        email: userData.email,
        auth: 'manual',
        lang: 'es',
        timezone: 'America/Santiago',
        description: `Usuario creado desde Academia - ${new Date().toLocaleDateString()}`,
        city: userData.city || 'Santiago',
        country: 'CL'
      }

      const response = await this.callMoodleAPI('core_user_create_users', {
        users: [moodleUser]
      })

      if (response.data && response.data.length > 0) {
        const createdUser = response.data[0]
        
        // Guardar mapeo local usuario Academia <-> Moodle
        await this.saveMoodleUserMapping(userData.id, createdUser.id, userData.email)

        return {
          success: true,
          moodleUserId: createdUser.id,
          username: moodleUser.username,
          tempPassword: this.config.defaultPassword,
          message: 'Usuario creado exitosamente en Moodle'
        }
      }

      throw new Error('No se pudo crear el usuario en Moodle')

    } catch (error) {
      console.error('Error creating user in Moodle:', error)
      return {
        success: false,
        message: 'Error al crear usuario en Moodle: ' + error.message
      }
    }
  }

  /**
   * Sincronizar login con Moodle (Single Sign-On)
   */
  async loginToMoodle(userData) {
    try {
      // Verificar si el usuario existe en Moodle
      const moodleUser = await this.getMoodleUserByEmail(userData.email)
      
      if (!moodleUser.success) {
        // Si no existe, crearlo
        const createResult = await this.createUserInMoodle(userData)
        if (!createResult.success) {
          throw new Error('No se pudo crear usuario en Moodle')
        }
      }

      // Generar token de login para SSO
      const loginToken = await this.generateMoodleLoginToken()
      
      if (loginToken.success) {
        // Construir URL de login automático
        const ssoUrl = `${this.config.baseUrl}/login/token.php?token=${loginToken.token}&service=moodle_mobile_app`
        
        return {
          success: true,
          ssoUrl: ssoUrl,
          moodleUserId: moodleUser.moodleUserId,
          message: 'Login sincronizado con Moodle'
        }
      }

      throw new Error('No se pudo generar token de login')

    } catch (error) {
      console.error('Error syncing login with Moodle:', error)
      return {
        success: false,
        message: 'Error al sincronizar login con Moodle: ' + error.message
      }
    }
  }

  // =====================================================
  // 2. GESTIÓN DE CURSOS
  // =====================================================

  /**
   * Inscribir usuario en curso cuando compra
   */
  async enrollUserInCourse(userId, courseId, roleid = 5) {
    try {
      // Obtener mapeo de usuario Academia -> Moodle
      const userMapping = await this.getMoodleUserMapping(userId)
      if (!userMapping.success) {
        throw new Error('Usuario no encontrado en Moodle')
      }

      // Obtener mapeo de curso Academia -> Moodle
      const courseMapping = await this.getMoodleCourseMapping(courseId)
      if (!courseMapping.success) {
        throw new Error('Curso no encontrado en Moodle')
      }

      // Inscribir en Moodle
      const response = await this.callMoodleAPI('enrol_manual_enrol_users', {
        enrolments: [{
          roleid: roleid, // 5 = Student role
          userid: userMapping.moodleUserId,
          courseid: courseMapping.moodleCourseId,
          timestart: Math.floor(Date.now() / 1000),
          timeend: 0, // Sin fecha de fin
          suspend: 0 // Usuario activo
        }]
      })

      // Registrar inscripción en base de datos local
      await this.saveEnrollmentRecord(userId, courseId, userMapping.moodleUserId, courseMapping.moodleCourseId)

      return {
        success: true,
        enrollmentId: response.data?.[0]?.id,
        message: 'Usuario inscrito exitosamente en el curso'
      }

    } catch (error) {
      console.error('Error enrolling user in course:', error)
      return {
        success: false,
        message: 'Error al inscribir usuario en curso: ' + error.message
      }
    }
  }

  /**
   * Sincronizar curso desde Moodle a la plataforma
   */
  async syncCourseFromMoodle(moodleCourseId) {
    try {
      // Obtener información del curso desde Moodle
      const courseData = await this.callMoodleAPI('core_course_get_courses', {
        options: {
          ids: [moodleCourseId]
        }
      })

      if (!courseData.data || courseData.data.length === 0) {
        throw new Error('Curso no encontrado en Moodle')
      }

      const moodleCourse = courseData.data[0]

      // Obtener categoría del curso
      const categoryData = await this.callMoodleAPI('core_course_get_categories', {
        criteria: [
          {
            key: 'id',
            value: moodleCourse.categoryid
          }
        ]
      })

      const category = categoryData.data?.[0]

      // Crear objeto curso para la plataforma
      const academyCourse = {
        id: `moodle_${moodleCourseId}`,
        title: moodleCourse.fullname,
        shortName: moodleCourse.shortname,
        description: moodleCourse.summary || 'Curso importado desde Moodle',
        category: category?.name || 'General',
        categoryId: moodleCourse.categoryid,
        moodleCourseId: moodleCourseId,
        startDate: new Date(moodleCourse.startdate * 1000).toISOString(),
        endDate: moodleCourse.enddate ? new Date(moodleCourse.enddate * 1000).toISOString() : null,
        visible: moodleCourse.visible === 1,
        format: moodleCourse.format,
        enrolledUsers: moodleCourse.enrolledusercount || 0,
        syncedAt: new Date().toISOString()
      }

      // Guardar en base de datos local (backend)
      await this.saveCourseToDatabase(academyCourse)

      return {
        success: true,
        course: academyCourse,
        message: 'Curso sincronizado exitosamente desde Moodle'
      }

    } catch (error) {
      console.error('Error syncing course from Moodle:', error)
      return {
        success: false,
        message: 'Error al sincronizar curso desde Moodle: ' + error.message
      }
    }
  }

  // =====================================================
  // 3. GESTIÓN DE CALIFICACIONES Y PROGRESO
  // =====================================================

  /**
   * Obtener calificaciones del usuario desde Moodle
   */
  async getUserGradesFromMoodle(userId, courseId = null) {
    try {
      const userMapping = await this.getMoodleUserMapping(userId)
      if (!userMapping.success) {
        throw new Error('Usuario no encontrado en Moodle')
      }

      let courses = []
      if (courseId) {
        const courseMapping = await this.getMoodleCourseMapping(courseId)
        if (courseMapping.success) {
          courses = [courseMapping.moodleCourseId]
        }
      }

      // Obtener calificaciones desde Moodle
      const gradesData = await this.callMoodleAPI('gradereport_user_get_grade_items', {
        userid: userMapping.moodleUserId,
        courseid: courses.length > 0 ? courses[0] : 0 // 0 = todos los cursos
      })

      const processedGrades = this.processGradesData(gradesData.data)

      // Guardar calificaciones en base de datos local
      await this.saveGradesToDatabase(userId, processedGrades)

      return {
        success: true,
        grades: processedGrades,
        message: 'Calificaciones sincronizadas exitosamente'
      }

    } catch (error) {
      console.error('Error getting user grades from Moodle:', error)
      return {
        success: false,
        message: 'Error al obtener calificaciones desde Moodle: ' + error.message
      }
    }
  }

  /**
   * Obtener progreso del curso desde Moodle
   */
  async getCourseProgressFromMoodle(userId, courseId) {
    try {
      const userMapping = await this.getMoodleUserMapping(userId)
      const courseMapping = await this.getMoodleCourseMapping(courseId)

      if (!userMapping.success || !courseMapping.success) {
        throw new Error('Usuario o curso no encontrado en Moodle')
      }

      // Obtener progreso de completitud del curso
      const progressData = await this.callMoodleAPI('core_completion_get_course_completion_status', {
        courseid: courseMapping.moodleCourseId,
        userid: userMapping.moodleUserId
      })

      const completionData = progressData.data?.completions || []
      const totalActivities = completionData.length
      const completedActivities = completionData.filter(comp => comp.state === 1).length
      const progressPercentage = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0

      const progressInfo = {
        userId: userId,
        courseId: courseId,
        totalActivities: totalActivities,
        completedActivities: completedActivities,
        progressPercentage: progressPercentage,
        isCompleted: progressPercentage === 100,
        lastAccess: progressData.data?.lastaccess ? new Date(progressData.data.lastaccess * 1000).toISOString() : null,
        syncedAt: new Date().toISOString()
      }

      // Guardar progreso en base de datos local
      await this.saveProgressToDatabase(progressInfo)

      return {
        success: true,
        progress: progressInfo,
        message: 'Progreso sincronizado exitosamente'
      }

    } catch (error) {
      console.error('Error getting course progress from Moodle:', error)
      return {
        success: false,
        message: 'Error al obtener progreso desde Moodle: ' + error.message
      }
    }
  }

  // =====================================================
  // 4. FUNCIONES AUXILIARES
  // =====================================================

  /**
   * Llamada genérica a la API de Moodle
   */
  async callMoodleAPI(wsfunction, params = {}) {
    try {
      const data = new URLSearchParams({
        wstoken: this.config.token,
        wsfunction: wsfunction,
        moodlewsrestformat: 'json',
        ...params
      })

      const response = await axios.post(
        `${this.config.baseUrl}${this.config.wsEndpoint}`,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )

      if (response.data.exception) {
        throw new Error(response.data.message)
      }

      return {
        success: true,
        data: response.data
      }

    } catch (error) {
      console.error('Moodle API Error:', error)
      throw error
    }
  }

  /**
   * Obtener usuario de Moodle por email
   */
  async getMoodleUserByEmail(email) {
    try {
      const response = await this.callMoodleAPI('core_user_get_users', {
        criteria: [
          {
            key: 'email',
            value: email
          }
        ]
      })

      if (response.data.users && response.data.users.length > 0) {
        return {
          success: true,
          moodleUserId: response.data.users[0].id,
          userData: response.data.users[0]
        }
      }

      return {
        success: false,
        message: 'Usuario no encontrado en Moodle'
      }

    } catch (error) {
      return {
        success: false,
        message: 'Error al buscar usuario en Moodle: ' + error.message
      }
    }
  }

  /**
   * Procesar datos de calificaciones de Moodle
   */
  processGradesData(gradesData) {
    if (!gradesData.usergrades) return []

    return gradesData.usergrades.map(usergrade => ({
      courseName: usergrade.coursename,
      items: usergrade.gradeitems.map(item => ({
        id: item.id,
        itemname: item.itemname,
        itemtype: item.itemtype,
        graderaw: item.graderaw,
        gradeformatted: item.gradeformatted,
        grademin: item.grademin,
        grademax: item.grademax,
        feedback: item.feedback
      }))
    }))
  }

  // =====================================================
  // 5. INTEGRACIONES CON BASE DE DATOS LOCAL
  // =====================================================

  /**
   * Guardar mapeo usuario Academia <-> Moodle
   */
  async saveMoodleUserMapping(academyUserId, moodleUserId, email) {
    try {
      const mapping = {
        academyUserId: academyUserId,
        moodleUserId: moodleUserId,
        email: email,
        createdAt: new Date().toISOString()
      }

      // Guardar en localStorage temporalmente
      const mappings = JSON.parse(localStorage.getItem('moodleUserMappings') || '[]')
      mappings.push(mapping)
      localStorage.setItem('moodleUserMappings', JSON.stringify(mappings))

      // TODO: Enviar al backend para guardar en base de datos
      // await this.saveToBackend('/api/moodle/user-mappings', mapping)

      return { success: true }
    } catch (error) {
      console.error('Error saving user mapping:', error)
      return { success: false }
    }
  }

  /**
   * Obtener mapeo de usuario
   */
  async getMoodleUserMapping(academyUserId) {
    try {
      const mappings = JSON.parse(localStorage.getItem('moodleUserMappings') || '[]')
      const mapping = mappings.find(m => m.academyUserId === academyUserId)

      if (mapping) {
        return {
          success: true,
          moodleUserId: mapping.moodleUserId,
          email: mapping.email
        }
      }

      return { success: false, message: 'Mapeo no encontrado' }
    } catch (error) {
      return { success: false, message: 'Error al obtener mapeo' }
    }
  }

  /**
   * Obtener mapeo de curso
   */
  async getMoodleCourseMapping(academyCourseId) {
    try {
      // Por ahora, mapeo simple basado en ID
      // TODO: Implementar mapeo real desde base de datos
      const courseId = academyCourseId.replace('course_', '')
      const moodleCourseId = parseInt(courseId)

      return {
        success: true,
        moodleCourseId: moodleCourseId
      }
    } catch (error) {
      return { success: false, message: 'Error al obtener mapeo de curso' }
    }
  }

  /**
   * Guardar registro de inscripción
   */
  async saveEnrollmentRecord(userId, courseId, moodleUserId, moodleCourseId) {
    try {
      const enrollment = {
        userId: userId,
        courseId: courseId,
        moodleUserId: moodleUserId,
        moodleCourseId: moodleCourseId,
        enrolledAt: new Date().toISOString(),
        status: 'active'
      }

      // Guardar en localStorage temporalmente
      const enrollments = JSON.parse(localStorage.getItem('moodleEnrollments') || '[]')
      enrollments.push(enrollment)
      localStorage.setItem('moodleEnrollments', JSON.stringify(enrollments))

      return { success: true }
    } catch (error) {
      console.error('Error saving enrollment record:', error)
      return { success: false }
    }
  }

  /**
   * Guardar curso en base de datos
   */
  async saveCourseToDatabase(courseData) {
    try {
      // TODO: Implementar llamada al backend
      console.log('Saving course to database:', courseData)
      return { success: true }
    } catch (error) {
      console.error('Error saving course to database:', error)
      return { success: false }
    }
  }

  /**
   * Guardar calificaciones en base de datos
   */
  async saveGradesToDatabase(userId, grades) {
    try {
      // TODO: Implementar llamada al backend
      console.log('Saving grades to database:', { userId, grades })
      return { success: true }
    } catch (error) {
      console.error('Error saving grades to database:', error)
      return { success: false }
    }
  }

  /**
   * Guardar progreso en base de datos
   */
  async saveProgressToDatabase(progressData) {
    try {
      // TODO: Implementar llamada al backend
      console.log('Saving progress to database:', progressData)
      return { success: true }
    } catch (error) {
      console.error('Error saving progress to database:', error)
      return { success: false }
    }
  }

  /**
   * Generar token de login para SSO
   */
  async generateMoodleLoginToken() {
    try {
      // TODO: Implementar generación de token SSO
      // Esto requiere configuración adicional en Moodle
      return {
        success: true,
        token: 'temp_sso_token_' + Date.now()
      }
    } catch (error) {
      return { success: false, message: 'Error generando token SSO' }
    }
  }
}

// Exportar instancia singleton
export default new MoodleIntegrationService()
