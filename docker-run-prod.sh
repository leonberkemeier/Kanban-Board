#!/bin/bash

echo "🚀 Building and starting Kanban Board in production mode..."

# Build the image
echo "📦 Building Docker image..."
docker build -t kanban-backend-prod .

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Start in production mode
echo "🐳 Starting production container..."
docker-compose up -d

echo ""
echo "✅ Production server started!"
echo ""
echo "🔗 Your Kanban Board API is available at:"
echo "   Backend API: http://localhost:8001/api/"
echo "   Health Check: http://localhost:8001/api/tasks/"
echo ""
echo "📊 To view logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 To stop:"
echo "   docker-compose down"
echo ""
echo "💾 Database: SQLite (persistent in Docker volume 'sqlite_data')"
echo "🌐 Reverse Proxy: Configure Caddy to proxy to http://localhost:8001"