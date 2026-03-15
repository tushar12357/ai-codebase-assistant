#!/bin/bash

echo "Starting deployment..."

docker-compose -f infra/docker/docker-compose.yml down

docker-compose -f infra/docker/docker-compose.yml build

docker-compose -f infra/docker/docker-compose.yml up -d

echo "Deployment complete."