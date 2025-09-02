# 🐳 SkillSphere Docker Setup

This project is fully containerized with Docker for both development and production environments.

## 🚀 Quick Start

### Production (All Services)
```bash
# Build and start all services
docker-compose up --build

# Access the application:
# Frontend: http://localhost
# Backend API: http://localhost:3000
# Database: localhost:3306
```

### Development (With Hot Reload)
```bash
# Start development environment
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build

# Access the application:
# Frontend: http://localhost:5173 (with hot reload)
# Backend API: http://localhost:3000 (with hot reload)
# Database: localhost:3306
```

## 🏗️ Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Frontend  │    │    API      │    │   MySQL    │
│   (Nginx)  │◄──►│  (Node.js)  │◄──►│  Database  │
│   Port 80  │    │  Port 3000  │    │  Port 3306 │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 📁 Docker Files

### Frontend
- **`frontend/Dockerfile`** - Production build with Nginx
- **`frontend/Dockerfile.dev`** - Development with hot reload
- **`frontend/nginx.conf`** - Nginx configuration with API proxy

### Backend
- **`backend/Dockerfile`** - Node.js production/development

### Docker Compose
- **`docker-compose.yml`** - Production configuration
- **`docker-compose.override.yml`** - Development overrides

## 🔧 Configuration

### Environment Variables
The frontend automatically uses `/api` as the base URL, which gets proxied to the backend service.

### Ports
- **Frontend**: 80 (production) / 5173 (development)
- **Backend**: 3000
- **Database**: 3306

## 🛠️ Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.yml -f docker-compose.override.yml up

# View logs
docker-compose logs -f frontend
docker-compose logs -f api
docker-compose logs -f db

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose build frontend
docker-compose build api

# Access container shell
docker exec -it skillsphere_frontend sh
docker exec -it skillsphere_api sh
```

## 🚀 Production Commands

```bash
# Start production environment
docker-compose up --build -d

# View running containers
docker-compose ps

# Scale services (if needed)
docker-compose up --scale api=3

# Stop and remove everything
docker-compose down -v
```

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 80, 3000, and 3306 are available
2. **Build failures**: Check Dockerfile syntax and dependencies
3. **Database connection**: Wait for MySQL health check to pass

### Debug Commands

```bash
# Check container status
docker-compose ps

# View service logs
docker-compose logs [service_name]

# Inspect container
docker inspect skillsphere_frontend

# Check network connectivity
docker network ls
docker network inspect skillsphere_default
```

### Reset Everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v --remove-orphans

# Remove all images
docker system prune -a

# Rebuild from scratch
docker-compose up --build
```

## 📝 Notes

- **Hot Reload**: Development mode includes volume mounts for live code changes
- **API Proxy**: Nginx automatically forwards `/api/*` requests to the backend
- **Database Persistence**: MySQL data is stored in a named volume
- **Security**: Production includes security headers and optimized builds

## 🌟 Benefits

✅ **Consistent Environment** - Same setup across all machines  
✅ **Easy Deployment** - One command to start everything  
✅ **Development/Production Parity** - Same containers, different configs  
✅ **Scalability** - Easy to scale individual services  
✅ **Isolation** - Each service runs in its own container  
✅ **Version Control** - Docker configurations are versioned
