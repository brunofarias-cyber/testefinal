# BProjetos - Sistema de Gestão de Projetos Educacionais

Plataforma full-stack para gestão pedagógica com React + Node.js + PostgreSQL.

## 🚀 Stack Tecnológica

### Frontend
- **React 18** + **Vite** - Interface moderna e rápida
- **TailwindCSS** - Estilização utilitária
- **Lucide React** - Ícones
- **Wouter** - Roteamento leve

### Backend
- **Node.js** + **Express** - API REST
- **TypeScript** - Tipagem estática
- **Drizzle ORM** - ORM type-safe
- **PostgreSQL (Neon)** - Banco de dados serverless
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas

## 📦 Instalação

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados

Crie um arquivo `.env` na raiz do projeto (copie de `.env.example`):

```bash
cp .env.example .env
```

Edite o `.env` e adicione sua URL do **Neon Database**:

```env
DATABASE_URL=postgresql://usuario:senha@host.neon.tech/database?sslmode=require
JWT_SECRET=seu-secret-super-seguro-aqui
PORT=5000
NODE_ENV=development
```

**🔗 Como obter a DATABASE_URL:**
1. Acesse https://neon.tech
2. Crie uma conta/projeto gratuito
3. Copie a "Connection String" do painel

### 3. Inicializar o banco de dados

```bash
npm run db:push
```

Este comando criará todas as tabelas no seu banco Neon.

## 🎯 Como Rodar

### Modo Desenvolvimento (Frontend + Backend)
```bash
npm run dev
```

Acesse: http://localhost:5000

### Apenas Frontend (Vite)
Se quiser rodar só o frontend sem backend:
```bash
npx vite
```

### Build para Produção
```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
testefinal/
├── server/              # Backend Node.js
│   ├── db/
│   │   ├── schema.ts    # Schema do banco (Drizzle)
│   │   └── index.ts     # Conexão com Neon
│   ├── routes.ts        # Rotas da API
│   ├── index-dev.ts     # Servidor dev
│   ├── index-prod.ts    # Servidor produção
│   └── vite.ts          # Integração Vite
├── src/                 # Frontend React
│   ├── App.jsx          # Componente principal
│   ├── main.jsx         # Entry point
│   └── index.css        # Estilos globais
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env                 # Variáveis de ambiente (CRIAR!)
```

## 🔑 API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar usuário
- `POST /api/auth/login` - Login

### Projetos
- `GET /api/projects` - Listar projetos
- `POST /api/projects` - Criar projeto
- `GET /api/projects/:id` - Buscar projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto

### Tarefas
- `GET /api/projects/:projectId/tasks` - Tarefas do projeto
- `POST /api/tasks` - Criar tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `DELETE /api/tasks/:id` - Deletar tarefa

### Eventos
- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento

### Frequência
- `GET /api/attendance` - Consultar frequência
- `POST /api/attendance` - Registrar presença

### Mensagens
- `GET /api/messages?userId=123` - Mensagens do usuário
- `POST /api/messages` - Enviar mensagem

### Usuários
- `GET /api/users?role=student` - Listar usuários

## 🎓 Perfis de Usuário

O sistema suporta 3 tipos de usuários:

1. **Professor** (`role: "teacher"`)
   - Gerenciar projetos e turmas
   - Registrar frequência
   - Criar rubricas

2. **Aluno** (`role: "student"`)
   - Ver projetos e tarefas
   - Acompanhar progresso
   - Sistema de conquistas

3. **Coordenador** (`role: "coordinator"`)
   - Visão geral (Kanban)
   - Métricas e relatórios
   - Gerenciar professores

## 🐛 Resolução de Problemas

### Erro: "DATABASE_URL must be set"
- Certifique-se que criou o arquivo `.env`
- Verifique se a URL do Neon está correta

### Porta 5000 em uso
- Mude no `.env`: `PORT=3000`
- Ou mate o processo: `lsof -ti:5000 | xargs kill`

### Erro ao copiar do Claude Code
Se arquivos vierem vazios:
1. Verifique se todos os arquivos têm conteúdo
2. Arquivos essenciais: `vite.config.js`, `main.jsx`, `index.html`, `tailwind.config.js`
3. Se faltarem, use este projeto como base completa

## 📝 Scripts Disponíveis

- `npm run dev` - Servidor desenvolvimento (frontend + backend)
- `npm run build` - Build para produção
- `npm start` - Rodar produção
- `npm run db:push` - Sincronizar schema com banco
- `npm run check` - Verificar tipos TypeScript

## 🤝 Dica: Copiar Projetos do Claude Code

Para evitar arquivos vazios:
1. Sempre exporte o projeto completo
2. Verifique se arquivos-chave têm conteúdo antes de rodar
3. Use `git` para rastrear mudanças
4. Mantenha um backup do `.env`

---

**Desenvolvido com ❤️ usando React + Node.js**
