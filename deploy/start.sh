#!/bin/bash

# Inform the user about the script's purpose
echo "Running docker-compose up in detached mode..."

# Change directory to the location of the script
cd "$(dirname "$0")"

# Run docker-compose up in detached mode
docker-compose up -d

# Inform the user that the services are up
echo "Services started successfully!"

# Inform the user about the delay
echo "Waiting for 1 second before opening the browser..."

# Add a 1-second delay
sleep 1

# Inform the user about opening the browser
echo "Opening http://localhost:3000/dashboard in the default web browser..."

# Open localhost:3000/dashboard in the default web browser
open "http://localhost:3000/dashboard"

echo "Remember to run stop.sh to stop the app"