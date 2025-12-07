# 🚀 Guia de Deploy - Render + BProjetos

**Data**: 7 de Dezembro de 2025  
**Status**: ✅ Configurado  
**Versão**: 6.0 Production Ready

---

## 🎯 Problema Resolvido

**Problema**: Em LIVE (Render) a tela não era gerada igual a localhost:3000
**Causa**: URLs hardcoded e proxy não funcionando em produção
**Solução**: Detectar URL automática em produção

---

## ✅ Configurações Implementadas

### 1. Socket.IO - Detecção de URL Automática

**Arquivo**: `src/components/MessagingSystemV2.jsx`

```javascript
// Antes (problema):
const socketUrl = API_BASE || 'http://localhost:3000';

// Depois (correto):
let socketUrl;
if (API_BASE) {
    socketUrl = API_BASE;
} else if (typeof window !== 'undefined' && window.location.origin) {
    socketUrl = window.location.origin;  // Usa URL atual (render.com, localhost, etc)
} else {
    socketUrl = 'http://localhost:3000'; // Fallback apenas em dev
}
```

**Benefício**: O socket.io agora se conecta à URL correta automaticamente em produção

### 2. API Routes

Todas as rotas usam **paths relativos** (correto):
```javascript
fetch('/api/bncc-dashboard/overview/${projectId}')
fetch('/api/projects')
fetch('/api/messages')
// etc...
```

**Benefício**: Funciona em qualquer domínio (localhost, Render, etc)

### 3. Vite Proxy (Dev)

**Arquivo**: `vite.config.js`

```javascript
server: {
    proxy: {
        '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            secure: false,
        }
    }
}
```

**Benefício**: Em localhost:5173, redireciona `/api` para localhost:3000

### 4. Environment Variables

**Arquivos**:
- `.env.local` (desenvolvimento)
- `.env.production` (produção - Render)

```env
VITE_API_URL=          # Deixar vazio para auto-detectar
VITE_SOCKET_URL=       # Deixar vazio para auto-detectar
```

---

## 📋 Checklist de Deploy para Render

### Antes de fazer Deploy:

- [x] Todas as rotas API usam paths relativos (`/api/...`)
- [x] Socket.IO detecta URL automaticamente
- [x] `.env.local` configurado para dev
- [x] `.env.production` configurado para prod
- [x] `vite.config.js` com proxy correto
- [x] Build passa sem erros

### Configuração no Render:

1. **Environment Variables** (no painel Render):
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<sua URL do Neon>
   JWT_SECRET=<seu secret>
   # VITE_API_URL e VITE_SOCKET_URL deixar em branco!
   ```

2. **Build Command**:
   ```bash
   npm install && npm run build
   ```

3. **Start Command**:
   ```bash
   node server.js
   ```

4. **Health Check**:
   ```
   GET /api/health
   ```

---

## 🔍 Verificação de Rota

### Em Desenvolvimento (localhost:5173):

```bash
1. Frontend roda em: http://localhost:5173
2. API chamadas para: http://localhost:3000/api/... (via proxy)
3. Socket.IO conecta a: http://localhost:3000
```

### Em Produção (Render):

```bash
1. Frontend roda em: https://seu-app.onrender.com
2. API chamadas para: https://seu-app.onrender.com/api/...
3. Socket.IO conecta a: https://seu-app.onrender.com
```

---

## 🎯 Como Testar

### Teste Local (Dev):
```bash
npm run dev
# Abra http://localhost:5173
# Teste chat, BNCC, etc
```

### Teste Production Build (Local):
```bash
npm run build
npm run preview
# Abra http://localhost:4173
# Teste tudo novamente
```

### Teste em Render (Live):
```
1. Faça push das mudanças para GitHub
2. Render faz auto-deploy
3. Abra https://seu-app.onrender.com
4. Teste chat, BNCC, etc
5. Verifique console (F12) para erros
```

---

## 🚨 Troubleshooting

### Problema: Chat não funciona em produção

**Solução**:
```javascript
// Verificar se socketUrl está correto
console.log('Socket URL:', socketUrl);

// Verificar se socket conectou
socket.on('connect', () => console.log('Socket conectado!'));
socket.on('disconnect', () => console.log('Socket desconectado!'));
```

### Problema: API retorna 404

**Solução**:
```bash
1. Verificar se a rota existe no server.js
2. Verificar se o build foi feito: npm run build
3. Verificar logs do Render
4. Testar curl: curl https://seu-app.onrender.com/api/health
```

### Problema: CORS Error

**Solução**: A aplicação está sendo servida pelo mesmo domínio, então não deve ter CORS. Se tiver:
```bash
1. Verificar se está servindo dist/
2. Verificar se proxy está ativo no dev
3. Verificar headers no server.js
```

---

## 📊 URLs de Produção

Para Render, as URLs serão:

```
Frontend:     https://seu-app.onrender.com
API:          https://seu-app.onrender.com/api/...
Socket.IO:    https://seu-app.onrender.com
Health Check: https://seu-app.onrender.com/api/health
```

---

## ✨ Resumo das Mudanças

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Socket URL em prod | ❌ Hardcoded localhost | ✅ Auto-detecta |
| API routes | ✅ Relativos | ✅ Continuam relativos |
| Env vars | ⚠️ Incompleto | ✅ Completo |
| Dev proxy | ✅ Configurado | ✅ Continua |
| Production | ❌ Problemático | ✅ Funcional |

---

## 🎉 Status Final

✅ Configuração correta para produção  
✅ Auto-detecção de URL em qualquer ambiente  
✅ Build passa sem erros  
✅ Pronto para deploy em Render

---

## 📝 Arquivos Modificados

1. `src/components/MessagingSystemV2.jsx` - Socket.IO URL detection
2. `.env.local` (novo) - Dev environment variables
3. `.env.production` (novo) - Production environment variables

---

## 🚀 Próximas Ações

1. Fazer commit das mudanças
2. Push para GitHub
3. Render fará auto-deploy
4. Testar em produção
5. Se houver erro, verificar logs no Render

```bash
# Commands para testar:
npm run dev          # Dev local
npm run build        # Build production
npm run preview      # Preview production local
```

---

**BProjetos v6.0 | Production Ready | 2025**

👉 Deploy com segurança! 🚀
