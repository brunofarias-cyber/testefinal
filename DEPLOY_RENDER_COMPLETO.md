# 🚀 Deploy BProjetos no Render - Guia Completo

## ✅ Pré-requisitos

Antes de começar, você precisa ter:
- [ ] Conta no GitHub
- [ ] Conta no Render (https://render.com)
- [ ] String de conexão do Neon PostgreSQL
- [ ] Código do projeto no GitHub

---

## 📋 PASSO 1: Preparar o Código para Deploy

### 1.1 - Verificar package.json

Confirme que o `package.json` tem o script de start correto:

```json
{
  "scripts": {
    "start": "node server.js",
    "server": "nodemon server.js",
    "client": "vite",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "build": "vite build"
  }
}
```

✅ O comando `start` deve apontar para `node server.js` (sem nodemon)

### 1.2 - Verificar porta do servidor

No arquivo `server.js`, confirme que está usando `process.env.PORT`:

```javascript
const PORT = process.env.PORT || 3000;
```

### 1.3 - Verificar .gitignore

Confirme que `.env` está no `.gitignore`:

```
node_modules/
.env
dist/
```

---

## 📤 PASSO 2: Enviar Código para o GitHub

### 2.1 - Inicializar Git (se ainda não fez)

```bash
git init
git add .
git commit -m "Initial commit - BProjetos"
```

### 2.2 - Criar repositório no GitHub

1. Acesse https://github.com
2. Clique em **"New repository"**
3. Nome: `bprojetos` (ou outro de sua escolha)
4. **NÃO** marque "Initialize with README"
5. Clique em **"Create repository"**

### 2.3 - Conectar e enviar

```bash
git remote add origin https://github.com/SEU_USUARIO/bprojetos.git
git branch -M main
git push -u origin main
```

**IMPORTANTE:** Se der erro de autenticação, use um **Personal Access Token** no lugar da senha.

---

## 🎯 PASSO 3: Configurar Render

### 3.1 - Acessar Render

1. Acesse https://render.com
2. Faça login (pode usar GitHub)
3. No Dashboard, clique em **"New +"**
4. Selecione **"Web Service"**

### 3.2 - Conectar Repositório

1. Clique em **"Connect a repository"**
2. Se aparecer "Configure GitHub App", clique e autorize o Render
3. Selecione o repositório **bprojetos**
4. Clique em **"Connect"**

### 3.3 - Configurar o Web Service

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | `bprojetos-backend` (ou qualquer nome) |
| **Region** | `Oregon (US West)` ou mais próximo |
| **Branch** | `main` |
| **Root Directory** | *(deixar vazio)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | `Free` |

**NÃO clique em "Create Web Service" ainda!**

---

## 🔐 PASSO 4: Configurar Variáveis de Ambiente

Antes de criar o serviço, role a página até a seção **"Environment Variables"**.

### 4.1 - Adicionar DATABASE_URL

1. Clique em **"Add Environment Variable"**
2. **Key:** `DATABASE_URL`
3. **Value:** Cole sua string de conexão do Neon

**Formato esperado:**
```
postgresql://user:password@host.neon.tech/database?sslmode=require
```

**ATENÇÃO:** Certifique-se que tem `?sslmode=require` no final!

### 4.2 - Adicionar JWT_SECRET

1. Clique em **"Add Environment Variable"**
2. **Key:** `JWT_SECRET`
3. **Value:** Qualquer string segura (exemplo: `meu-super-segredo-jwt-2024`)

### 4.3 - Adicionar NODE_ENV

1. Clique em **"Add Environment Variable"**
2. **Key:** `NODE_ENV`
3. **Value:** `production`

### 4.4 - Resumo das Variáveis

Você deve ter **3 variáveis**:
- ✅ `DATABASE_URL`
- ✅ `JWT_SECRET`
- ✅ `NODE_ENV`

---

## 🚀 PASSO 5: Deploy!

1. **Agora SIM**, clique em **"Create Web Service"**
2. Render vai começar a fazer o build
3. Aguarde 2-5 minutos

### 5.1 - Acompanhar Logs

Na página do serviço, clique na aba **"Logs"** para ver o progresso:

```
==> Cloning from https://github.com/...
==> Running 'npm install'
==> Starting service with 'node server.js'
✅ PostgreSQL conectado
🚀 Servidor rodando em porta 10000
```

### 5.2 - Verificar Status

- ✅ Se aparecer **"Live"** em verde = SUCESSO! 🎉
- ❌ Se aparecer **"Build failed"** = veja o **PASSO 6**

---

## 🌐 PASSO 6: Testar o Deploy

### 6.1 - Obter URL

Na página do serviço, copie a URL (algo como):
```
https://bprojetos-backend.onrender.com
```

### 6.2 - Testar API

Abra no navegador:
```
https://bprojetos-backend.onrender.com
```

Você deve ver:
```
Backend PostgreSQL is running! 🚀
Access the frontend at http://localhost:5173
```

### 6.3 - Testar Login

Use Postman, Insomnia, ou curl:

```bash
curl -X POST https://bprojetos-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "professor@bprojetos.com",
    "password": "prof123"
  }'
```

Se retornar um token JWT = **FUNCIONOU!** ✅

---

## 🐛 PASSO 7: Resolver Problemas Comuns

### Erro: "Application failed to respond"

**Causa:** Servidor não está escutando na porta correta

**Solução:**
1. No `server.js`, confirme:
```javascript
const PORT = process.env.PORT || 3000;
```

2. No Render, vá em **Settings** → **Build & Deploy**
3. Confirme que **Start Command** é `node server.js`
4. Clique em **"Manual Deploy"** → **"Deploy latest commit"**

---

### Erro: "cannot find module"

**Causa:** Dependência faltando

**Solução:**
1. Confirme que todas as dependências estão no `package.json`
2. No terminal local, rode:
```bash
npm install
```
3. Faça commit e push:
```bash
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```
4. Render vai fazer redeploy automaticamente

---

### Erro: "PostgreSQL connection failed"

**Causa:** DATABASE_URL incorreta ou banco não acessível

**Solução:**
1. No Render, vá em **Environment** → **Environment Variables**
2. Clique em **Edit** ao lado de `DATABASE_URL`
3. Confirme que a string está correta e tem `?sslmode=require` no final
4. Teste a conexão no Neon Dashboard primeiro
5. Se alterou, clique em **"Manual Deploy"**

---

### Erro: "port already in use"

**Causa:** Tentando usar porta fixa

**Solução:**
No `server.js`, **NUNCA** use porta fixa em produção:

❌ **ERRADO:**
```javascript
const PORT = 3000; // fixo
```

✅ **CORRETO:**
```javascript
const PORT = process.env.PORT || 3000;
```

---

### Erro: "ENUM type already exists"

**Causa:** Conflito de tipos no banco

**Solução:**
No `config/database.js`, adicione `typeValidation: false`:

```javascript
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  typeValidation: false, // <-- ADICIONE ISSO
  // ... resto
});
```

---

## 🔄 PASSO 8: Atualizar o Deploy

Quando fizer mudanças no código:

```bash
git add .
git commit -m "Descrição da mudança"
git push
```

Render vai fazer **redeploy automático**!

---

## 📊 PASSO 9: Monitorar o Serviço

### 9.1 - Ver Logs em Tempo Real

1. No Render Dashboard, clique no seu serviço
2. Clique na aba **"Logs"**
3. Logs aparecem em tempo real

### 9.2 - Ver Métricas

1. Clique na aba **"Metrics"**
2. Veja CPU, memória, requests

### 9.3 - Configurar Alertas (Opcional)

1. Clique na aba **"Settings"**
2. Role até **"Health Checks"**
3. Configure path: `/health`

---

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Serviço está **"Live"** no Render
- [ ] URL do serviço abre e mostra mensagem
- [ ] Login via API retorna token JWT
- [ ] Tabelas foram criadas no Neon
- [ ] Dados de seed foram inseridos
- [ ] Variáveis de ambiente configuradas
- [ ] Logs não mostram erros

---

## 🎉 Próximos Passos

### Deploy do Frontend (Opcional)

Se quiser hospedar o frontend também:

1. No Render, clique em **"New +" → "Static Site"**
2. Conecte o mesmo repositório
3. **Build Command:** `npm run build`
4. **Publish Directory:** `dist`
5. Adicione variável: `REACT_APP_API_URL=https://seu-backend.onrender.com`

---

## 📞 Suporte

Se continuar com problemas:

1. **Copie os logs** completos do Render
2. **Tire screenshot** da seção Environment Variables
3. **Me envie** para análise

---

## 🔗 Links Úteis

- [Render Docs](https://render.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Sequelize Docs](https://sequelize.org/docs/v6/)

---

**Última atualização:** Dezembro 2024
**Versão:** 1.0
