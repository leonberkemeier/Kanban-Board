#!/bin/bash

# Docker run script for development

echo "🐳 Starting Kanban Board in development mode..."

# Stop any existing containers
docker-compose -f docker-compose.dev.yml down

# Start the development container
docker-compose -f docker-compose.dev.yml up --build

echo "🔧 Development server should be available at:"
echo "   Backend API: http://localhost:8001/api/"
echo "   Admin: http://localhost:8001/admin/"