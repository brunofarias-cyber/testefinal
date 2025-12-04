# 🚀 Guia de Deploy no Render

## Problema: "Exited with status 126"

Isso acontece porque o Render teve problemas com os comandos de build.

## ✅ Solução: Configuração Manual no Render

### **1️⃣ Configurações do Serviço**

No painel do Render, vá em **Settings** e configure:

#### **Build & Deploy:**
- **Build Command:** 
  ```
  npm install && npm run build:render
  ```

- **Start Command:**
  ```
  npm start
  ```

- **Root Directory:** (deixe vazio)

---

### **2️⃣ Environment Variables**

Em **Environment**, adicione:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_GB8v2sXxRSTu@ep-winter-glade-acy2ustp-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` |
| `JWT_SECRET` | `meu-super-secret-abc123XYZ` |
| `NODE_ENV` | `production` |
| `NODE_VERSION` | `20` |

⚠️ **NÃO adicione** `PORT` - o Render define automaticamente!

---

### **3️⃣ Depois de Configurar**

1. Salve as configurações
2. Clique em **Manual Deploy** → **Deploy latest commit**
3. Aguarde o build (pode demorar 3-5 minutos)

---

## 🆘 Se ainda der erro

Use a configuração **MAIS SIMPLES:**

**Build Command:**
```
npm install && npm run build:simple
```

Eu vou criar esse script agora para você!

---

## 📊 Logs Úteis

Para ver o erro real:
1. No Render, vá em **Logs**
2. Procure por linhas com ❌ ou `Error:`
3. Me envie o erro específico

---

## ⚡ Alternativa: Deploy sem esbuild

Se nada funcionar, posso te mostrar como fazer deploy **sem** esbuild (mais simples).

Me avise se quer tentar!
