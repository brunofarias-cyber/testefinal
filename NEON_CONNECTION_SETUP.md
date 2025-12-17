# 🔧 Configuração Rápida - DATABASE_URL no Render

## Sua Connection String (Neon)
```
postgresql://neondb_owner:npg_e9S1MZIvFyDh@ep-frosty-surf-ac5dikxg-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## ✅ PASSOS PARA CONECTAR NO RENDER

### 1️⃣ Ir ao Render Dashboard
- Acesse: https://dashboard.render.com
- Faça login
- Procure pelo serviço **"nexo-fullstack"**

### 2️⃣ Clicar em "Environment"
- No menu superior do seu serviço
- Clique em **"Environment"**

### 3️⃣ Adicionar DATABASE_URL
- Clique em **"Add Environment Variable"** (botão azul)
- **Key:** `DATABASE_URL`
- **Value:** Cole INTEIRO:
```
postgresql://neondb_owner:npg_e9S1MZIvFyDh@ep-frosty-surf-ac5dikxg-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```
- Deixe **"Sync with GitHub"** desmarcado
- Clique **"Save"**

### 4️⃣ Fazer Deploy
- Volte ao serviço (clique em "Settings" ou nome do serviço)
- Clique em **"Manual Deploy"** ou **"Redeploy latest commit"**
- Selecione branch **"main"**
- Clique em **"Create Deploy"**

### 5️⃣ Monitorar Logs
- Clique em **"Logs"**
- Procure por:
  - ✅ `✅ Banco de dados conectado com sucesso!`
  - ✅ `✅ Servidor NEXO rodando!`
  - ❌ Erros de conexão

### 6️⃣ Testar
```bash
curl https://seu-app.onrender.com/api/health
```

Deve retornar algo como:
```json
{
  "status":"ok",
  "database":"connected",
  "environment":"production"
}
```

---

## ⚠️ IMPORTANTE

- **Não compartilhe essa string** com ninguém (contém senha!)
- Se vazar, regenere a senha no Neon Console
- A string já tem `sslmode=require` - está segura ✅

---

## 🆘 Se der erro:

**"Connection refused"**
- Verifique se a string foi copiada corretamente (sem quebras)
- Confirme que o Neon está online

**"SSL: CERTIFICATE_VERIFY_FAILED"**
- A string já tem `sslmode=require` - deveria funcionar
- Se não funcionar, tente com `&sslmode=prefer`

**Timeout**
- Aumentar Health Check Timeout para 30s
- Ir em Settings > Health Check Timeout

---

**Status:** 🚀 Pronto para conectar!
