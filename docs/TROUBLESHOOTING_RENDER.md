# 🔧 Troubleshooting - Deploy no Render

**Arquivo:** `docs/TROUBLESHOOTING_RENDER.md`  
**Data:** 6 de Dezembro de 2025  
**Objetivo:** Diagnosticar e resolver problemas de deploy no Render

---

## 🎯 Índice Rápido

1. [Diagnóstico Inicial](#diagnóstico-inicial)
2. [Problemas Comuns](#problemas-comuns)
3. [Checklist Pré-Deploy](#checklist-pré-deploy)
4. [Logs e Debugging](#logs-e-debugging)
5. [Configuração Correta](#configuração-correta)
6. [Soluções Passo a Passo](#soluções-passo-a-passo)

---

## 🚨 Diagnóstico Inicial

### Passo 1: Identificar o Tipo de Erro

Acesse os logs do Render e identifique qual fase está falando:

```bash
# Fases do Deploy no Render:
1. ⏬ Cloning repository      → Problema: Acesso ao GitHub
2. 📦 Installing dependencies → Problema: package.json ou npm
3. 🔨 Building application    → Problema: Build script
4. 🚀 Starting server         → Problema: server.js ou PORT
5. ✅ Health check            → Problema: Rota /health ou timeout
```

### Passo 2: Verificar Status Atual

```bash
# No Render Dashboard:
1. Vá em: https://dashboard.render.com
2. Clique no seu serviço
3. Veja a aba "Logs"
4. Identifique a ÚLTIMA linha antes do erro
```

---

## 🐛 Problemas Comuns

### Problema 1: "Build failed" - Dependencies

**Sintoma:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Causa:** Conflito de dependências ou versão do Node.js incorreta

**Solução:**

```bash
# 1. Verificar Node version local
node --version

# 2. Especificar no Render
# Adicionar em "Environment Variables":
NODE_VERSION=20.x

# 3. Limpar package-lock.json
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Fix: regenerate package-lock.json"
git push
```

**Arquivo a verificar:** `package.json`
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

---

### Problema 2: "Application failed to respond"

**Sintoma:**
```
Your service did not respond to the health check within 10 minutes
```

**Causa:** Servidor não está escutando na porta correta ou demorou muito para iniciar

**Solução 1: Verificar PORT**

```javascript
// server.js - INCORRETO ❌
const PORT = 3000;
app.listen(PORT);

// server.js - CORRETO ✅
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

**Solução 2: Adicionar Health Check Route**

```javascript
// server.js - Adicionar ANTES de outras rotas
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

**Solução 3: Configurar no Render**

No Render Dashboard → Settings:
```
Health Check Path: /health
Health Check Interval: 30 seconds (não menos que isso!)
```

---

### Problema 3: "Build command exited with code 1"

**Sintoma:**
```
npm run build
> vite build
✖ Build failed in 1.2s
```

**Causa:** Erro no build do Vite (código React inválido ou imports quebrados)

**Solução 1: Testar build localmente**

```bash
# Rodar build local para ver o erro
npm run build

# Se funcionar local mas não no Render:
# Problema é diferença de ambiente
```

**Solução 2: Verificar imports**

```javascript
// INCORRETO ❌ (case-sensitive no Linux)
import Button from './components/button';

// CORRETO ✅
import Button from './components/Button';
```

**Solução 3: Verificar variáveis de ambiente**

```javascript
// vite.config.js - Adicionar
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,  // Desabilitar sourcemaps em produção
    rollupOptions: {
      output: {
        manualChunks: undefined  // Evitar problemas com chunks
      }
    }
  }
});
```

---

### Problema 4: Database Connection Failed

**Sintoma:**
```
Error: connect ECONNREFUSED
Unable to connect to the database
```

**Causa:** Banco de dados não configurado ou variáveis de ambiente incorretas

**Solução 1: Verificar Variáveis de Ambiente**

No Render Dashboard → Environment:
```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
# OU
DB_HOST=dpg-xxxxx.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=bprojetos
DB_USER=bprojetos_user
DB_PASSWORD=xxxxx
DB_SSL=true
```

**Solução 2: Habilitar SSL**

```javascript
// config/database.js - Adicionar SSL config
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false  // IMPORTANTE para Render
    }
  },
  logging: false
});
```

**Solução 3: Testar Conexão**

```javascript
// server.js - Adicionar teste de conexão
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    // NÃO fazer process.exit(1) aqui! Deixar o servidor subir
  }
}
testDatabaseConnection();
```

---

### Problema 5: "Start command exited immediately"

**Sintoma:**
```
==> Starting service with 'node server.js'
[Process exited]
```

**Causa:** Erro no código que faz o servidor crashar imediatamente

**Solução 1: Adicionar try-catch no server.js**

```javascript
// server.js - Wrapper principal
async function startServer() {
  try {
    const PORT = process.env.PORT || 3000;
    
    // Tentar conectar banco (mas não bloquear)
    try {
      await sequelize.authenticate();
      console.log('✅ Database connected');
    } catch (dbError) {
      console.warn('⚠️ Database connection failed:', dbError.message);
      console.log('📝 Server will start anyway (offline mode)');
    }
    
    // SEMPRE iniciar o servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

startServer();
```

**Solução 2: Verificar imports quebrados**

```bash
# Procurar por imports que não existem
grep -r "import.*from.*\.js" server.js routes/

# Render usa Node.js puro (não Babel)
# Certifique-se de que todos os imports tem extensão .js
```

---

### Problema 6: "Out of Memory" (OOM)

**Sintoma:**
```
JavaScript heap out of memory
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Causa:** Build ou servidor consumindo muita RAM

**Solução 1: Aumentar memória do Node**

No Render → Environment Variables:
```bash
NODE_OPTIONS=--max-old-space-size=2048
```

**Solução 2: Otimizar build**

```json
// package.json - Build script
{
  "scripts": {
    "build": "vite build --mode production",
    "build:server": "echo 'No build needed for backend'"
  }
}
```

**Solução 3: Upgrade Plan**

Se nada funcionar, upgrade para plano pago (512MB → 2GB RAM):
```
Free Plan: 512MB RAM (limitado)
Starter: $7/mês - 2GB RAM
```

---

## ✅ Checklist Pré-Deploy

### Antes de fazer deploy, verificar:

```bash
# 1. Build funciona local?
npm run build
# Deve gerar pasta /dist sem erros

# 2. Servidor funciona local?
npm start
# OU
node server.js
# Deve subir na porta 3000

# 3. Variáveis de ambiente estão definidas?
# Criar arquivo .env.production.local
PORT=3000
DATABASE_URL=postgres://...
NODE_ENV=production

# 4. package.json tem os scripts corretos?
cat package.json | grep -A 5 "scripts"

# 5. Git está atualizado?
git status
git add .
git commit -m "Fix: ready for deploy"
git push origin main
```

---

## 🔍 Logs e Debugging

### Como ler os logs do Render

```bash
# 1. Logs de Build (durante deploy)
==> Installing dependencies
==> Building application
==> Starting service

# 2. Logs de Runtime (servidor rodando)
✅ Server running on port 10000
✅ Database connected
📡 Socket.io initialized

# 3. Logs de Erro
❌ Error: Cannot find module './routes/missing.js'
❌ Database connection failed: timeout
```

### Adicionar logs úteis no código

```javascript
// server.js - Logs informativos
console.log('🚀 Starting server...');
console.log('📁 NODE_ENV:', process.env.NODE_ENV);
console.log('🔌 PORT:', process.env.PORT);
console.log('💾 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing');

// Em cada rota importante
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.json({ status: 'OK' });
});
```

---

## ⚙️ Configuração Correta

### render.yaml (recomendado)

Criar arquivo `render.yaml` na raiz do projeto:

```yaml
services:
  # Backend (Node.js + Express)
  - type: web
    name: bprojetos-backend
    env: node
    region: oregon
    plan: free
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_VERSION
        value: 20.11.0
      - key: NODE_ENV
        value: production
      - key: PORT
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: bprojetos-db
          property: connectionString
    healthCheckPath: /health
    
  # Frontend (Vite Static Site)
  - type: web
    name: bprojetos-frontend
    env: static
    region: oregon
    plan: free
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    headers:
      - path: /*
        name: Cache-Control
        value: public, max-age=3600
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

  # Database (PostgreSQL)
  - type: pserv
    name: bprojetos-db
    env: docker
    region: oregon
    plan: free
    dockerfilePath: ./Dockerfile.postgres
```

### Variáveis de Ambiente Essenciais

No Render Dashboard → Environment:

```bash
# OBRIGATÓRIAS
NODE_VERSION=20.11.0
NODE_ENV=production
PORT=10000  # Render define isso automaticamente

# DATABASE (se usar PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/db
DB_SSL=true

# FRONTEND (se usar Vite)
VITE_API_URL=https://bprojetos-backend.onrender.com

# OPCIONAIS
JWT_SECRET=seu-secret-aqui-change-me
SESSION_SECRET=outro-secret-aqui
FRONTEND_URL=https://bprojetos.onrender.com
```

---

## 🛠️ Soluções Passo a Passo

### Solução A: Servidor não sobe (crash imediato)

```bash
# 1. Verificar logs no Render
# Procure por: "Error:", "Cannot find", "undefined"

# 2. Testar localmente com mesmas variáveis
export NODE_ENV=production
export PORT=10000
node server.js

# 3. Se funcionar local, problema é variável de ambiente
# Adicionar todas as variáveis no Render Dashboard

# 4. Se não funcionar local, corrigir o erro mostrado
```

### Solução B: Build do Vite falha

```bash
# 1. Rodar build local
npm run build

# 2. Se der erro, corrigir imports/código
# Se funcionar, verificar Node version

# 3. No Render, garantir Node 18+ ou 20+
NODE_VERSION=20.11.0

# 4. Verificar se tem arquivo vite.config.js
cat vite.config.js
```

### Solução C: Banco de dados não conecta

```bash
# 1. Verificar se DATABASE_URL está correto
echo $DATABASE_URL

# 2. Testar conexão manual
node -e "
const { Sequelize } = require('sequelize');
const seq = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});
seq.authenticate().then(() => console.log('OK')).catch(e => console.error(e));
"

# 3. Se falhar, verificar:
# - Banco foi criado no Render?
# - SSL está habilitado no código?
# - Password tem caracteres especiais? (escapar com encodeURIComponent)
```

### Solução D: Deploy demora mais de 10 minutos

```bash
# 1. Aumentar timeout no Render
# Settings → Health Check Interval: 60 seconds

# 2. Otimizar instalação de dependências
# package.json - Remover devDependencies desnecessárias

# 3. Usar cache do npm
# Render faz isso automaticamente, mas pode limpar:
# Dashboard → Manual Deploy → Clear Build Cache
```

### Solução E: 502 Bad Gateway após deploy

```bash
# Causa: Servidor não está respondendo na porta correta

# Correção:
# server.js
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0');  # ← '0.0.0.0' é importante!

# Render injeta PORT automaticamente, NÃO definir manualmente
```

---

## 🚀 Deploy Manual (caso render.yaml não funcione)

### Opção 1: Web Service (Backend)

```bash
# No Render Dashboard:
1. New → Web Service
2. Connect GitHub repository
3. Configurar:
   Name: bprojetos-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: ./
   Environment: Node
   Build Command: npm install
   Start Command: node server.js
   Plan: Free

4. Add Environment Variables:
   NODE_VERSION=20.11.0
   NODE_ENV=production
   DATABASE_URL=(copiar do PostgreSQL service)

5. Advanced → Health Check Path: /health
6. Create Web Service
```

### Opção 2: Static Site (Frontend)

```bash
# No Render Dashboard:
1. New → Static Site
2. Connect GitHub repository
3. Configurar:
   Name: bprojetos-frontend
   Branch: main
   Root Directory: ./
   Build Command: npm install && npm run build
   Publish Directory: dist
   Plan: Free

4. Add Environment Variables:
   VITE_API_URL=https://bprojetos-backend.onrender.com

5. Redirects/Rewrites:
   Source: /*
   Destination: /index.html
   Action: Rewrite

6. Create Static Site
```

---

## 🔥 Solução de Emergência (Fast Deploy)

Se NADA funcionar, use essa configuração mínima:

### 1. Simplificar server.js

```javascript
// server-minimal.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check (OBRIGATÓRIO)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: Date.now() });
});

// API básica
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend funcionando!' });
});

// Escutar na porta
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server on port ${PORT}`);
});
```

### 2. Simplificar package.json

```json
{
  "name": "bprojetos",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 3. Deploy

```bash
git add .
git commit -m "Minimal server for debugging"
git push

# No Render:
Start Command: node server.js
Build Command: npm install
Environment: Node
```

---

## 📊 Checklist de Verificação Final

Antes de declarar "não está funcionando", verificar:

```bash
✅ [ ] Node version é 18+ ou 20+?
✅ [ ] PORT usa process.env.PORT?
✅ [ ] Servidor escuta em '0.0.0.0'?
✅ [ ] Rota /health existe e retorna 200?
✅ [ ] Build local funciona? (npm run build)
✅ [ ] Server local funciona? (node server.js)
✅ [ ] Todas variáveis de ambiente estão no Render?
✅ [ ] DATABASE_URL tem SSL habilitado no código?
✅ [ ] Git está atualizado? (git push)
✅ [ ] Logs do Render foram lidos completamente?
✅ [ ] Health Check timeout é >= 30s?
✅ [ ] package.json tem "start" script?
✅ [ ] Não há erros de import/require?
✅ [ ] Não há console.log com objetos gigantes?
✅ [ ] Free tier tem RAM suficiente? (512MB)
```

---

## 🆘 Quando Pedir Ajuda

Se após seguir TODOS os passos acima, ainda não funcionar:

**Informações para fornecer:**

1. **Logs completos do Render** (últimas 50 linhas)
2. **Último commit do Git** (`git log -1`)
3. **Versão do Node local** (`node --version`)
4. **Build local funciona?** (sim/não + print do erro)
5. **Variáveis de ambiente** (sem senhas! apenas nomes)
6. **Tipo de serviço no Render** (Web Service ou Static Site?)
7. **Print do erro específico** (screenshot ou cópia)

---

## 📚 Referências Úteis

- **Render Docs:** https://render.com/docs
- **Render Status:** https://status.render.com
- **Render Community:** https://community.render.com
- **Node.js no Render:** https://render.com/docs/node-version

---

## ✨ Dica Final

**90% dos problemas de deploy no Render são:**
1. ❌ Porta errada (esquecer `process.env.PORT`)
2. ❌ Health check sem rota `/health`
3. ❌ Database SSL não configurado
4. ❌ Node version incompatível
5. ❌ Variáveis de ambiente faltando

**Verifique esses 5 pontos PRIMEIRO antes de investigar mais!**

---

**Status:** 🔧 Guia completo pronto para debugging amanhã!
