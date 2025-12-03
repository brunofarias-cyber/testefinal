# 🚀 Guia de Deploy no Render (Atualizado)

## ✅ Configuração Automática (Recomendada)

O projeto já possui um arquivo `render.yaml` configurado.
Se você conectar o repositório no Render como **Blueprint**, ele vai configurar tudo sozinho!

1. No Render, clique em **New +** → **Blueprint**
2. Conecte seu repositório GitHub
3. O Render vai detectar o `render.yaml` e pedir apenas as variáveis de ambiente.

---

## 🛠️ Configuração Manual (Se preferir)

Se criar como **Web Service**, use estas configurações:

### **1️⃣ Build & Deploy**
- **Runtime:** Node
- **Build Command:** 
  ```bash
  npm install && npm run build:render
  ```
- **Start Command:**
  ```bash
  npm run start:prod
  ```

### **2️⃣ Environment Variables**

Adicione estas variáveis em **Environment**:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_e9S1MZIvFyDh@ep-frosty-surf-ac5dikxg-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | `sua-chave-secreta-super-segura-aqui-2024` |
| `NODE_VERSION` | `20.16.11` |

⚠️ **NÃO adicione** `PORT` - o Render define automaticamente!

---

## 🔍 O que acontece no Deploy?

1. **Build:**
   - Compila o Frontend (Vite) → `dist/`
   - Compila o Backend (Esbuild) → `dist-server/index.js`

2. **Start:**
   - Roda `npm run db:push` (Atualiza o banco de dados Neon automaticamente)
   - Inicia o servidor Node.js

---

## 🆘 Problemas Comuns

### Erro: `sh: 1: drizzle-kit: not found`
- Significa que as dependências não foram instaladas corretamente.
- Certifique-se de que `drizzle-kit` está em `dependencies` no `package.json` (já corrigimos isso!).

### Erro de Conexão com Banco
- Verifique se a `DATABASE_URL` está correta e se o banco Neon está ativo.
