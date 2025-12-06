#!/bin/bash
# Render Build Script

echo "🔧 Starting Render Build..."

# Clean install with legacy peer deps
echo "📦 Installing dependencies..."
# Force clean install
rm -rf node_modules
npm install --legacy-peer-deps

# Build frontend
echo "🏗️ Building frontend..."
npm run build

echo "✅ Build complete!"
