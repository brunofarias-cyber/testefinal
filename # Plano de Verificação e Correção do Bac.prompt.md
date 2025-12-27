# Plano de Verificação e Correção do Backend/Frontend

## 1. Verificar variáveis de ambiente (.env)
- Confirme se o arquivo `.env` está preenchido corretamente, principalmente `DATABASE_URL`.

## 2. Checar status do banco de dados
- Teste a conexão com o banco usando um cliente (DBeaver, TablePlus, psql).
- Veja se o banco está online e acessível.

## 3. Verificar se tabelas existem (Teams, etc)
- No cliente do banco, rode:
  ```sql
  \dt
  ```
  ou
  ```sql
  SELECT * FROM information_schema.tables WHERE table_name = 'Teams';
  ```
- Se não existir, rode as migrações ou scripts SQL do projeto.

## 4. Executar migrações ou scripts SQL
- No terminal:
  ```bash
  npx sequelize-cli db:migrate
  ```
  ou rode o script SQL do projeto.

## 5. Testar conexão backend e endpoint /api/health
- No terminal:
  ```bash
  node server.js
  ```
- No navegador ou terminal:
  ```bash
  curl http://localhost:3000/api/health
  ```
  Deve mostrar `"database": "connected"`.

## 6. Testar frontend em localhost:3000 e 5173
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (Express serve build do frontend)

## 7. Revisar logs de erro do terminal
- Se aparecer erro, copie e cole aqui.
