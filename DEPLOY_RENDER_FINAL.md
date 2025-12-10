# 🚀 Deploy NEXO no Render - Guia Completo

## ✅ O que foi configurado

### 1. **render.yaml** atualizado
- Nome do serviço: `nexo-fullstack`
- Build command: `npm install && npm run build:render`
- Start command: `node server.js`
- Servidor irá construir o frontend e servir tudo em uma única porta

### 2. **package.json** atualizado
- Adicionado script: `"build:render": "vite build"`
- Constrói o frontend React para a pasta `/dist`

### 3. **server.js** já configurado
- Serve arquivos estáticos da pasta `/dist`
- SPA fallback para rotas do React
- Rotas da API em `/api/*`

## 📋 Passo a Passo para Deploy

### Opção 1: Deploy Automático via GitHub

1. **Faça commit e push das mudanças:**
```bash
cd /Users/brunopicanco/Desktop/testefinal
git add .
git commit -m "Configurar deploy fullstack no Render"
git push origin main
```

2. **No Render Dashboard:**
   - Acesse: https://dashboard.render.com
   - O serviço `nexo-fullstack` irá detectar as mudanças
   - Clique em "Manual Deploy" → "Deploy latest commit"
   - Aguarde o build (~3-5 minutos)

3. **Verificar logs:**
   - Clique em "Logs" no painel do serviço
   - Procure por: `✅ Servidor rodando em http://0.0.0.0:3000`
   - Procure por: `vite build completed`

### Opção 2: Deploy Manual via Render Dashboard

1. **Acesse Render:** https://dashboard.render.com

2. **Criar Novo Web Service:**
   - Clique em "New" → "Web Service"
   - Conecte seu repositório GitHub
   - Selecione o repositório `testefinal`

3. **Configurações:**
   - **Name:** `nexo-fullstack`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build:render`
   - **Start Command:** `node server.js`

4. **Variáveis de Ambiente (Environment Variables):**
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=(seu postgres URL)
   JWT_SECRET=(gerar string aleatória)
   ANTHROPIC_API_KEY=(sua chave se usar IA)
   ```

5. **Clique em "Create Web Service"**

## 🔍 Verificar Deploy

### 1. Health Check
Acesse: `https://seu-app.onrender.com/api/health`

Deve retornar:
```json
{
  "message": "Backend NEXO API",
  "version": "1.0.0",
  "endpoints": [
    "/api/health",
    "/api/bncc",
    "/api/classes",
    "/api/team-chat",
    "/api/wizard-bncc",
    "/api/messages"
  ]
}
```

### 2. Frontend
Acesse: `https://seu-app.onrender.com`

Deve carregar a página do NEXO com login.

## 🐛 Troubleshooting

### Problema: "Cannot GET /"
**Causa:** Build do frontend não foi executado
**Solução:**
- Verificar logs do build
- Procurar por erros no `vite build`
- Garantir que pasta `/dist` foi criada

### Problema: "404 Not Found" nas rotas do React
**Causa:** SPA fallback não configurado
**Solução:** Já configurado no `server.js` (linhas 168-175)

### Problema: API retorna 404
**Causa:** Rotas da API não carregadas
**Solução:**
- Verificar variável `DATABASE_URL` está configurada
- Verificar logs: `✅ TODAS as rotas importadas com sucesso`

### Problema: Build timeout
**Causa:** Build muito lento no plano free
**Solução:**
- Esperar mais tempo (até 15 minutos)
- Verificar se `node_modules` não está no git
- Limpar cache: Settings → "Clear build cache"

## 📊 Estrutura do Deploy

```
Render Build Process:
├── 1. npm install (instala dependências)
├── 2. npm run build:render (vite build)
│   └── Cria pasta /dist com:
│       ├── index.html
│       ├── assets/
│       │   ├── *.js (React bundled)
│       │   └── *.css
│       └── ...
├── 3. node server.js (inicia servidor)
└── 4. Serve:
    ├── /api/* → Backend routes
    └── /* → Frontend (SPA)
```

## 🔐 Variáveis de Ambiente Necessárias

```bash
# Essenciais
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Autenticação
JWT_SECRET=sua_chave_secreta_aleatoria_aqui

# Opcionais (IA)
ANTHROPIC_API_KEY=sk-ant-...

# Opcionais (Google OAuth)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=...
```

## ✅ Checklist Final

- [ ] Commit e push no GitHub
- [ ] Render detectou mudanças
- [ ] Build completou sem erros
- [ ] `/api/health` retorna JSON correto
- [ ] Frontend carrega em `/`
- [ ] Login funciona
- [ ] Rotas do React funcionam (ex: `/dashboard`)

## 🌐 URLs após Deploy

- **Frontend:** `https://nexo-fullstack.onrender.com`
- **API:** `https://nexo-fullstack.onrender.com/api/health`
- **Dashboard Render:** `https://dashboard.render.com/web/srv-XXXXX`

## 📝 Notas Importantes

1. **Plano Free do Render:**
   - Dorme após 15 minutos de inatividade
   - Primeiro acesso pode demorar 30-60 segundos

2. **Build Time:**
   - Primeira vez: ~5-10 minutos
   - Builds subsequentes: ~3-5 minutos

3. **Hot Reload:**
   - Não funciona em produção (normal)
   - Mudanças requerem novo deploy

4. **Logs:**
   - Sempre verifique os logs em caso de erro
   - Procure por mensagens de erro em vermelho

---

## 🎯 Próximos Passos

Depois do deploy bem-sucedido:
1. Testar todas as funcionalidades principais
2. Configurar domínio customizado (opcional)
3. Configurar SSL/HTTPS (automático no Render)
4. Monitorar performance e logs
