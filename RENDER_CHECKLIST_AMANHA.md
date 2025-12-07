# 🚀 Checklist Render Deploy - Amanhã

**Data:** 6 de Dezembro de 2025  
**Status:** Preparado para debugging

---

## ⚠️ VERIFICAÇÕES ANTES DE COMEÇAR

### 1. Verificar estado atual do projeto

```bash
# Testar build local
npm run build

# Testar server local
node server.js

# Verificar porta
curl http://localhost:3000/api/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-06...",
  "uptime": 1.234
}
```

---

## 🔍 DIAGNÓSTICO DO PROBLEMA ATUAL

### Passo 1: Acessar logs do Render

```bash
1. Ir para: https://dashboard.render.com
2. Selecionar serviço: bprojetos (ou nome do seu serviço)
3. Clicar em "Logs"
4. Copiar últimas 100 linhas do erro
```

### Passo 2: Identificar a fase que falha

Marcar qual fase está falhando:

```
[ ] Fase 1: Cloning repository (problema de acesso GitHub)
[ ] Fase 2: Installing dependencies (npm install)
[ ] Fase 3: Building application (npm run build)
[ ] Fase 4: Starting server (node server.js)
[ ] Fase 5: Health check (rota /health não responde)
```

---

## 🛠️ SOLUÇÕES RÁPIDAS POR FASE

### ❌ Se falhar em: Installing dependencies

**Problema:** `npm ERR! ERESOLVE` ou `npm ERR! code`

**Solução:**
```bash
# Local - Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "fix: regenerate package-lock.json"
git push

# Render - Adicionar variável
NODE_VERSION=20.11.0
```

---

### ❌ Se falhar em: Building application

**Problema:** `vite build failed` ou `Build failed in X.Xs`

**Verificar:**
1. Imports com case incorreto (Button vs button)
2. Variáveis de ambiente faltando (VITE_API_URL)
3. Código com erro de sintaxe

**Solução:**
```bash
# Testar build local
npm run build

# Se der erro aqui, corrigir ANTES de fazer deploy
# Se funcionar aqui mas não no Render, problema é NODE_VERSION
```

---

### ❌ Se falhar em: Starting server

**Problema:** Server crash imediato `[Process exited]`

**Verificação no código:**

```javascript
// server.js - Linha ~390
// ✅ CORRETO (já está assim)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em porta ${PORT}`);
});

// ❌ ERRADO (se estiver assim, mudar)
const PORT = 3000;
app.listen(PORT);
```

**Solução:**
```bash
# Verificar se está escutando em 0.0.0.0
# Mudar de:
app.listen(PORT, () => {...})

# Para:
app.listen(PORT, '0.0.0.0', () => {...})
```

---

### ❌ Se falhar em: Health check

**Problema:** `Your service did not respond within 10 minutes`

**Verificar rota /health:**

```javascript
// server.js - Linha ~42
// ✅ JÁ EXISTE essa rota! Verificar se está funcionando:
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
```

**Configurar no Render:**
```
Health Check Path: /api/health  ← IMPORTANTE o /api/
Health Check Interval: 30  ← Aumentar para 30s ou 60s
```

---

### ❌ Se falhar em: Database connection

**Problema:** `Error: connect ECONNREFUSED` ou `Database connection failed`

**Verificar código atual:**

```javascript
// server.js - Linha ~380
// ✅ O código atual JÁ faz process.exit(1) se DB falhar
// Isso é OK para Render SE o DATABASE_URL estiver correto

// Verificar se SSL está habilitado no sequelize:
// config/database.js ← VERIFICAR ESSE ARQUIVO AMANHÃ
```

**Solução rápida:**
```bash
# No Render Environment Variables:
DATABASE_URL=postgresql://user:pass@host:5432/db
DB_SSL=true
NODE_ENV=production

# Se continuar falhando, COMENTAR temporariamente:
# process.exit(1) ← Para servidor subir mesmo sem DB
```

---

## 📝 ARQUIVOS PARA VERIFICAR AMANHÃ

### 1. config/database.js

```bash
# Verificar se tem SSL habilitado:
cat config/database.js | grep -i ssl

# Deve ter algo assim:
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
```

### 2. package.json

```bash
# Verificar scripts e engines:
cat package.json | grep -A 10 "scripts"
cat package.json | grep -A 5 "engines"

# Deve ter:
"scripts": {
  "start": "node server.js",
  "build": "vite build",
  "dev": "concurrently \"node server.js\" \"vite\""
},
"engines": {
  "node": ">=18.0.0"
}
```

### 3. vite.config.js

```bash
# Verificar se existe e está correto:
cat vite.config.js

