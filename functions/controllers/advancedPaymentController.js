// Controller para gestión avanzada de pagos y suscripciones - Día 4
const admin = require('firebase-admin');
const { verifyToken } = require('../middlewares/authMiddleware');

class AdvancedPaymentController {
  // Dashboard de pagos con métricas avanzadas
  async getPaymentDashboard(req, res) {
    try {
      const userId = req.user.uid;
      const userRole = req.user.role;
      
      // Verificar permisos
      if (!['admin', 'teacher'].includes(userRole)) {
        return res.status(403).json({ error: 'Acceso denegado' });
      }

      const db = admin.firestore();
      
      // Obtener datos de pagos
      const paymentsRef = db.collection('payments');
      const subscriptionsRef = db.collection('subscriptions');
      
      // Pagos del último mes
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      const [paymentsSnapshot, subscriptionsSnapshot] = await Promise.all([
        paymentsRef.where('createdAt', '>=', lastMonth).get(),
        subscriptionsRef.where('status', '==', 'active').get()
      ]);
      
      const payments = [];
      const subscriptions = [];
      
      paymentsSnapshot.forEach(doc => {
        payments.push({ id: doc.id, ...doc.data() });
      });
      
      subscriptionsSnapshot.forEach(doc => {
        subscriptions.push({ id: doc.id, ...doc.data() });
      });
      
      // Calcular métricas
      const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
      const activeSubscriptions = subscriptions.length;
      const monthlyRecurringRevenue = subscriptions.reduce((sum, sub) => 
        sum + (sub.monthlyAmount || 0), 0
      );
      
      // Métricas de conversión
      const conversionRate = payments.length > 0 ? 
        (payments.filter(p => p.status === 'completed').length / payments.length) * 100 : 0;
      
      // Datos para gráficos
      const paymentsByMethod = this.groupPaymentsByMethod(payments);
      const revenueOverTime = this.calculateRevenueOverTime(payments);
      const subscriptionTrends = this.calculateSubscriptionTrends(subscriptions);
      
      res.json({
        summary: {
          totalRevenue,
          totalPayments: payments.length,
          activeSubscriptions,
          monthlyRecurringRevenue,
          conversionRate: Math.round(conversionRate * 100) / 100,
          averageOrderValue: payments.length > 0 ? totalRevenue / payments.length : 0
        },
        recentPayments: payments.slice(0, 10),
        activeSubscriptions: subscriptions.slice(0, 10),
        analytics: {
          paymentsByMethod,
          revenueOverTime,
          subscriptionTrends,
          topCourses: await this.getTopSellingCourses(db)
        }
      });
      
    } catch (error) {
      console.error('Error getting payment dashboard:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Crear un nuevo plan de pago
  async createPaymentPlan(req, res) {
    try {
      const userId = req.user.uid;
      const { 
        name, 
        description, 
        amount, 
        currency = 'CLP',
        interval, // monthly, yearly, one-time
        features,
        courseIds,
        discountPercentage = 0,
        isActive = true
      } = req.body;

      // Validaciones
      if (!name || !amount || !interval) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }

      const db = admin.firestore();
      
      const planData = {
        name,
        description,
        amount,
        currency,
        interval,
        features: features || [],
        courseIds: courseIds || [],
        discountPercentage,
        isActive,
        createdBy: userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const planRef = await db.collection('paymentPlans').add(planData);
      
      res.json({
        success: true,
        planId: planRef.id,
        message: 'Plan de pago creado exitosamente'
      });
      
    } catch (error) {
      console.error('Error creating payment plan:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  // Procesar pago con múltiples métodos
  async processPayment(req, res) {
    try {
      const userId = req.user.uid;
      const { 
        method, // stripe, transbank, khipu
        amount,
        currency = 'CLP',
        courseId,
        planId,
        metadata = {}
      } = req.body;

      // Validaciones
      if (!method || !amount) {
        return res.status(400).json({ error: 'Método de pago y monto son requeridos' });
      }

      const db = admin.firestore();
      
      // Crear registro de pago pendiente
      const paymentData = {
        userId,
        method,
        amount,
        currency,
        courseId,
        planId,
        status: 'pending',
        metadata,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const paymentRef = await db.collection('payments').add(paymentData);
      const paymentId = paymentRef.id;

      let paymentResponse;

      // Procesar según el método de pago
      switch (method) {
        case 'stripe':
          paymentResponse = await this.processStripePayment({
            paymentId,
            amount,
            currency,
            metadata: { ...metadata, userId, courseId, planId }
          });
          break;
          
        case 'transbank':
          paymentResponse = await this.processTransbankPayment({
            paymentId,
            amount,
            metadata: { ...metadata, userId, courseId, planId }
          });
          break;
          
        case 'khipu':
          paymentResponse = await this.processKhipuPayment({
            paymentId,
            amount,
            metadata: { ...metadata, userId, courseId, planId }
          });
          break;
          
        default:
          throw new Error('Método de pago no soportado');
      }

      // Actualizar registro de pago con datos del procesador
      await paymentRef.update({
        externalId: paymentResponse.externalId,
        paymentUrl: paymentResponse.paymentUrl,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({
        success: true,
        paymentId,
        paymentUrl: paymentResponse.paymentUrl,
        externalId: paymentResponse.externalId
      });
      
    } catch (error) {
      console.error('Error processing payment:', error);
      res.status(500).json({ error: 'Error procesando el pago' });
    }
  }

  // Confirmar pago completado
  async confirmPayment(req, res) {
    try {
      const { paymentId } = req.params;
      const { status, externalData = {} } = req.body;

      const db = admin.firestore();
      const paymentRef = db.collection('payments').doc(paymentId);
      const paymentDoc = await paymentRef.get();

      if (!paymentDoc.exists) {
        return res.status(404).json({ error: 'Pago no encontrado' });
      }

      const paymentData = paymentDoc.data();

      // Actualizar estado del pago
      await paymentRef.update({
        status,
        externalData,
        completedAt: status === 'completed' ? admin.firestore.FieldValue.serverTimestamp() : null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Si el pago fue exitoso, activar curso o suscripción
      if (status === 'completed') {
        await this.activateUserAccess(paymentData.userId, paymentData.courseId, paymentData.planId);
      }

      res.json({ success: true, message: 'Pago confirmado' });
      
    } catch (error) {
      console.error('Error confirming payment:', error);
      res.status(500).json({ error: 'Error confirmando el pago' });
    }
  }

  // Gestionar suscripciones
  async manageSubscriptions(req, res) {
    try {
      const userId = req.user.uid;
      const { action, subscriptionId, planId } = req.body;

      const db = admin.firestore();

      switch (action) {
        case 'create':
          await this.createSubscription(userId, planId, db);
          break;
          
        case 'cancel':
          await this.cancelSubscription(subscriptionId, db);
          break;
          
        case 'pause':
          await this.pauseSubscription(subscriptionId, db);
          break;
          
        case 'resume':
          await this.resumeSubscription(subscriptionId, db);
          break;
          
        default:
          throw new Error('Acción no válida');
      }

      res.json({ success: true, message: 'Suscripción actualizada' });
      
    } catch (error) {
      console.error('Error managing subscription:', error);
      res.status(500).json({ error: 'Error gestionando suscripción' });
    }
  }

  // Obtener analytics de pagos
  async getPaymentAnalytics(req, res) {
    try {
      const { startDate, endDate, method, status } = req.query;
      
      const db = admin.firestore();
      let query = db.collection('payments');

      // Aplicar filtros
      if (startDate) {
        query = query.where('createdAt', '>=', new Date(startDate));
      }
      if (endDate) {
        query = query.where('createdAt', '<=', new Date(endDate));
      }
      if (method) {
        query = query.where('method', '==', method);
      }
      if (status) {
        query = query.where('status', '==', status);
      }

      const snapshot = await query.get();
      const payments = [];
      
      snapshot.forEach(doc => {
        payments.push({ id: doc.id, ...doc.data() });
      });

      const analytics = {
        totalPayments: payments.length,
        totalRevenue: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
        successRate: payments.length > 0 ? 
          (payments.filter(p => p.status === 'completed').length / payments.length) * 100 : 0,
        paymentsByMethod: this.groupPaymentsByMethod(payments),
        revenueByDay: this.calculateDailyRevenue(payments),
        averageOrderValue: payments.length > 0 ? 
          payments.reduce((sum, p) => sum + (p.amount || 0), 0) / payments.length : 0
      };

      res.json(analytics);
      
    } catch (error) {
      console.error('Error getting payment analytics:', error);
      res.status(500).json({ error: 'Error obteniendo analytics' });
    }
  }

  // Métodos auxiliares
  async processStripePayment(paymentData) {
    // Integración con Stripe
    return {
      externalId: `stripe_${Date.now()}`,
      paymentUrl: `https://checkout.stripe.com/pay/${paymentData.paymentId}`
    };
  }

  async processTransbankPayment(paymentData) {
    // Integración con Transbank
    return {
      externalId: `tbk_${Date.now()}`,
      paymentUrl: `https://webpay3gint.transbank.cl/webpayserver/initTransaction`
    };
  }

  async processKhipuPayment(paymentData) {
    // Integración con Khipu
    return {
      externalId: `khipu_${Date.now()}`,
      paymentUrl: `https://khipu.com/payment/${paymentData.paymentId}`
    };
  }

  async activateUserAccess(userId, courseId, planId) {
    const db = admin.firestore();
    
    if (courseId) {
      // Activar acceso a curso específico
      await db.collection('enrollments').add({
        userId,
        courseId,
        status: 'active',
        enrolledAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    if (planId) {
      // Activar suscripción
      await db.collection('subscriptions').add({
        userId,
        planId,
        status: 'active',
        startDate: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  }

  groupPaymentsByMethod(payments) {
    const grouped = {};
    payments.forEach(payment => {
      const method = payment.method || 'unknown';
      grouped[method] = (grouped[method] || 0) + 1;
    });
    return grouped;
  }

  calculateRevenueOverTime(payments) {
    const revenueByDate = {};
    payments.forEach(payment => {
      if (payment.status === 'completed' && payment.createdAt) {
        const date = new Date(payment.createdAt.toDate()).toISOString().split('T')[0];
        revenueByDate[date] = (revenueByDate[date] || 0) + (payment.amount || 0);
      }
    });
    
    return Object.entries(revenueByDate).map(([date, revenue]) => ({
      date,
      revenue
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  calculateSubscriptionTrends(subscriptions) {
    const trends = {
      active: 0,
      cancelled: 0,
      paused: 0
    };
    
    subscriptions.forEach(sub => {
      const status = sub.status || 'unknown';
      if (trends.hasOwnProperty(status)) {
        trends[status]++;
      }
    });
    
    return trends;
  }

  async getTopSellingCourses(db) {
    try {
      const paymentsSnapshot = await db.collection('payments')
        .where('status', '==', 'completed')
        .where('courseId', '!=', null)
        .get();
      
      const courseSales = {};
      paymentsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.courseId) {
          courseSales[data.courseId] = (courseSales[data.courseId] || 0) + 1;
        }
      });
      
      return Object.entries(courseSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([courseId, sales]) => ({ courseId, sales }));
        
    } catch (error) {
      console.error('Error getting top selling courses:', error);
      return [];
    }
  }

  calculateDailyRevenue(payments) {
    const dailyRevenue = {};
    payments.forEach(payment => {
      if (payment.status === 'completed' && payment.createdAt) {
        const date = new Date(payment.createdAt.toDate()).toISOString().split('T')[0];
        dailyRevenue[date] = (dailyRevenue[date] || 0) + (payment.amount || 0);
      }
    });
    return dailyRevenue;
  }

  async createSubscription(userId, planId, db) {
    const subscriptionData = {
      userId,
      planId,
      status: 'active',
      startDate: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection('subscriptions').add(subscriptionData);
  }

  async cancelSubscription(subscriptionId, db) {
    await db.collection('subscriptions').doc(subscriptionId).update({
      status: 'cancelled',
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  async pauseSubscription(subscriptionId, db) {
    await db.collection('subscriptions').doc(subscriptionId).update({
      status: 'paused',
      pausedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  async resumeSubscription(subscriptionId, db) {
    await db.collection('subscriptions').doc(subscriptionId).update({
      status: 'active',
      resumedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
}

module.exports = new AdvancedPaymentController();
