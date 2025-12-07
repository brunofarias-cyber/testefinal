/*
═══════════════════════════════════════════════════════════════════════
  BACKEND - SERVIÇO DE IA PARA GERAÇÃO DE PLANEJAMENTO
═══════════════════════════════════════════════════════════════════════

Arquivo: services/aiService.js

Este arquivo contém:
1. Função para chamar OpenAI/Claude API
2. Fallback para geração de sugestões mock
3. Cache de sugestões para economizar API calls

Por enquanto: Usa mock (dados fictícios)
Futuro: Integra com OpenAI/Claude API

═══════════════════════════════════════════════════════════════════════
*/

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// ═══════════════════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL: Gerar sugestão com IA
// ═══════════════════════════════════════════════════════════════════════

export async function generateAISuggestion(input) {
  const { tema, area, habilidades } = input;

  console.log(`[AI] Gerando sugestão para: ${tema}`);

  // 🚀 OPÇÃO 1: Usar Claude API (RECOMENDADO)
  if (process.env.CLAUDE_API_KEY && process.env.USE_CLAUDE === 'true') {
    try {
      return await generateWithClaude(tema, area, habilidades);
    } catch (error) {
      console.error('[AI] Erro ao chamar Claude, usando mock como fallback');
    }
  }

  // 🚀 OPÇÃO 2: Usar OpenAI API
  if (process.env.OPENAI_API_KEY && process.env.USE_OPENAI === 'true') {
    try {
      return await generateWithOpenAI(tema, area, habilidades);
    } catch (error) {
      console.error('[AI] Erro ao chamar OpenAI, usando mock como fallback');
    }
  }

  // 🚀 OPÇÃO 3: Usar Mock (padrão, sem API)
  console.log('[AI] Usando geração mock (padrão)');
  return generateMockSuggestion(tema, area, habilidades);
}

// ═══════════════════════════════════════════════════════════════════════
// OPÇÃO 1: Claude API (via Anthropic)
// ═══════════════════════════════════════════════════════════════════════

