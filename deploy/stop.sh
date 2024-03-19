#!/bin/bash

# Inform the user about the script's purpose
echo "Stopping docker-compose services..."

# Change directory to the location of the script
cd "$(dirname "$0")"

# Run docker-compose down to stop services
docker-compose down

# Inform the user that the services are stopped
echo "Services stopped successfully!"
