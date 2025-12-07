# 📡 Documentação das Rotas do Wizard BNCC

## Overview

As rotas do Wizard BNCC permitem que o frontend obtenha dados curriculares BNCC e gerem sugestões de planejamento com IA.

**Arquivo:** `routes/wizard-bncc.js`
**Base URL:** `/api/wizard-bncc`

---

## 📋 Rotas Disponíveis

### 1. **GET `/status`** - Status da IA

Verifica qual provedor de IA está ativo e disponível.

**Request:**
```bash
GET /api/wizard-bncc/status
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "configured": false,
    "providers": {
      "openai": "inativo",
      "claude": "inativo",
      "mock": "sempre disponível"
    },
    "current": "mock"
  }
}
```

**Uso:**
- Verificar qual IA está em uso
- Mostrar ao usuário qual provider está ativo
- Determinar comportamento do frontend

---

### 2. **GET `/areas`** - Listar Áreas BNCC

Retorna todas as 5 áreas de conhecimento da BNCC (Matemática, Linguagens, Ciências, etc).

**Request:**
```bash
GET /api/wizard-bncc/areas
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "codigo": "MAT",
      "nome": "Matemática",
      "icone": "📊",
      "descricao": "Números, álgebra, geometria, grandezas e estatística",
      "ordem": 1
    },
    {
      "id": 2,
      "codigo": "LIN",
      "nome": "Linguagens",
      "icone": "📖",
      "descricao": "Língua portuguesa, línguas estrangeiras, artes",
      "ordem": 2
    }
    // ... mais áreas
  ]
}
```

**Fallback:** Se a tabela não existir no banco, retorna dados mock

---

### 3. **GET `/habilidades`** - Listar Habilidades

Retorna habilidades de uma área específica.

**Request:**
```bash
GET /api/wizard-bncc/habilidades?areaId=1&anoEscolar=7º%20ano
```

**Query Params:**
- `areaId` (obrigatório): ID da área
- `anoEscolar` (opcional): Filtrar por ano (ex: "7º ano", "8º ano")

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "codigo": "EF07MA01",
      "titulo": "Resolver e elaborar problemas com números naturais",
      "descricao": "Envolvendo divisor, múltiplo, números primos, mmc e mdc",
      "anoEscolar": "7º ano"
    },
    {
      "id": 2,
      "codigo": "EF08MA01",
      "titulo": "Efetuar cálculos com potências",
      "descricao": "Com expoentes inteiros e notação científica",
      "anoEscolar": "8º ano"
    }
    // ... mais habilidades
  ]
}
```

**Error (400):**
```json
{
  "error": "areaId é obrigatório"
}
```

---

### 4. **GET `/competencias`** - Listar Competências Gerais

Retorna as 10 competências gerais da BNCC.

**Request:**
```bash
GET /api/wizard-bncc/competencias
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "numero": 1,
      "titulo": "Conhecimento",
      "descricao": "Valorizar e utilizar os conhecimentos historicamente construídos..."
    },
    {
      "id": 2,
      "numero": 2,
      "titulo": "Pensamento Científico, Crítico e Criativo",
      "descricao": "Exercitar a curiosidade intelectual..."
    }
    // ... até competência 10
  ]
}
```

---

### 5. **GET `/anos-escolares`** - Listar Anos Escolares

Retorna todos os anos escolares disponíveis nas habilidades.

**Request:**
```bash
GET /api/wizard-bncc/anos-escolares
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    "6º-7º ano",
    "7º ano",
    "8º-9º ano",
    "8º ano",
    "Ensino Médio"
  ]
}
```

---

### 6. **POST `/draft`** - Salvar Rascunho

Salva o estado do wizard (rascunho) para continuar depois.

**Request:**
```bash
POST /api/wizard-bncc/draft
Content-Type: application/json

{
  "teacherId": 123,
  "classId": 456,
  "areaId": 3,
  "selectedHabilidadesIds": [1, 2, 5],
  "temaProjeto": "Horta Sustentável",
  "etapaAtual": 2
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Rascunho salvo com sucesso",
  "data": {
    "id": 789,
    "teacherId": 123,
    "classId": 456,
    "areaId": 3,
    "temaProjeto": "Horta Sustentável",
    "etapaAtual": 2,
    "updatedAt": "2024-12-06T10:30:00Z"
  }
}
```

**Error (400):**
```json
{
  "error": "teacherId e classId são obrigatórios"
}
```

---

### 7. **POST `/generate-ai`** - Gerar Sugestão com IA

Gera sugestões de planejamento usando IA (Claude, OpenAI ou Mock).

**Request:**
```bash
POST /api/wizard-bncc/generate-ai
Content-Type: application/json

