# 🚀 GUÍA COMPLETA DEL BACKEND - ACADEMIA VIRTUAL

## 📋 **INFORMACIÓN GENERAL**

**URL Base de Producción:** `https://us-central1-academy-bd619.cloudfunctions.net/api`  
**URL Base de Desarrollo:** `http://localhost:5006`  
**Plataforma:** Firebase Functions (Node.js 20)  
**Framework:** Express.js  
**Base de Datos:** Firebase Firestore  
**Autenticación:** Firebase Auth + JWT Custom  

---

## 🏗️ **ARQUITECTURA DEL BACKEND**

### **Estructura Principal**
```
functions/
├── index.js                    # Punto de entrada principal
├── config/
│   └── firebase.js            # Configuración Firebase Admin
├── controllers/               # Lógica de negocio
├── middlewares/               # Autenticación y validaciones
├── models/                    # Modelos de datos
├── routes/                    # Definición de rutas
├── services/                  # Servicios externos (pagos, Moodle)
└── utils/                     # Utilidades y helpers
```

---

## 🔐 **SISTEMA DE AUTENTICACIÓN**

### **Tipos de Tokens Soportados**
1. **Firebase ID Tokens** (recomendado)
2. **Custom JWT Tokens** (para compatibilidad)

### **Middleware de Autenticación**

#### **verifyToken** - Middleware Principal
```javascript
// Uso en rutas
router.get('/protected', verifyToken, (req, res) => {
  // req.user estará disponible con:
  // - uid: ID del usuario
  // - email: Email del usuario  
  // - role: Rol del usuario
  // - tokenType: 'firebase' | 'custom'
});
```

#### **checkRole** - Validación de Roles
```javascript
// Verificar roles específicos
router.get('/admin-only', verifyToken, checkRole(['admin']), controllerFunction);
router.get('/teachers', verifyToken, checkRole(['teacher', 'admin']), controllerFunction);
```

### **Roles Disponibles**
- `admin`: Acceso completo al sistema
- `teacher`: Crear y gestionar cursos
- `student`: Inscribirse y acceder a cursos
- `master`: Super administrador (funcionalidad extendida)

---

## 🌐 **CONFIGURACIÓN CORS**

### **Orígenes Permitidos**
```javascript
const allowedOrigins = [
  'http://localhost:8080',    // Vue.js desarrollo
  'http://localhost:8081',    // Vue.js puerto alternativo
  'http://localhost:8082',    
  'http://localhost:8083',
  'https://academy-bd619.web.app',        // Producción Firebase
  'https://academy-bd619.firebaseapp.com' // Dominio alternativo
];
```

### **Métodos Permitidos**
`GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS`

---

## 📡 **RUTAS PRINCIPALES DEL API**

### **🔑 Autenticación (`/auth`)**

#### `POST /auth/register`
**Descripción:** Registrar nuevo usuario  
**Cuerpo de la petición:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com", 
  "password": "MiPassword123!",
  "confirmPassword": "MiPassword123!",
  "phone": "+56912345678",
  "role": "student"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "firebase_uid",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "student"
  },
  "token": "jwt_token_here"
}
```

#### `POST /auth/login`
**Descripción:** Iniciar sesión  
**Cuerpo de la petición:**
```json
{
  "email": "juan@example.com",
  "password": "MiPassword123!"
}
```

**Respuesta Exitosa:**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": "firebase_uid",
    "name": "Juan Pérez", 
    "email": "juan@example.com",
    "role": "student"
  },
  "token": "jwt_token_here"
}
```

---

### **👥 Usuarios (`/users`)**

#### `GET /users` 
**Autenticación:** Requerida (Admin)  
**Descripción:** Listar todos los usuarios

#### `GET /users/:id`
**Autenticación:** Requerida  
**Descripción:** Obtener información de usuario específico

#### `PUT /users/:id`
**Autenticación:** Requerida  
**Descripción:** Actualizar información de usuario

---

### **📚 Cursos (`/courses`)**

