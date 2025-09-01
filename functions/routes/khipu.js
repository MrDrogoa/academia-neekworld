const express = require('express');
const router = express.Router();
const KhipuPaymentService = require('../services/khipuPaymentService');
const SaleModel = require('../models/saleModel');
const EnrollmentModel = require('../models/enrollmentModel');

// Instanciar servicio
const khipuService = new KhipuPaymentService();

// Mock auth middleware for development
const mockAuth = (req, res, next) => {
  req.user = { uid: 'test_user_123', role: 'student' };
  next();
};

/**
 * Crear pago con Khipu
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

    console.log('🏦 Creando pago Khipu para venta:', saleId);

    // Crear pago en Khipu
    const paymentResult = await khipuService.createPayment({
      amount: amount,
      subject: courseTitle,
      body: `Pago de curso: ${courseTitle}`,
      saleId: saleId,
      courseId: sale.courseId,
      userEmail: sale.userEmail || 'estudiante@academia.com'
    });

    // Actualizar venta con información de Khipu
    await SaleModel.update(saleId, {
      paymentProvider: 'khipu',
      paymentId: paymentResult.paymentId,
      paymentStatus: 'pending',
      paymentUrl: paymentResult.paymentUrl,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      paymentUrl: paymentResult.paymentUrl,
      paymentId: paymentResult.paymentId,
      message: 'Pago Khipu creado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en endpoint crear Khipu:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * Verificar estado del pago
 */
router.get('/verify/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    console.log('🔍 Verificando pago Khipu:', paymentId);

    const paymentStatus = await khipuService.verifyPayment(paymentId);

    res.json({
      success: true,
      payment: paymentStatus
    });

  } catch (error) {
    console.error('❌ Error verificando pago Khipu:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error verificando pago'
    });
  }
});

/**
 * Webhook de confirmación de Khipu
 */
router.post('/webhook', async (req, res) => {
  try {
    console.log('📨 Webhook Khipu recibido:', req.body);

    const webhookResult = await khipuService.processWebhook(req.body);

    if (webhookResult.paymentConfirmed) {
      // Buscar venta por transaction_id
      const sales = await SaleModel.getByPaymentId(webhookResult.transactionId);
      
      if (sales && sales.length > 0) {
        const sale = sales[0];
        
        // Actualizar venta como completada
        await SaleModel.update(sale.id, {
          status: 'completed',
          paymentStatus: 'paid',
          paidAt: webhookResult.paidAt,
          updatedAt: new Date()
        });

        // Crear enrollamiento automático
        try {
          await EnrollmentModel.create({
            userId: sale.userId,
            courseId: sale.courseId,
            enrollmentDate: new Date(),
            status: 'active',
            paymentMethod: 'khipu',
            transactionId: webhookResult.transactionId
          });

          console.log('✅ Enrollamiento automático creado para venta:', sale.id);
        } catch (enrollError) {
          console.error('⚠️ Error creando enrollamiento:', enrollError);
          // No fallar el webhook por esto
        }

        console.log('🎉 Pago Khipu procesado exitosamente:', sale.id);
      }
    }

    // Siempre responder OK a Khipu
    res.status(200).json({ 
      success: true, 
      message: 'Webhook procesado' 
    });

  } catch (error) {
    console.error('❌ Error procesando webhook Khipu:', error);
    
    // Responder OK aunque haya error interno
    res.status(200).json({ 
      success: false, 
      message: 'Error interno',
      error: error.message 
    });
  }
});

/**
 * Confirmar pago (llamado desde frontend después del retorno)
 */
router.post('/confirm', mockAuth, async (req, res) => {
  try {
    const { paymentId, saleId } = req.body;

    if (!paymentId || !saleId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros: paymentId, saleId'
      });
    }

    console.log('✅ Confirmando pago Khipu:', { paymentId, saleId });

    // Verificar estado del pago en Khipu
    const paymentStatus = await khipuService.verifyPayment(paymentId);

    if (paymentStatus.isCompleted) {
      // Actualizar venta
      await SaleModel.update(saleId, {
        status: 'completed',
        paymentStatus: 'paid',
        paidAt: paymentStatus.paidAt,
        updatedAt: new Date()
      });

      // Obtener información de la venta
      const sale = await SaleModel.getById(saleId);

      res.json({
        success: true,
        paymentConfirmed: true,
        sale: sale,
        message: 'Pago confirmado exitosamente'
      });

    } else {
      res.json({
        success: false,
        paymentConfirmed: false,
        status: paymentStatus.status,
        message: 'Pago aún no completado'
      });
    }

  } catch (error) {
    console.error('❌ Error confirmando pago Khipu:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error confirmando pago'
    });
  }
});

/**
 * Obtener bancos disponibles
 */
router.get('/banks', async (req, res) => {
  try {
    const banksResult = await khipuService.getAvailableBanks();
    
    res.json({
      success: true,
      banks: banksResult.banks
    });

  } catch (error) {
    console.error('❌ Error obteniendo bancos:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo bancos disponibles'
    });
  }
});

/**
 * Cancelar pago
 */
router.post('/cancel', mockAuth, async (req, res) => {
  try {
    const { paymentId, saleId } = req.body;

    if (!paymentId || !saleId) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros: paymentId, saleId'
      });
    }

    // Cancelar en Khipu
    await khipuService.cancelPayment(paymentId);

    // Actualizar venta
    await SaleModel.update(saleId, {
      status: 'cancelled',
      paymentStatus: 'cancelled',
      cancelledAt: new Date(),
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Pago cancelado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error cancelando pago:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelando pago'
    });
  }
});

module.exports = router;
