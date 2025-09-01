# Script de Configuración de Moodle para Servicios Web

## Pasos para Configurar Servicios Web en Moodle

### 1. Acceder como Administrador
- URL: https://neekworld.cl/NW/
- Usuario: admin
- Contraseña: Gala2024.

### 2. Habilitar Servicios Web
1. Ir a **Administración del sitio** > **Características avanzadas**
2. Marcar **Habilitar servicios web**
3. Guardar cambios

### 3. Habilitar Protocolos
1. Ir a **Administración del sitio** > **Plugins** > **Servicios web** > **Gestionar protocolos**
2. Habilitar **REST protocol**

### 4. Crear un Servicio Web Externo
1. Ir a **Administración del sitio** > **Plugins** > **Servicios web** > **Servicios externos**
2. Hacer clic en **Agregar**
3. Completar:
   - **Nombre**: Academia Shopping Cart Integration
   - **Nombre corto**: academia_cart
   - **Habilitado**: Sí
   - **Usuarios autorizados solamente**: No
   - **Puede descargar archivos**: Sí
   - **Puede subir archivos**: Sí

### 5. Agregar Funciones al Servicio
Después de crear el servicio, agregar estas funciones:

```
core_course_create_courses
core_course_get_courses
core_course_get_courses_by_field
enrol_manual_enrol_users
core_user_create_users
core_user_get_users
core_user_get_users_by_field
```

### 6. Crear Usuario para API
1. Ir a **Administración del sitio** > **Usuarios** > **Cuentas** > **Agregar un nuevo usuario**
2. Completar:
   - **Nombre de usuario**: api_academia
   - **Contraseña**: ApiAcademia2024!
   - **Nombre**: API
   - **Apellido**: Academia
   - **Dirección de correo**: api@academia.com

### 7. Asignar Capacidades al Usuario API
1. Ir a **Administración del sitio** > **Usuarios** > **Permisos** > **Asignar roles del sistema**
2. Asignar rol **Manager** al usuario api_academia

### 8. Crear Token para el Usuario API
1. Ir a **Administración del sitio** > **Plugins** > **Servicios web** > **Gestionar tokens**
2. Hacer clic en **Crear token**
3. Completar:
   - **Usuario**: api_academia
   - **Servicio**: Academia Shopping Cart Integration
   - **Dirección IP**: (dejar vacío para cualquier IP)
   - **Válido hasta**: (fecha futura o vacío)

### 9. Copiar el Token Generado
El token generado debe copiarse y agregarse a las variables de entorno del proyecto.

## Variables de Entorno

Crear archivo `.env` en la carpeta `frontend`:

```env
VUE_APP_MOODLE_BASE_URL=https://neekworld.cl/NW
VUE_APP_MOODLE_TOKEN=tu_token_generado_aqui
VUE_APP_MOODLE_WS_ENDPOINT=/webservice/rest/server.php
```

## Crear Categorías de Cursos

1. Ir a **Administración del sitio** > **Cursos** > **Gestionar cursos y categorías**
2. Crear las siguientes categorías:

- **Desarrollo Web** (ID: 1)
- **Data Science** (ID: 2)  
- **Diseño** (ID: 3)
- **Marketing** (ID: 4)
- **DevOps** (ID: 5)
- **Desarrollo Móvil** (ID: 6)

## Crear Cursos de Demostración

Para cada curso del catálogo, crear en Moodle:

### Curso 1: Desarrollo Web con Vue.js 3
- **Nombre completo**: Desarrollo Web con Vue.js 3
- **Nombre corto**: VUE3_WEB_DEV
- **Categoría**: Desarrollo Web
- **Resumen**: Aprende a crear aplicaciones web modernas con Vue.js 3, Vuetify y las mejores prácticas
- **Formato**: Formato por temas

### Curso 2: Python para Data Science
- **Nombre completo**: Python para Data Science
- **Nombre corto**: PYTHON_DATA_SCI
- **Categoría**: Data Science
- **Resumen**: Domina Python, pandas, numpy y matplotlib para análisis de datos profesional
- **Formato**: Formato por temas

### Curso 3: Diseño UI/UX Profesional
- **Nombre completo**: Diseño UI/UX Profesional
- **Nombre corto**: DESIGN_UIUX
- **Categoría**: Diseño
- **Resumen**: Crea interfaces atractivas y funcionales usando Figma y principios de diseño centrado en el usuario
- **Formato**: Formato por temas

### Curso 4: Marketing Digital Completo
- **Nombre completo**: Marketing Digital Completo
- **Nombre corto**: MARKETING_DIGITAL
- **Categoría**: Marketing
- **Resumen**: Estrategias de marketing digital, SEO, SEM, redes sociales y análisis de métricas
- **Formato**: Formato por temas

### Curso 5: DevOps con Docker y Kubernetes
- **Nombre completo**: DevOps con Docker y Kubernetes
- **Nombre corto**: DEVOPS_DOCKER_K8S
- **Categoría**: DevOps
- **Resumen**: Automatiza deployments y gestiona contenedores en entornos de producción
- **Formato**: Formato por temas

### Curso 6: React Native Masterclass
- **Nombre completo**: React Native Masterclass
- **Nombre corto**: REACT_NATIVE_MASTER
- **Categoría**: Desarrollo Móvil
- **Resumen**: Desarrolla aplicaciones móviles nativas para iOS y Android con React Native
- **Formato**: Formato por temas

## Prueba de la API

Para probar que los servicios web funcionan, puedes usar esta URL de prueba:

```
https://neekworld.cl/NW/webservice/rest/server.php?wstoken=TU_TOKEN&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json
```

Si funciona correctamente, deberías recibir información del sitio en formato JSON.

## Mapeo de IDs

Una vez creados los cursos, actualizar el mapeo en el código:

```javascript
const COURSE_ID_MAPPING = {
  'course_001': 1, // ID real del curso Vue.js en Moodle
  'course_002': 2, // ID real del curso Python en Moodle
  'course_003': 3, // ID real del curso Diseño en Moodle
  'course_004': 4, // ID real del curso Marketing en Moodle
  'course_005': 5, // ID real del curso DevOps en Moodle
  'course_006': 6  // ID real del curso React Native en Moodle
}
```

## Checklist de Configuración

- [ ] Servicios web habilitados
- [ ] Protocolo REST habilitado
- [ ] Servicio externo creado
- [ ] Funciones agregadas al servicio
- [ ] Usuario API creado
- [ ] Token generado
- [ ] Variables de entorno configuradas
- [ ] Categorías de cursos creadas
- [ ] Cursos de demostración creados
- [ ] API probada con token

---

**Nota**: Completar estos pasos antes de la demostración del examen para tener la integración completa funcionando.
