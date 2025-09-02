# SkillSphere - Skill Sharing Platform

A full-stack web application for sharing and booking skills between users.

## Quick Start

### Option 1: Use Setup Script (Recommended)
```bash
# Windows
setup.bat

# Linux/Mac
./setup.sh
```

### Option 2: Manual Setup
```bash
# 1. Ensure schema file exists
mkdir -p db-init
cp backend/db-init/001_schema.sql db-init/

# 2. Start the application
docker-compose up --build
```

### Option 3: Use Development Script
```bash
# Windows
start-dev.bat
```

## Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database**: localhost:3307

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Containerization**: Docker

## Project Structure

```
├── frontend/          # React frontend
├── backend/           # Node.js API
├── db-init/          # Database schema
└── docker-compose.yml # Docker configuration
```

## Features

- User authentication (login/signup)
- Skill creation and management
- Skill booking system
- User dashboard
- Responsive design

## Development

The application runs in development mode with hot reload for both frontend and backend.

## Troubleshooting

### Database Issues
If you get "Table doesn't exist" errors:

```bash
# Complete reset (removes all data)
docker-compose down -v
docker-compose up --build
```

### Port Conflicts
If ports are already in use:
```bash
# Check what's using the ports
netstat -an | findstr :3000
netstat -an | findstr :5173
netstat -an | findstr :3307
```

### Schema File Missing
If the database isn't initializing:
```bash
# Ensure schema file exists
mkdir -p db-init
cp backend/db-init/001_schema.sql db-init/
```

### Container Issues
```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs api
docker-compose logs db
```