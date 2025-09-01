// Rutas para gestión avanzada de pagos y suscripciones - Día 4
const express = require('express');
const router = express.Router();
const advancedPaymentController = require('../controllers/advancedPaymentController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken);

// Dashboard de pagos
router.get('/dashboard', advancedPaymentController.getPaymentDashboard);

// Gestión de planes de pago
router.post('/plans', advancedPaymentController.createPaymentPlan);
router.get('/plans', async (req, res) => {
  try {
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    const plansSnapshot = await db.collection('paymentPlans')
      .where('isActive', '==', true)
      .orderBy('createdAt', 'desc')
      .get();
    
    const plans = [];
    plansSnapshot.forEach(doc => {
      plans.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(plans);
  } catch (error) {
    console.error('Error getting payment plans:', error);
    res.status(500).json({ error: 'Error obteniendo planes de pago' });
  }
});

router.put('/plans/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: require('firebase-admin').firestore.FieldValue.serverTimestamp()
    };
    
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    await db.collection('paymentPlans').doc(planId).update(updateData);
    
    res.json({ success: true, message: 'Plan actualizado exitosamente' });
  } catch (error) {
    console.error('Error updating payment plan:', error);
    res.status(500).json({ error: 'Error actualizando plan de pago' });
  }
});

router.delete('/plans/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    await db.collection('paymentPlans').doc(planId).update({
      isActive: false,
      deletedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ success: true, message: 'Plan eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting payment plan:', error);
    res.status(500).json({ error: 'Error eliminando plan de pago' });
  }
});

// Procesamiento de pagos
router.post('/process', advancedPaymentController.processPayment);
router.post('/confirm/:paymentId', advancedPaymentController.confirmPayment);

// Obtener historial de pagos del usuario
router.get('/history', async (req, res) => {
  try {
    const userId = req.user.uid;
    const { limit = 20, offset = 0, status } = req.query;
    
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    let query = db.collection('payments')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.get();
    const payments = [];
    
    snapshot.forEach(doc => {
      payments.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(payments);
  } catch (error) {
    console.error('Error getting payment history:', error);
    res.status(500).json({ error: 'Error obteniendo historial de pagos' });
  }
});

// Obtener detalles de un pago específico
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.uid;
    const userRole = req.user.role;
    
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    const paymentDoc = await db.collection('payments').doc(paymentId).get();
    
    if (!paymentDoc.exists) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    
    const paymentData = paymentDoc.data();
    
    // Verificar permisos (solo el usuario dueño o admin/teacher pueden ver)
    if (paymentData.userId !== userId && !['admin', 'teacher'].includes(userRole)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    
    res.json({ id: paymentDoc.id, ...paymentData });
  } catch (error) {
    console.error('Error getting payment details:', error);
    res.status(500).json({ error: 'Error obteniendo detalles del pago' });
  }
});

// Gestión de suscripciones
router.post('/subscriptions', advancedPaymentController.manageSubscriptions);

// Obtener suscripciones del usuario
router.get('/subscriptions', async (req, res) => {
  try {
    const userId = req.user.uid;
    
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    const subscriptionsSnapshot = await db.collection('subscriptions')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
    
    const subscriptions = [];
    subscriptionsSnapshot.forEach(doc => {
      subscriptions.push({ id: doc.id, ...doc.data() });
    });
    
    // Obtener detalles de los planes para cada suscripción
    const subscriptionsWithPlans = await Promise.all(
      subscriptions.map(async (subscription) => {
        if (subscription.planId) {
          const planDoc = await db.collection('paymentPlans').doc(subscription.planId).get();
          if (planDoc.exists) {
            subscription.plan = planDoc.data();
          }
        }
        return subscription;
      })
    );
    
    res.json(subscriptionsWithPlans);
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    res.status(500).json({ error: 'Error obteniendo suscripciones' });
  }
});

// Analytics de pagos
router.get('/analytics', advancedPaymentController.getPaymentAnalytics);

// Generar factura/comprobante
router.get('/invoice/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.uid;
    
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    const paymentDoc = await db.collection('payments').doc(paymentId).get();
    
    if (!paymentDoc.exists) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    
    const paymentData = paymentDoc.data();
    
    // Verificar que el usuario sea el dueño del pago
    if (paymentData.userId !== userId) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    
    // Obtener datos del usuario
    const userDoc = await admin.auth().getUser(userId);
    
    // Obtener datos del curso si aplica
    let courseData = null;
    if (paymentData.courseId) {
      const courseDoc = await db.collection('courses').doc(paymentData.courseId).get();
      if (courseDoc.exists) {
        courseData = courseDoc.data();
      }
    }
    
    const invoice = {
      invoiceNumber: `INV-${paymentId.slice(-8).toUpperCase()}`,
      date: paymentData.createdAt,
      customer: {
        name: userDoc.displayName || userDoc.email,
        email: userDoc.email
      },
      items: [
        {
          description: courseData ? courseData.title : 'Suscripción a plataforma',
          amount: paymentData.amount,
          currency: paymentData.currency
        }
      ],
      total: paymentData.amount,
      currency: paymentData.currency,
      status: paymentData.status
    };
    
    res.json(invoice);
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Error generando factura' });
  }
});

// Webhooks para notificaciones de pagos externos
router.post('/webhook/stripe', async (req, res) => {
  try {
    // Procesar webhook de Stripe
    const { paymentId, status, externalData } = req.body;
    
    if (paymentId && status) {
      await advancedPaymentController.confirmPayment(
        { params: { paymentId }, body: { status, externalData } },
        { json: () => {} }
      );
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Error processing Stripe webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
});

router.post('/webhook/transbank', async (req, res) => {
  try {
    // Procesar webhook de Transbank
    const { paymentId, status, externalData } = req.body;
    
    if (paymentId && status) {
      await advancedPaymentController.confirmPayment(
        { params: { paymentId }, body: { status, externalData } },
        { json: () => {} }
      );
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Error processing Transbank webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
});

router.post('/webhook/khipu', async (req, res) => {
  try {
    // Procesar webhook de Khipu
    const { paymentId, status, externalData } = req.body;
    
    if (paymentId && status) {
      await advancedPaymentController.confirmPayment(
        { params: { paymentId }, body: { status, externalData } },
        { json: () => {} }
      );
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Error processing Khipu webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
});

// Estadísticas para administradores
router.get('/admin/stats', async (req, res) => {
  try {
    const userRole = req.user.role;
    
    if (!['admin', 'teacher'].includes(userRole)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    
    const admin = require('firebase-admin');
    const db = admin.firestore();
    
    // Obtener estadísticas generales
    const [paymentsSnapshot, subscriptionsSnapshot, plansSnapshot] = await Promise.all([
      db.collection('payments').get(),
      db.collection('subscriptions').get(),
      db.collection('paymentPlans').where('isActive', '==', true).get()
    ]);
    
    const payments = [];
    const subscriptions = [];
    const plans = [];
    
    paymentsSnapshot.forEach(doc => payments.push(doc.data()));
    subscriptionsSnapshot.forEach(doc => subscriptions.push(doc.data()));
    plansSnapshot.forEach(doc => plans.push(doc.data()));
    
    const stats = {
      totalPayments: payments.length,
      completedPayments: payments.filter(p => p.status === 'completed').length,
      totalRevenue: payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0),
      activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
      totalSubscriptions: subscriptions.length,
      activePlans: plans.length,
      conversionRate: payments.length > 0 ? 
        (payments.filter(p => p.status === 'completed').length / payments.length) * 100 : 0
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({ error: 'Error obteniendo estadísticas' });
  }
});

module.exports = router;
