#!/bin/bash

set -e

echo "🚀 Starting deployment..."

if command -v docker-compose &> /dev/null; then
  COMPOSE_CMD="docker-compose"
else
  COMPOSE_CMD="docker compose"
fi

COMPOSE_FILE="infra/docker/docker-compose.yml"

echo "🛑 Stopping existing containers..."
$COMPOSE_CMD -f $COMPOSE_FILE down

echo "🔨 Building images..."
$COMPOSE_CMD -f $COMPOSE_FILE build --no-cache

echo "🚀 Starting services..."
$COMPOSE_CMD -f $COMPOSE_FILE up -d

echo "⏳ Waiting for services..."
sleep 10

echo "✅ Checking AI service..."
curl -f http://localhost:8000/health || (echo "❌ Health check failed" && exit 1)

echo "🎉 Deployment successful!"