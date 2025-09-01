// Servicio para gestión del carrito de compras
import { reactive } from 'vue'
import moodleIntegrationService from './moodleIntegrationService'
import authService from './authService'

// Configuración de Moodle (usar variables de entorno en producción)
const MOODLE_CONFIG = {
  baseUrl: 'https://neekworld.cl/NW',
  wsEndpoint: '/webservice/rest/server.php',
  // Token se configurará después de habilitar servicios web
  token: process.env.VUE_APP_MOODLE_TOKEN || 'TOKEN_PENDIENTE'
}

class CartService {
  constructor() {
    this.cart = reactive({
      items: [],
      total: 0,
      itemCount: 0
    })
    
    // Cargar carrito desde localStorage al inicializar
    this.loadCartFromStorage()
  }

  // Agregar curso al carrito
  addCourse(course) {
    // Verificar si el curso ya está en el carrito
    const existingItem = this.cart.items.find(item => item.id === course.id)
    
    if (existingItem) {
      // Si ya existe, no agregar duplicados
      return {
        success: false,
        message: 'Este curso ya está en tu carrito'
      }
    }

    // Agregar nuevo item al carrito
    const cartItem = {
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price || 0,
      originalPrice: course.originalPrice || course.price,
      discount: course.discount || 0,
      thumbnail: course.thumbnail,
      instructor: course.instructor,
      duration: course.duration,
      category: course.category,
      addedAt: new Date().toISOString()
    }

    this.cart.items.push(cartItem)
    this.updateCartTotals()
    this.saveCartToStorage()

    return {
      success: true,
      message: 'Curso agregado al carrito exitosamente'
    }
  }

  // Remover curso del carrito
  removeCourse(courseId) {
    const index = this.cart.items.findIndex(item => item.id === courseId)
    
    if (index !== -1) {
      this.cart.items.splice(index, 1)
      this.updateCartTotals()
      this.saveCartToStorage()
      
      return {
        success: true,
        message: 'Curso removido del carrito'
      }
    }

    return {
      success: false,
      message: 'Curso no encontrado en el carrito'
    }
  }

  // Limpiar carrito completo
  clearCart() {
    this.cart.items = []
    this.updateCartTotals()
    this.saveCartToStorage()
  }

  // Obtener items del carrito
  getCartItems() {
    return this.cart.items
  }

  // Obtener total del carrito
  getCartTotal() {
    return this.cart.total
  }

  // Obtener cantidad de items
  getItemCount() {
    return this.cart.itemCount
  }

  // Verificar si un curso está en el carrito
  isInCart(courseId) {
    return this.cart.items.some(item => item.id === courseId)
  }

  // Calcular descuentos aplicables
  calculateDiscounts() {
    let totalDiscount = 0
    let discountDetails = []

    // Descuento por cantidad de cursos
    if (this.cart.items.length >= 3) {
      const quantityDiscount = this.cart.total * 0.15 // 15% descuento por 3+ cursos
      totalDiscount += quantityDiscount
      discountDetails.push({
        type: 'quantity',
        description: 'Descuento por 3+ cursos (15%)',
        amount: quantityDiscount
      })
    }

    // Descuentos por cursos específicos
    this.cart.items.forEach(item => {
      if (item.discount > 0) {
        const itemDiscount = (item.originalPrice - item.price)
        totalDiscount += itemDiscount
        discountDetails.push({
          type: 'course',
          description: `Descuento en ${item.title}`,
          amount: itemDiscount
        })
      }
    })

    return {
      totalDiscount,
      discountDetails,
      finalTotal: Math.max(0, this.cart.total - totalDiscount)
    }
  }

  // Aplicar cupón de descuento
  applyCoupon(couponCode) {
    const coupons = {
      'WELCOME10': { discount: 0.10, description: '10% de descuento de bienvenida' },
      'STUDENT20': { discount: 0.20, description: '20% descuento estudiante' },
      'PROMO50': { discount: 0.50, description: '50% descuento promocional' }
    }

    const coupon = coupons[couponCode.toUpperCase()]
    
    if (!coupon) {
      return {
        success: false,
        message: 'Cupón no válido'
      }
    }

    const discountAmount = this.cart.total * coupon.discount
    
    return {
      success: true,
      message: 'Cupón aplicado exitosamente',
      coupon: {
        code: couponCode.toUpperCase(),
        discount: coupon.discount,
        description: coupon.description,
        discountAmount
      }
    }
  }

  // Procesar compra del carrito
  async processCartPurchase(paymentMethod = 'stripe', userInfo = {}) {
    if (this.cart.items.length === 0) {
      return {
        success: false,
        message: 'El carrito está vacío'
      }
    }

    // Verificar que el usuario esté autenticado
    const currentUser = authService.getCurrentUser()
    if (!currentUser.isAuthenticated) {
      return {
        success: false,
        message: 'Debes iniciar sesión para realizar la compra',
        requiresAuth: true
      }
    }

    try {
      // Usar datos del usuario autenticado
      const purchaseUserInfo = {
        ...currentUser.userData,
        ...userInfo // userInfo puede sobrescribir datos específicos
      }

      // Simular procesamiento de pago
      const purchaseData = {
        items: this.cart.items,
        total: this.cart.total,
        paymentMethod,
        userInfo: purchaseUserInfo,
        timestamp: new Date().toISOString(),
        orderId: `ORDER-${Date.now()}`
      }

      // Aquí integraremos con el sistema de pagos real
      const paymentResult = await this.processPayment(purchaseData)

      if (paymentResult.success) {
        // Guardar compra en historial
        this.savePurchaseHistory(purchaseData)
        
        // Inscribir automáticamente en Moodle usando el nuevo servicio
        const enrollmentResult = await this.enrollCoursesInMoodle(this.cart.items, purchaseUserInfo)
        
        // Limpiar carrito después de compra exitosa
        this.clearCart()

        return {
          success: true,
          message: 'Compra procesada exitosamente',
          orderId: purchaseData.orderId,
          purchasedCourses: purchaseData.items,
          moodleEnrollment: enrollmentResult,
          moodleSSO: currentUser.moodleData ? {
            available: true,
            url: currentUser.moodleData.ssoUrl
          } : null
        }
      }

      return paymentResult

    } catch (error) {
      console.error('Error processing cart purchase:', error)
      return {
        success: false,
        message: 'Error al procesar la compra'
      }
    }
  }

