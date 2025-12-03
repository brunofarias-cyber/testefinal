# 🗄️ Configuração do Banco de Dados Neon

## Passo a Passo Completo

### 1️⃣ Criar Conta no Neon (GRATUITO)

1. Acesse: **https://neon.tech**
2. Clique em **"Sign Up"** ou **"Get Started"**
3. Escolha uma opção de login:
   - 🐙 GitHub (recomendado - mais rápido)
   - 📧 Email
   - 🔑 Google

4. Autorize o acesso (se usar GitHub/Google)

---

### 2️⃣ Criar Novo Projeto

Após fazer login:

1. Clique em **"Create Project"** ou **"New Project"**
2. Preencha os dados:
   - **Project Name:** `bprojetos` (ou qualquer nome)
   - **Database Name:** `bprojetos_db`
   - **Region:** Escolha a mais próxima do Brasil (em ordem de preferência):
     - 🥇 **`South America (São Paulo)`** ← MELHOR OPÇÃO!
     - 🥈 `US East (N. Virginia)`
     - 🥉 `US East (Ohio)`
   - **Postgres Version:** Deixe a padrão (16)
   
   > ⚠️ **Nota:** A região de São Paulo pode não estar disponível no plano gratuito. Se não aparecer, escolha **US East (N. Virginia)**.

3. Clique em **"Create Project"**

---

### 3️⃣ Copiar a Connection String (DATABASE_URL)

Após criar o projeto, você verá a tela de conexão:

1. Procure por **"Connection String"** ou **"Connection Details"**
2. Selecione a aba **"Pooled connection"** (recomendado)
3. Copie a URL que parece com isso:

```
postgresql://usuario:[senha]@[host].neon.tech/bprojetos_db?sslmode=require
```

**Exemplo real:**
```
postgresql://user_abc123:xYz9K7mN2pQr@ep-cool-name-123456.us-east-2.aws.neon.tech/bprojetos_db?sslmode=require
```

4. **Guarde essa URL!** Você vai precisar dela.

---

### 4️⃣ Criar o arquivo `.env`

No seu terminal, na pasta do projeto:

```bash
cd /Users/brunopicanco/Desktop/testefinal
```

Crie o arquivo `.env`:

```bash
touch .env
```

Abra o arquivo `.env` (pode usar TextEdit, VS Code, ou qualquer editor):

```bash
open .env
```

Cole este conteúdo, **substituindo** a URL pela que você copiou:

```env
DATABASE_URL=postgresql://SEU_USUARIO:SUA_SENHA@SEU_HOST.neon.tech/bprojetos_db?sslmode=require
JWT_SECRET=meu-super-secret-key-abc123xyz
PORT=5000
NODE_ENV=development
```

**⚠️ IMPORTANTE:** Substitua toda a linha `DATABASE_URL=` pela URL real que você copiou do Neon!

Salve e feche o arquivo.

---

### 5️⃣ Criar as Tabelas no Banco

Agora vamos criar todas as tabelas automaticamente:

```bash
npm run db:push
```

Você deve ver algo como:

```
✅ Pushing database changes...
✅ Tables created successfully!
```

---

### 6️⃣ Rodar o Projeto Completo

Agora sim, rode o servidor completo (frontend + backend):

```bash
npm run dev
```

Você verá:

```
🚀 Server started on port 5000
  ➜  Local:   http://localhost:5000/
```

Acesse: **http://localhost:5000**

---

## ✅ Verificar se funcionou

### No navegador:
1. A aplicação deve carregar normalmente
2. Tente fazer login/cadastro

### No terminal:
Você verá logs das requisições:
```
POST /api/auth/login 200 in 45ms
GET /api/projects 200 in 12ms
```

---

## 🔍 Acessar o Painel do Neon

Você pode gerenciar seu banco pelo painel do Neon:

1. Acesse: https://console.neon.tech
2. Clique no seu projeto
3. Vá em **"Tables"** para ver suas tabelas
4. Vá em **"SQL Editor"** para executar queries

---

## 🆘 Problemas Comuns

### ❌ Erro: "DATABASE_URL must be set"
**Solução:** Verifique se o arquivo `.env` foi criado na raiz do projeto

### ❌ Erro: "Connection refused"
**Solução:** Verifique se copiou a URL correta do Neon (com senha!)

### ❌ Erro: "SSL connection required"
**Solução:** Certifique-se que a URL termina com `?sslmode=require`

### ❌ Porta 5000 em uso
**Solução:** Mude no `.env` para: `PORT=3000`

---

## 📊 Estrutura das Tabelas Criadas

O comando `npm run db:push` criará automaticamente:

- ✅ `users` - Usuários (professores, alunos, coordenadores)
- ✅ `projects` - Projetos educacionais
- ✅ `tasks` - Tarefas dos projetos
- ✅ `events` - Eventos e prazos
- ✅ `attendance` - Registro de frequência
- ✅ `rubrics` - Rubricas de avaliação
- ✅ `messages` - Mensagens entre usuários

---

## 🎯 Próximos Passos

Após configurar o banco:

1. ✅ Criar usuários de teste
2. ✅ Cadastrar projetos
3. ✅ Testar todas as funcionalidades
4. 🚀 Fazer deploy no Render (próximo passo!)

---

**Dúvidas? Me chame que eu ajudo!** 🚀
