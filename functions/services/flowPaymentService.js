const crypto = require('crypto');
const axios = require('axios');

/**
 * Servicio de pagos con Flow
 * Especialista en pagos electrónicos Chile
 */
class FlowPaymentService {
  constructor() {
    this.apiKey = process.env.FLOW_API_KEY;
    this.secretKey = process.env.FLOW_SECRET_KEY;
    this.environment = process.env.FLOW_ENVIRONMENT || 'sandbox';
    
    // URLs según ambiente
    this.baseUrl = this.environment === 'production' 
      ? 'https://www.flow.cl/api' 
      : 'https://sandbox.flow.cl/api';
      
    this.frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    
    if (!this.apiKey || !this.secretKey) {
      console.warn('⚠️ Flow no configurado - faltan credenciales');
      return;
    }
    
    console.log('💰 Flow configurado correctamente:', {
      environment: this.environment,
      baseUrl: this.baseUrl
    });
  }

  /**
   * Crear firma para autenticación Flow
   */
  createSignature(params) {
    // Ordenar parámetros alfabéticamente
    const sortedKeys = Object.keys(params).sort();
    const paramsString = sortedKeys.map(key => `${key}${params[key]}`).join('');
    
    // Crear HMAC con secret key
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(paramsString)
      .digest('hex');
  }

  /**
   * Crear un pago con Flow
   */
  async createPayment(paymentData) {
    try {
      if (!this.apiKey || !this.secretKey) {
        throw new Error('Flow no está configurado correctamente');
      }

      const { amount, subject, saleId, userEmail } = paymentData;

      console.log('💰 Creando pago Flow:', { amount, subject, saleId });

      // Parámetros para Flow
      const params = {
        apiKey: this.apiKey,
        commerceOrder: saleId,
        subject: subject,
        currency: 'CLP',
        amount: amount,
        email: userEmail,
        paymentMethod: 9, // Todos los medios de pago
        urlConfirmation: `${this.baseUrl}/webhook/flow`,
        urlReturn: `${this.frontendUrl}/payment/flow/return`
      };

      // Crear firma
      params.s = this.createSignature(params);

      console.log('📡 Enviando solicitud a Flow...');

      const response = await axios.post(`${this.baseUrl}/payment/create`, params);

      if (response.data && response.data.url && response.data.token) {
        console.log('✅ Pago Flow creado exitosamente:', response.data.token);
        
        return {
          success: true,
          paymentUrl: response.data.url + '?token=' + response.data.token,
          token: response.data.token,
          flowUrl: response.data.url,
          saleId: saleId
        };
      } else {
        throw new Error('Respuesta inválida de Flow: ' + JSON.stringify(response.data));
      }

    } catch (error) {
      console.error('❌ Error creando pago Flow:', error.response?.data || error.message);
      throw new Error(`Error Flow: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Confirmar un pago Flow
   */
  async confirmPayment(token) {
    try {
      if (!this.apiKey || !this.secretKey) {
        throw new Error('Flow no está configurado correctamente');
      }

      console.log('🔍 Confirmando pago Flow:', token);

      const params = {
        apiKey: this.apiKey,
        token: token
      };

      // Crear firma
      params.s = this.createSignature(params);

      const response = await axios.get(`${this.baseUrl}/payment/getStatus`, { params });

      if (response.data) {
        console.log('✅ Estado del pago Flow obtenido:', response.data.status);
        
        return {
          success: true,
          status: response.data.status,
          commerceOrder: response.data.commerceOrder,
          requestDate: response.data.requestDate,
          confirmationDate: response.data.confirmationDate,
          amount: response.data.amount,
          payer: response.data.payer,
          paymentData: response.data
        };
      } else {
        throw new Error('No se pudo obtener el estado del pago');
      }

    } catch (error) {
      console.error('❌ Error confirmando pago Flow:', error.response?.data || error.message);
      throw new Error(`Error confirmando Flow: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Procesar webhook de Flow
   */
  async processWebhook(webhookData) {
    try {
      console.log('🔔 Procesando webhook Flow:', webhookData);

      const { token } = webhookData;
      
      if (!token) {
        throw new Error('Token no proporcionado en webhook');
      }

      // Confirmar el pago
      const paymentStatus = await this.confirmPayment(token);

      return {
        success: true,
        paymentStatus,
        shouldUpdateDB: paymentStatus.status === 2 // 2 = Pagado en Flow
      };

    } catch (error) {
      console.error('❌ Error procesando webhook Flow:', error);
      throw error;
    }
  }

  /**
   * Obtener métodos de pago disponibles
   */
  getPaymentMethods() {
    return [
      { id: 'webpay', name: 'Webpay', icon: '💳' },
      { id: 'banco', name: 'Transferencia Bancaria', icon: '🏦' },
      { id: 'servipag', name: 'ServiPag', icon: '🏪' },
      { id: 'multicaja', name: 'Multicaja', icon: '💰' },
      { id: 'chilecompra', name: 'ChileCompra', icon: '🏛️' }
    ];
  }

  /**
   * Calcular costos de transacción
   */
  calculateTransactionCost(amount) {
    // Flow cobra aproximadamente 3.49% + IVA
    const flowFee = amount * 0.0349;
    const iva = flowFee * 0.19;
    const total = flowFee + iva;
    
    return {
      amount,
      flowFee: Math.round(flowFee),
      iva: Math.round(iva),
      totalFee: Math.round(total),
      netAmount: amount - Math.round(total),
      feePercentage: 3.49
    };
  }
}

module.exports = FlowPaymentService;
