#!/bin/bash

# Create a deploy directory if it doesn't exist
mkdir -p deploy

# Clean up any previous deploy files
rm -rf deploy/*

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

# Copy feed.xml
cp feed.xml deploy/

# Copy content directory excluding markdown files
echo "Copying content (excluding markdown files)..."
find content -type f ! -name "*.md" -exec cp --parents {} deploy/ \;

# Create a zip file for easy upload
echo "Creating zip archive..."
cd deploy
zip -r ../website-deploy.zip ./*

echo "Deployment package created successfully!"
echo "Your files are ready in the 'website-deploy.zip' file"
echo "You can also find individual files in the 'deploy' directory"
