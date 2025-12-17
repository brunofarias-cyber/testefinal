#!/bin/bash

# Debug script para Render
echo "=== DEBUG RENDER BUILD ===" 
echo ""
echo "1. Node version:"
node --version
npm --version

echo ""
echo "2. Current directory:"
pwd
ls -la

echo ""
echo "3. Terser installed?"
npm ls terser

echo ""
echo "4. Trying to build..."
npm run build:render

echo ""
echo "5. After build, dist exists?"
if [ -d "dist" ]; then
  echo "✅ dist ENCONTRADO!"
  ls -lh dist/
else
  echo "❌ dist NÃO ENCONTRADO"
  find . -name "dist" -type d 2>/dev/null | head -10
fi

echo ""
echo "6. Vite version:"
npx vite --version

echo ""
echo "=== END DEBUG ==="
