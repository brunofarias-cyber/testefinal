# Diretrizes para Agentes de IA neste Projeto

## Visão Geral do Projeto
Este projeto é uma plataforma full-stack para gestão pedagógica, construída com as seguintes tecnologias principais:

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Node.js, Express, TypeScript, Drizzle ORM
- **Banco de Dados**: PostgreSQL (Neon)

O objetivo principal é fornecer uma interface moderna e responsiva para professores, alunos e coordenadores gerenciarem projetos educacionais.

## Estrutura do Código
A estrutura do projeto segue uma divisão clara entre frontend e backend:

```
testefinal/
├── server/              # Backend Node.js
│   ├── db/             # Configuração do banco de dados
│   ├── routes.ts       # Rotas da API
│   ├── index-dev.ts    # Servidor para desenvolvimento
│   ├── index-prod.ts   # Servidor para produção
│   └── vite.ts         # Integração com Vite
├── src/                 # Frontend React
│   ├── App.jsx         # Componente principal
│   ├── main.jsx        # Entry point
│   └── index.css       # Estilos globais
├── package.json         # Dependências e scripts
├── vite.config.js       # Configuração do Vite
├── tailwind.config.js   # Configuração do TailwindCSS
└── .env                 # Variáveis de ambiente (não versionado)
```

## Fluxos de Trabalho Críticos

### Configuração Inicial
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o banco de dados criando um arquivo `.env` baseado em `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Sincronize o schema com o banco de dados:
   ```bash
   npm run db:push
   ```

### Desenvolvimento
- Para rodar o frontend e backend simultaneamente:
  ```bash
  npm run dev
  ```
  Acesse o sistema em: [http://localhost:5000](http://localhost:5000)

- Para rodar apenas o frontend:
  ```bash
  npx vite
  ```

### Produção
1. Gere o build:
   ```bash
   npm run build
   ```
2. Inicie o servidor:
   ```bash
   npm start
   ```

## Padrões Específicos do Projeto

### Backend
- **Rotas**: Definidas em `server/routes.ts`.
- **ORM**: Utiliza Drizzle ORM para um mapeamento type-safe do banco de dados.
- **Autenticação**: Implementada com JWT e Bcrypt.

### Frontend
- **Estado**: Gerenciado diretamente nos componentes React.
- **Estilização**: Utiliza classes utilitárias do TailwindCSS.
- **Roteamento**: Feito com Wouter para simplicidade.

### Scripts Importantes
- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera o build para produção.
- `npm run db:push`: Sincroniza o schema com o banco de dados.
- `npm run check`: Verifica os tipos TypeScript.

## Integrações e Dependências Externas
- **Neon Database**: Banco de dados PostgreSQL serverless.
- **TailwindCSS**: Para estilização rápida e responsiva.
- **Lucide React**: Biblioteca de ícones.

## Resolução de Problemas Comuns

### Erro: "DATABASE_URL must be set"
- Certifique-se de que o arquivo `.env` foi criado e configurado corretamente.

### Porta 5000 em uso
- Altere a porta no `.env`:
  ```env
  PORT=3000
  ```
- Ou mate o processo que está usando a porta:
  ```bash
  lsof -ti:5000 | xargs kill
  ```

## Exemplos de Padrões

### Exemplo de Rota Backend
```typescript
import express from 'express';
const router = express.Router();

router.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // Lógica de autenticação aqui
});

export default router;
```

### Exemplo de Componente React
```jsx
import React from 'react';

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Bem-vindo ao Sistema!</h1>
    </div>
  );
}

export default App;
```

---

Siga estas diretrizes para garantir que as contribuições sejam consistentes e alinhadas com os padrões do projeto.