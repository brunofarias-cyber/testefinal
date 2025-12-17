#!/bin/bash

# Script para garantir que o dist seja construído
# Roda com npm ci limpo e depois build

set -e

echo "🏗️ Build Frontend - TESTEFINAL"
echo "================================"

# 1. Limpar caches
echo "🗑️ Limpando caches..."
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf .vite 2>/dev/null || true

# 2. Verificar Node version
echo "📋 Node version:"
node --version
npm --version

# 3. Install dependencies
echo "📦 npm ci..."
npm ci --legacy-peer-deps

# 4. Build
echo "🏗️ Buildando frontend..."
npx vite build --mode production

# 5. Verificar resultado
if [ -f "dist/index.html" ]; then
  echo "✅ BUILD SUCESSO!"
  echo "📊 Tamanho de dist:"
  du -sh dist/
  ls -lh dist/
else
  echo "❌ dist/index.html não foi criado"
  exit 1
fi