#### `GET /courses`
**Autenticación:** No requerida  
**Descripción:** Listar todos los cursos públicos

**Respuesta:**
```json
{
  "courses": [
    {
      "id": "course_id",
      "title": "Curso de React",
      "description": "Aprende React desde cero",
      "price": 99990,
      "currency": "CLP",
      "image": "https://url-imagen.com/react.jpg",
      "instructor": "María García",
      "level": "beginner",
      "category": "programming",
      "status": "published"
    }
  ]
}
```

#### `POST /courses`
**Autenticación:** Requerida (Teacher/Admin)  
**Descripción:** Crear nuevo curso

**Cuerpo de la petición:**
```json
{
  "title": "Nuevo Curso",
  "description": "Descripción del curso", 
  "price": 50000,
  "currency": "CLP",
  "image": "https://imagen.com/curso.jpg",
  "level": "intermediate",
  "category": "design"
}
```

#### `PUT /courses/:id`
**Autenticación:** Requerida (Teacher propietario/Admin)  
**Descripción:** Actualizar curso existente

#### `GET /courses/:id`
**Autenticación:** Requerida + Acceso al curso  
**Descripción:** Obtener detalles completos del curso

---

### **🛒 Inscripciones (`/enrollments`)**

#### `POST /enrollments`
**Autenticación:** Requerida (Student)  
**Descripción:** Inscribirse en un curso

#### `GET /enrollments`
**Autenticación:** Requerida  
**Descripción:** Obtener inscripciones del usuario

---

### **💳 Pagos (`/api/payments`)**

#### `POST /api/payments/stripe/create-intent`
**Descripción:** Crear intención de pago con Stripe

#### `POST /api/payments/transbank/create`
**Descripción:** Crear transacción con Transbank WebPay

#### `POST /api/payments/khipu/create`
**Descripción:** Crear pago con Khipu

---

### **🏥 Salud del Sistema (`/health`)**

#### `GET /health`
**Descripción:** Verificar estado del API

#### `GET /health/firebase`
**Descripción:** Verificar conexión con Firebase

#### `POST /health/token-debug`
**Descripción:** Debug de tokens para desarrollo

---

## 🔧 **MIDDLEWARE DE AUTENTICACIÓN**

### **Headers Requeridos**
Todas las rutas protegidas requieren:
```
Authorization: Bearer <token>
```

### **Estructura del objeto `req.user`**
Después de la autenticación exitosa:
```javascript
req.user = {
  uid: "firebase_uid",           // ID único del usuario
  email: "user@example.com",     // Email del usuario
  role: "student",               // Rol del usuario
  displayName: "Juan Pérez",     // Nombre completo
  photoURL: "https://...",       // URL de foto de perfil
  tokenType: "firebase"          // Tipo de token usado
}
```

---

## 🛠️ **CONFIGURACIÓN DE VARIABLES DE ENTORNO**

### **Variables Requeridas (.env)**
```env
# Firebase
FIREBASE_PROJECT_ID=academy-bd619

# JWT
JWT_SECRET=your_secret_key_here

# Stripe
STRIPE_SECRET_KEY=sk_test_[TU_CLAVE_AQUI]
STRIPE_PUBLIC_KEY=pk_test_[TU_CLAVE_AQUI]

# Transbank
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C

# Khipu  
KHIPU_RECEIVER_ID=your_receiver_id
KHIPU_SECRET=your_secret_key
KHIPU_ENVIRONMENT=sandbox

# Moodle
MOODLE_URL=https://tu-moodle.com
MOODLE_TOKEN=tu_token_aqui
```

---

## 🚨 **MANEJO DE ERRORES**

### **Códigos de Estado HTTP**
- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error en la petición (datos inválidos)
- `401`: No autenticado o token inválido
- `403`: Acceso denegado (permisos insuficientes)
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

### **Formato de Errores**
```json
{
  "message": "Descripción del error",
  "details": "Detalles específicos del error",
  "status": "error"
}
```

---

