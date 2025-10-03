#!/bin/bash

# Docker build script for Kanban Board backend

echo "🐳 Building Kanban Board Docker image..."

# Build the Docker image
docker build -t kanban-backend:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo "🔍 Image info:"
    docker images kanban-backend:latest
else
    echo "❌ Docker build failed!"
    exit 1
fi

echo ""
echo "🚀 To run the container:"
echo "  Development: docker-compose -f docker-compose.dev.yml up"
echo "  Production:  docker-compose up"
echo ""
echo "🔧 To run just the backend container:"
echo "  docker run -p 8001:8000 kanban-backend:latest"