# Registro de Usuarios de Prueba - Sistema de Autenticación

## 📋 Resumen del Proceso

Este documento detalla el proceso de configuración y registro de usuarios de prueba para el sistema de autenticación del proyecto academia.

## 👥 Usuarios de Prueba Configurados

Los siguientes usuarios de prueba han sido configurados exitosamente en el sistema:

### 🎓 Estudiante
- **Email:** `student@neekworld.cl`
- **Contraseña:** `Password123!`
- **Rol:** `student`
- **Nombre:** Estudiante Neekworld

### 👨‍🏫 Profesor
- **Email:** `teacher@neekworld.cl`
- **Contraseña:** `Password123!`
- **Rol:** `teacher`
- **Nombre:** Profesor Neekworld

### 👨‍💼 Administrador
- **Email:** `admin@neekworld.cl`
- **Contraseña:** `Password123!`
- **Rol:** `admin`
- **Nombre:** Admin Neekworld

## 🔧 Correcciones Realizadas

### 1. Problema de Roles
**Issue:** El sistema solo permitía roles `student` y `teacher`, rechazando el rol `admin`.

**Solución:** Modificado el archivo `functions/controllers/authController.js`:
```javascript
// Antes
const validRoles = ['student', 'teacher'];

// Después
const validRoles = ['student', 'teacher', 'admin'];
```

### 2. Error de Middleware
**Issue:** Error `Cannot find module '../middlewares/auth'` en múltiples archivos.

**Archivos corregidos:**
- `functions/controllers/advancedPaymentController.js`
- `functions/routes/advancedPayments.js`

**Solución:** Cambiado la referencia del middleware:
```javascript
// Antes
const { verifyToken } = require('../middlewares/auth');

// Después
const { verifyToken } = require('../middlewares/authMiddleware');
```

### 3. Mejoras en Manejo de Errores
**Agregado:** Logging detallado en el proceso de registro para identificar errores específicos:
- Error en creación de Firebase Auth
- Error en encriptación de contraseña
- Error en guardado en Firestore

## 🧪 Proceso de Pruebas

### Script de Pruebas Utilizado
Archivo: `functions/tests/manual-auth-tests.js`

### Casos de Error Verificados ✅
1. **Contraseña Débil:** Detecta contraseñas que no cumplen requisitos
2. **Email Inválido:** Valida formato de correo electrónico
3. **Contraseñas No Coinciden:** Verifica que password y confirmPassword sean iguales

### Estado Final de Usuarios
```
📊 === RESULTADO FINAL ===
✅ Usuarios registrados exitosamente
❌ Error: "El correo ya está registrado" (indica registro previo exitoso)
```

## 🌐 API Endpoint
**URL Base:** `https://us-central1-academy-bd619.cloudfunctions.net/api`

### Endpoints de Autenticación
- **Registro:** `POST /auth/register`
- **Login:** `POST /auth/login`
- **Perfil:** `GET /auth/profile`

## 🔐 Validaciones de Seguridad

### Contraseña
- Mínimo 8 caracteres
- Incluir mayúsculas y minúsculas
- Incluir números
- Incluir símbolos especiales

### Email
- Formato válido según regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

## 📝 Uso para Pruebas

Los usuarios pueden utilizarse para:

1. **Pruebas de Login**
   ```javascript
   {
     "email": "student@neekworld.cl",
     "password": "Password123!"
   }
   ```

2. **Pruebas de Roles**
   - Student: Acceso a cursos y contenido básico
   - Teacher: Creación y gestión de cursos
   - Admin: Gestión completa del sistema

3. **Pruebas de Autenticación**
   - Verificación de tokens JWT
   - Middleware de autorización por roles

## 🚀 Deploy Status

- **Estado:** ✅ Completado exitosamente
- **Fecha:** 24 de Agosto, 2025
- **Funciones:** `api` y `moodleSync` actualizadas
- **URL de Funciones:** `https://us-central1-academy-bd619.cloudfunctions.net/api`

## 📱 Próximos Pasos

1. Usar estos usuarios para pruebas de frontend
2. Verificar funcionalidades específicas por rol
3. Probar flujos completos de autenticación
4. Implementar casos de prueba automatizados

## 🔍 Comando de Verificación

Para verificar que los usuarios funcionan correctamente:

```bash
node ./functions/tests/manual-auth-tests.js
```

## 📞 Contacto

Para dudas o issues relacionados con estos usuarios de prueba, revisar:
- Logs de Firebase Functions
- Console de Firebase Auth
- Firestore para datos de usuarios

---

**Nota:** Estos usuarios están configurados para ambiente de desarrollo/testing. No usar en producción.
