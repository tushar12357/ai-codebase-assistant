#!/bin/bash

set -e

echo "Starting deployment..."

# Detect compose command

if command -v docker-compose &> /dev/null; then
COMPOSE_CMD="docker-compose"
else
COMPOSE_CMD="docker compose"
fi

COMPOSE_FILE="infra/docker/docker-compose.yml"

echo "Stopping existing containers..."
$COMPOSE_CMD -f $COMPOSE_FILE down

echo "Building images..."
$COMPOSE_CMD -f $COMPOSE_FILE build

echo "Starting services..."
$COMPOSE_CMD -f $COMPOSE_FILE up -d

echo "Deployment complete."
