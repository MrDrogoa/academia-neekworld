#!/bin/bash

# 🚀 Script de Configuración Rápida - Academia Virtual
# Este script configura automáticamente el entorno de desarrollo

echo "🎓 Configurando Academia Virtual - MVP Examen"
echo "============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "functions" ]; then
    print_error "Este script debe ejecutarse desde la raíz del proyecto"
    exit 1
fi

print_status "Verificando estructura del proyecto..."

# Crear archivos de configuración si no existen
create_env_files() {
    print_status "Creando archivos de configuración..."
    
    # Frontend .env.local
    if [ ! -f "frontend/.env.local" ]; then
        cat > frontend/.env.local << 'EOL'
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBexamplekey
VITE_FIREBASE_AUTH_DOMAIN=academy-bd619.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=academy-bd619
VITE_FIREBASE_STORAGE_BUCKET=academy-bd619.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_FUNCTIONS_URL=http://localhost:3000

# Stripe (Test Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890
EOL
        print_success "Frontend .env.local creado"
    else
        print_warning "Frontend .env.local ya existe"
    fi
    
    # Backend .env
    if [ ! -f "functions/.env" ]; then
        cat > functions/.env << 'EOL'
# Firebase Admin
FIREBASE_PROJECT_ID=academy-bd619
GOOGLE_APPLICATION_CREDENTIALS=./config/academy-bd619-firebase-adminsdk-sqh3j-fcca0a0223.json

# JWT Secret
JWT_SECRET=academia_virtual_jwt_secret_super_seguro_2024

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51234567890
STRIPE_WEBHOOK_SECRET=whsec_1234567890

# Transbank Configuration (Test Mode)
TRANSBANK_INTEGRATION_TYPE=TEST
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C

# URLs
FRONTEND_URL=http://localhost:8080
BACKEND_URL=http://localhost:3000

# Development
NODE_ENV=development
DEBUG=true
EOL
        print_success "Backend .env creado"
    else
        print_warning "Backend .env ya existe"
    fi
}

# Instalar dependencias
install_dependencies() {
    print_status "Instalando dependencias del frontend..."
    cd frontend
    if npm install; then
        print_success "Dependencias del frontend instaladas"
    else
        print_error "Error instalando dependencias del frontend"
        exit 1
    fi
    cd ..
    
    print_status "Instalando dependencias del backend..."
    cd functions
    if npm install; then
        print_success "Dependencias del backend instaladas"
    else
        print_error "Error instalando dependencias del backend"
        exit 1
    fi
    cd ..
}

# Verificar Firebase CLI
check_firebase() {
    print_status "Verificando Firebase CLI..."
    if command -v firebase &> /dev/null; then
        print_success "Firebase CLI encontrado"
        firebase --version
    else
        print_warning "Firebase CLI no encontrado"
        print_status "Instalando Firebase CLI..."
        npm install -g firebase-tools
    fi
}

# Crear datos de demo
create_demo_data() {
    print_status "Creando archivo de datos demo..."
    
    cat > demo-data.json << 'EOL'
{
  "users": [
    {
      "email": "admin@academia.com",
      "password": "Admin123!",
      "name": "Administrador",
      "role": "admin"
    },
    {
      "email": "profesor@academia.com", 
      "password": "Profesor123!",
      "name": "Juan Profesor",
      "role": "teacher"
    },
    {
      "email": "estudiante@academia.com",
      "password": "Estudiante123!",
      "name": "María Estudiante", 
      "role": "student"
    }
  ],
  "courses": [
    {
      "title": "Desarrollo Web Básico",
      "description": "Aprende HTML, CSS y JavaScript desde cero",
      "category": "Programación",
      "modality": "asynchronized",
      "duration_days": 30,
      "isFree": true,
      "instructor": "profesor@academia.com"
    },
    {
      "title": "Vue.js Avanzado",
      "description": "Domina Vue.js 3 con Composition API",
      "category": "Frontend",
      "modality": "synchronized", 
      "totalPrice": 29990,
      "instructor": "profesor@academia.com"
    },
    {
      "title": "Firebase Backend",
      "description": "Crea backends escalables con Firebase",
      "category": "Backend",
      "modality": "asynchronized",
      "duration_days": 45,
      "totalPrice": 39990,
      "hasActiveDiscount": true,
      "discountPercentage": 20,
      "instructor": "profesor@academia.com"
    }
  ]
}
EOL
    print_success "Datos demo creados en demo-data.json"
}

