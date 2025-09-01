// Configuración técnica comparativa: Khipu vs Flow

/**
 * KHIPU - Especialista en Transferencias Bancarias
 */
class KhipuPaymentService {
  constructor() {
    this.apiUrl = 'https://khipu.com/api/2.0';
    this.receiverId = process.env.KHIPU_RECEIVER_ID;
    this.secret = process.env.KHIPU_SECRET;
  }

  // Ventaja: Proceso muy simple
  async createPayment(orderData) {
    const payment = {
      amount: orderData.amount,
      currency: 'CLP',
      subject: orderData.courseTitle,
      body: `Acceso al curso: ${orderData.courseTitle}`,
      return_url: `${process.env.FRONTEND_URL}/payment/khipu/success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/khipu/cancel`,
      notify_url: `${process.env.API_URL}/webhooks/khipu`,
      // Ventaja única: Comisión fija
      fixed_commission: true
    };

    return this.makeRequest('POST', '/payments', payment);
  }

  // Ventaja: Confirmación inmediata
  async verifyPayment(paymentId) {
    return this.makeRequest('GET', `/payments/${paymentId}`);
  }
}

/**
 * FLOW - Pasarela Integral Chilena
 */
class FlowPaymentService {
  constructor() {
    this.apiUrl = 'https://www.flow.cl/api';
    this.apiKey = process.env.FLOW_API_KEY;
    this.secretKey = process.env.FLOW_SECRET_KEY;
  }

  // Ventaja: Múltiples métodos en una integración
  async createPayment(orderData) {
    const payment = {
      commerceOrder: orderData.orderId,
      subject: orderData.courseTitle,
      amount: orderData.amount,
      currency: 'CLP',
      // Ventaja única: Usuario elige método de pago
      paymentMethod: 'auto', // tarjeta, transferencia, servipag, etc.
      urlConfirmation: `${process.env.API_URL}/webhooks/flow`,
      urlReturn: `${process.env.FRONTEND_URL}/payment/flow/return`,
      // Ventaja: Cuotas sin interés
      installments: orderData.installments || 1
    };

    return this.makeRequest('POST', '/payment/create', payment);
  }

  // Múltiples estados por diferentes métodos
  async getPaymentStatus(token) {
    return this.makeRequest('GET', '/payment/getStatus', { token });
  }
}

// Comparación de costos en tiempo real
const costComparison = {
  calculateCommission: (amount, gateway, method = 'default') => {
    const costs = {
      transbank: {
        default: amount * 0.0295 * 1.19 // 2.95% + IVA
      },
      khipu: {
        default: 390 // Fijo
      },
      flow: {
        card: amount * 0.0349 * 1.19,      // 3.49% + IVA
        transfer: amount * 0.0299 * 1.19,  // 2.99% + IVA
        servipag: amount * 0.045 * 1.19    // 4.5% + IVA
      },
      stripe: {
        default: (amount * 0.036) + 30 // 3.6% + $30
      }
    };

    return Math.round(costs[gateway][method] || costs[gateway].default);
  },

  // Análisis de rentabilidad por monto
  profitabilityAnalysis: (coursePrice) => {
    const gateways = ['transbank', 'khipu', 'flow', 'stripe'];
    const analysis = {};

    gateways.forEach(gateway => {
      const commission = costComparison.calculateCommission(coursePrice, gateway);
      analysis[gateway] = {
        commission,
        netAmount: coursePrice - commission,
        percentage: ((commission / coursePrice) * 100).toFixed(2)
      };
    });

    return analysis;
  }
};

// Recomendaciones automáticas por monto
const getRecommendation = (amount) => {
  if (amount <= 30000) {
    return {
      primary: 'transbank',
      reason: 'Más confiable para montos bajos',
      alternative: 'flow',
      alternativeReason: 'Opción Servipag para efectivo'
    };
  } else if (amount <= 80000) {
    return {
      primary: 'khipu',
      reason: 'Comisión fija más rentable',
      alternative: 'transbank',
      alternativeReason: 'Backup confiable'
    };
  } else {
    return {
      primary: 'khipu',
      reason: 'Máxima rentabilidad en montos altos',
      alternative: 'flow',
      alternativeReason: 'Transferencias bancarias alternativas'
    };
  }
};

module.exports = {
  KhipuPaymentService,
  FlowPaymentService,
  costComparison,
  getRecommendation
};
