#!/bin/bash

# Precision Tech Insights - Server Deployment Script

echo "🚀 Starting deployment..."

# Navigate to project directory
cd ~/domains/precisiontechinsights.com/public_html

# Stop any running Node processes
echo "🛑 Stopping existing Node processes..."
pkill -f "node server.js" || true

# Pull latest code from GitHub
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Start server with nohup
echo "🚀 Starting server..."
nohup node server.js > server.log 2>&1 &

# Get the process ID
sleep 2
PID=$(pgrep -f "node server.js")

if [ -z "$PID" ]; then
    echo "❌ Failed to start server"
    exit 1
else
    echo "✅ Server started successfully with PID: $PID"
    echo "📝 Logs: tail -f server.log"
fi
