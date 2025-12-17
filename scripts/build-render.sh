#!/bin/bash

# Build script para Render - garante que o frontend é construído

set -e  # Exit on any error

echo "🏗️ Build Frontend TESTEFINAL"
echo "================================"

echo "📋 Node.js: $(node --version)"
echo "📦 NPM: $(npm --version)"

# 1. Instalar dependências
echo ""
echo "📦 Instalando dependências..."
npm ci --legacy-peer-deps

# 2. Construir frontend
echo ""
echo "🏗️ Construindo frontend com Vite..."
npm run build:render

# 3. Verificar se foi criado
echo ""
echo "✅ Verificando dist..."
if [ -f "dist/index.html" ]; then
  echo "✅ dist/index.html encontrado!"
  ls -lh dist/
else
  echo "❌ ERRO: dist/index.html não foi criado"
  echo "Listando conteúdo:"
  ls -la
  exit 1
fi

echo ""
echo "🎉 Build concluído com sucesso!"
