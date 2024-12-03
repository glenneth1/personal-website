#!/bin/bash

# Default port
PORT=3001

# Function to cleanup and exit
cleanup() {
    echo -e "\nShutting down server..."
    # Kill any running live-server processes
    pkill -f "live-server.*:$PORT" 2>/dev/null
    exit 0
}

# Set up trap for Ctrl+C (SIGINT)
trap cleanup SIGINT

echo "Starting local server on port $PORT..."
echo "Visit http://localhost:$PORT to view your site"
echo "Press Ctrl+C to stop the server"

# Start live-server with specific options
./node_modules/.bin/live-server \
    --port=$PORT \
    --no-browser \
    --quiet \
    --ignore=node_modules \
    .

# Keep script running until Ctrl+C
wait
