# 🤖 Serviço de IA para Wizard BNCC

## Visão Geral

O **aiService.js** é um serviço de inteligência artificial que gera sugestões de planejamento de projetos educacionais. Ele suporta múltiplos provedores de IA e oferece fallback automático.

## Arquitetura

```
User (Frontend)
    ↓
POST /api/wizard-bncc/generate-ai
    ↓
wizard-bncc.js (route)
    ↓
aiService.js (service)
    ├─ Claude API (Anthropic)
    ├─ OpenAI API (GPT-4)
    └─ Mock Generator (local, sem API)
```

## Modo de Funcionamento

### 1️⃣ **Modo Mock (Padrão - Sem API)**

```bash
# Padrão: sem configuração
# Funciona 100% localmente
# Nenhuma API key necessária
```

**Pros:**
- ✅ Funciona imediatamente
- ✅ Sem custos
- ✅ Sem dependências externas
- ✅ Rápido para testes

**Cons:**
- ❌ Sugestões genéricas (não personalizadas)
- ❌ Não usa AI de verdade

### 2️⃣ **Modo Claude (Recomendado para produção)**

```bash
# No arquivo .env:
CLAUDE_API_KEY=sk-ant-...sua-chave...
CLAUDE_MODEL=claude-3-sonnet-20240229
USE_CLAUDE=true
```

**Como obter chave:**
1. Ir para https://console.anthropic.com/
2. Criar uma conta ou fazer login
3. Gerar API key
4. Adicionar ao .env

**Custo:** ~$0.003 USD por sugestão (muito barato)

### 3️⃣ **Modo OpenAI (GPT-4)**

```bash
# No arquivo .env:
OPENAI_API_KEY=sk-...sua-chave...
OPENAI_MODEL=gpt-4-turbo-preview
USE_OPENAI=true
```

**Como obter chave:**
1. Ir para https://platform.openai.com/api-keys
2. Criar uma conta ou fazer login
3. Gerar API key
4. Adicionar ao .env

**Custo:** ~$0.03 USD por sugestão (mais caro que Claude)

## Uso no Backend

### Exemplo Básico

```javascript
import { generateAISuggestion } from '../services/aiService.js';

// Na rota POST /wizard-bncc/generate-ai:
const sugestao = await generateAISuggestion({
  tema: 'Horta Sustentável na Escola',
  area: 'Ciências da Natureza',
  habilidades: [
    'Investigar a influência da biosfera nas transformações do planeta...',
    'Analisar e interpretar diferentes tipos de transformações químicas...',
  ],
});

console.log(sugestao.justificativa);
console.log(sugestao.objetivosEspecificos);
console.log(sugestao.atividadesIniciais);
console.log(sugestao.provider); // 'claude', 'openai' ou 'mock'
```

### Verificar Status da IA

```javascript
import { getAIStatus } from '../services/aiService.js';

const status = getAIStatus();
console.log(status);
// {
//   configured: false,
//   providers: {
//     openai: 'inativo',
//     claude: 'inativo',
//     mock: 'sempre disponível'
//   },
//   current: 'mock'
// }
```

## Fluxo de Fallback

```
Cliente solicita sugestão
    ↓
1. Tenta Claude (se CLAUDE_API_KEY + USE_CLAUDE=true)
    ├─ Sucesso? Retorna
    └─ Erro? Continua...
2. Tenta OpenAI (se OPENAI_API_KEY + USE_OPENAI=true)
    ├─ Sucesso? Retorna
    └─ Erro? Continua...
3. Usa Mock (sempre disponível como fallback)
    └─ Retorna sugestão genérica
```

## Resposta da API

### Sucesso com IA Real

```json
{
  "success": true,
  "data": {
    "justificativa": "O projeto 'Horta Sustentável'...",
    "objetivosEspecificos": "1. Compreender sustentabilidade...",
    "atividadesIniciais": "1. Diagnosticar o espaço...",
    "iaProvider": "claude"
  }
}
```

### Fallback para Mock

```json
{
  "success": false,
  "fallback": {
    "justificativa": "Projeto educativo focado no tema proposto...",
    "objetivosEspecificos": "1. Desenvolver competências...",
    "atividadesIniciais": "1. Apresentação do tema...",
    "iaProvider": "mock"
  },
  "data": { /* mesmo objeto do fallback */ }
}
```

## Prompt Engineering

A qualidade das sugestões depende do prompt enviado à IA. O prompts atual:

1. **Define contexto:** "Você é especialista em educação e BNCC"
2. **Fornece parâmetros:** tema, área, habilidades
3. **Especifica formato:** JSON com 3 seções
4. **Orienta tom:** "prático, criativo e inspirador"

### Customizar Prompt

Para melhorar as sugestões, edite a função `generateWithClaude()` ou `generateWithOpenAI()` em `aiService.js`.

**Exemplos de melhorias:**
- Adicionar exemplos de projeto bem-sucedido
- Especificar nível de escolaridade
- Definir duração esperada do projeto
- Incluir restrições (ex: "sem usar internet")

## Variáveis de Ambiente

```bash
# Status da IA
GET /api/wizard-bncc/status
# Retorna qual provider está ativo
```

## Troubleshooting

### Problema: "API key inválida"

```javascript
// Solução: Verificar se a chave está correta no .env
// e se USE_CLAUDE/USE_OPENAI está true
```

### Problema: "Timeout na API"

```javascript
// Solução: Aumentar timeout em axios.post()
// Padrão: 30 segundos
```

### Problema: "Formato JSON inválido"

```javascript
// Solução: A IA retornou texto sem JSON
// O código tenta extrair JSON com regex
// Se falhar, usa mock como fallback
```

## Desenvolvimento Local

### Testar com Mock (sem API)

```bash
npm start
# Wizard funciona 100% localmente
```

### Testar com Claude

```bash
# 1. Adicionar chave no .env
CLAUDE_API_KEY=sk-ant-...

# 2. Ativar Claude
USE_CLAUDE=true

# 3. Iniciar
npm start
```

### Verificar Logs

```bash
# No terminal, procure por:
[AI] Gerando sugestão para: ...
[Claude API] ✅ Sugestão gerada com sucesso
# ou
[Mock] Gerando sugestão offline
```

## Próximos Passos

### Curto Prazo
- [ ] Implementar cache de sugestões
- [ ] Adicionar rate limiting
- [ ] Log de uso de API

### Médio Prazo
- [ ] Integrar com mais modelos (GPT-4-vision, etc)
- [ ] Suporte a streaming de resposta
- [ ] Personalização de prompts por usuário

### Longo Prazo
- [ ] Treinamento de modelo customizado
- [ ] Fine-tuning com dados da escola
- [ ] Avaliação automática de qualidade

## Referências

- [Claude API Docs](https://docs.anthropic.com/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [BNCC - Base Nacional Comum Curricular](http://basenacionalcomum.mec.gov.br/)
- [Educação Baseada em Projetos](https://www.edutopia.org/article/what-project-based-learning)

## Suporte

Para dúvidas ou issues com a IA:
1. Verificar logs: `npm start 2>&1 | grep "\[AI\]"`
2. Testar com mock primeiro
3. Verificar credenciais de API
4. Abrir issue no GitHub
