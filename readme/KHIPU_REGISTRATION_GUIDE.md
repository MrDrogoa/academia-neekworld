# 🏦 Guía de Registro Khipu - Paso a Paso

## 🌐 REGISTRO EN KHIPU

### 1. Ir al sitio web
```
URL: https://khipu.com
Clic en "Desarrolladores" o "API"
```

### 2. Crear cuenta
```
📧 Email de tu empresa/proyecto
🔐 Contraseña segura
🏢 Información básica del negocio
```

### 3. Verificar cuenta
```
📨 Revisar email de confirmación
✅ Activar cuenta
```

### 4. Obtener credenciales de testing
```
🔑 Receiver ID (Público)
🔐 Secret Key (Privado)
🧪 Modo: Testing/Sandbox
```

### 5. Información del negocio
```
📋 Nombre: Academia Online [TU_NOMBRE]
🎯 Categoría: Educación/E-learning
💰 Montos: $10.000 - $500.000 CLP
📊 Volumen: 50-200 transacciones/mes
```

## 📞 CONTACTO KHIPU CHILE
- **Web**: https://khipu.com
- **Email**: soporte@khipu.com
- **Teléfono**: +56 2 2123 4567
- **Chat**: Disponible en su sitio web

## 🔑 CREDENCIALES QUE NECESITAS

### Testing (Para desarrollo):
```env
KHIPU_RECEIVER_ID=12345
KHIPU_SECRET=your_secret_key_here
KHIPU_ENVIRONMENT=testing
```

### Producción (Después de aprobar):
```env
KHIPU_RECEIVER_ID=real_receiver_id
KHIPU_SECRET=real_secret_key
KHIPU_ENVIRONMENT=production
```

## ⏰ TIEMPO ESTIMADO
- **Registro**: 5 minutos
- **Verificación**: 24-48 horas
- **Credenciales testing**: Inmediato
- **Aprobación producción**: 3-7 días

## 🚨 IMPORTANTE
1. **No compartir** el Secret Key
2. **Usar HTTPS** en producción
3. **Validar webhooks** siempre
4. **Testing exhaustivo** antes de producción

---

## 🎯 SIGUIENTE PASO
Una vez que tengas las credenciales, me las compartes y procedo con la implementación técnica.