async function generateWithClaude(tema, area, habilidades) {
  const apiKey = process.env.CLAUDE_API_KEY;
  const model = process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229';

  const prompt = `
Você é um especialista em educação baseada em projetos e na Base Nacional Comum Curricular (BNCC).

Um professor deseja criar um projeto educacional com os seguintes parâmetros:

📌 TEMA DO PROJETO: ${tema}
📚 ÁREA DE CONHECIMENTO: ${area}
🎯 HABILIDADES BNCC A DESENVOLVER:
${habilidades.map((h, i) => `${i + 1}. ${h}`).join('\n')}

Por favor, gere um planejamento inicial para este projeto com TRÊS seções:

1. **JUSTIFICATIVA** (3-4 linhas)
   - Por que este projeto é relevante?
   - Como alinha com BNCC?
   - Qual é o valor educacional?

2. **OBJETIVOS ESPECÍFICOS** (4-5 objetivos)
   - O que os alunos aprenderão?
   - Como alinham com as habilidades BNCC selecionadas?
   - Que competências serão desenvolvidas?

3. **SUGESTÃO DE ATIVIDADES INICIAIS** (5-7 atividades)
   - Primeiro passo do projeto
   - Como engajar os alunos?
   - Qual é o contexto/problema inicial?

FORMATO DA RESPOSTA (JSON):
{
  "justificativa": "...",
  "objetivosEspecificos": "1. ...\\n2. ...\\n3. ...",
  "atividadesIniciais": "1. ...\\n2. ...\\n3. ..."
}

Seja prático, criativo e inspirador. Use linguagem clara para educadores.
`;

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );

    // Extrair conteúdo de texto
    const content = response.data.content[0];
    if (content.type !== 'text') {
      throw new Error('Resposta inesperada da API Claude');
    }

    // Tentar parsear JSON da resposta
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Não conseguiu extrair JSON da resposta');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      justificativa: parsed.justificativa || '',
      objetivosEspecificos: parsed.objetivosEspecificos || '',
      atividadesIniciais: parsed.atividadesIniciais || '',
      provider: 'claude',
    };
  } catch (error) {
    console.error('[Claude API] Erro:', error.message);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// OPÇÃO 2: OpenAI API
// ═══════════════════════════════════════════════════════════════════════

async function generateWithOpenAI(tema, area, habilidades) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview';

  const prompt = `
Você é um especialista em educação baseada em projetos e na Base Nacional Comum Curricular (BNCC) brasileira.

Um professor deseja criar um projeto educacional com os seguintes parâmetros:

📌 TEMA DO PROJETO: ${tema}
📚 ÁREA DE CONHECIMENTO: ${area}
🎯 HABILIDADES BNCC A DESENVOLVER:
${habilidades.map((h, i) => `${i + 1}. ${h}`).join('\n')}

Por favor, gere um planejamento inicial para este projeto em JSON com TRÊS seções:

1. justificativa: (3-4 linhas explicando relevância e alinhamento com BNCC)
2. objetivosEspecificos: (4-5 objetivos em formato texto com quebras de linha)
3. atividadesIniciais: (5-7 atividades iniciais em formato texto com quebras de linha)

Responda APENAS com JSON válido (sem markdown, sem codeblocks).
Seja prático, criativo e inspirador. Use linguagem clara para educadores.
`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em planejamento de projetos educacionais alinhados com BNCC. Sempre responde em JSON válido.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;

    // Tentar parsear JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Não conseguiu extrair JSON da resposta');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      justificativa: parsed.justificativa || '',
      objetivosEspecificos: parsed.objetivosEspecificos || '',
      atividadesIniciais: parsed.atividadesIniciais || '',
      provider: 'openai',
    };
  } catch (error) {
    console.error('[OpenAI API] Erro:', error.message);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// OPÇÃO 3: Mock - Geração local sem API
// ═══════════════════════════════════════════════════════════════════════

function generateMockSuggestion(tema, area, habilidades) {
  console.log('[Mock] Gerando sugestão offline');

  const habilidadesTexto = habilidades.length > 0 
    ? habilidades.slice(0, 2).join(', ') 
    : 'habilidades selecionadas';

  const justificativa = `O projeto "${tema}" foi selecionado por sua relevância na área de ${area}. Este projeto promove aprendizagem significativa ao conectar conhecimentos teóricos com aplicações práticas. Ao trabalhar com as habilidades BNCC selecionadas, os alunos desenvolvem não apenas competências específicas do conhecimento, mas também habilidades socioemocionais como colaboração, comunicação e pensamento crítico. A proposta busca contextualizar o aprendizado, tornando-o mais significativo e próximo da realidade dos estudantes.`;

  const objetivosEspecificos = `1. Desenvolver e aplicar conhecimentos específicos relacionados ao tema "${tema}"
2. Compreender e articular as habilidades BNCC: ${habilidadesTexto}
3. Trabalhar colaborativamente em diferentes formatos (equipes, pares, grupo)
4. Criar artefatos que demonstrem aprendizagem (apresentações, protótipos, documentações)
5. Refletir criticamente sobre o processo de aprendizagem e resultados alcançados
6. Integrar conhecimentos de diferentes áreas de forma interdisciplinar`;

  const atividadesIniciais = `1. **Disparador Investigativo**: Apresentar um problema ou desafio real relacionado a "${tema}" que inspire investigação e desperte curiosidade

2. **Exploração Inicial**: Alunos exploram diferentes aspectos do tema através de pesquisa orientada, entrevistas, observação ou experimentação

3. **Levantamento de Ideias**: Brainstorm em pequenos grupos sobre possíveis soluções, abordagens ou perspectivas do tema

4. **Definição de Escopo**: Estabelecer limites claros do projeto, objetivos específicos e cronograma de execução

5. **Organização de Grupos**: Formar equipes considerando habilidades complementares e interesses diversos

6. **Planejamento Colaborativo**: Criar um plano de ação detalhado com responsabilidades individuais e coletivas

7. **Estabelecer Critérios**: Definir conjuntamente como avaliar o sucesso do projeto e os indicadores de aprendizagem`;

  return {
    justificativa,
    objetivosEspecificos,
    atividadesIniciais,
    provider: 'mock',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// FUNÇÃO AUXILIAR: Validar se API está configurada
// ═══════════════════════════════════════════════════════════════════════

export function hasAIConfigured() {
  return {
    hasOpenAI: !!process.env.OPENAI_API_KEY && process.env.USE_OPENAI === 'true',
    hasClaude: !!process.env.CLAUDE_API_KEY && process.env.USE_CLAUDE === 'true',
    preferredProvider: process.env.PREFERRED_AI_PROVIDER || 'mock',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// FUNÇÃO AUXILIAR: Obter status da IA
// ═══════════════════════════════════════════════════════════════════════

export function getAIStatus() {
  const config = hasAIConfigured();
  
  let activeProvider = 'mock';
  if (config.hasClaude) activeProvider = 'claude';
  else if (config.hasOpenAI) activeProvider = 'openai';

  return {
    configured: config.hasOpenAI || config.hasClaude,
    activeProvider,
    availableProviders: {
      openai: config.hasOpenAI,
      claude: config.hasClaude,
      mock: true,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════
// EXPORTAÇÕES
// ═══════════════════════════════════════════════════════════════════════

export default {
  generateAISuggestion,
  hasAIConfigured,
  getAIStatus,
};

// ═══════════════════════════════════════════════════════════════════════
// COMO USAR NO ARQUIVO DE ROTAS
// ═══════════════════════════════════════════════════════════════════════

/*
import { generateAISuggestion, getAIStatus } from '../services/aiService.js';

// Na rota POST /wizard/generate-ai:
const sugestao = await generateAISuggestion({
  tema: 'Horta Sustentável na Escola',
  area: 'Ciências da Natureza',
  habilidades: [
    'Investigar a influência da biosfera nas transformações do planeta...',
    'Analisar e interpretar diferentes tipos de transformações químicas...'
  ]
});

console.log(sugestao.justificativa);
console.log(sugestao.objetivosEspecificos);
console.log(sugestao.atividadesIniciais);
console.log(`Provider usado: ${sugestao.provider}`);

// Verificar status da IA:
const status = getAIStatus();
console.log(`IA ativa: ${status.activeProvider}`);
*/

// ═══════════════════════════════════════════════════════════════════════
// VARIÁVEIS DE AMBIENTE (.env)
// ═══════════════════════════════════════════════════════════════════════

/*
# IA CONFIGURATION

# OpenAI
OPENAI_API_KEY=sk-...sua-chave...
OPENAI_MODEL=gpt-4-turbo-preview
USE_OPENAI=false

# Claude (Anthropic)
CLAUDE_API_KEY=sk-ant-...sua-chave...
CLAUDE_MODEL=claude-3-sonnet-20240229
USE_CLAUDE=false

# Preferência (quando múltiplas disponíveis)
PREFERRED_AI_PROVIDER=mock

# Por padrão, tudo usa MOCK até você ativar uma API
*/

// ═══════════════════════════════════════════════════════════════════════
// PRÓXIMOS PASSOS
// ═══════════════════════════════════════════════════════════════════════

/*
1. DESENVOLVIMENTO AGORA (sem API):
   - Use generateMockSuggestion()
   - Testa lógica do wizard
   - Frontend funciona 100%

2. INTEGRAÇÃO FUTURA (com IA real):
   - Obter API key do OpenAI ou Anthropic
   - Atualizar .env
   - Definir USE_OPENAI=true ou USE_CLAUDE=true
   - Código continua funcionando igual (abstrato)

3. MONITORING:
   - Log de qual provider foi usado
   - Cache de sugestões para economizar API
   - Rate limiting para evitar custos altos

4. MELHORIAS FUTURAS:
   - Implementar cache Redis/memória
   - Rate limiting por usuário
   - Histórico de sugestões geradas
   - Fine-tuning do prompt para melhores resultados
*/
