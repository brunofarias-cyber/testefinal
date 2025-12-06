#!/bin/bash
set -e # Exit immediately if any command fails

echo "🔧 Starting Render Build..."

# Clean EVERYTHING to fix corrupted dependencies
echo "🧹 Cleaning environment (Nuclear Option)..."
rm -rf node_modules
rm -f package-lock.json
npm cache clean --force

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build frontend
echo "🏗️ Building frontend..."
npm run build

echo "✅ Build complete!"
