const express = require('express');
const router = express.Router();
const FlowPaymentService = require('../services/flowPaymentService');
const SaleModel = require('../models/saleModel');
const EnrollmentModel = require('../models/enrollmentModel');

// Instanciar servicio
const flowService = new FlowPaymentService();

// Mock auth middleware for development
const mockAuth = (req, res, next) => {
  req.user = { uid: 'test_user_123', role: 'student' };
  next();
};

/**
 * Crear pago con Flow
 */
router.post('/create', mockAuth, async (req, res) => {
  try {
    const { saleId, amount, courseTitle, returnUrl } = req.body;
    
    if (!saleId || !amount || !courseTitle) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros requeridos: saleId, amount, courseTitle'
      });
    }

    // Verificar que la venta existe
    const sale = await SaleModel.getById(saleId);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }

    console.log('💰 Creando pago Flow para venta:', saleId);

    // Crear pago en Flow
    const paymentResult = await flowService.createPayment({
      amount: amount,
      subject: courseTitle,
      saleId: saleId,
      userEmail: sale.userEmail || 'estudiante@academia.com'
    });

    if (paymentResult.success) {
      // Actualizar venta con información del pago
      await SaleModel.update(saleId, {
        paymentMethod: 'flow',
        paymentToken: paymentResult.token,
        paymentStatus: 'pending',
        updatedAt: new Date()
      });

      res.json({
        success: true,
        paymentUrl: paymentResult.paymentUrl,
        token: paymentResult.token,
        saleId: saleId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creando pago Flow'
      });
    }

  } catch (error) {
    console.error('Error creating Flow payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando pago con Flow',
      error: error.message
    });
  }
});

/**
 * Webhook para confirmación automática de Flow
 */
router.post('/webhook', async (req, res) => {
  try {
    console.log('🔔 Webhook Flow recibido:', req.body);

    const webhookResult = await flowService.processWebhook(req.body);
    
    if (webhookResult.success && webhookResult.shouldUpdateDB) {
      const { commerceOrder } = webhookResult.paymentStatus;
      
      // Actualizar estado de la venta
      await SaleModel.update(commerceOrder, {
        paymentStatus: 'completed',
        paymentConfirmedAt: new Date(),
        paymentData: webhookResult.paymentStatus.paymentData
      });

      // Confirmar inscripción si existe
      const sale = await SaleModel.getById(commerceOrder);
      if (sale && sale.courseId) {
        await EnrollmentModel.confirmEnrollment(sale.userId, sale.courseId);
        console.log('✅ Inscripción confirmada automáticamente');
      }
    }

    res.json({ 
      success: true,
      message: 'Webhook procesado correctamente' 
    });

  } catch (error) {
    console.error('Error processing Flow webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Error procesando webhook'
    });
  }
});

/**
 * Verificar estado de pago Flow
 */
router.get('/verify/:token', mockAuth, async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token es requerido'
      });
    }

    console.log('🔍 Verificando pago Flow:', token);

    const paymentStatus = await flowService.confirmPayment(token);

    res.json({
      success: true,
      paymentStatus: paymentStatus
    });

  } catch (error) {
    console.error('Error verifying Flow payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verificando pago',
      error: error.message
    });
  }
});

/**
 * Confirmar pago manualmente
 */
router.post('/confirm', mockAuth, async (req, res) => {
  try {
    const { token, saleId } = req.body;
    
    if (!token || !saleId) {
      return res.status(400).json({
        success: false,
        message: 'Token y Sale ID son requeridos'
      });
    }

    console.log('✅ Confirmando pago Flow manualmente:', { token, saleId });

    const paymentStatus = await flowService.confirmPayment(token);

    if (paymentStatus.status === 2) { // 2 = Pagado en Flow
      // Actualizar venta
      await SaleModel.update(saleId, {
        paymentStatus: 'completed',
        paymentConfirmedAt: new Date(),
        paymentData: paymentStatus.paymentData
      });

      // Confirmar inscripción
      const sale = await SaleModel.getById(saleId);
      if (sale && sale.courseId) {
        await EnrollmentModel.confirmEnrollment(sale.userId, sale.courseId);
      }

      res.json({
        success: true,
        message: 'Pago confirmado exitosamente',
        paymentDetails: {
          amount: paymentStatus.amount,
          confirmationDate: paymentStatus.confirmationDate,
          payer: paymentStatus.payer
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Pago no completado',
        status: paymentStatus.status
      });
    }

  } catch (error) {
    console.error('Error confirming Flow payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error confirmando pago',
      error: error.message
    });
  }
});

/**
 * Obtener métodos de pago disponibles
 */
router.get('/methods', (req, res) => {
  try {
    const methods = flowService.getPaymentMethods();
    
    res.json({
      success: true,
      methods: methods
    });

  } catch (error) {
    console.error('Error getting Flow payment methods:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo métodos de pago'
    });
  }
});

/**
 * Calcular costos de transacción
 */
router.post('/calculate-cost', (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Monto válido es requerido'
      });
    }

    const costs = flowService.calculateTransactionCost(amount);
    
    res.json({
      success: true,
      costs: costs
    });

  } catch (error) {
    console.error('Error calculating Flow costs:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculando costos'
    });
  }
});

/**
 * Cancelar pago (para casos especiales)
 */
router.post('/cancel', mockAuth, async (req, res) => {
  try {
    const { saleId, reason } = req.body;
    
    if (!saleId) {
      return res.status(400).json({
        success: false,
        message: 'Sale ID es requerido'
      });
    }

    console.log('❌ Cancelando pago Flow:', { saleId, reason });

    // Actualizar estado de la venta
    await SaleModel.update(saleId, {
      paymentStatus: 'cancelled',
      cancellationReason: reason || 'Cancelado por usuario',
      cancelledAt: new Date()
    });

    res.json({
      success: true,
      message: 'Pago cancelado exitosamente'
    });

  } catch (error) {
    console.error('Error cancelling Flow payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelando pago',
      error: error.message
    });
  }
});

module.exports = router;
