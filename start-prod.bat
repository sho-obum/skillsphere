@echo off
echo Starting SkillSphere Production Environment...
echo.
echo This will start:
echo - MySQL Database (port 3306)
echo - Backend API (port 3000)
echo - Frontend (port 80) - Production build
echo.
echo Press any key to continue...
pause >nul

docker-compose up --build -d

echo.
echo Production environment started in background.
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.
pause
