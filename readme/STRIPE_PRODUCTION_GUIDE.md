# 💳 Guía de Implementación Stripe - Producción

## 📋 Checklist para el Cliente

### Paso 1: Crear Cuenta Stripe
- [ ] Registrarse en https://dashboard.stripe.com/register
- [ ] Verificar email empresarial
- [ ] Completar información de la empresa
- [ ] Subir documentos requeridos

### Paso 2: Activar Cuenta
- [ ] Verificación de identidad aprobada
- [ ] Configurar métodos de pago aceptados
- [ ] Establecer frecuencia de pagos
- [ ] Configurar cuenta bancaria para recibir fondos

### Paso 3: Obtener Credenciales de Producción
```env
# Credenciales REALES de producción (reemplazar con valores reales)
STRIPE_PUBLIC_KEY=pk_live_[TU_CLAVE_PUBLICA_AQUI]
STRIPE_SECRET_KEY=sk_live_[TU_CLAVE_SECRETA_AQUI]
STRIPE_WEBHOOK_SECRET=whsec_[TU_WEBHOOK_SECRET_AQUI]
```

### Paso 4: Configurar Webhooks
URL del Webhook: https://academy-bd619.web.app/api/payments/stripe/webhook

Eventos a Configurar:
- payment_intent.succeeded
- payment_intent.payment_failed
- payment_intent.requires_action

## 💰 Costos de Stripe (Chile)

### Tarifas por Transacción:
- **Tarjetas nacionales**: 3.6% + $30 CLP
- **Tarjetas internacionales**: 4.4% + $30 CLP
- **Disputas**: $75.000 CLP por disputa

### Ejemplo de Costos:
```
Curso de $50.000 CLP:
- Comisión Stripe: $1.830 CLP (3.6% + $30)
- Recibes: $48.170 CLP

Curso de $100.000 CLP:
- Comisión Stripe: $3.630 CLP (3.6% + $30)
- Recibes: $96.370 CLP
```

## 🚀 Ventajas para el Cliente

### Pagos Internacionales:
✅ Acepta tarjetas de todo el mundo
✅ Soporte para 135+ monedas
✅ Conversión automática a CLP
✅ Protección contra fraude incluida

### Facilidad de Uso:
✅ Dashboard completo para gestión
✅ Reportes detallados de ventas
✅ API móvil para monitoreo
✅ Integración directa con contabilidad

### Seguridad:
✅ Certificación PCI DSS Level 1
✅ Protección contra chargebacks
✅ Detección de fraude con ML
✅ Cumple normativas internacionales

## 📞 Contacto Stripe Chile
- **Teléfono**: +56 2 2123 4567
- **Email**: support@stripe.com
- **Chat**: Disponible 24/7 en dashboard
- **Documentación**: https://stripe.com/docs

## ⚠️ Consideraciones Importantes

### Tiempos de Aprobación:
- Cuenta básica: 1-2 días hábiles
- Verificación completa: 3-7 días hábiles
- Primera transferencia: 7 días después del primer pago

### Montos Límite:
- Inicial: $500.000 CLP/mes
- Después de verificación: Sin límite
- Transacción máxima: $5.000.000 CLP

### Documentación Requerida:
1. Cédula de identidad del representante legal
2. Iniciación de actividades (SII)
3. Estados financieros últimos 6 meses
4. Comprobante de domicilio empresarial
5. Estatutos de constitución de la sociedad

## 🔧 Proceso de Migración

### De Testing a Producción:
1. Obtener credenciales de producción
2. Actualizar variables de entorno
3. Configurar webhooks de producción
4. Realizar transacción de prueba
5. Monitorear primeras ventas

### Testing Recomendado:
- [ ] Transacción exitosa $1.000 CLP
- [ ] Verificar webhook de confirmación
- [ ] Confirmar recepción de fondos
- [ ] Probar flujo de reembolso
