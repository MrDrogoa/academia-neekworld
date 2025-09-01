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
