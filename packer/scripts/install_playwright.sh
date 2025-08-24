#!/bin/bash
set -e

echo "Updating system packages..."
sudo rm -rf /var/lib/apt/lists/*
sudo apt-get clean
sudo apt-get update -y
sudo apt-get upgrade -y

echo "Installing dependencies..."
sudo apt-get install -y curl git unzip software-properties-common apt-transport-https

# Install Node.js 22 (latest LTS)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
sudo npm install -g pnpm

# Install Playwright and browsers
sudo npm install -g playwright

# Prepare global browsers directory (owned by root is fine)
sudo mkdir -p /usr/local/share/pw-browsers

export PLAYWRIGHT_BROWSERS_PATH=/usr/local/share/pw-browsers
sudo -E npx playwright install --with-deps

# Ensure non-root users can at least read and execute
sudo chmod -R a+rx /usr/local/share/pw-browsers

echo "AMI build complete!"
