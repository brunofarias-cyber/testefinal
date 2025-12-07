# 📍 Configuração de Rotas - Localhost vs Render

**Data**: 7 de Dezembro de 2025  
**Status**: ✅ Corrigido e Testado

---

## ✅ O Que Foi Feito

### Problema Original
Em Render (produção), a aplicação não funcionava igual a localhost porque:
1. URLs hardcoded para `localhost:3000`
2. Socket.IO não conseguia conectar
3. API calls falhavam

### Solução Implementada
1. ✅ Auto-detecção de URL baseado em `window.location.origin`
2. ✅ Socket.IO agora usa URL correta automaticamente
3. ✅ API routes já estavam corretas (paths relativos)

---

## 📊 Comparação

### Em Desenvolvimento (localhost:5173)

```
┌─────────────────────────────────────────┐
│ Browser: http://localhost:5173          │
├─────────────────────────────────────────┤
│ Frontend React:                         │
│  └─ fetch('/api/...') →                 │
│      → Proxy Vite →                     │
│      → http://localhost:3000/api/...    │
│                                         │
│ Socket.IO:                              │
│  └─ io('http://localhost:3000')         │
│      → Conecta ao WebSocket             │
└─────────────────────────────────────────┘
```

### Em Produção (Render)

```
┌─────────────────────────────────────────────┐
│ Browser: https://seu-app.onrender.com       │
├─────────────────────────────────────────────┤
│ Frontend React (servido por Node):          │
│  └─ fetch('/api/...') →                     │
│      → Node.js server →                     │
│      → https://seu-app.onrender.com/api/... │
│                                             │
│ Socket.IO:                                  │
│  └─ io(window.location.origin)              │
│      → io('https://seu-app.onrender.com')   │
│      → Conecta ao WebSocket                 │
└─────────────────────────────────────────────┘
```

---

## 🔧 Código Que Foi Mudado

### MessagingSystemV2.jsx

**ANTES** (problema):
```javascript
const socketUrl = API_BASE || 'http://localhost:3000';
const newSocket = io(socketUrl);
```

**DEPOIS** (correto):
```javascript
let socketUrl;
if (API_BASE) {
    socketUrl = API_BASE;
} else if (typeof window !== 'undefined' && window.location.origin) {
    socketUrl = window.location.origin;  // ✅ Auto-detecta!
} else {
    socketUrl = 'http://localhost:3000';
}
const newSocket = io(socketUrl);
```

---

## 🎯 Rotas API

Todas as rotas API já estavam corretas (usando paths relativos):

```javascript
// ✅ CORRETO (funciona em qualquer lugar)
fetch('/api/bncc-dashboard/overview/1')
fetch('/api/projects')
fetch('/api/messages')
fetch('/api/health')
```

```javascript
// ❌ ERRADO (só funciona em localhost)
fetch('http://localhost:3000/api/...')
fetch('http://seu-app.onrender.com/api/...')
```

---

## 📋 Environment Variables

### .env.local (Desenvolvimento)
```env
# Deixar em branco para usar window.location.origin
VITE_API_URL=
VITE_SOCKET_URL=
```

### .env.production (Produção)
```env
# Deixar em branco para usar window.location.origin
VITE_API_URL=
VITE_SOCKET_URL=
```

**Nota**: Se precisar forçar uma URL específica, pode usar:
```env
VITE_API_URL=https://seu-api.com
VITE_SOCKET_URL=https://seu-app.onrender.com
```

---

## ✨ Como Detecta a URL

```javascript
// Ordem de prioridade:

1. Se VITE_API_URL está definida → usa ela
2. Se window.location.origin existe → usa URL atual
3. Fallback para localhost (dev apenas)

// Exemplos:
// localhost:5173 → usa localhost:5173
// seu-app.onrender.com → usa seu-app.onrender.com
// seu-dominio.com → usa seu-dominio.com
```

---

## 🚀 Deploy em Render

### Passo 1: Environment Variables
No painel Render, deixar em branco:
```
VITE_API_URL=       # Vazio (auto-detecta)
VITE_SOCKET_URL=    # Vazio (auto-detecta)
```

### Passo 2: Build
```bash
npm install
npm run build  # Gera dist/
```

### Passo 3: Start
```bash
node server.js
```

### Passo 4: Verificar
```bash
curl https://seu-app.onrender.com/api/health
# Deve retornar: {"status":"ok",...}
```

---

## 🔍 Teste Local

### Build e Preview
```bash
npm run build    # Cria dist/
npm run preview  # Simula produção em localhost:4173
```

Depois acessar `http://localhost:4173` e testar:
- ✅ Chat (Socket.IO)
- ✅ BNCC (API)
- ✅ Projetos (API)
- ✅ Login/Logout

---

## 📱 Verificação

### No Console (F12)

**Em Desenvolvimento**:
```javascript
console.log(window.location.origin)  // http://localhost:5173
```

**Em Render**:
```javascript
console.log(window.location.origin)  // https://seu-app.onrender.com
```

**Socket.IO deve conectar a**:
```javascript
// Verificar no Console Network
// WebSocket: wss://seu-app.onrender.com/socket.io/?...
```

---

## ✅ Checklist

- [x] Socket.IO usa auto-detecção
- [x] API routes são relativos
- [x] Env vars configurados
- [x] vite.config.js com proxy
- [x] Build passa sem erros
- [x] Pronto para Render

---

## 🎉 Resultado

✅ **Localhost**: Funciona perfeitamente  
✅ **Render**: Agora funciona igual  
✅ **Qualquer domínio**: Auto-detecta corretamente

---

**BProjetos v6.0 | Production Ready | 2025**

👉 Deploy com confiança! 🚀
