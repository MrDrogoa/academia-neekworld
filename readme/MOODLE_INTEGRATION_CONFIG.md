# Configuración Moodle para Integración con Carrito de Compras

## Información de Conexión de Moodle

### Configuración para el Examen de Grado

**URL Base de Moodle:** `https://neekworld.cl/NW/`

**Credenciales de Administrador:**
- Usuario: `admin`
- Contraseña: `Gala2024.`

**Información de la Base de Datos:**
- Host: `localhost`
- Database: `neekworl_moodl83`
- Username: `neekworl_moodl83`
- Password: `u8(q[t65pS`

**Token de API:** `[Se generará en Moodle > Administración del sitio > Plugins > Servicios web]`

### Configuración de Servicios Web en Moodle

1. **Habilitar Servicios Web:**
   - Ir a `Administración del sitio > Características avanzadas`
   - Habilitar "Servicios web"

2. **Crear Servicio Web:**
   - Ir a `Administración del sitio > Plugins > Servicios web > Servicios externos`
   - Crear nuevo servicio: "Academia Shopping Cart Integration"

3. **Funciones Requeridas:**
   ```
   core_course_create_courses
   core_course_get_courses
   core_enrol_get_enrolled_users
   enrol_manual_enrol_users
   core_user_create_users
   core_user_get_users
   ```

4. **Configurar Token:**
   - Ir a `Administración del sitio > Plugins > Servicios web > Gestionar tokens`
   - Crear token para el usuario del servicio

### Estructura de Cursos en Moodle

Los cursos creados desde el carrito de compras seguirán esta estructura:

```json
{
  "courses": [
    {
      "id": "course_001",
      "fullname": "Desarrollo Web con Vue.js 3",
      "shortname": "VUE3_WEB_DEV",
      "categoryid": 1,
      "summary": "Aprende a crear aplicaciones web modernas con Vue.js 3",
      "format": "topics",
      "visible": 1
    },
    {
      "id": "course_002", 
      "fullname": "Python para Data Science",
      "shortname": "PYTHON_DATA_SCI",
      "categoryid": 2,
      "summary": "Domina Python para análisis de datos profesional",
      "format": "topics",
      "visible": 1
    }
  ]
}
```

### Categorías de Cursos

```json
{
  "categories": [
    {
      "id": 1,
      "name": "Desarrollo Web",
      "description": "Cursos de desarrollo frontend y backend"
    },
    {
      "id": 2,
      "name": "Data Science",
      "description": "Cursos de análisis de datos y machine learning"
    },
    {
      "id": 3,
      "name": "Diseño",
      "description": "Cursos de UI/UX y diseño digital"
    },
    {
      "id": 4,
      "name": "Marketing",
      "description": "Cursos de marketing digital y estrategias"
    },
    {
      "id": 5,
      "name": "DevOps",
      "description": "Cursos de infraestructura y deployment"
    }
  ]
}
```

### APIs Utilizadas

#### 1. Inscribir Usuario en Curso
```javascript
// POST /webservice/rest/server.php
{
  wstoken: 'tu_token_aqui',
  wsfunction: 'enrol_manual_enrol_users',
  moodlewsrestformat: 'json',
  enrolments: [
    {
      roleid: 5, // ID del rol estudiante
      userid: userId,
      courseid: courseId
    }
  ]
}
```

#### 2. Obtener Información del Curso
```javascript
// POST /webservice/rest/server.php
{
  wstoken: 'tu_token_aqui',
  wsfunction: 'core_course_get_courses',
  moodlewsrestformat: 'json',
  options: {
    ids: [courseId]
  }
}
```

#### 3. Crear Usuario (si no existe)
```javascript
// POST /webservice/rest/server.php
{
  wstoken: 'tu_token_aqui',
  wsfunction: 'core_user_create_users',
  moodlewsrestformat: 'json',
  users: [
    {
      username: 'usuario123',
      password: 'temporal123',
      firstname: 'Juan',
      lastname: 'Pérez',
      email: 'juan@ejemplo.com'
    }
  ]
}
```

### Configuración en cartService.js

El archivo `cartService.js` ya incluye la función `enableCoursesInMoodle()` que se conectará con estas APIs:

```javascript
// Configuración de Moodle (se moverá a variables de entorno)
const MOODLE_CONFIG = {
  baseUrl: 'https://tu-moodle.ejemplo.com',
  token: 'tu_token_de_moodle',
  wsEndpoint: '/webservice/rest/server.php'
}
```

### Variables de Entorno Requeridas

Crear archivo `.env` en el frontend:

```env
VUE_APP_MOODLE_BASE_URL=https://tu-moodle.ejemplo.com
VUE_APP_MOODLE_TOKEN=tu_token_secreto
VUE_APP_MOODLE_WS_ENDPOINT=/webservice/rest/server.php
```

### Flujo de Integración Post-Compra

1. **Usuario completa compra** → `cartService.processCartPurchase()`
2. **Sistema procesa pago** → Stripe/Transbank/Khipu
3. **Pago confirmado** → `enableCoursesInMoodle()`
4. **Inscripción automática** → APIs de Moodle
5. **Notificación al usuario** → Email + Dashboard
6. **Redirección** → `/my-courses` o Moodle

### Datos de Demostración para el Examen

#### Usuarios de Prueba
- **Estudiante:** `estudiante@demo.com` / `demo123`
- **Profesor:** `profesor@demo.com` / `demo123` 
- **Administrador:** `admin@demo.com` / `admin123`

#### Cursos de Demostración
- Vue.js 3 (Desarrollo Web) - $89.990
- Python Data Science - $109.990
- Diseño UI/UX - $79.990
- Marketing Digital - $69.990
- DevOps con Docker - $119.990

#### Cupones de Descuento
- `DEMO20` - 20% descuento
- `ESTUDIANTE` - 15% descuento
- `PRIMERA_COMPRA` - 25% descuento
- `BLACK_FRIDAY` - 40% descuento

### Checklist Pre-Examen

- [ ] Servidor frontend ejecutándose (`npm run serve`)
- [ ] Servidor backend ejecutándose (`npm run dev`)
- [ ] Base de datos Firebase configurada
- [ ] Moodle configurado con servicios web
- [ ] Variables de entorno configuradas
- [ ] Datos de demostración cargados
- [ ] Carrito de compras funcional
- [ ] Proceso de pago integrado
- [ ] Inscripción automática en Moodle
- [ ] Panel "Mis Cursos" funcionando

### Próximos Pasos

1. **Configurar instancia Moodle real**
2. **Generar token de API**
3. **Actualizar variables de entorno**
4. **Probar flujo completo de compra**
5. **Verificar inscripción automática**
6. **Preparar demostración para examen**

---

*Nota: Este documento debe actualizarse con los datos reales de Moodle antes del examen de grado.*
