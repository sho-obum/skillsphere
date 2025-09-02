#!/bin/bash

echo "========================================"
echo "   SkillSphere Setup Script"
echo "========================================"
echo

echo "Checking prerequisites..."
echo

# Check if Docker is running
if ! docker version >/dev/null 2>&1; then
    echo "ERROR: Docker is not running or not installed"
    echo "Please start Docker and try again"
    exit 1
fi
echo "Docker is running"

# Check if schema file exists
if [ ! -f "db-init/001_schema.sql" ]; then
    echo "Schema file not found"
    echo "Creating schema file..."
    mkdir -p db-init
    cp backend/db-init/001_schema.sql db-init/
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to copy schema file"
        exit 1
    fi
    echo "Schema file created"
else
    echo "Schema file exists"
fi

echo
echo "Starting SkillSphere..."
echo
echo "This will start:"
echo "- MySQL Database on port 3307"
echo "- Backend API on port 3000"
echo "- Frontend on port 5173"
echo
echo "Access your app at: http://localhost:5173"
echo

# Stop any existing containers
echo "Stopping existing containers..."
docker-compose down >/dev/null 2>&1

# Start the application
echo "Starting application..."
docker-compose up --build
