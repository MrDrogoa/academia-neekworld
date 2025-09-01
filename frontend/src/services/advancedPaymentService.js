// Servicio para gestión avanzada de pagos y suscripciones
import backendService from './backendService'

const API_BASE = '/payments-advanced'

class AdvancedPaymentService {
  // Dashboard de pagos
  async getPaymentDashboard() {
    try {
      const response = await backendService.get(`${API_BASE}/dashboard`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using local data:', error.message)
      return this.getLocalPaymentDashboard()
    }
  }

  // Gestión de planes
  async getPaymentPlans() {
    try {
      const response = await backendService.get(`${API_BASE}/plans`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using local plans:', error.message)
      return this.getLocalPaymentPlans()
    }
  }

  async createPaymentPlan(planData) {
    try {
      const response = await backendService.post(`${API_BASE}/plans`, planData)
      
      // Guardar localmente también
      this.savePlanLocally(response.data)
      
      return response.data
    } catch (error) {
      console.warn('Backend not available, saving locally:', error.message)
      return this.createPlanLocally(planData)
    }
  }

  async updatePaymentPlan(planId, planData) {
    try {
      const response = await backendService.put(`${API_BASE}/plans/${planId}`, planData)
      
      // Actualizar localmente también
      this.updatePlanLocally(planId, planData)
      
      return response.data
    } catch (error) {
      console.warn('Backend not available, updating locally:', error.message)
      return this.updatePlanLocally(planId, planData)
    }
  }

  async deletePaymentPlan(planId) {
    try {
      await backendService.delete(`${API_BASE}/plans/${planId}`)
      
      // Eliminar localmente también
      this.deletePlanLocally(planId)
      
      return { success: true }
    } catch (error) {
      console.warn('Backend not available, deleting locally:', error.message)
      return this.deletePlanLocally(planId)
    }
  }

  // Procesamiento de pagos
  async processPayment(paymentData) {
    try {
      const response = await backendService.post(`${API_BASE}/process`, paymentData)
      
      // Guardar transacción localmente
      this.savePaymentLocally(response.data)
      
      return response.data
    } catch (error) {
      console.warn('Backend not available, processing locally:', error.message)
      return this.processPaymentLocally(paymentData)
    }
  }

  async confirmPayment(paymentId, confirmationData) {
    try {
      const response = await backendService.post(`${API_BASE}/confirm/${paymentId}`, confirmationData)
      
      // Actualizar estado localmente
      this.confirmPaymentLocally(paymentId, confirmationData)
      
      return response.data
    } catch (error) {
      console.warn('Backend not available, confirming locally:', error.message)
      return this.confirmPaymentLocally(paymentId, confirmationData)
    }
  }

  // Historial de pagos
  async getPaymentHistory(filters = {}) {
    try {
      const params = new URLSearchParams(filters)
      const response = await backendService.get(`${API_BASE}/history?${params}`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using local history:', error.message)
      return this.getLocalPaymentHistory(filters)
    }
  }

  async getPaymentDetails(paymentId) {
    try {
      const response = await backendService.get(`${API_BASE}/payment/${paymentId}`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, getting local payment:', error.message)
      return this.getLocalPaymentDetails(paymentId)
    }
  }

  // Gestión de suscripciones
  async manageSubscription(action, data) {
    try {
      const response = await backendService.post(`${API_BASE}/subscriptions`, {
        action,
        ...data
      })
      
      // Actualizar suscripciones localmente
      this.updateSubscriptionLocally(action, data)
      
      return response.data
    } catch (error) {
      console.warn('Backend not available, managing subscription locally:', error.message)
      return this.manageSubscriptionLocally(action, data)
    }
  }

  async getUserSubscriptions() {
    try {
      const response = await backendService.get(`${API_BASE}/subscriptions`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using local subscriptions:', error.message)
      return this.getLocalUserSubscriptions()
    }
  }

  // Analytics de pagos
  async getPaymentAnalytics(filters = {}) {
    try {
      const params = new URLSearchParams(filters)
      const response = await backendService.get(`${API_BASE}/analytics?${params}`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using local analytics:', error.message)
      return this.getLocalPaymentAnalytics(filters)
    }
  }

  // Facturación
  async generateInvoice(paymentId) {
    try {
      const response = await backendService.get(`${API_BASE}/invoice/${paymentId}`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, generating local invoice:', error.message)
      return this.generateLocalInvoice(paymentId)
    }
  }

  // Estadísticas administrativas
  async getAdminStats() {
    try {
      const response = await backendService.get(`${API_BASE}/admin/stats`)
      return response.data
    } catch (error) {
      console.warn('Backend not available, using local admin stats:', error.message)
      return this.getLocalAdminStats()
    }
  }

  // ===== MÉTODOS LOCALES (FALLBACK) =====

  getLocalPaymentDashboard() {
    const payments = this.getLocalPayments()
    const subscriptions = this.getLocalSubscriptions()
    
    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (p.amount || 0), 0)
    
    const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length
    const monthlyRecurringRevenue = subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + (s.monthlyAmount || 0), 0)
    
    return {
      summary: {
        totalRevenue,
        totalPayments: payments.length,
        activeSubscriptions,
        monthlyRecurringRevenue,
        conversionRate: 85.5,
        averageOrderValue: payments.length > 0 ? totalRevenue / payments.length : 0
      },
      recentPayments: payments.slice(0, 10),
      activeSubscriptions: subscriptions.slice(0, 10),
      analytics: {
        paymentsByMethod: this.generatePaymentsByMethod(),
        revenueOverTime: this.generateRevenueOverTime(),
        subscriptionTrends: this.generateSubscriptionTrends(),
        topCourses: this.generateTopCourses()
      }
    }
  }

  getLocalPaymentPlans() {
    const stored = localStorage.getItem('paymentPlans')
    if (stored) {
      return JSON.parse(stored)
    }
    
    const defaultPlans = [
      {
        id: 'plan-basic',
        name: 'Plan Básico',
        description: 'Acceso a cursos básicos',
        amount: 19990,
        currency: 'CLP',
        interval: 'monthly',
        features: ['Acceso a 5 cursos', 'Soporte por email', 'Certificados básicos'],
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'plan-premium',
        name: 'Plan Premium',
        description: 'Acceso completo a la plataforma',
        amount: 39990,
        currency: 'CLP',
        interval: 'monthly',
        features: ['Acceso ilimitado', 'Soporte prioritario', 'Certificados premium', 'Mentorías 1:1'],
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'plan-annual',
        name: 'Plan Anual',
        description: 'Plan premium con descuento anual',
        amount: 399990,
        currency: 'CLP',
        interval: 'yearly',
        features: ['Acceso ilimitado', 'Soporte prioritario', 'Certificados premium', 'Mentorías 1:1', '2 meses gratis'],
        discountPercentage: 17,
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ]
    
    localStorage.setItem('paymentPlans', JSON.stringify(defaultPlans))
    return defaultPlans
  }

  getLocalPayments() {
    const stored = localStorage.getItem('userPayments')
    if (stored) {
      return JSON.parse(stored)
    }
    
    const defaultPayments = [
      {
        id: 'payment-1',
        amount: 89990,
        currency: 'CLP',
        method: 'stripe',
        status: 'completed',
        courseId: 'course-1',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Ayer
        completedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'payment-2',
        amount: 39990,
        currency: 'CLP',
        method: 'transbank',
        status: 'completed',
        planId: 'plan-premium',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 días atrás
        completedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: 'payment-3',
        amount: 79990,
        currency: 'CLP',
        method: 'khipu',
        status: 'pending',
        courseId: 'course-2',
        createdAt: new Date().toISOString()
      }
    ]
    
    localStorage.setItem('userPayments', JSON.stringify(defaultPayments))
    return defaultPayments
  }

  getLocalSubscriptions() {
    const stored = localStorage.getItem('userSubscriptions')
    if (stored) {
      return JSON.parse(stored)
    }
    
    const defaultSubscriptions = [
      {
        id: 'sub-1',
        planId: 'plan-premium',
        status: 'active',
        monthlyAmount: 39990,
        startDate: new Date(Date.now() - 2592000000).toISOString(), // 30 días atrás
        plan: {
          name: 'Plan Premium',
          features: ['Acceso ilimitado', 'Soporte prioritario']
        }
      }
    ]
    
    localStorage.setItem('userSubscriptions', JSON.stringify(defaultSubscriptions))
    return defaultSubscriptions
  }

  createPlanLocally(planData) {
    const plans = this.getLocalPaymentPlans()
    const newPlan = {
      id: `plan-${Date.now()}`,
      ...planData,
      isActive: true,
      createdAt: new Date().toISOString()
    }
    
    plans.push(newPlan)
    localStorage.setItem('paymentPlans', JSON.stringify(plans))
    return newPlan
  }

  updatePlanLocally(planId, planData) {
    const plans = this.getLocalPaymentPlans()
    const index = plans.findIndex(p => p.id === planId)
    
    if (index !== -1) {
      plans[index] = { ...plans[index], ...planData, updatedAt: new Date().toISOString() }
      localStorage.setItem('paymentPlans', JSON.stringify(plans))
      return plans[index]
    }
    
    throw new Error('Plan not found')
  }

  deletePlanLocally(planId) {
    const plans = this.getLocalPaymentPlans()
    const index = plans.findIndex(p => p.id === planId)
    
    if (index !== -1) {
      plans[index].isActive = false
      plans[index].deletedAt = new Date().toISOString()
      localStorage.setItem('paymentPlans', JSON.stringify(plans))
      return { success: true }
    }
    
    throw new Error('Plan not found')
  }

  processPaymentLocally(paymentData) {
    const payment = {
      id: `payment-${Date.now()}`,
      ...paymentData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      paymentUrl: `https://checkout.local/${paymentData.method}/${Date.now()}`
    }
    
    this.savePaymentLocally(payment)
    return payment
  }

  savePaymentLocally(payment) {
    const payments = this.getLocalPayments()
    payments.push(payment)
    localStorage.setItem('userPayments', JSON.stringify(payments))
  }

  confirmPaymentLocally(paymentId, confirmationData) {
    const payments = this.getLocalPayments()
    const index = payments.findIndex(p => p.id === paymentId)
    
    if (index !== -1) {
      payments[index] = {
        ...payments[index],
        ...confirmationData,
        completedAt: confirmationData.status === 'completed' ? new Date().toISOString() : null
      }
      localStorage.setItem('userPayments', JSON.stringify(payments))
      return payments[index]
    }
    
    throw new Error('Payment not found')
  }

  getLocalPaymentHistory(filters) {
    let payments = this.getLocalPayments()
    
    // Aplicar filtros
    if (filters.status) {
      payments = payments.filter(p => p.status === filters.status)
    }
    if (filters.method) {
      payments = payments.filter(p => p.method === filters.method)
    }
    
    return payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  getLocalPaymentDetails(paymentId) {
    const payments = this.getLocalPayments()
    const payment = payments.find(p => p.id === paymentId)
    
    if (!payment) {
      throw new Error('Payment not found')
    }
    
    return payment
  }

  manageSubscriptionLocally(action, data) {
    const subscriptions = this.getLocalSubscriptions()
    
    switch (action) {
      case 'create': {
        const newSub = {
          id: `sub-${Date.now()}`,
          planId: data.planId,
          status: 'active',
          startDate: new Date().toISOString()
        }
        subscriptions.push(newSub)
        break
      }
        
      case 'cancel': {
        const cancelIndex = subscriptions.findIndex(s => s.id === data.subscriptionId)
        if (cancelIndex !== -1) {
          subscriptions[cancelIndex].status = 'cancelled'
          subscriptions[cancelIndex].cancelledAt = new Date().toISOString()
        }
        break
      }
    }
    
    localStorage.setItem('userSubscriptions', JSON.stringify(subscriptions))
    return { success: true }
  }

  getLocalUserSubscriptions() {
    return this.getLocalSubscriptions()
  }

  getLocalPaymentAnalytics() {
    const payments = this.getLocalPayments()
    
    return {
      totalPayments: payments.length,
      totalRevenue: payments.filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0),
      successRate: payments.length > 0 ? 
        (payments.filter(p => p.status === 'completed').length / payments.length) * 100 : 0,
      paymentsByMethod: this.generatePaymentsByMethod(),
      revenueByDay: this.generateRevenueByDay(),
      averageOrderValue: payments.length > 0 ? 
        payments.reduce((sum, p) => sum + (p.amount || 0), 0) / payments.length : 0
    }
  }

  generateLocalInvoice(paymentId) {
    const payment = this.getLocalPaymentDetails(paymentId)
    
    return {
      invoiceNumber: `INV-${paymentId.slice(-8).toUpperCase()}`,
      date: payment.createdAt,
      customer: {
        name: 'Usuario Local',
        email: 'usuario@local.com'
      },
      items: [
        {
          description: payment.courseId ? 'Curso online' : 'Suscripción',
          amount: payment.amount,
          currency: payment.currency
        }
      ],
      total: payment.amount,
      currency: payment.currency,
      status: payment.status
    }
  }

  getLocalAdminStats() {
    const payments = this.getLocalPayments()
    const subscriptions = this.getLocalSubscriptions()
    
    return {
      totalPayments: payments.length,
      completedPayments: payments.filter(p => p.status === 'completed').length,
      totalRevenue: payments.filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0),
      activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
      totalSubscriptions: subscriptions.length,
      activePlans: this.getLocalPaymentPlans().filter(p => p.isActive).length,
      conversionRate: payments.length > 0 ? 
        (payments.filter(p => p.status === 'completed').length / payments.length) * 100 : 0
    }
  }

  // Métodos auxiliares para generar datos simulados
  generatePaymentsByMethod() {
    return {
      stripe: 45,
      transbank: 32,
      khipu: 23
    }
  }

  generateRevenueOverTime() {
    const data = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 500000) + 100000
      })
    }
    return data
  }

  generateSubscriptionTrends() {
    return {
      active: 145,
      cancelled: 12,
      paused: 8
    }
  }

  generateTopCourses() {
    return [
      { courseId: 'course-1', sales: 45 },
      { courseId: 'course-2', sales: 32 },
      { courseId: 'course-3', sales: 28 }
    ]
  }

  generateRevenueByDay() {
    const data = {}
    for (let i = 7; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      data[dateStr] = Math.floor(Math.random() * 200000) + 50000
    }
    return data
  }
}

export default new AdvancedPaymentService()
