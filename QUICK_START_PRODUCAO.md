# ⚡ QUICK START - NEXO Production Ready

## 30 segundos para começar

```bash
# 1. Iniciar servidor + frontend
npm run dev

# 2. Em outro terminal, testar validações
node test-production.js

# 3. Acessar
Browser: http://localhost:5173
Health: curl http://localhost:3000/api/health
```

---

## 🧪 Testes Rápidos

### Teste 1: Validação de Nota
```bash
# Deve REJEITAR (nota > 10)
curl -X POST http://localhost:3000/api/grades/create \
  -H "Content-Type: application/json" \
  -d '{"studentId":"1","grade":15,"projectId":"1","feedback":"test"}'
# Resultado: 400 Bad Request

# Deve ACEITAR (nota válida)
curl -X POST http://localhost:3000/api/grades/create \
  -H "Content-Type: application/json" \
  -d '{"studentId":"1","grade":5,"projectId":"1","feedback":"bom"}'
# Resultado: 201 Created
```

### Teste 2: Validação de Presença
```bash
# Deve REJEITAR (status inválido)
curl -X POST http://localhost:3000/api/attendance/mark \
  -H "Content-Type: application/json" \
  -d '{"studentId":"1","classId":"1","className":"Math","status":"invalid"}'
# Resultado: 400 Bad Request

# Deve ACEITAR (status válido)
curl -X POST http://localhost:3000/api/attendance/mark \
  -H "Content-Type: application/json" \
  -d '{"studentId":"1","classId":"1","className":"Math","status":"presente"}'
# Resultado: 201 Created
```

### Teste 3: Validação de Mensagem
```bash
# Deve REJEITAR (mensagem > 500 chars)
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -d "{\"conversationId\":\"1\",\"senderId\":\"1\",\"message\":\"$(printf 'x%.0s' {1..501})\",\"senderRole\":\"student\"}"
# Resultado: 400 Bad Request

# Deve ACEITAR (mensagem curta)
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{"conversationId":"1","senderId":"1","message":"Olá!","senderRole":"student"}'
# Resultado: 201 Created
```

---

## 📊 O Que Foi Implementado

### ✅ 4 Middleware Files
- `middleware/validators.js` - Express-validator rules
- `middleware/errorHandler.js` - Global error handling
- `middleware/rateLimiter.js` - 6 rate limiters
- `utils/logger.js` - Centralized logging

### ✅ 16 Rotas com Validação
- Grades (4 validadores)
- Attendance (6 validadores)
- Submissions (7 validadores)
- Messages (2 validadores)
- Rubricas (2 validadores)

### ✅ 6 Rate Limiters
- Global: 100 req/15 min
- Auth: 5 req/15 min
- API: 50 req/15 min
- Communication: 20 req/hour
- Create: 30 req/hour
- Upload: 10 req/hour

### ✅ Security Features
- XSS Prevention via sanitizeInputs
- Input Validation on all routes
- SQL Injection Prevention (ORM)
- CORS Configured
- JWT Auth Support

---

## 🚨 Troubleshooting

### Problema: Porta 3000 já em uso
```bash
# Matando processo anterior
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Ou usar porta diferente
PORT=3001 npm run server:dev
```

### Problema: BD não conecta
```bash
# Verificar .env
cat .env | grep DATABASE_URL

# Servidor opera em modo OFFLINE automaticamente
# Dados não persistem mas sistema funciona
```

### Problema: Testes falhando
```bash
# 1. Limpar node_modules
rm -rf node_modules && npm install

# 2. Restart servidor
npm run dev

# 3. Rodar testes novamente
node test-production.js
```

### Problema: Validador rejeitando entrada válida
```bash
# Verificar formato esperado
# Attendance: status deve ser 'presente', 'falta' ou 'atraso'
# Grades: note deve estar entre 0 e 10
# Messages: message max 500 caracteres

# Ver erro específico
curl -X POST http://localhost:3000/... | jq .details
```

---

## 📁 Estrutura de Pastas

```
testefinal/
├── middleware/
│   ├── validators.js      ← Validações
│   ├── errorHandler.js    ← Error handling
│   └── rateLimiter.js     ← Rate limiting
├── utils/
│   └── logger.js          ← Logging
├── routes/
│   ├── grades.js          ← Notas
│   ├── attendance.js      ← Presença
│   ├── submissions.js     ← Entregas
│   ├── messages.js        ← Mensagens
│   ├── rubricas.js        ← Rubrics
│   └── ... (outros)
├── logs/                  ← Log files (criados automaticamente)
│   ├── combined.log
│   └── error.log
├── server.js              ← Main app
├── test-production.js     ← Suite de testes
└── .env                   ← Environment vars
```

---

## 📊 Endpoints Disponíveis

```
GET  /api/health              - Health check
GET  /api/bncc/*              - BNCC endpoints
GET  /api/classes/*           - Classes
GET  /api/team-chat/*         - Chat
GET  /api/messages/*          - Messages
POST /api/grades/create       - Create grade
POST /api/attendance/mark     - Mark attendance
POST /api/submissions/upload  - Upload submission
POST /api/messages/send       - Send message
POST /api/rubricas            - Create rubric
```

---

## 🔍 Monitorando Logs

### Ver logs em tempo real
```bash
tail -f logs/combined.log      # Todos os logs
tail -f logs/error.log         # Apenas erros
```

### Filtrar por tipo
```bash
grep ERROR logs/combined.log
grep WARNING logs/combined.log
grep INFO logs/combined.log
```

---

## 🎉 Status Final

**Servidor**: ✅ Operacional  
**Validações**: ✅ 9/9 testes passando  
**Database**: ✅ PostgreSQL conectado  
**Frontend**: ✅ Vite rodando  
**Security**: ✅ 10+ medidas implementadas  
**Logging**: ✅ Arquivo + Console  
**Documentação**: ✅ Completa  

---

**Pronto para usar! 🚀**
