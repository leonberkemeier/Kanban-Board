#!/bin/bash

# Deployment script for Kanban Board to kanban.leonberkemeier.de
# This script deploys the application using Docker Compose and updates Caddy

set -e  # Exit on any error

echo "🚀 Starting deployment of Kanban Board..."

# Check if we're in the correct directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the project root."
    exit 1
fi

# Build and deploy frontend to Caddy directory
echo "📦 Building and deploying React frontend..."
./deploy-frontend.sh

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🔨 Building and starting Docker containers..."
docker-compose up -d --build

# Wait for backend to be healthy
echo "🏥 Waiting for backend to be healthy..."
timeout=120
counter=0
while [ $counter -lt $timeout ]; do
    if curl -f http://localhost:8001/api/tasks/ >/dev/null 2>&1; then
        echo "✅ Backend is healthy!"
        break
    fi
    echo "⏳ Waiting for backend... ($counter/$timeout seconds)"
    sleep 5
    counter=$((counter + 5))
done

if [ $counter -ge $timeout ]; then
    echo "❌ Backend failed to start within $timeout seconds"
    exit 1
fi

# Update Caddy configuration
echo "🔄 Updating Caddy configuration..."
if [ -f "/etc/caddy/Caddyfile" ]; then
    sudo cp Caddyfile.production /etc/caddy/Caddyfile
    sudo systemctl reload caddy
    echo "✅ Caddy configuration updated and reloaded!"
    echo "📁 Frontend files are now served from /var/www/kanban"
else
    echo "⚠️  Warning: /etc/caddy/Caddyfile not found. You may need to manually update your Caddy configuration."
    echo "📄 Use the Caddyfile.production file in this directory."
    echo "📁 Make sure to create /var/www/kanban and copy frontend/build/* there"
fi

# Show final status
echo ""
echo "🎉 Deployment completed successfully!"
echo "📊 Your Kanban Board should be available at: https://kanban.leonberkemeier.de"
echo ""
echo "📋 Container status:"
docker-compose ps

echo ""
echo "📝 Next steps:"
echo "1. Ensure your DNS points kanban.leonberkemeier.de to your server"
echo "2. If Caddy config wasn't updated automatically, manually copy Caddyfile.production to your Caddy configuration"
echo "3. Check the logs if anything isn't working: docker-compose logs"