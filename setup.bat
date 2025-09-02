@echo off
echo ========================================
echo   SkillSphere Setup Script
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check if Docker is running
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running or not installed
    echo Please start Docker Desktop and try again
    pause
    exit /b 1
)
echo Docker is running

REM Check if schema file exists
if not exist "db-init\001_schema.sql" (
    echo Schema file not found
    echo Creating schema file...
    if not exist "db-init" mkdir db-init
    copy "backend\db-init\001_schema.sql" "db-init\" >nul
    if %errorlevel% neq 0 (
        echo ERROR: Failed to copy schema file
        pause
        exit /b 1
    )
    echo Schema file created
) else (
    echo Schema file exists
)

echo.
echo Starting SkillSphere...
echo.
echo This will start:
echo - MySQL Database on port 3307
echo - Backend API on port 3000  
echo - Frontend on port 5173
echo.
echo Access your app at: http://localhost:5173
echo.

REM Stop any existing containers
echo Stopping existing containers...
docker-compose down >nul 2>&1

REM Start the application
echo Starting application...
docker-compose up --build

echo.
echo Development environment stopped.
pause
