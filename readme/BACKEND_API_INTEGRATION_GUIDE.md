# Backend API Endpoints para Integración Bidireccional con Moodle

## Documentación de Endpoints Requeridos

### 1. Autenticación y Gestión de Usuarios

#### POST /api/auth/register
- **Propósito**: Registrar nuevo usuario en la plataforma y Moodle
- **Payload**:
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "password": "string",
  "country": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "userId": "string",
  "userData": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "student"
  },
  "moodleData": {
    "moodleUserId": "number",
    "username": "string", 
    "tempPassword": "string"
  }
}
```

#### POST /api/auth/login
- **Propósito**: Autenticar usuario y crear sesión SSO con Moodle
- **Payload**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "success": true,
  "token": "string",
  "userData": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "student"
  },
  "moodleSSO": {
    "ssoUrl": "string",
    "moodleUserId": "number"
  }
}
```

#### POST /api/auth/logout
- **Propósito**: Cerrar sesión y limpiar tokens
- **Headers**: Authorization: Bearer {token}

### 2. Gestión de Cursos y Compras

#### POST /api/courses/purchase
- **Propósito**: Procesar compra de cursos con inscripción automática en Moodle
- **Headers**: Authorization: Bearer {token}
- **Payload**:
```json
{
  "items": [
    {
      "id": "string",
      "title": "string",
      "price": "number"
    }
  ],
  "paymentMethod": "string",
  "paymentData": {}
}
```
- **Response**:
```json
{
  "success": true,
  "orderId": "string",
  "moodleEnrollments": [
    {
      "courseId": "string",
      "moodleCourseId": "number",
      "enrollmentStatus": "enrolled"
    }
  ]
}
```

#### GET /api/user/courses
- **Propósito**: Obtener cursos del usuario sincronizados con Moodle
- **Headers**: Authorization: Bearer {token}
- **Response**:
```json
{
  "courses": [
    {
      "id": "string",
      "title": "string",
      "moodleCourseId": "number",
      "enrollmentDate": "string",
      "progress": "number",
      "lastAccessed": "string"
    }
  ]
}
```

### 3. Sincronización con Moodle

#### POST /api/moodle/sync-progress
- **Propósito**: Sincronizar progreso desde Moodle
- **Headers**: Authorization: Bearer {token}
- **Payload**:
```json
{
  "courseId": "string" // opcional, si no se envía sincroniza todos
}
```

#### POST /api/moodle/sync-grades
- **Propósito**: Sincronizar calificaciones desde Moodle
- **Headers**: Authorization: Bearer {token}
- **Payload**:
```json
{
  "courseId": "string" // opcional
}
```

#### GET /api/moodle/user-mapping
- **Propósito**: Obtener mapeo entre usuario de la plataforma y Moodle
- **Headers**: Authorization: Bearer {token}

### 4. Configuración de Moodle

#### POST /api/moodle/create-user
- **Propósito**: Crear usuario en Moodle (uso interno)
- **Headers**: Authorization: Bearer {adminToken}
- **Payload**:
```json
{
  "username": "string",
  "password": "string",
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "country": "string"
}
```

#### POST /api/moodle/enroll-course
- **Propósito**: Inscribir usuario en curso de Moodle (uso interno)
- **Headers**: Authorization: Bearer {adminToken}
- **Payload**:
```json
{
  "userId": "number",
  "courseId": "number",
  "roleId": 5
}
```

#### GET /api/moodle/course-progress/:userId/:courseId
- **Propósito**: Obtener progreso de usuario en curso específico

#### GET /api/moodle/user-grades/:userId/:courseId?
- **Propósito**: Obtener calificaciones de usuario

## Variables de Entorno Requeridas

```env
# Moodle Configuration
MOODLE_BASE_URL=https://neekworld.cl/NW
MOODLE_WS_TOKEN=tu_token_de_servicios_web
MOODLE_WS_ENDPOINT=/webservice/rest/server.php

# Database
MONGODB_URI=mongodb://localhost:27017/academia
# o
MYSQL_HOST=localhost
MYSQL_USER=usuario
MYSQL_PASSWORD=password
MYSQL_DATABASE=academia

# JWT
JWT_SECRET=tu_secret_key_aqui
JWT_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:8080
```

## Estructura de Base de Datos

### Tabla/Colección: users
```json
{
  "_id": "ObjectId",
  "email": "string",
  "password": "string (hashed)",
  "firstName": "string",
  "lastName": "string",
  "country": "string",
  "role": "student|teacher|admin",
  "moodleUserId": "number",
  "moodleUsername": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Tabla/Colección: purchases
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "orderId": "string",
  "items": [
    {
      "courseId": "string",
      "title": "string",
      "price": "number"
    }
  ],
  "total": "number",
  "paymentMethod": "string",
  "status": "completed|pending|failed",
  "createdAt": "Date"
}
```

### Tabla/Colección: course_enrollments
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "courseId": "string",
  "moodleCourseId": "number",
  "enrollmentDate": "Date",
  "lastAccessed": "Date",
  "progress": "number",
  "status": "enrolled|completed|suspended"
}
```

### Tabla/Colección: moodle_sync_log
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "syncType": "progress|grades|enrollment",
  "courseId": "string",
  "status": "success|error",
  "errorMessage": "string",
  "data": "Object",
  "syncedAt": "Date"
}
```

## Configuración Requerida en Moodle

### 1. Habilitar Servicios Web
1. Ir a Administración del sitio > Funciones avanzadas
2. Habilitar "Servicios web"

### 2. Crear Token de Servicios Web
1. Ir a Administración del sitio > Servidores > Servicios web > Gestionar tokens
2. Crear token para usuario administrador

### 3. Habilitar Funciones de Servicios Web
- core_user_create_users
- core_user_get_users_by_field
- enrol_manual_enrol_users
- core_course_get_courses
- core_grades_get_grades
- gradereport_user_get_grade_items
- core_completion_get_course_completion_status

### 4. Configurar Método de Autenticación
- Habilitar autenticación por servicios web
- Configurar SSO si es necesario

## Próximos Pasos de Implementación

1. **Backend API Development**
   - Implementar endpoints de autenticación
   - Crear servicios de integración con Moodle
   - Configurar base de datos y modelos

2. **Moodle Configuration**
   - Configurar servicios web en la instancia Moodle
   - Crear cursos de ejemplo
   - Configurar roles y permisos

3. **Testing & Integration**
   - Probar flujo completo de registro
   - Validar SSO y sincronización
   - Testear compras y inscripciones automáticas

4. **Production Deployment**
   - Configurar variables de entorno
   - Implementar logging y monitoring
   - Configurar backups de sincronización
