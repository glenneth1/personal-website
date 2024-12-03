#!/bin/bash

# Directory containing markdown files
MD_DIR="content/posts"
CONVERTED_COUNT=0

echo "Checking for new markdown files..."

# Loop through all markdown files
for md_file in "$MD_DIR"/*.md; do
    # Skip if no markdown files found
    [[ -e "$md_file" ]] || continue
    
    # Get the corresponding HTML filename
    html_file="${md_file%.md}.html"
    
    # Check if HTML file doesn't exist or markdown file is newer
    if [[ ! -f "$html_file" ]] || [[ "$md_file" -nt "$html_file" ]]; then
        echo "Converting: $md_file"
        node src/js/md-to-html.js "$md_file"
        ((CONVERTED_COUNT++))
    fi
done

if [ $CONVERTED_COUNT -eq 0 ]; then
    echo "No new markdown files to convert."
else
    echo "Converted $CONVERTED_COUNT file(s)."
fi

# Run the deploy script
echo "Running deploy script..."
./deploy.sh