## 📱 **INTEGRACIÓN CON FRONTEND**

### **Configuración de Axios (Recomendada)**
```javascript
// En el frontend Vue.js
import axios from 'axios';

// Configurar base URL
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:5006';

// Interceptor para incluir token automáticamente
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Redirigir al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### **Ejemplo de Llamada al API**
```javascript
// Obtener cursos
const getCourses = async () => {
  try {
    const response = await axios.get('/courses');
    return response.data.courses;
  } catch (error) {
    console.error('Error obteniendo cursos:', error);
    throw error;
  }
};

// Crear curso (requiere autenticación)
const createCourse = async (courseData) => {
  try {
    const response = await axios.post('/courses', courseData);
    return response.data;
  } catch (error) {
    console.error('Error creando curso:', error);
    throw error;
  }
};
```

---

## 🔄 **FLUJO DE AUTENTICACIÓN COMPLETO**

### **1. Registro de Usuario**
```
Frontend -> POST /auth/register -> Backend
                                    ↓
                              Firebase Auth (crear usuario)
                                    ↓
                              Firestore (guardar datos adicionales)
                                    ↓
                              Respuesta con token JWT
```

### **2. Login de Usuario**
```
Frontend -> POST /auth/login -> Backend
                                 ↓
                           Verificar email/password
                                 ↓
                           Generar token JWT
                                 ↓
                           Respuesta con token
```

### **3. Peticiones Autenticadas**
```
Frontend -> GET /courses (con token) -> Backend
                                         ↓
                                   verifyToken middleware
                                         ↓
                                   Validar token Firebase/JWT
                                         ↓
                                   Obtener datos usuario (req.user)
                                         ↓
                                   Ejecutar controlador
```

---

## 🧪 **ENDPOINTS DE TESTING**

### **Usuarios de Prueba**
```
Admin:
- Email: admin@test.com  
- Password: Admin123!

Teacher:
- Email: teacher@test.com
- Password: Teacher123!

Student:
- Email: student@test.com  
- Password: Student123!
```

### **Rutas de Debug**
- `GET /health` - Estado del API
- `GET /health/firebase` - Conexión Firebase
- `POST /health/token-debug` - Analizar tokens
- `GET /protected` - Probar autenticación

---

## 📈 **MÉTRICAS Y MONITOREO**

### **Logs Disponibles**
El backend registra automáticamente:
- Peticiones entrantes y salientes
- Errores de autenticación
- Operaciones de base de datos
- Transacciones de pago

### **Endpoints de Métricas**
- `GET /metrics` - Estadísticas del sistema
- `GET /health` - Estado de servicios

---

## 🔐 **SEGURIDAD IMPLEMENTADA**

### **Validaciones de Input**
- Email: Formato válido requerido
- Password: Mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos
- Roles: Solo valores permitidos (`admin`, `teacher`, `student`)

### **Protección CORS**
- Lista blanca de orígenes permitidos
- Headers de seguridad configurados

### **Tokens**
- Expiración automática
- Verificación de integridad
- Rotación de secrets recomendada

---

## 🚀 **DEPLOYMENT**

### **Comandos de Despliegue**
```bash
# Desplegar a Firebase Functions
npm run deploy

# Desplegar solo funciones específicas
firebase deploy --only functions

# Ver logs en producción
firebase functions:log
```

### **URLs de Producción**
- **API Principal:** `https://us-central1-academy-bd619.cloudfunctions.net/api`
- **Dashboard:** `https://academy-bd619.web.app`

---

## 📞 **SOPORTE Y CONTACTO**

Para implementar el frontend correctamente:

1. **Usar la URL base correcta** según el entorno
2. **Incluir siempre el token** en el header `Authorization`
3. **Manejar errores 401** redirigiendo al login
4. **Verificar CORS** si tienes problemas de conectividad
5. **Usar los endpoints de health** para debugging

**¿Dudas?** Revisa los logs del backend o usa `/health/token-debug` para analizar problemas de autenticación.
