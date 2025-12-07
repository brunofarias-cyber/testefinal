#!/bin/bash

echo "🚀 Iniciando servidor BProjetos..."

# Kill any existing server
pkill -f "node server.js" 2>/dev/null || true
sleep 1

# Start server with nohup
cd "$(dirname "$0")"
nohup node server.js > server.log 2>&1 &
SERVER_PID=$!

echo "✅ Servidor iniciado com PID: $SERVER_PID"
echo "📋 Logs em: server.log"
echo "🔍 Para ver logs em tempo real: tail -f server.log"
echo "❌ Para parar: pkill -f 'node server.js'"

# Wait a bit and test
sleep 3

if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Servidor está rodando!"
    echo "🌐 Acesse: http://localhost:3000"
    echo "💚 Health check: http://localhost:3000/api/health"
else
    echo "❌ Servidor falhou ao iniciar. Verifique server.log"
    cat server.log
    exit 1
fi
