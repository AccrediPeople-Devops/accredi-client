#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Docker rebuild process...${NC}"

# Stop and remove existing container
echo -e "${YELLOW}Stopping and removing existing container...${NC}"
docker stop accredi-client-container 2>/dev/null || echo "No container to stop"
docker rm accredi-client-container 2>/dev/null || echo "No container to remove"

# Remove existing image
echo -e "${YELLOW}Removing existing image...${NC}"
docker rmi accredi-client 2>/dev/null || echo "No image to remove"

# Clean up dangling images
echo -e "${YELLOW}Cleaning up dangling images...${NC}"
docker image prune -f

# Build new image
echo -e "${YELLOW}Building new Docker image...${NC}"
if docker build -t accredi-client .; then
    echo -e "${GREEN}✅ Image built successfully!${NC}"
else
    echo -e "${RED}❌ Image build failed!${NC}"
    exit 1
fi

# Run new container
echo -e "${YELLOW}Starting new container...${NC}"
if docker run -d -p 8080:8080 --name accredi-client-container accredi-client; then
    echo -e "${GREEN}✅ Container started successfully!${NC}"
    echo -e "${GREEN}🚀 Application is running on http://localhost:8080${NC}"
else
    echo -e "${RED}❌ Container failed to start!${NC}"
    exit 1
fi

# Show container status
echo -e "${YELLOW}Container status:${NC}"
docker ps | grep accredi-client-container

echo -e "${GREEN}✅ Docker rebuild process completed successfully!${NC}" 