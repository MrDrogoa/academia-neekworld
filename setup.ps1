# 🚀 Script de Configuración Rápida - Academia Virtual (Windows PowerShell)
# Este script configura automáticamente el entorno de desarrollo en Windows

Write-Host "🎓 Configurando Academia Virtual - MVP Examen" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Función para imprimir con colores
function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json") -and -not (Test-Path "frontend") -and -not (Test-Path "functions")) {
    Write-Error "Este script debe ejecutarse desde la raíz del proyecto"
    exit 1
}

Write-Status "Verificando estructura del proyecto..."

# Crear archivos de configuración si no existen
function Create-EnvFiles {
    Write-Status "Creando archivos de configuración..."
    
    # Frontend .env.local
    if (-not (Test-Path "frontend\.env.local")) {
        $frontendEnv = @'
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
'@
        $frontendEnv | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
        Write-Success "Frontend .env.local creado"
    } else {
        Write-Warning "Frontend .env.local ya existe"
    }
    
    # Backend .env
    if (-not (Test-Path "functions\.env")) {
        $backendEnv = @'
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
'@
        $backendEnv | Out-File -FilePath "functions\.env" -Encoding UTF8
        Write-Success "Backend .env creado"
    } else {
        Write-Warning "Backend .env ya existe"
    }
}

# Instalar dependencias
function Install-Dependencies {
    Write-Status "Instalando dependencias del frontend..."
    Set-Location frontend
    try {
        npm install
        Write-Success "Dependencias del frontend instaladas"
    } catch {
        Write-Error "Error instalando dependencias del frontend"
        exit 1
    }
    Set-Location ..
    
    Write-Status "Instalando dependencias del backend..."
    Set-Location functions
    try {
        npm install
        Write-Success "Dependencias del backend instaladas"
    } catch {
        Write-Error "Error instalando dependencias del backend"
        exit 1
    }
    Set-Location ..
}

# Verificar Firebase CLI
function Check-Firebase {
    Write-Status "Verificando Firebase CLI..."
    try {
        $firebaseVersion = firebase --version
        Write-Success "Firebase CLI encontrado: $firebaseVersion"
    } catch {
        Write-Warning "Firebase CLI no encontrado"
        Write-Status "Instalando Firebase CLI..."
        npm install -g firebase-tools
    }
}

# Crear datos de demo
function Create-DemoData {
    Write-Status "Creando archivo de datos demo..."
    
    $demoData = @'
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
'@
    $demoData | Out-File -FilePath "demo-data.json" -Encoding UTF8
    Write-Success "Datos demo creados en demo-data.json"
}