{
  "temaProjeto": "Horta Sustentável",
  "selectedHabilidadesIds": [1, 2, 5],
  "areaId": 3
}
```

**Response (200) - Com IA:**
```json
{
  "success": true,
  "data": {
    "justificativa": "O projeto 'Horta Sustentável' foi cuidadosamente planejado para desenvolver competências essenciais...",
    "objetivosEspecificos": "1. Compreender princípios de sustentabilidade\n2. Aplicar conhecimentos de biologia\n3. Trabalhar em equipe",
    "atividadesIniciais": "1. Diagnosticar o espaço\n2. Pesquisar sobre hortas\n3. Planejar as ações",
    "iaProvider": "claude"
  }
}
```

**Response (200) - Com Fallback:**
```json
{
  "success": false,
  "fallback": {
    "justificativa": "Projeto educativo focado...",
    "objetivosEspecificos": "1. Desenvolver competências...",
    "atividadesIniciais": "1. Apresentação do tema...",
    "iaProvider": "mock"
  },
  "data": { /* mesmo do fallback */ }
}
```

**Error (400):**
```json
{
  "error": "temaProjeto e selectedHabilidadesIds são obrigatórios"
}
```

---

### 8. **POST `/save-project`** - Salvar Projeto Final

Cria um projeto baseado nos dados do wizard e vincula habilidades BNCC.

**Request:**
```bash
POST /api/wizard-bncc/save-project
Content-Type: application/json

{
  "teacherId": 123,
  "classId": 456,
  "titulo": "Horta Sustentável da Escola",
  "descricao": "Projeto de implementação de uma horta com foco em sustentabilidade",
  "justificativa": "Este projeto...",
  "objetivosEspecificos": "1. Compreender...\n2. Aplicar...",
  "selectedHabilidadesIds": [1, 2, 5]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Projeto criado com sucesso",
  "data": {
    "projectId": "proj-1733485800000",
    "titulo": "Horta Sustentável da Escola",
    "classId": 456
  }
}
```

**Error (400):**
```json
{
  "error": "Título, descrição e classId são obrigatórios"
}
```

**Ações realizadas:**
1. ✅ Cria um novo projeto
2. ✅ Vincula habilidades BNCC
3. ✅ Remove rascunho (draft)
4. ✅ Retorna ID do projeto

---

## 🔄 Fluxo Típico do Usuário

```
1. Frontend carrega "Criar Projeto"
   ↓
2. GET /areas
   ↓
3. Usuário seleciona uma área
   ↓
4. GET /habilidades?areaId=X
   ↓
5. Usuário preenche tema e seleciona habilidades
   ↓
6. POST /draft (auto-save)
   ↓
7. Usuário clica "Gerar com IA"
   ↓
8. POST /generate-ai
   ↓
9. Frontend exibe sugestões
   ↓
10. Usuário refina e clica "Salvar"
    ↓
11. POST /save-project
    ↓
12. Projeto criado com sucesso! ✅
```

---

## 🧪 Exemplos de Teste

### Com cURL

**Listar áreas:**
```bash
curl http://localhost:3000/api/wizard-bncc/areas
```

**Listar habilidades:**
```bash
curl "http://localhost:3000/api/wizard-bncc/habilidades?areaId=1"
```

**Gerar sugestão:**
```bash
curl -X POST http://localhost:3000/api/wizard-bncc/generate-ai \
  -H "Content-Type: application/json" \
  -d '{
    "temaProjeto": "Horta Sustentável",
    "selectedHabilidadesIds": [1, 2],
    "areaId": 1
  }'
```

### Com Node.js / Fetch

```javascript
// Exemplo no frontend
const response = await fetch('/api/wizard-bncc/generate-ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    temaProjeto: 'Horta Sustentável',
    selectedHabilidadesIds: [1, 2],
    areaId: 1,
  }),
});

const data = await response.json();
console.log(data.data.justificativa);
```

---

## ⚠️ Tratamento de Erros

Todas as rotas incluem tratamento de erro com:
- Logs detalhados no console
- Fallback para dados mock quando necessário
- Status HTTP apropriados (400, 500)
- Mensagens de erro descritivas

---

## 🚀 Próximos Passos

1. **Integrar no Frontend:** Usar rotas em `ProjectWizard.jsx`
2. **Executar Seed:** `node backend/scripts/seed-bncc-clean.js`
3. **Testar:** Execute `node backend/scripts/test-ai-service.js`
4. **Deploy:** Configure variáveis de IA em produção
5. **Monitorar:** Adicione logs e métricas

---

## 📞 Referências

- Arquivo de rotas: `routes/wizard-bncc.js`
- Serviço de IA: `services/aiService.js`
- Componente React: `src/components/ProjectWizard.jsx`
- Documentação IA: `docs/AI_SERVICE.md`
