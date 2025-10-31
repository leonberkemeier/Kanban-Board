#!/bin/bash

# Script to build React frontend and deploy to Caddy directory
set -e

echo "📦 Building React frontend..."

# Navigate to frontend directory and build
cd /home/archy/Desktop/Server/KanbanBoard/frontend
npm run build

echo "📁 Creating Caddy web directory..."

# Create the Caddy directory if it doesn't exist
sudo mkdir -p /var/www/kanban

echo "📋 Copying build files to Caddy directory..."

# Copy the built files to Caddy's web directory
sudo cp -r build/* /var/www/kanban/

# Set proper ownership and permissions
sudo chown -R caddy:caddy /var/www/kanban
sudo chmod -R 755 /var/www/kanban

echo "✅ Frontend deployed to /var/www/kanban"
echo "🔄 You can now reload Caddy to serve the new files"
echo ""
echo "To reload Caddy configuration:"
echo "sudo systemctl reload caddy"