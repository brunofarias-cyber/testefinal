#!/bin/bash
# Render Build Script

echo "🔧 Starting Render Build..."

# Clean install with legacy peer deps
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps || npm install --legacy-peer-deps

# Build frontend
echo "🏗️ Building frontend..."
npm run build

echo "✅ Build complete!"
