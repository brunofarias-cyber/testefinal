import axios from 'axios';

// ═══════════════════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════════════════

export const AISuggestionSchema = {
  justificativa: String,
  objetivosEspecificos: String,
  atividadesIniciais: String,
  provider: String,
};

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
      console.error('[AI] Erro ao chamar Claude, usando mock como fallback:', error.message);
    }
  }

  // 🚀 OPÇÃO 2: Usar OpenAI API
  if (process.env.OPENAI_API_KEY && process.env.USE_OPENAI === 'true') {
    try {
      return await generateWithOpenAI(tema, area, habilidades);
    } catch (error) {
      console.error('[AI] Erro ao chamar OpenAI, usando mock como fallback:', error.message);
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
        max_tokens: 1500,
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

    console.log('[Claude API] ✅ Sugestão gerada com sucesso');

    return {
      justificativa: parsed.justificativa || '',
      objetivosEspecificos: parsed.objetivosEspecificos || '',
      atividadesIniciais: parsed.atividadesIniciais || '',
      provider: 'claude',
    };
  } catch (error) {
    console.error('[Claude API] ❌ Erro:', error.message);
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
            content:
              'Você é um especialista em planejamento de projetos educacionais alinhados com BNCC. Sempre responde em JSON válido.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
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

    console.log('[OpenAI API] ✅ Sugestão gerada com sucesso');

    return {
      justificativa: parsed.justificativa || '',
      objetivosEspecificos: parsed.objetivosEspecificos || '',
      atividadesIniciais: parsed.atividadesIniciais || '',
      provider: 'openai',
    };
  } catch (error) {
    console.error('[OpenAI API] ❌ Erro:', error.message);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// OPÇÃO 3: Mock - Geração local sem API
// ═══════════════════════════════════════════════════════════════════════

function generateMockSuggestion(tema, area, habilidades) {
  console.log('[Mock] Gerando sugestão offline');

  const justificativa = `O projeto "${tema}" foi selecionado por sua relevância na área de ${area}. Este projeto promove aprendizagem significativa ao conectar conhecimentos teóricos com aplicações práticas. Ao trabalhar com as habilidades BNCC selecionadas, os alunos desenvolvem não apenas competências específicas do conhecimento, mas também habilidades socioemocionais como colaboração, comunicação e pensamento crítico.`;

  const objetivosEspecificos = `1. Desenvolver e aplicar conhecimentos específicos relacionados ao tema "${tema}"
2. Compreender e articular as habilidades BNCC: ${habilidades.slice(0, 2).join(', ')}
3. Trabalhar colaborativamente em diferentes formatos (equipes, pares, grupo)
4. Criar artefatos que demonstrem aprendizagem (apresentações, protótipos, documentações)
5. Refletir criticamente sobre o processo de aprendizagem e resultados alcançados`;

  const atividadesIniciais = `1. **Disparador Investigativo**: Apresentar um problema ou desafio real relacionado a "${tema}" que inspire investigação
2. **Exploração Inicial**: Alunos exploram diferentes aspectos do tema através de pesquisa, entrevistas ou observação
3. **Levantamento de Ideias**: Brainstorm em pequenos grupos sobre possíveis soluções ou abordagens
4. **Definição de Escopo**: Estabelecer limites claros do projeto, objetivos e cronograma
5. **Organização de Grupos**: Formar equipes considerando habilidades complementares
6. **Planejamento Colaborativo**: Criar um plano de ação com responsabilidades individuais
7. **Estabelecer Critérios**: Definir conjuntamente como avaliar o sucesso do projeto`;

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
  return {
    configured: config.hasOpenAI || config.hasClaude,
    providers: {
      openai: config.hasOpenAI ? 'ativo' : 'inativo',
      claude: config.hasClaude ? 'ativo' : 'inativo',
      mock: 'sempre disponível',
    },
    current: config.preferredProvider,
  };
}

export default {
  generateAISuggestion,
  hasAIConfigured,
  getAIStatus,
};