# Crear script de inicio para Windows
function Create-StartScript {
    Write-Status "Creando script de inicio..."
    
    $startScript = @'
# 🚀 Script de Inicio - Academia Virtual (Windows)

Write-Host "🚀 Iniciando Academia Virtual en modo desarrollo" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Función para verificar puertos
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

Write-Host "🔍 Verificando puertos..." -ForegroundColor Blue

if (Test-Port 8080) {
    Write-Host "⚠️  Puerto 8080 está ocupado" -ForegroundColor Yellow
    Write-Host "   Para liberar: netstat -ano | findstr :8080"
    exit 1
} else {
    Write-Host "✅ Puerto 8080 disponible" -ForegroundColor Green
}

if (Test-Port 3000) {
    Write-Host "⚠️  Puerto 3000 está ocupado" -ForegroundColor Yellow
    Write-Host "   Para liberar: netstat -ano | findstr :3000"
    exit 1
} else {
    Write-Host "✅ Puerto 3000 disponible" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Iniciando servicios..." -ForegroundColor Blue

# Iniciar frontend en nueva ventana
Write-Host "📱 Iniciando frontend en puerto 8080..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run serve" -WindowStyle Normal

# Esperar un poco
Start-Sleep -Seconds 3

# Iniciar backend en nueva ventana
Write-Host "⚙️  Iniciando backend en puerto 3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd functions; npm run serve" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Servicios iniciándose en ventanas separadas:" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:8080" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📝 Usuarios demo:" -ForegroundColor Yellow
Write-Host "   Admin:      admin@academia.com      / Admin123!" -ForegroundColor White
Write-Host "   Profesor:   profesor@academia.com   / Profesor123!" -ForegroundColor White
Write-Host "   Estudiante: estudiante@academia.com / Estudiante123!" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Abriendo navegador..." -ForegroundColor Blue
Start-Sleep -Seconds 5
Start-Process "http://localhost:8080"

Write-Host ""
Write-Host "⏹️  Para detener los servicios, cierra las ventanas de PowerShell" -ForegroundColor Cyan
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
'@
    
    $startScript | Out-File -FilePath "start-dev.ps1" -Encoding UTF8
    Write-Success "Script de inicio creado: .\start-dev.ps1"
}

# Crear documentación de setup
function Create-SetupDocs {
    Write-Status "Creando documentación de setup..."
    
    $setupDocs = @'
# 🚀 Setup Rápido - Academia Virtual (Windows)

## Prerrequisitos
- Node.js 18+ instalado
- npm (incluido con Node.js)
- PowerShell 5.0+ (incluido en Windows 10+)

## Configuración Automática

1. **Ejecutar script de configuración (como Administrador):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\setup.ps1
```

2. **Iniciar servicios de desarrollo:**
```powershell
.\start-dev.ps1
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

## Comandos Útiles Windows

### Verificar puertos ocupados:
```cmd
netstat -ano | findstr :8080
netstat -ano | findstr :3000
```

### Terminar proceso por PID:
```cmd
taskkill /PID [número] /F
```

### Limpiar cache npm:
```cmd
npm cache clean --force
rmdir /s node_modules
del package-lock.json
npm install
```

## Estructura del Proyecto

```
academia-virtual/
├── frontend/          # Vue.js 3 + Vuetify
├── functions/         # Firebase Functions
├── docs/             # Documentación
├── demo-data.json    # Datos de demostración
├── setup.ps1         # Script de configuración
└── start-dev.ps1     # Script de inicio
```

## Solución de Problemas

### Error de PowerShell Execution Policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Puertos ocupados:
```cmd
# Encontrar proceso que usa el puerto
netstat -ano | findstr :8080
# Terminar proceso (reemplazar PID)
taskkill /PID [número] /F
```

### Node.js no encontrado:
1. Descargar desde: https://nodejs.org
2. Instalar versión LTS
3. Reiniciar PowerShell
4. Verificar: `node --version`

### Problemas de permisos:
- Ejecutar PowerShell como Administrador
- Verificar antivirus no bloquee Node.js

## Para el Examen

### Preparación (5 min antes):
1. Ejecutar `.\start-dev.ps1`
2. Verificar ambos servicios en navegador
3. Login con usuario demo
4. Tener datos precargados

### URLs importantes:
- Aplicación: http://localhost:8080
- API: http://localhost:3000/api
- Firebase Console: https://console.firebase.google.com

¡El proyecto está listo para impresionar! 🎓
'@

    $setupDocs | Out-File -FilePath "SETUP_RAPIDO_WINDOWS.md" -Encoding UTF8
    Write-Success "Documentación creada: SETUP_RAPIDO_WINDOWS.md"
}

# Función principal
function Main {
    Write-Status "Iniciando configuración de Academia Virtual..."
    
    Create-EnvFiles
    Write-Host ""
    
    Install-Dependencies
    Write-Host ""
    
    Check-Firebase
    Write-Host ""
    
    Create-DemoData
    Write-Host ""
    
    Create-StartScript
    Write-Host ""
    
    Create-SetupDocs
    Write-Host ""
    
    Write-Success "🎉 Configuración completada exitosamente!"
    Write-Host ""
    Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "   1. Revisar archivos .env y ajustar credenciales"
    Write-Host "   2. Ejecutar: .\start-dev.ps1"
    Write-Host "   3. Abrir: http://localhost:8080"
    Write-Host "   4. Login con usuarios demo"
    Write-Host ""
    Write-Host "📖 Más información en: SETUP_RAPIDO_WINDOWS.md" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🚀 ¡Todo listo para el examen!" -ForegroundColor Green
    
    # Preguntar si quiere iniciar ahora
    $response = Read-Host "`n¿Deseas iniciar los servicios ahora? (s/n)"
    if ($response -eq 's' -or $response -eq 'S' -or $response -eq 'yes' -or $response -eq 'y') {
        Write-Host "Iniciando servicios..." -ForegroundColor Green
        .\start-dev.ps1
    }
}

# Ejecutar función principal
Main
