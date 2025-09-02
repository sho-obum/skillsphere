@echo off
echo Starting SkillSphere Development Environment...
echo.
echo This will start:
echo - MySQL Database on port 3307
echo - Backend API on port 3000
echo - Frontend on port 5173
echo.
echo Access your app at: http://localhost:5173
echo.
docker-compose up --build
