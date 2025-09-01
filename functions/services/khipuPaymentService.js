const crypto = require('crypto');
const axios = require('axios');

/**
 * Servicio de pagos con Khipu
 * Especialista en transferencias bancarias Chile
 */
class KhipuPaymentService {
  constructor() {
    this.receiverId = process.env.KHIPU_RECEIVER_ID;
    this.secret = process.env.KHIPU_SECRET;
    this.environment = process.env.KHIPU_ENVIRONMENT || 'testing';
    this.baseUrl = this.environment === 'production' 
      ? 'https://khipu.com/api/2.0' 
      : 'https://khipu.com/api/2.0';
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';

    console.log('🔍 Inicializando KhipuPaymentService:', {
      receiverId: this.receiverId,
      secret: this.secret ? '***' : undefined,
      environment: this.environment,
      baseUrl: this.baseUrl,
      frontendUrl: this.frontendUrl
    });

    if (!this.receiverId || !this.secret) {
      console.warn('⚠️ Khipu no configurado - faltan credenciales');
      return;
    }
    console.log('🏦 Khipu configurado correctamente');
  }

  /**
   * Crear firma HMAC para autenticación
   */
  createSignature(data, secret) {
    const concatenated = Object.keys(data)
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join('&');
      
    return crypto
      .createHmac('sha256', secret)
      .update(concatenated)
      .digest('hex');
  }

  /**
   * Crear pago con Khipu
   */
  async createPayment(paymentData) {
    try {
      const {
        amount,
        subject,
        body = '',
        saleId,
        courseId,
        userEmail = 'test@ejemplo.com'
      } = paymentData;

      // Datos del pago
      const paymentRequest = {
        receiver_id: this.receiverId,
        amount: Math.round(amount),
        currency: 'CLP',
        subject: subject,
        body: body || `Acceso al curso: ${subject}`,
        transaction_id: saleId,
        custom: JSON.stringify({ courseId, saleId }),
        return_url: `${this.frontendUrl}/payment/khipu/return`,
        cancel_url: `${this.frontendUrl}/payment/khipu/cancel`,
        notify_url: `${process.env.API_BASE_URL || 'http://localhost:3000'}/api/payments/khipu/webhook`,
        expires_date: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
        payer_email: userEmail
      };

      // Crear firma
      const signature = this.createSignature(paymentRequest, this.secret);
      
      // Headers
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `${this.receiverId}:${signature}`
      };

      // Hacer request
      const response = await axios.post(
        `${this.baseUrl}/payments`,
        new URLSearchParams(paymentRequest),
        { headers }
      );

      console.log('✅ Pago Khipu creado:', response.data);

      return {
        success: true,
        paymentUrl: response.data.payment_url,
        paymentId: response.data.payment_id,
        transactionId: saleId,
        readyForTerminal: response.data.ready_for_terminal
      };

    } catch (error) {
      console.error('❌ Error creando pago Khipu:', error.response?.data || error.message);
      throw new Error(`Error Khipu: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Verificar estado del pago
   */
  async verifyPayment(paymentId) {
    try {
      const verifyData = {
        receiver_id: this.receiverId,
        payment_id: paymentId
      };

      const signature = this.createSignature(verifyData, this.secret);
      
      const headers = {
        'Authorization': `${this.receiverId}:${signature}`
      };

      const response = await axios.get(
        `${this.baseUrl}/payments/${paymentId}`,
        { headers }
      );

      const payment = response.data;

      return {
        success: true,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        subject: payment.subject,
        transactionId: payment.transaction_id,
        paidAt: payment.transfer_date,
        isCompleted: payment.status === 'done'
      };

    } catch (error) {
      console.error('❌ Error verificando pago Khipu:', error.response?.data || error.message);
      throw new Error(`Error verificando Khipu: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Procesar webhook de confirmación
   */
  async processWebhook(webhookData) {
    try {
      const { payment_id, notification_signature } = webhookData;
      
      if (!payment_id || !notification_signature) {
        throw new Error('Webhook inválido: faltan datos requeridos');
      }

      // Verificar pago
      const paymentStatus = await this.verifyPayment(payment_id);
      
      if (paymentStatus.isCompleted) {
        console.log('🎉 Pago Khipu confirmado:', paymentStatus);
        
        return {
          success: true,
          paymentConfirmed: true,
          transactionId: paymentStatus.transactionId,
          amount: paymentStatus.amount,
          paidAt: paymentStatus.paidAt
        };
      }

      return {
        success: true,
        paymentConfirmed: false,
        status: paymentStatus.status
      };

    } catch (error) {
      console.error('❌ Error procesando webhook Khipu:', error);
      throw error;
    }
  }

  /**
   * Cancelar pago
   */
  async cancelPayment(paymentId) {
    try {
      const cancelData = {
        receiver_id: this.receiverId,
        payment_id: paymentId
      };

      const signature = this.createSignature(cancelData, this.secret);
      
      const headers = {
        'Authorization': `${this.receiverId}:${signature}`
      };

      await axios.delete(
        `${this.baseUrl}/payments/${paymentId}`,
        { headers }
      );

      return { success: true, cancelled: true };

    } catch (error) {
      console.error('❌ Error cancelando pago Khipu:', error.response?.data || error.message);
      throw new Error(`Error cancelando Khipu: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Obtener bancos disponibles
   */
  async getAvailableBanks() {
    try {
      const response = await axios.get(`${this.baseUrl}/banks`);
      
      return {
        success: true,
        banks: response.data.banks || []
      };

    } catch (error) {
      console.error('❌ Error obteniendo bancos Khipu:', error);
      return {
        success: false,
        banks: [
          { id: 'bci', name: 'Banco BCI' },
          { id: 'santander', name: 'Banco Santander' },
          { id: 'chile', name: 'Banco de Chile' },
          { id: 'estado', name: 'BancoEstado' },
          { id: 'scotiabank', name: 'Scotiabank' }
        ]
      };
    }
  }
}

module.exports = KhipuPaymentService;
