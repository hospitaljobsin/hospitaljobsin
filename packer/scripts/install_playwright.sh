#!/bin/bash
set -e

echo "Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

echo "Installing dependencies..."
sudo apt-get install -y curl git unzip software-properties-common apt-transport-https

# Install Node.js 22 (latest LTS)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install Playwright and browsers
npm install -g playwright
npx playwright install --with-deps

echo "AMI build complete!"
