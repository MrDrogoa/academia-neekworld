# Script de Configuracion - Academia Virtual

Write-Host "Configurando Academia Virtual - MVP Examen" -ForegroundColor Green
Write-Host "==========================================="

# Verificar estructura del proyecto
if (-not (Test-Path "frontend") -or -not (Test-Path "functions")) {
    Write-Host "ERROR: Este script debe ejecutarse desde la raiz del proyecto" -ForegroundColor Red
    exit 1
}

Write-Host "Verificando estructura del proyecto..." -ForegroundColor Blue

# Crear archivo .env.local para el frontend
Write-Host "Creando archivos de configuracion..." -ForegroundColor Blue

if (-not (Test-Path "frontend\.env.local")) {
    @"
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBexamplekey
VITE_FIREBASE_AUTH_DOMAIN=academy-bd619.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=academy-bd619

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
VITE_FUNCTIONS_URL=http://localhost:3000

# Stripe Test Mode
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_[TU_CLAVE_AQUI]
"@ | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
    Write-Host "Frontend .env.local creado" -ForegroundColor Green
} else {
    Write-Host "Frontend .env.local ya existe" -ForegroundColor Yellow
}

if (-not (Test-Path "functions\.env")) {
    @"
# Firebase Admin
FIREBASE_PROJECT_ID=academy-bd619
GOOGLE_APPLICATION_CREDENTIALS=./config/academy-bd619-firebase-adminsdk-sqh3j-fcca0a0223.json

# JWT Secret
JWT_SECRET=academia_virtual_jwt_secret_super_seguro_2024

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_[TU_CLAVE_AQUI]
STRIPE_WEBHOOK_SECRET=whsec_1234567890

# Transbank Test Mode
TRANSBANK_INTEGRATION_TYPE=TEST
TRANSBANK_COMMERCE_CODE=597055555532
TRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C

# URLs
FRONTEND_URL=http://localhost:8080
BACKEND_URL=http://localhost:3000

# Development
NODE_ENV=development
DEBUG=true
"@ | Out-File -FilePath "functions\.env" -Encoding UTF8
    Write-Host "Backend .env creado" -ForegroundColor Green
} else {
    Write-Host "Backend .env ya existe" -ForegroundColor Yellow
}

# Instalar dependencias del frontend
Write-Host "Instalando dependencias del frontend..." -ForegroundColor Blue
Set-Location frontend
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Dependencias del frontend instaladas" -ForegroundColor Green
} else {
    Write-Host "Error instalando dependencias del frontend" -ForegroundColor Red
}
Set-Location ..

# Instalar dependencias del backend
Write-Host "Instalando dependencias del backend..." -ForegroundColor Blue
Set-Location functions
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Dependencias del backend instaladas" -ForegroundColor Green
} else {
    Write-Host "Error instalando dependencias del backend" -ForegroundColor Red
}
Set-Location ..

# Crear datos demo
Write-Host "Creando archivo de datos demo..." -ForegroundColor Blue
@"
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
      "name": "Maria Estudiante",
      "role": "student"
    }
  ]
}
"@ | Out-File -FilePath "demo-data.json" -Encoding UTF8
Write-Host "Datos demo creados en demo-data.json" -ForegroundColor Green

# Crear script de inicio
Write-Host "Creando script de inicio..." -ForegroundColor Blue
@"
# Script de Inicio - Academia Virtual

Write-Host "Iniciando Academia Virtual..." -ForegroundColor Green
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Blue
Write-Host "Backend: http://localhost:3000" -ForegroundColor Blue
Write-Host ""
Write-Host "Usuarios demo:" -ForegroundColor Yellow
Write-Host "  Admin: admin@academia.com / Admin123!"
Write-Host "  Profesor: profesor@academia.com / Profesor123!"
Write-Host "  Estudiante: estudiante@academia.com / Estudiante123!"
Write-Host ""

# Iniciar frontend en nueva ventana
Write-Host "Iniciando frontend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run serve"

# Esperar y iniciar backend
Start-Sleep -Seconds 3
Write-Host "Iniciando backend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd functions; npm run serve"

# Abrir navegador
Start-Sleep -Seconds 5
Write-Host "Abriendo navegador..." -ForegroundColor Blue
Start-Process "http://localhost:8080"

Write-Host ""
Write-Host "Servicios iniciados!" -ForegroundColor Green
Write-Host "Para detener, cierra las ventanas de PowerShell"
"@ | Out-File -FilePath "start-dev.ps1" -Encoding UTF8
Write-Host "Script de inicio creado: .\start-dev.ps1" -ForegroundColor Green

Write-Host ""
Write-Host "Configuracion completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Ejecutar: .\start-dev.ps1"
Write-Host "   2. Abrir: http://localhost:8080"
Write-Host "   3. Login con usuarios demo"
Write-Host ""
Write-Host "Todo listo para el examen!" -ForegroundColor Green

$response = Read-Host "`nDeseas iniciar los servicios ahora? (s/n)"
if ($response -eq 's' -or $response -eq 'S') {
    Write-Host "Iniciando servicios..." -ForegroundColor Green
    .\start-dev.ps1
}
