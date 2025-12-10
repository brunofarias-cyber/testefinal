#!/bin/bash

# Script de teste do build para produção
# Simula o processo de build do Render localmente

echo "🚀 Testando build de produção..."
echo ""

# 1. Limpar build anterior
echo "📦 Limpando build anterior..."
rm -rf dist/
echo "✅ Build anterior removido"
echo ""

# 2. Instalar dependências (simulando npm install do Render)
echo "📥 Instalando dependências..."
npm install --quiet
if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi
echo ""

# 3. Build do frontend
echo "🏗️  Construindo frontend (Vite)..."
npm run build:render
if [ $? -eq 0 ]; then
    echo "✅ Frontend construído com sucesso"
else
    echo "❌ Erro ao construir frontend"
    exit 1
fi
echo ""

# 4. Verificar se dist/ foi criado
echo "🔍 Verificando pasta dist/..."
if [ -d "dist" ]; then
    echo "✅ Pasta dist/ criada"
    echo "📁 Conteúdo:"
    ls -lh dist/ | head -10
else
    echo "❌ Pasta dist/ não foi criada"
    exit 1
fi
echo ""

# 5. Verificar arquivos essenciais
echo "🔍 Verificando arquivos essenciais..."
if [ -f "dist/index.html" ]; then
    echo "✅ index.html encontrado"
else
    echo "❌ index.html NÃO encontrado"
    exit 1
fi

if [ -d "dist/assets" ]; then
    echo "✅ pasta assets/ encontrada"
    echo "   Arquivos JS: $(find dist/assets -name '*.js' | wc -l)"
    echo "   Arquivos CSS: $(find dist/assets -name '*.css' | wc -l)"
else
    echo "❌ pasta assets/ NÃO encontrada"
    exit 1
fi
echo ""

# 6. Verificar tamanho do build
echo "📊 Tamanho do build:"
du -sh dist/
echo ""

# 7. Testar servidor em modo produção
echo "🌐 Iniciando servidor em modo produção..."
echo "   (Pressione Ctrl+C para parar)"
echo ""
echo "✅ Teste o site em: http://localhost:3000"
echo "✅ Teste a API em: http://localhost:3000/api/health"
echo ""

# Definir NODE_ENV=production e iniciar servidor
NODE_ENV=production node server.js
