#!/bin/bash

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found!"
    exit 1
fi

# Encrypt .env to .env.gpg
gpg --symmetric --cipher-algo AES256 .env

# Check if encryption was successful
if [ $? -eq 0 ]; then
    echo "Credentials encrypted successfully to .env.gpg"
    echo "You can now safely delete the original .env file"
    echo "To delete it, run: rm .env"
else
    echo "Encryption failed!"
fi
