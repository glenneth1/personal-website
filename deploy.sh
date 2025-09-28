#!/bin/bash

# Function to show usage
show_usage() {
    echo "Usage: $0 [--ftp]"
    echo "Options:"
    echo "  --ftp    Upload to FTP server (requires .env.gpg file with encrypted credentials)"
    exit 1
}

# Function to decrypt credentials
decrypt_credentials() {
    if [ ! -f ".env.gpg" ]; then
        echo "Error: .env.gpg file not found!"
        exit 1
    fi
    
    # Create a temporary file for decrypted credentials
    TEMP_ENV=$(mktemp)
    
    # Decrypt the credentials
    if ! gpg --quiet --decrypt .env.gpg > "$TEMP_ENV"; then
        echo "Error: Failed to decrypt credentials!"
        rm "$TEMP_ENV"
        exit 1
    fi
    
    # Source the decrypted credentials
    source "$TEMP_ENV"
    
    # Securely remove the temporary file
    rm "$TEMP_ENV"
}

# Parse command line arguments
USE_FTP=false
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --ftp) USE_FTP=true ;;
        -h|--help) show_usage ;;
        *) echo "Unknown parameter: $1"; show_usage ;;
    esac
    shift
done

# Ensure deploy directory structure exists
mkdir -p deploy/content/posts

# Temporarily save the posts
if [ -d "deploy/content/posts" ]; then
    mkdir -p .tmp_posts
    mv deploy/content/posts/* .tmp_posts/ 2>/dev/null || true
fi

# Clean up deploy directory
rm -rf deploy/*

# Restore the directory structure
mkdir -p deploy/content/posts

# Restore the posts if they existed
if [ -d ".tmp_posts" ]; then
    mv .tmp_posts/* deploy/content/posts/ 2>/dev/null || true
    rm -rf .tmp_posts
fi

# Run build process to ensure latest CSS
echo "Building CSS..."
npm run build

echo "Generating RSS feed..."
node src/js/generate-rss.js

# Copy necessary files
echo "Copying files..."
cp index.html deploy/
cp favicon.svg deploy/
cp -r dist deploy/
cp -r src/js deploy/js
cp feed.xml deploy/

# Create deployment package
echo "Creating zip archive..."
cd deploy && zip -r ../website-deploy.zip ./*
cd ..

echo "Deployment package created successfully!"
echo "Your files are ready in the 'website-deploy.zip' file"
echo "You can also find individual files in the 'deploy' directory"

# FTP Upload if requested
if [ "$USE_FTP" = true ]; then
    # Decrypt and load credentials
    decrypt_credentials
    
    if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ] || [ -z "$FTP_DIR" ]; then
        echo "Error: Missing FTP credentials!"
        exit 1
    fi

    # Check if lftp is installed
    if ! command -v lftp &> /dev/null; then
        echo "Error: lftp is not installed. Please install it first."
        exit 1
    fi

    echo "Starting FTP upload..."
    lftp -c "
        set ssl:verify-certificate no;
        open -u $FTP_USER,$FTP_PASS $FTP_HOST;
        lcd deploy;
        cd $FTP_DIR;
        mirror -R --parallel=4 --verbose;
        bye"
    
    echo "FTP upload completed!"
fi