# Deve ter:
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
```

---

## 🚀 AÇÕES PARA AMANHÃ (em ordem)

### ✅ Checklist de Execução

```bash
# 1. Coletar informações
[ ] Abrir Render logs
[ ] Copiar erro completo
[ ] Identificar fase que falha

# 2. Verificar arquivos locais
[ ] cat config/database.js (verificar SSL)
[ ] cat package.json (verificar scripts)
[ ] node server.js (testar local)
[ ] npm run build (testar build)

# 3. Verificar Render Dashboard
[ ] Environment Variables estão corretas?
[ ] NODE_VERSION está definido?
[ ] DATABASE_URL está correto?
[ ] Health Check Path = /api/health?

# 4. Correções mais prováveis
[ ] Adicionar '0.0.0.0' no app.listen()
[ ] Habilitar SSL no config/database.js
[ ] Aumentar Health Check timeout para 60s
[ ] Adicionar NODE_VERSION=20.11.0

# 5. Deploy e teste
[ ] git add . && git commit && git push
[ ] Aguardar build no Render
[ ] Verificar logs em tempo real
[ ] Testar rota: https://SEU_APP.onrender.com/api/health
```

---

## 🔧 CORREÇÕES MAIS PROVÁVEIS

### Correção 1: SSL no Database

**Arquivo:** `config/database.js`

```javascript
// SE estiver assim (SEM SSL):
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

// MUDAR PARA (COM SSL):
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});
```

### Correção 2: Host no Listen

**Arquivo:** `server.js` (linha ~387)

```javascript
// MUDAR DE:
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em porta ${PORT}`);
});

// PARA:
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em porta ${PORT}`);
  console.log(`📍 Host: 0.0.0.0:${PORT}`);
});
```

### Correção 3: Não fazer exit se DB falhar (temporário)

**Arquivo:** `server.js` (linha ~392)

```javascript
// MUDAR DE:
.catch(err => {
  console.error('❌ Erro ao conectar PostgreSQL:', err.message);
  process.exit(1);  // ← Remove isso temporariamente
});

// PARA:
.catch(err => {
  console.error('❌ Erro ao conectar PostgreSQL:', err.message);
  console.log('⚠️ Servidor vai subir sem banco (modo offline)');
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando SEM DATABASE em porta ${PORT}`);
  });
});
```

---

## 📊 VARIÁVEIS DE AMBIENTE NECESSÁRIAS

### No Render Dashboard → Environment

```bash
# ESSENCIAIS
NODE_VERSION=20.11.0
NODE_ENV=production
PORT=10000  # Render define automaticamente, NÃO adicionar manualmente

# DATABASE (se usar PostgreSQL do Render)
DATABASE_URL=postgresql://...  # Copiar do PostgreSQL service
DB_SSL=true

# OPCIONAL (se tiver)
JWT_SECRET=seu-secret-aqui
FRONTEND_URL=https://seu-frontend.onrender.com
```

---

## 🆘 SE NADA FUNCIONAR

### Último recurso: Deploy Minimalista

Criar arquivo `server-minimal.js`:

```javascript
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server minimal funcionando!',
    timestamp: Date.now() 
  });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend está vivo!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Minimal server on port ${PORT}`);
});
```

**Deploy minimal:**
```bash
# Mudar no Render:
Start Command: node server-minimal.js

# Se funcionar, problema está no server.js principal
# Ir adicionando features uma por uma até achar o problema
```

---

## 📞 INFORMAÇÕES PARA DEBUG

Se precisar de ajuda, coletar:

```bash
# 1. Logs do Render (últimas 100 linhas)
# 2. Erro específico (print)
# 3. Resultado dos comandos:

node --version
npm --version
git log -1 --oneline
cat package.json | grep "start"
cat server.js | grep "app.listen"
cat config/database.js | head -20

# 4. Environment Variables (sem senhas!)
echo "NODE_VERSION: ?"
echo "NODE_ENV: ?"
echo "DATABASE_URL: está definido? sim/não"
```

---

## ✅ META PARA AMANHÃ

**Objetivo:** Servidor respondendo em `https://SEU_APP.onrender.com/api/health`

**Tempo estimado:** 30-60 minutos

**Resultado esperado:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-07T...",
  "uptime": 12.34
}
```

---

**Status:** 🔥 Pronto para resolver amanhã!

**Dica:** Começar pelas correções 1, 2 e 3 acima. São as mais prováveis!
