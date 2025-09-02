@echo off
echo Starting SkillSphere Development Environment...
echo.
echo This will start:
echo - MySQL Database (port 3307)
echo - Backend API (port 3000) with hot reload
echo - Frontend (port 5173) with hot reload
echo.
echo Press any key to continue...
pause >nul

docker-compose up --build

echo.
echo Development environment stopped.
pause
