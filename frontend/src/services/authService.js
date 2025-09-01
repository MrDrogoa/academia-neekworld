// Servicio de autenticación integrado con Moodle
import { reactive } from 'vue'
import moodleIntegrationService from './moodleIntegrationService'

class AuthService {
  constructor() {
    this.user = reactive({
      isAuthenticated: false,
      userData: null,
      moodleData: null
    })
  }

  /**
   * Registrar usuario (crear en plataforma y Moodle)
   */
  async register(userData) {
    try {
      // 1. Crear usuario en la plataforma (backend)
      const academyResult = await this.createUserInAcademy(userData)
      
      if (!academyResult.success) {
        throw new Error(academyResult.message)
      }

      // 2. Crear usuario en Moodle automáticamente
      const moodleResult = await moodleIntegrationService.createUserInMoodle({
        ...userData,
        id: academyResult.userId
      })

      if (!moodleResult.success) {
        console.warn('Usuario creado en Academia pero falló en Moodle:', moodleResult.message)
        // No fallar completamente, continuar con el registro
      }

      return {
        success: true,
        userId: academyResult.userId,
        moodleData: moodleResult.success ? {
          moodleUserId: moodleResult.moodleUserId,
          username: moodleResult.username,
          tempPassword: moodleResult.tempPassword
        } : null,
        message: 'Usuario registrado exitosamente',
        moodleWarning: !moodleResult.success ? 'Usuario creado en Academia pero no se pudo sincronizar con Moodle' : null
      }

    } catch (error) {
      console.error('Error in registration:', error)
      return {
        success: false,
        message: 'Error durante el registro: ' + error.message
      }
    }
  }

  /**
   * Login del usuario (sincronizar con Moodle)
   */
  async login(credentials) {
    try {
      // 1. Autenticar en la plataforma
      const academyResult = await this.authenticateInAcademy(credentials)
      
      if (!academyResult.success) {
        throw new Error(academyResult.message)
      }

      // 2. Sincronizar login con Moodle (SSO)
      const moodleResult = await moodleIntegrationService.loginToMoodle(academyResult.userData)

      // 3. Actualizar estado del usuario
      this.user.isAuthenticated = true
      this.user.userData = academyResult.userData
      this.user.moodleData = moodleResult.success ? {
        ssoUrl: moodleResult.ssoUrl,
        moodleUserId: moodleResult.moodleUserId
      } : null

      // 4. Guardar en localStorage
      localStorage.setItem('userSession', JSON.stringify({
        userData: academyResult.userData,
        moodleData: this.user.moodleData,
        loginTime: new Date().toISOString()
      }))

      return {
        success: true,
        userData: academyResult.userData,
        moodleData: this.user.moodleData,
        message: 'Login exitoso',
        moodleWarning: !moodleResult.success ? 'Autenticado en Academia pero no se pudo sincronizar con Moodle' : null
      }

    } catch (error) {
      console.error('Error in login:', error)
      return {
        success: false,
        message: 'Error durante el login: ' + error.message
      }
    }
  }

  /**
   * Logout del usuario
   */
  async logout() {
    try {
      // Limpiar estado local
      this.user.isAuthenticated = false
      this.user.userData = null
      this.user.moodleData = null

      // Limpiar localStorage
      localStorage.removeItem('userSession')
      localStorage.removeItem('moodleEnrollments')
      localStorage.removeItem('moodleUserMappings')

      return {
        success: true,
        message: 'Logout exitoso'
      }

    } catch (error) {
      console.error('Error in logout:', error)
      return {
        success: false,
        message: 'Error durante el logout'
      }
    }
  }

  /**
   * Restaurar sesión desde localStorage
   */
  restoreSession() {
    try {
      const session = JSON.parse(localStorage.getItem('userSession') || 'null')
      
      if (session && session.userData) {
        this.user.isAuthenticated = true
        this.user.userData = session.userData
        this.user.moodleData = session.moodleData

        return true
      }

      return false
    } catch (error) {
      console.error('Error restoring session:', error)
      return false
    }
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    return {
      isAuthenticated: this.user.isAuthenticated,
      userData: this.user.userData,
      moodleData: this.user.moodleData
    }
  }

  /**
   * Abrir Moodle con SSO
   */
  openMoodleSSO() {
    if (this.user.moodleData && this.user.moodleData.ssoUrl) {
      window.open(this.user.moodleData.ssoUrl, '_blank')
      return true
    }

    // Fallback: abrir Moodle normal
    window.open('https://neekworld.cl/NW/', '_blank')
    return false
  }

  /**
   * Sincronizar progreso desde Moodle
   */
  async syncProgressFromMoodle(courseId = null) {
    if (!this.user.isAuthenticated) {
      return { success: false, message: 'Usuario no autenticado' }
    }

    try {
      const result = await moodleIntegrationService.getCourseProgressFromMoodle(
        this.user.userData.id,
        courseId
      )

      return result
    } catch (error) {
      console.error('Error syncing progress from Moodle:', error)
      return {
        success: false,
        message: 'Error al sincronizar progreso desde Moodle'
      }
    }
  }

  /**
   * Sincronizar calificaciones desde Moodle
   */
  async syncGradesFromMoodle(courseId = null) {
    if (!this.user.isAuthenticated) {
      return { success: false, message: 'Usuario no autenticado' }
    }

    try {
      const result = await moodleIntegrationService.getUserGradesFromMoodle(
        this.user.userData.id,
        courseId
      )

      return result
    } catch (error) {
      console.error('Error syncing grades from Moodle:', error)
      return {
        success: false,
        message: 'Error al sincronizar calificaciones desde Moodle'
      }
    }
  }

  // =====================================================
  // FUNCIONES AUXILIARES (Mock - conectar con backend real)
  // =====================================================

  /**
   * Crear usuario en la plataforma Academia
   */
  async createUserInAcademy(userData) {
    try {
      // TODO: Implementar llamada real al backend
      // Simulación por ahora
      const userId = 'user_' + Date.now()
      
      return {
        success: true,
        userId: userId,
        userData: {
          id: userId,
          email: userData.email,
          name: userData.name || `${userData.firstName} ${userData.lastName}`,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || 'student',
          createdAt: new Date().toISOString()
        }
      }

    } catch (error) {
      return {
        success: false,
        message: 'Error creando usuario en Academia: ' + error.message
      }
    }
  }

  /**
   * Autenticar usuario en la plataforma Academia
   */
  async authenticateInAcademy(credentials) {
    try {
      // TODO: Implementar llamada real al backend
      // Simulación por ahora
      if (credentials.email && credentials.password) {
        return {
          success: true,
          userData: {
            id: 'user_demo_' + Date.now(),
            email: credentials.email,
            name: 'Usuario Demo',
            firstName: 'Usuario',
            lastName: 'Demo',
            role: 'student',
            lastLogin: new Date().toISOString()
          }
        }
      }

      throw new Error('Credenciales inválidas')

    } catch (error) {
      return {
        success: false,
        message: 'Error de autenticación: ' + error.message
      }
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    return this.user.isAuthenticated
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role) {
    if (!this.isAuthenticated()) {
      return false
    }
    return this.user.userData && this.user.userData.role === role
  }

  /**
   * Verificar si el usuario es estudiante
   */
  isStudent() {
    return this.hasRole('student')
  }

  /**
   * Obtener el rol del usuario actual
   */
  getUserRole() {
    if (!this.isAuthenticated()) {
      return null
    }
    return this.user.userData ? this.user.userData.role : null
  }
}


// Exportar instancia singleton
export default new AuthService()