  // Simular procesamiento de pago
  async processPayment(purchaseData) {
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Usar purchaseData para mostrar información de la compra (por ejemplo, log)
    console.log('Procesando pago para:', purchaseData);

    // Simular éxito/fallo aleatorio (90% éxito)
    const success = Math.random() > 0.1

    if (success) {
      return {
        success: true,
        transactionId: `TXN-${Date.now()}`,
        message: `Pago procesado exitosamente para el pedido ${purchaseData.orderId}`
      }
    } else {
      return {
        success: false,
        message: `Error en el procesamiento del pago para el pedido ${purchaseData.orderId}. Intenta nuevamente.`
      }
    }
  }

  // Inscribir cursos en Moodle usando el servicio de integración
  async enrollCoursesInMoodle(courses, userInfo) {
    try {
      const enrollmentResults = []

      for (const course of courses) {
        const result = await moodleIntegrationService.enrollUserInCourse(
          userInfo.id,
          course.id
        )
        
        enrollmentResults.push({
          courseId: course.id,
          courseTitle: course.title,
          ...result
        })
      }

      console.log('Moodle enrollment results:', enrollmentResults)

      return {
        success: true,
        enrollments: enrollmentResults,
        message: 'Cursos habilitados exitosamente en Moodle'
      }

    } catch (error) {
      console.error('Error enrolling courses in Moodle:', error)
      return {
        success: false,
        message: 'Error al habilitar cursos en Moodle: ' + error.message
      }
    }
  }

  // Función legacy - mantener para compatibilidad
  async enableCoursesInMoodle(courses, userInfo) {
    try {
      // Mock de habilitación en Moodle
      const moodleEnrollments = courses.map(course => ({
        courseId: course.id,
        moodleCourseId: `moodle_${course.id}`, // ID del curso en Moodle
        userId: userInfo.id,
        enrollmentDate: new Date().toISOString(),
        status: 'enrolled',
        moodleUrl: `${MOODLE_CONFIG.baseUrl}/course/view.php?id=${course.id}`
      }))

      // Guardar enrollments localmente (temporal)
      const existingEnrollments = JSON.parse(localStorage.getItem('moodleEnrollments') || '[]')
      const updatedEnrollments = [...existingEnrollments, ...moodleEnrollments]
      localStorage.setItem('moodleEnrollments', JSON.stringify(updatedEnrollments))

      console.log('Courses enabled in Moodle:', moodleEnrollments)
      console.log('Moodle URL configured:', MOODLE_CONFIG.baseUrl)
      
      return {
        success: true,
        enrollments: moodleEnrollments
      }

    } catch (error) {
      console.error('Error enabling courses in Moodle:', error)
      return {
        success: false,
        message: 'Error al habilitar cursos en Moodle'
      }
    }
  }

  // Actualizar totales del carrito
  updateCartTotals() {
    this.cart.total = this.cart.items.reduce((sum, item) => sum + (item.price || 0), 0)
    this.cart.itemCount = this.cart.items.length
  }

  // Guardar carrito en localStorage
  saveCartToStorage() {
    try {
      localStorage.setItem('shopping_cart', JSON.stringify({
        items: this.cart.items,
        total: this.cart.total,
        itemCount: this.cart.itemCount,
        lastUpdated: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Error saving cart to storage:', error)
    }
  }

  // Cargar carrito desde localStorage
  loadCartFromStorage() {
    try {
      const stored = localStorage.getItem('shopping_cart')
      if (stored) {
        const cartData = JSON.parse(stored)
        this.cart.items = cartData.items || []
        this.updateCartTotals()
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error)
      this.cart.items = []
      this.updateCartTotals()
    }
  }

  // Guardar historial de compras
  savePurchaseHistory(purchaseData) {
    try {
      const existing = JSON.parse(localStorage.getItem('purchase_history') || '[]')
      existing.push(purchaseData)
      localStorage.setItem('purchase_history', JSON.stringify(existing))
    } catch (error) {
      console.error('Error saving purchase history:', error)
    }
  }

  // Obtener historial de compras
  getPurchaseHistory() {
    try {
      return JSON.parse(localStorage.getItem('purchase_history') || '[]')
    } catch (error) {
      console.error('Error loading purchase history:', error)
      return []
    }
  }

  // Obtener cursos habilitados en Moodle para un usuario
  getMoodleEnrollments(userId) {
    try {
      const enrollments = JSON.parse(localStorage.getItem('moodleEnrollments') || '[]')
      return enrollments.filter(enrollment => enrollment.userId === userId)
    } catch (error) {
      console.error('Error loading Moodle enrollments:', error)
      return []
    }
  }

  // Generar link a Moodle para un curso específico
  generateMoodleLink(courseId) {
    // Esta URL se configurará con la instancia real de Moodle
    const moodleBaseUrl = process.env.VUE_APP_MOODLE_URL || 'https://demo-moodle.com'
    return `${moodleBaseUrl}/course/view.php?id=moodle_${courseId}`
  }
}

// Instancia singleton del carrito
const cartService = new CartService()

export default cartService
