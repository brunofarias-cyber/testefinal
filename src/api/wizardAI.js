/**
 * ═══════════════════════════════════════════════════════════════════════
 * API de Sugestão de Habilidades com IA
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Endpoints para processar descrições de projetos e sugerir habilidades BNCC
 * baseadas em análise de texto e padrões de palavras-chave
 */

import { buscarHabilidadesPorPalavraChave, BNCC_OFICIAL, getAllHabilidades } from '../constants/bnccOficial.js';

// Palavras-chave mapeadas para áreas
const AREA_KEYWORDS = {
  'Matemática': [
    'número', 'cálculo', 'operação', 'equação', 'fração', 'decimal', 'porcentagem',
    'álgebra', 'geometria', 'gráfico', 'proporção', 'razão', 'estatística',
    'probabilidade', 'função', 'trigonometria', 'ângulo', 'perímetro', 'área',
    'volume', 'potência', 'raiz', 'sequência', 'progressão', 'matrix'
  ],
  'Ciências': [
    'matéria', 'energia', 'química', 'física', 'célula', 'corpo', 'saúde',
    'ecossistema', 'ambiente', 'natureza', 'transformação', 'reação',
    'sistema', 'organismo', 'movimento', 'luz', 'som', 'eletricidade',
    'magnetismo', 'combustão', 'água', 'ar', 'temperatura', 'pressão'
  ],
  'Língua Portuguesa': [
    'texto', 'leitura', 'escrita', 'gramática', 'linguagem', 'comunicação',
    'interpretação', 'produção', 'narrativa', 'descrição', 'argumento',
    'discurso', 'literatura', 'poesia', 'diálogo', 'fala', 'palavra',
    'sentido', 'significado', 'coesão', 'coerência', 'pontuação', 'acentuação'
  ],
  'Ciências Sociais': [
    'história', 'geografia', 'cultura', 'sociedade', 'política', 'economia',
    'país', 'região', 'povo', 'comunidade', 'desenvolvimento', 'meio',
    'território', 'espaço', 'transformação', 'cidadania', 'direitos',
    'cidadão', 'governo', 'democracia', 'imperio', 'revolução', 'guerra'
  ]
};

/**
 * Identifica a área principal baseado nas palavras-chave
 */
function identificarArea(texto) {
  const textoLower = texto.toLowerCase();
  const pontuacoes = {};

  for (const [area, keywords] of Object.entries(AREA_KEYWORDS)) {
    const matches = keywords.filter(kw => textoLower.includes(kw)).length;
    pontuacoes[area] = matches;
  }

  // Retorna a área com maior pontuação
  const areaComMaiorPontuacao = Object.entries(pontuacoes)
    .sort(([, a], [, b]) => b - a)[0];

  return areaComMaiorPontuacao?.[0] || 'Matemática'; // Default
}

/**
 * Extrai palavras-chave do texto para busca de habilidades
 */
function extrairPalavrasChave(texto) {
  // Palavras comuns a serem ignoradas
  const stopwords = [
    'o', 'a', 'de', 'e', 'é', 'em', 'para', 'com', 'por', 'que', 'um',
    'no', 'da', 'do', 'os', 'as', 'dos', 'das', 'uma', 'seu', 'sua',
    'seu', 'seus', 'suas', 'ele', 'ela', 'eles', 'elas', 'nós', 'você',
    'vocês', 'eu', 'tu', 'meu', 'minha', 'este', 'esse', 'aquele',
    'como', 'onde', 'quando', 'porque', 'muito', 'pouco', 'mais', 'menos'
  ];

  const palavras = texto
    .toLowerCase()
    .split(/\s+/)
    .filter(p => p.length > 3 && !stopwords.includes(p))
    .filter(p => /^[a-záéíóúâêôãõç]+$/.test(p)); // Apenas palavras válidas

  return [...new Set(palavras)]; // Remove duplicatas
}

