#!/bin/bash

# Default settings
PORT=9000  # Changed default to avoid common conflicts
SERVE=false
DEBUG=false

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --serve) SERVE=true ;;
        --port) PORT="$2"; shift ;;
        --debug) DEBUG=true ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Function to log debug messages
log_debug() {
    if [ "$DEBUG" = true ]; then
        echo "[DEBUG] $1"
    fi
}

# Function to cleanup and exit
cleanup() {
    echo -e "\nShutting down server..."
    pkill -f "live-server.*:$PORT" 2>/dev/null
    exit 0
}

# Function to check if a port is in use
check_port() {
    local port=$1
    nc -z localhost "$port" >/dev/null 2>&1
    if [ $? -eq 0 ]; then
        return 0  # Port is in use
    fi
    return 1     # Port is free
}

# Function to find next available port
find_available_port() {
    local port=$1
    local max_port=$((port + 100))  # Don't search indefinitely
    
    while [ "$port" -lt "$max_port" ]; do
        if ! check_port "$port"; then
            echo "$port"
            return 0
        fi
        port=$((port + 1))
    done
    
    echo "Error: No available ports found between $1 and $max_port" >&2
    exit 1
}

# Set up trap for Ctrl+C (SIGINT) if serving
if [ "$SERVE" = true ]; then
    trap cleanup SIGINT
fi

# Directory structure
MD_DIR="content/posts"
DEPLOY_DIR="deploy"
POSTS_DEPLOY_DIR="$DEPLOY_DIR/content/posts"
DIST_DIR="$DEPLOY_DIR/dist"
SRC_DIR="src"

# Ensure all required directories exist
dirs_to_create=(
    "$MD_DIR"
    "$DEPLOY_DIR"
    "$POSTS_DEPLOY_DIR"
    "$DIST_DIR"
    "$SRC_DIR"
)

for dir in "${dirs_to_create[@]}"; do
    if [ ! -d "$dir" ]; then
        echo "Creating directory: $dir"
        mkdir -p "$dir"
    fi
done

# Build CSS first to ensure styles are available
echo "Building CSS..."
if ! npm run build; then
    echo "Error: Failed to build CSS"
    exit 1
fi

echo "Checking for new markdown files..."
CONVERTED_COUNT=0

# Loop through all markdown files
for md_file in "$MD_DIR"/*.md; do
    # Skip if no markdown files found
    [[ -e "$md_file" ]] || continue
    
    base_name=$(basename "$md_file")
    html_file="$POSTS_DEPLOY_DIR/${base_name%.md}.html"
    local_html_file="$MD_DIR/${base_name%.md}.html"
    
    log_debug "Processing $base_name"
    
    # Check if HTML file doesn't exist or markdown file is newer
    if [[ ! -f "$html_file" ]] || [[ "$md_file" -nt "$html_file" ]]; then
        echo "Converting $base_name to HTML..."
        if ! node "$SRC_DIR/js/md-to-html.js" "$md_file" "$html_file"; then
            echo "Error: Failed to convert $base_name to HTML"
            exit 1
        fi
        cp "$html_file" "$local_html_file"
        ((CONVERTED_COUNT++))
    fi
done

echo "Converted $CONVERTED_COUNT new or modified files"

# Update summaries in index.html
echo "Updating blog post summaries in index.html..."
if ! npm run update-summaries; then
    echo "Error: Failed to update summaries"
    exit 1
fi

# Generate RSS feed
echo "Generating RSS feed..."
if ! node "$SRC_DIR/js/generate-rss.js"; then
    echo "Error: Failed to generate RSS feed"
    exit 1
fi

# Copy necessary files to deploy directory
echo "Copying files to deploy directory..."
cp index.html "$DEPLOY_DIR/"
cp -r dist/* "$DEPLOY_DIR/dist/"

# If --serve flag is provided, start the server
if [ "$SERVE" = true ]; then
    # Find available port if specified port is in use
    FINAL_PORT=$(find_available_port "$PORT")
    
    echo "Starting local server on port $FINAL_PORT..."
    echo "Visit http://localhost:$FINAL_PORT to view your site"
    echo "Press Ctrl+C to stop the server"
    
    # Copy deploy files to root for local development
    cp -r "$DEPLOY_DIR"/* .
    
    # Ensure live-server exists
    if [ ! -f "./node_modules/.bin/live-server" ]; then
        echo "Error: live-server not found. Please run 'npm install' first."
        exit 1
    fi
    
    # Start live-server with specific options
    ./node_modules/.bin/live-server \
        --port="$FINAL_PORT" \
        --no-browser \
        --watch="*.html,*.css,content/**/*.html" \
        --wait=50 \
        --quiet \
        --ignore=node_modules \
        .
    
    # Keep script running until Ctrl+C
    wait
fi
