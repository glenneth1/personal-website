#!/bin/bash

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
