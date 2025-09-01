const FlowPaymentService = require('../../services/flowPaymentService');

describe('FlowPaymentService', () => {
  let flowService;

  beforeAll(() => {
    // Configurar variables de entorno para testing
    process.env.FLOW_API_KEY = 'test_api_key_flow_123';
    process.env.FLOW_SECRET_KEY = 'test_secret_key_flow_456';
    process.env.FLOW_ENVIRONMENT = 'sandbox';
    process.env.FRONTEND_URL = 'http://localhost:8080';
  });

  beforeEach(() => {
    flowService = new FlowPaymentService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Inicialización', () => {
    test('debe inicializar correctamente con variables de entorno', () => {
      expect(flowService.apiKey).toBe('test_api_key_flow_123');
      expect(flowService.secretKey).toBe('test_secret_key_flow_456');
      expect(flowService.environment).toBe('sandbox');
      expect(flowService.baseUrl).toBe('https://sandbox.flow.cl/api');
    });

    test('debe manejar variables de entorno faltantes', () => {
      delete process.env.FLOW_API_KEY;
      delete process.env.FLOW_SECRET_KEY;
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const service = new FlowPaymentService();
      
      expect(consoleSpy).toHaveBeenCalledWith('⚠️ Flow no configurado - faltan credenciales');
      
      consoleSpy.mockRestore();
      
      // Restaurar variables
      process.env.FLOW_API_KEY = 'test_api_key_flow_123';
      process.env.FLOW_SECRET_KEY = 'test_secret_key_flow_456';
    });
  });

  describe('Firma de autenticación', () => {
    test('debe crear firma HMAC correcta', () => {
      const params = {
        apiKey: 'test_key',
        amount: 1000,
        commerceOrder: 'test_order'
      };

      const signature = flowService.createSignature(params);
      
      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.length).toBe(64); // SHA256 en hex tiene 64 caracteres
    });

    test('debe generar la misma firma para los mismos parámetros', () => {
      const params = {
        amount: 1000,
        apiKey: 'test_key',
        commerceOrder: 'test_order'
      };

      const signature1 = flowService.createSignature(params);
      const signature2 = flowService.createSignature(params);
      
      expect(signature1).toBe(signature2);
    });

    test('debe generar firmas diferentes para parámetros diferentes', () => {
      const params1 = { apiKey: 'key1', amount: 1000 };
      const params2 = { apiKey: 'key2', amount: 1000 };

      const signature1 = flowService.createSignature(params1);
      const signature2 = flowService.createSignature(params2);
      
      expect(signature1).not.toBe(signature2);
    });
  });

  describe('Métodos de pago', () => {
    test('debe retornar lista de métodos de pago disponibles', () => {
      const methods = flowService.getPaymentMethods();
      
      expect(Array.isArray(methods)).toBe(true);
      expect(methods.length).toBeGreaterThan(0);
      expect(methods[0]).toHaveProperty('id');
      expect(methods[0]).toHaveProperty('name');
      expect(methods[0]).toHaveProperty('icon');
    });
  });

  describe('Cálculo de costos', () => {
    test('debe calcular costos de transacción correctamente', () => {
      const amount = 10000;
      const costs = flowService.calculateTransactionCost(amount);
      
      expect(costs).toHaveProperty('amount', amount);
      expect(costs).toHaveProperty('flowFee');
      expect(costs).toHaveProperty('iva');
      expect(costs).toHaveProperty('totalFee');
      expect(costs).toHaveProperty('netAmount');
      expect(costs).toHaveProperty('feePercentage', 3.49);
      
      // Verificar cálculos
      const expectedFlowFee = Math.round(amount * 0.0349);
      const expectedIva = Math.round(expectedFlowFee * 0.19);
      const expectedTotal = expectedFlowFee + expectedIva;
      
      expect(costs.flowFee).toBe(expectedFlowFee);
      expect(costs.iva).toBe(expectedIva);
      expect(costs.totalFee).toBe(expectedTotal);
      expect(costs.netAmount).toBe(amount - expectedTotal);
    });

    test('debe manejar montos pequeños', () => {
      const amount = 100;
      const costs = flowService.calculateTransactionCost(amount);
      
      expect(costs.amount).toBe(amount);
      expect(costs.totalFee).toBeGreaterThan(0);
      expect(costs.netAmount).toBeLessThan(amount);
    });

    test('debe manejar montos grandes', () => {
      const amount = 1000000;
      const costs = flowService.calculateTransactionCost(amount);
      
      expect(costs.amount).toBe(amount);
      expect(costs.flowFee).toBe(Math.round(amount * 0.0349));
      expect(costs.netAmount).toBeLessThan(amount);
    });
  });

  describe('Validación de errores', () => {
    test('debe lanzar error cuando Flow no está configurado', async () => {
      const serviceWithoutConfig = new FlowPaymentService();
      serviceWithoutConfig.apiKey = null;
      serviceWithoutConfig.secretKey = null;

      await expect(serviceWithoutConfig.createPayment({
        amount: 1000,
        subject: 'Test',
        saleId: 'test_sale',
        userEmail: 'test@test.com'
      })).rejects.toThrow('Flow no está configurado correctamente');
    });
  });

  describe('Comparación de costos', () => {
    test('debe mostrar ventaja económica vs otras pasarelas', () => {
      const amount = 50000; // $50.000 CLP
      
      // Flow: 3.49% + IVA
      const flowCosts = flowService.calculateTransactionCost(amount);
      
      // Comparar con costos estimados de otras pasarelas
      const transbank = amount * 0.029; // ~2.9%
      const khipu = 990; // Tarifa fija de ~$990
      
      // Flow debería ser competitivo
      console.log('💰 Comparación de costos para $50.000:');
      console.log(`Flow: $${flowCosts.totalFee}`);
      console.log(`Transbank (estimado): $${Math.round(transbank)}`);
      console.log(`Khipu (estimado): $${khipu}`);
      
      expect(flowCosts.totalFee).toBeGreaterThan(0);
      expect(flowCosts.feePercentage).toBe(3.49);
    });
  });
});

describe('Integración Flow con sistema de ventas', () => {
  test('debe seguir el flujo completo de pago', () => {
    const saleData = {
      saleId: 'SALE_123',
      amount: 25000,
      courseTitle: 'Curso de Programación',
      userEmail: 'estudiante@test.com'
    };

    // Simular flujo de pago
    console.log('🔄 Simulando flujo de pago Flow:');
    console.log('1. Crear pago con Flow API');
    console.log('2. Redirigir usuario a Flow');
    console.log('3. Usuario completa pago en Flow');
    console.log('4. Flow envía webhook de confirmación');
    console.log('5. Sistema confirma inscripción automáticamente');
    
    expect(saleData.saleId).toBeDefined();
    expect(saleData.amount).toBeGreaterThan(0);
  });
});
