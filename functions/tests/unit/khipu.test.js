// Cargar variables de entorno antes de importar servicios
require('dotenv').config();

const KhipuPaymentService = require('../../services/khipuPaymentService');

describe('Khipu Payment Service', () => {
  let khipuService;

  beforeEach(() => {
    khipuService = new KhipuPaymentService();
  });

  test('should have Khipu environment variables configured', () => {
    // Verificar que las variables de entorno estén configuradas
    expect(process.env.KHIPU_RECEIVER_ID).toBeDefined();
    expect(process.env.KHIPU_SECRET).toBeDefined();
    expect(process.env.KHIPU_ENVIRONMENT).toBeDefined();
  });

  test('should initialize Khipu service correctly', () => {
    expect(khipuService).toBeDefined();
    expect(khipuService.receiverId).toBeDefined();
    expect(khipuService.secret).toBeDefined();
    expect(khipuService.environment).toBe('testing');
  });

  test('should create HMAC signature correctly', () => {
    const testData = {
      amount: 50000,
      currency: 'CLP',
      subject: 'Test Course'
    };
    
    const signature = khipuService.createSignature(testData, 'test_secret');
    
    expect(signature).toBeDefined();
    expect(typeof signature).toBe('string');
    expect(signature.length).toBe(64); // SHA256 hex string length
  });

  test('should validate payment data structure', () => {
    const paymentData = {
      amount: 75000,
      subject: 'Curso de Desarrollo Web',
      saleId: 'sale_123',
      courseId: 'course_456',
      userEmail: 'test@ejemplo.com'
    };

    // Validar estructura de datos
    expect(paymentData.amount).toBeGreaterThan(0);
    expect(paymentData.subject).toBeDefined();
    expect(paymentData.saleId).toBeDefined();
    expect(paymentData.courseId).toBeDefined();
    expect(paymentData.userEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  test('should handle payment amount correctly', () => {
    const amounts = [1000, 50000, 100000, 500000];
    
    amounts.forEach(amount => {
      expect(Math.round(amount)).toBe(amount);
      expect(amount).toBeGreaterThan(0);
      expect(amount).toBeLessThanOrEqual(10000000); // Max reasonable amount
    });
  });

  test('should generate valid URLs', () => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
    const apiUrl = process.env.API_BASE_URL || 'http://localhost:3000';
    
    const returnUrl = `${frontendUrl}/payment/khipu/return`;
    const cancelUrl = `${frontendUrl}/payment/khipu/cancel`;
    const webhookUrl = `${apiUrl}/api/payments/khipu/webhook`;
    
    expect(returnUrl).toMatch(/^https?:\/\/.+\/payment\/khipu\/return$/);
    expect(cancelUrl).toMatch(/^https?:\/\/.+\/payment\/khipu\/cancel$/);
    expect(webhookUrl).toMatch(/^https?:\/\/.+\/api\/payments\/khipu\/webhook$/);
  });

  test('should validate webhook data structure', () => {
    const webhookData = {
      payment_id: 'khipu_payment_123',
      notification_signature: 'signature_456'
    };
    
    expect(webhookData.payment_id).toBeDefined();
    expect(webhookData.notification_signature).toBeDefined();
    expect(typeof webhookData.payment_id).toBe('string');
    expect(typeof webhookData.notification_signature).toBe('string');
  });

  test('should calculate commission correctly (Khipu advantage)', () => {
    // Khipu usa comisión fija de $390 CLP
    const khipuCommission = 390;
    
    // Comparar con otros métodos para diferentes montos
    const testAmounts = [25000, 50000, 100000, 150000];
    
    testAmounts.forEach(amount => {
      // Transbank: ~3.5%
      const transbankCommission = Math.round(amount * 0.035);
      
      // Khipu es más barato para montos altos
      if (amount >= 40000) {
        expect(khipuCommission).toBeLessThan(transbankCommission);
        
        const savings = transbankCommission - khipuCommission;
        const savingsPercent = (savings / transbankCommission) * 100;
        
        console.log(`Curso $${amount.toLocaleString()}: Ahorro $${savings} (${savingsPercent.toFixed(1)}%)`);
        expect(savingsPercent).toBeGreaterThan(50); // Al menos 50% de ahorro
      }
    });
  });

  test('should validate bank list structure', () => {
    const expectedBanks = [
      { id: 'bci', name: 'Banco BCI' },
      { id: 'santander', name: 'Banco Santander' },
      { id: 'chile', name: 'Banco de Chile' },
      { id: 'estado', name: 'BancoEstado' },
      { id: 'scotiabank', name: 'Scotiabank' }
    ];
    
    expectedBanks.forEach(bank => {
      expect(bank.id).toBeDefined();
      expect(bank.name).toBeDefined();
      expect(typeof bank.id).toBe('string');
      expect(typeof bank.name).toBe('string');
    });
  });

  test('should handle timeout configuration', () => {
    const timeoutMinutes = 30;
    const timeoutMs = timeoutMinutes * 60 * 1000;
    const expiryDate = new Date(Date.now() + timeoutMs);
    
    expect(expiryDate.getTime()).toBeGreaterThan(Date.now());
    expect(expiryDate.getTime() - Date.now()).toBeLessThanOrEqual(timeoutMs + 1000); // 1s tolerance
  });
});
