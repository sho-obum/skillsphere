Write-Host "Starting SkillSphere Development Environment..." -ForegroundColor Green
Write-Host ""
Write-Host "This will start:" -ForegroundColor Yellow
Write-Host "- MySQL Database (port 3306)" -ForegroundColor Cyan
Write-Host "- Backend API (port 3000) with hot reload" -ForegroundColor Cyan
Write-Host "- Frontend (port 5173) with hot reload" -ForegroundColor Cyan
Write-Host ""

$confirmation = Read-Host "Press Enter to continue or 'n' to cancel"
if ($confirmation -eq 'n') {
    Write-Host "Cancelled." -ForegroundColor Red
    exit
}

Write-Host "Starting services..." -ForegroundColor Green
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build

Write-Host ""
Write-Host "Development environment stopped." -ForegroundColor Yellow
Read-Host "Press Enter to exit"
