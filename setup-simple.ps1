# 🚀 Script de Configuración Simple - Academia Virtual

Write-Host "🎓 Configurando Academia Virtual - MVP Examen" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "frontend") -or -not (Test-Path "functions")) {
    Write-Host "[ERROR] Este script debe ejecutarse desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] Verificando estructura del proyecto..." -ForegroundColor Blue

# Crear archivo .env.local para el frontend
Write-Host "[INFO] Creando archivos de configuración..." -ForegroundColor Blue

if (-not (Test-Path "frontend\.env.local")) {
    $frontendEnv = "# Firebase Configuration`nVITE_FIREBASE_API_KEY=AIzaSyBexamplekey`nVITE_FIREBASE_AUTH_DOMAIN=academy-bd619.firebaseapp.com`nVITE_FIREBASE_PROJECT_ID=academy-bd619`n`n# API Configuration`nVITE_API_BASE_URL=http://localhost:3000/api`nVITE_FUNCTIONS_URL=http://localhost:3000`n`n# Stripe Test Mode`nVITE_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890"
    $frontendEnv | Out-File -FilePath "frontend\.env.local" -Encoding UTF8
    Write-Host "[SUCCESS] Frontend .env.local creado" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Frontend .env.local ya existe" -ForegroundColor Yellow
}

if (-not (Test-Path "functions\.env")) {
    $backendEnv = "# Firebase Admin`nFIREBASE_PROJECT_ID=academy-bd619`nGOOGLE_APPLICATION_CREDENTIALS=./config/academy-bd619-firebase-adminsdk-sqh3j-fcca0a0223.json`n`n# JWT Secret`nJWT_SECRET=academia_virtual_jwt_secret_super_seguro_2024`n`n# Stripe Configuration`nSTRIPE_SECRET_KEY=sk_test_51234567890`nSTRIPE_WEBHOOK_SECRET=whsec_1234567890`n`n# Transbank Test Mode`nTRANSBANK_INTEGRATION_TYPE=TEST`nTRANSBANK_COMMERCE_CODE=597055555532`nTRANSBANK_API_KEY=579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C`n`n# URLs`nFRONTEND_URL=http://localhost:8080`nBACKEND_URL=http://localhost:3000`n`n# Development`nNODE_ENV=development`nDEBUG=true"
    $backendEnv | Out-File -FilePath "functions\.env" -Encoding UTF8
    Write-Host "[SUCCESS] Backend .env creado" -ForegroundColor Green
} else {
    Write-Host "[WARNING] Backend .env ya existe" -ForegroundColor Yellow
}

# Instalar dependencias del frontend
Write-Host "[INFO] Instalando dependencias del frontend..." -ForegroundColor Blue
Set-Location frontend
try {
    npm install | Out-Null
    Write-Host "[SUCCESS] Dependencias del frontend instaladas" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Error instalando dependencias del frontend" -ForegroundColor Red
}
Set-Location ..

# Instalar dependencias del backend
Write-Host "[INFO] Instalando dependencias del backend..." -ForegroundColor Blue
Set-Location functions
try {
    npm install | Out-Null
    Write-Host "[SUCCESS] Dependencias del backend instaladas" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Error instalando dependencias del backend" -ForegroundColor Red
}
Set-Location ..

# Crear datos demo
Write-Host "[INFO] Creando archivo de datos demo..." -ForegroundColor Blue
$demoData = "{`n  `"users`": [`n    {`n      `"email`": `"admin@academia.com`",`n      `"password`": `"Admin123!`",`n      `"name`": `"Administrador`",`n      `"role`": `"admin`"`n    },`n    {`n      `"email`": `"profesor@academia.com`",`n      `"password`": `"Profesor123!`",`n      `"name`": `"Juan Profesor`",`n      `"role`": `"teacher`"`n    },`n    {`n      `"email`": `"estudiante@academia.com`",`n      `"password`": `"Estudiante123!`",`n      `"name`": `"María Estudiante`",`n      `"role`": `"student`"`n    }`n  ]`n}"

$demoData | Out-File -FilePath "demo-data.json" -Encoding UTF8
Write-Host "[SUCCESS] Datos demo creados en demo-data.json" -ForegroundColor Green

# Crear script de inicio simple
Write-Host "[INFO] Creando script de inicio..." -ForegroundColor Blue

$startScript = "Write-Host 'Iniciando Academia Virtual...' -ForegroundColor Cyan`nWrite-Host 'Frontend: http://localhost:8080' -ForegroundColor Green`nWrite-Host 'Backend: http://localhost:3000' -ForegroundColor Green`nWrite-Host ''`nWrite-Host 'Usuarios demo:' -ForegroundColor Yellow`nWrite-Host '  Admin: admin@academia.com / Admin123!'`nWrite-Host '  Profesor: profesor@academia.com / Profesor123!'`nWrite-Host '  Estudiante: estudiante@academia.com / Estudiante123!'`nWrite-Host ''`nWrite-Host 'Iniciando frontend...' -ForegroundColor Blue`nStart-Process powershell -ArgumentList '-NoExit', '-Command', 'cd frontend; npm run serve'`nStart-Sleep -Seconds 3`nWrite-Host 'Iniciando backend...' -ForegroundColor Blue`nStart-Process powershell -ArgumentList '-NoExit', '-Command', 'cd functions; npm run serve'`nStart-Sleep -Seconds 5`nStart-Process 'http://localhost:8080'"

$startScript | Out-File -FilePath "start-dev.ps1" -Encoding UTF8
Write-Host "[SUCCESS] Script de inicio creado: .\start-dev.ps1" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Configuración completada exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Ejecutar: .\start-dev.ps1"
Write-Host "   2. Abrir: http://localhost:8080"
Write-Host "   3. Login con usuarios demo"
Write-Host ""
Write-Host "🚀 ¡Todo listo para el examen!" -ForegroundColor Green
