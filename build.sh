#!/bin/bash

# Default settings
PORT=8080
SERVE=false

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --serve) SERVE=true ;;
        --port) PORT="$2"; shift ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Function to cleanup and exit
cleanup() {
    echo -e "\nShutting down server..."
    # Kill any running live-server processes
    pkill -f "live-server.*:$PORT" 2>/dev/null
    exit 0
}

# Set up trap for Ctrl+C (SIGINT) if serving
if [ "$SERVE" = true ]; then
    trap cleanup SIGINT
fi

# Directory containing markdown files
MD_DIR="content/posts"
DEPLOY_DIR="deploy/content/posts"
CONVERTED_COUNT=0

# Create deploy directory if it doesn't exist
mkdir -p "$DEPLOY_DIR"
mkdir -p "$MD_DIR"  # Ensure local directory exists too

echo "Checking for new markdown files..."

# Loop through all markdown files
for md_file in "$MD_DIR"/*.md; do
    # Skip if no markdown files found
    [[ -e "$md_file" ]] || continue
    
    # Get the base name of the file
    base_name=$(basename "$md_file")
    # Create the HTML filenames
    html_file="$DEPLOY_DIR/${base_name%.md}.html"
    local_html_file="$MD_DIR/${base_name%.md}.html"
    
    # Check if HTML file doesn't exist or markdown file is newer
    if [[ ! -f "$html_file" ]] || [[ "$md_file" -nt "$html_file" ]]; then
        echo "Converting $base_name to HTML..."
        node src/js/md-to-html.js "$md_file" "$html_file"
        # Also copy to local directory for development
        cp "$html_file" "$local_html_file"
        ((CONVERTED_COUNT++))
    fi
done

echo "Converted $CONVERTED_COUNT new or modified files"

# Update summaries in index.html
echo "Updating blog post summaries in index.html..."
npm run update-summaries

# Generate RSS feed
echo "Generating RSS feed..."
node src/js/generate-rss.js

# Run the deploy script
echo "Running deploy script..."
./deploy.sh

# If --serve flag is provided, start the server
if [ "$SERVE" = true ]; then
    echo "Starting local server on port $PORT..."
    echo "Visit http://localhost:$PORT to view your site"
    echo "Press Ctrl+C to stop the server"
    
    # Copy deploy files to root for local development
    cp -r deploy/* .
    
    # Start live-server with specific options
    ./node_modules/.bin/live-server \
        --port=$PORT \
        --no-browser \
        --quiet \
        --ignore=node_modules \
        .
        
    # Keep script running until Ctrl+C
    wait
fi