/**
 * Função principal: Sugerir habilidades baseado na descrição
 */
export function sugerirHabilidades(projectName, projectDescription) {
  if (!projectDescription || projectDescription.length < 20) {
    return {
      suggestedHabilidades: [],
      mainArea: 'Matemática',
      confidence: 0
    };
  }

  // 1. Identificar área principal
  const textoCompleto = `${projectName} ${projectDescription}`;
  const mainArea = identificarArea(textoCompleto);

  // 2. Extrair palavras-chave relevantes
  const palavrasChave = extrairPalavrasChave(projectDescription);

  // 3. Buscar habilidades que combinam com as palavras-chave
  const habilidadesComPontuacao = {};

  for (const palavra of palavrasChave) {
    const resultados = buscarHabilidadesPorPalavraChave(palavra);
    for (const hab of resultados) {
      habilidadesComPontuacao[hab.code] = (habilidadesComPontuacao[hab.code] || 0) + 1;
    }
  }

  // 4. Priorizar habilidades da área principal
  const habilidadasesPrincipal = getAllHabilidades(mainArea);
  const habilidadesOrdenadas = habilidadasesPrincipal
    .filter(hab => habilidadesComPontuacao[hab.code] || Math.random() > 0.6)
    .sort((a, b) => (habilidadesComPontuacao[b.code] || 0) - (habilidadesComPontuacao[a.code] || 0))
    .slice(0, 8); // Limitar a 8 sugestões

  // Se não encontrou o suficiente, adicionar mais aleatorias
  if (habilidadesOrdenadas.length < 5) {
    const todasHabilidades = getAllHabilidades(mainArea);
    const codigosSugeridos = new Set(habilidadesOrdenadas.map(h => h.code));
    const adicionais = todasHabilidades
      .filter(h => !codigosSugeridos.has(h.code))
      .sort(() => Math.random() - 0.5)
      .slice(0, 5 - habilidadesOrdenadas.length);
    habilidadesOrdenadas.push(...adicionais);
  }

  return {
    suggestedHabilidades: habilidadesOrdenadas,
    mainArea: mainArea,
    confidence: Math.min(100, (palavrasChave.length * 10) + (habilidadasesPrincipal.length / 2))
  };
}

/**
 * Middleware para rota de sugestão
 */
export function setupAIRoutes(app) {
  app.post('/api/wizard-ai/suggest-habilidades', (req, res) => {
    try {
      const { projectDescription, projectName } = req.body;

      if (!projectDescription || projectDescription.length < 20) {
        return res.status(400).json({
          error: 'Descrição muito curta',
          suggestedHabilidades: []
        });
      }

      const resultado = sugerirHabilidades(projectName || '', projectDescription);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      console.error('Erro ao sugerir habilidades:', error);
      res.status(500).json({
        error: 'Erro ao processar sugestões',
        suggestedHabilidades: []
      });
    }
  });

  app.get('/api/wizard-ai/habilidades-area/:area', (req, res) => {
    try {
      const { area } = req.params;
      const habilidades = getAllHabilidades(area);

      if (habilidades.length === 0) {
        return res.status(404).json({
          error: 'Área não encontrada'
        });
      }

      res.json({
        success: true,
        area: area,
        total: habilidades.length,
        habilidades: habilidades
      });
    } catch (error) {
      console.error('Erro ao buscar habilidades:', error);
      res.status(500).json({
        error: 'Erro ao buscar habilidades'
      });
    }
  });

  app.get('/api/wizard-ai/buscar/:termo', (req, res) => {
    try {
      const { termo } = req.params;
      const resultados = buscarHabilidadesPorPalavraChave(termo);

      res.json({
        success: true,
        termo: termo,
        total: resultados.length,
        resultados: resultados
      });
    } catch (error) {
      console.error('Erro ao buscar:', error);
      res.status(500).json({
        error: 'Erro ao buscar'
      });
    }
  });
}