# Crear script de inicio
create_start_script() {
    print_status "Creando script de inicio..."
    
    cat > start-dev.sh << 'EOL'
#!/bin/bash

echo "🚀 Iniciando Academia Virtual en modo desarrollo"
echo "================================================"

# Función para limpiar procesos al salir
cleanup() {
    echo "🧹 Limpiando procesos..."
    jobs -p | xargs -r kill
    exit
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Verificar puertos libres
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Puerto $1 está ocupado"
        return 1
    else
        echo "✅ Puerto $1 disponible"
        return 0
    fi
}

echo "🔍 Verificando puertos..."
check_port 8080 || { echo "Frontend necesita puerto 8080"; exit 1; }
check_port 3000 || { echo "Backend necesita puerto 3000"; exit 1; }

echo ""
echo "🎯 Iniciando servicios..."

# Iniciar frontend
echo "📱 Iniciando frontend en puerto 8080..."
cd frontend
npm run serve &
FRONTEND_PID=$!

# Esperar un poco
sleep 3

# Iniciar backend  
echo "⚙️  Iniciando backend en puerto 3000..."
cd ../functions
npm run serve &
BACKEND_PID=$!

echo ""
echo "✅ Servicios iniciados:"
echo "   Frontend: http://localhost:8080"
echo "   Backend:  http://localhost:3000"
echo ""
echo "📝 Usuarios demo:"
echo "   Admin:      admin@academia.com      / Admin123!"
echo "   Profesor:   profesor@academia.com   / Profesor123!"
echo "   Estudiante: estudiante@academia.com / Estudiante123!"
echo ""
echo "⏹️  Para detener, presiona Ctrl+C"

# Esperar a que termine algún proceso
wait
EOL

    chmod +x start-dev.sh
    print_success "Script de inicio creado: ./start-dev.sh"
}

# Crear documentación de setup
create_setup_docs() {
    print_status "Creando documentación de setup..."
    
    cat > SETUP_RAPIDO.md << 'EOL'
# 🚀 Setup Rápido - Academia Virtual

## Prerrequisitos
- Node.js 18+ instalado
- npm o yarn
- Firebase CLI (se instala automáticamente)

## Configuración Automática

1. **Ejecutar script de configuración:**
```bash
chmod +x setup.sh
./setup.sh
```

2. **Iniciar servicios de desarrollo:**
```bash
./start-dev.sh
```

3. **Acceder a la aplicación:**
- Frontend: http://localhost:8080
- Backend: http://localhost:3000

## Usuarios Demo

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@academia.com | Admin123! |
| Profesor | profesor@academia.com | Profesor123! |
| Estudiante | estudiante@academia.com | Estudiante123! |

## Funcionalidades Verificadas

### ✅ Autenticación
- [x] Registro de usuarios
- [x] Login con email/password  
- [x] Diferenciación de roles
- [x] Dashboard personalizado

### ✅ Gestión de Cursos
- [x] Crear cursos (profesor)
- [x] Aprobar cursos (admin)
- [x] Catálogo público
- [x] Búsqueda y filtros

### ✅ Sistema de Pagos
- [x] Transbank WebPay Plus
- [x] Stripe Payments
- [x] Confirmaciones automáticas
- [x] Inscripciones post-pago

### ✅ UI/UX
- [x] Diseño responsivo
- [x] Paleta corporativa
- [x] Notificaciones
- [x] Accesibilidad básica

## Estructura del Proyecto

```
academia-virtual/
├── frontend/          # Vue.js 3 + Vuetify
├── functions/         # Firebase Functions
├── docs/             # Documentación
├── demo-data.json    # Datos de demostración
├── setup.sh          # Script de configuración
└── start-dev.sh      # Script de inicio
```

## Para el Examen

### Preparación (5 min antes):
1. Ejecutar `./start-dev.sh`
2. Verificar que ambos servicios responden
3. Hacer login con usuario demo
4. Tener datos precargados

### Flujo de Demostración:
1. Login con diferentes roles
2. Crear curso como profesor
3. Buscar y filtrar cursos
4. Proceso completo de compra
5. Dashboard actualizado
6. Panel administrativo

### Plan B:
- Video de backup preparado
- Screenshots de funcionalidades
- Datos demo precargados
- Versión offline disponible

## Soporte Técnico

Si algo falla durante la configuración:

1. **Verificar versiones:**
```bash
node --version  # Debería ser 18+
npm --version   # Debería ser 8+
```

2. **Limpiar cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

3. **Verificar puertos:**
```bash
lsof -i :8080  # Frontend
lsof -i :3000  # Backend
```

4. **Logs detallados:**
```bash
# En terminal separadas:
cd frontend && npm run serve
cd functions && npm run serve
```

¡El proyecto está listo para impresionar! 🎓
EOL

    print_success "Documentación creada: SETUP_RAPIDO.md"
}

# Ejecución principal
main() {
    print_status "Iniciando configuración de Academia Virtual..."
    
    create_env_files
    echo ""
    
    install_dependencies
    echo ""
    
    check_firebase
    echo ""
    
    create_demo_data
    echo ""
    
    create_start_script
    echo ""
    
    create_setup_docs
    echo ""
    
    print_success "🎉 Configuración completada exitosamente!"
    echo ""
    echo "📋 Próximos pasos:"
    echo "   1. Revisar archivos .env y ajustar credenciales"
    echo "   2. Ejecutar: ./start-dev.sh"
    echo "   3. Abrir: http://localhost:8080"
    echo "   4. Login con usuarios demo"
    echo ""
    echo "📖 Más información en: SETUP_RAPIDO.md"
    echo ""
    echo "🚀 ¡Todo listo para el examen!"
}

# Ejecutar función principal
main
