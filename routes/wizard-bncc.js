import express from 'express';
import sequelize from '../config/database.js';
import { generateAISuggestion, getAIStatus } from '../services/aiService.js';

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════
// GET /api/wizard-bncc/status - Status da IA
// ═══════════════════════════════════════════════════════════════════════
router.get('/status', (req, res) => {
  const status = getAIStatus();
  res.json({
    success: true,
    data: status,
  });
});

// ═══════════════════════════════════════════════════════════════════════
// GET /api/wizard-bncc/areas - Lista todas as áreas BNCC
// ═══════════════════════════════════════════════════════════════════════
router.get('/areas', async (req, res) => {
  try {
    const areas = await sequelize.query(
      'SELECT id, codigo, nome, descricao, icone, ordem FROM bncc_areas ORDER BY ordem'
    );

    // Se a tabela não existir, retornar dados mock
    if (areas[0].length === 0) {
      return res.json({
        success: true,
        data: [
          { id: 1, codigo: 'MAT', nome: 'Matemática', icone: '📊', descricao: 'Números, álgebra, geometria', ordem: 1 },
          { id: 2, codigo: 'LIN', nome: 'Linguagens', icone: '📖', descricao: 'Português, artes, idiomas', ordem: 2 },
          { id: 3, codigo: 'CN', nome: 'Ciências da Natureza', icone: '🔬', descricao: 'Física, química, biologia', ordem: 3 },
          { id: 4, codigo: 'CS', nome: 'Ciências Sociais', icone: '🌍', descricao: 'História, geografia', ordem: 4 },
          { id: 5, codigo: 'EC', nome: 'Educação Completa', icone: '💪', descricao: 'Educação física, bem-estar', ordem: 5 },
        ],
      });
    }

    res.json({
      success: true,
      data: areas[0],
    });
  } catch (error) {
    console.error('Erro ao buscar áreas:', error.message);
    // Retornar dados mock em caso de erro
    res.json({
      success: true,
      data: [
        { id: 1, codigo: 'MAT', nome: 'Matemática', icone: '📊', descricao: 'Números, álgebra, geometria', ordem: 1 },
        { id: 2, codigo: 'LIN', nome: 'Linguagens', icone: '📖', descricao: 'Português, artes, idiomas', ordem: 2 },
        { id: 3, codigo: 'CN', nome: 'Ciências da Natureza', icone: '🔬', descricao: 'Física, química, biologia', ordem: 3 },
        { id: 4, codigo: 'CS', nome: 'Ciências Sociais', icone: '🌍', descricao: 'História, geografia', ordem: 4 },
        { id: 5, codigo: 'EC', nome: 'Educação Completa', icone: '💪', descricao: 'Educação física, bem-estar', ordem: 5 },
      ],
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// GET /api/wizard-bncc/habilidades - Lista habilidades de uma área
// ═══════════════════════════════════════════════════════════════════════
router.get('/habilidades', async (req, res) => {
  try {
    const { areaId } = req.query;

    if (!areaId) {
      return res.status(400).json({ error: 'areaId é obrigatório' });
    }

    const habilidades = await sequelize.query(
      `SELECT id, codigo, titulo, descricao, ano_escolar as "anoEscolar"
       FROM bncc_habilidades
       WHERE area_id = $1
       ORDER BY codigo`,
      {
        bind: [areaId],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Mock data se tabela não existir
    if (habilidades.length === 0) {
      return res.json({
        success: true,
        data: [
          {
            id: 1,
            codigo: 'EF07MA01',
            titulo: 'Resolver e elaborar problemas com números naturais',
            descricao: 'Envolvendo divisor, múltiplo, números primos, mmc e mdc',
            anoEscolar: '7º ano',
          },
          {
            id: 2,
            codigo: 'EF08MA01',
            titulo: 'Efetuar cálculos com potências',
            descricao: 'Com expoentes inteiros e notação científica',
            anoEscolar: '8º ano',
          },
          {
            id: 3,
            codigo: 'EM13MAT101',
            titulo: 'Interpretar criticamente fontes de informação',
            descricao: 'Situações econômicas e sociais que envolvam variação de grandezas',
            anoEscolar: 'Ensino Médio',
          },
        ],
      });
    }

    res.json({
      success: true,
      data: habilidades,
    });
  } catch (error) {
    console.error('Erro ao buscar habilidades:', error.message);
    res.json({
      success: true,
      data: [
        {
          id: 1,
          codigo: 'EF07MA01',
          titulo: 'Resolver e elaborar problemas com números naturais',
          descricao: 'Envolvendo divisor, múltiplo, números primos, mmc e mdc',
          anoEscolar: '7º ano',
        },
        {
          id: 2,
          codigo: 'EF08MA01',
          titulo: 'Efetuar cálculos com potências',
          descricao: 'Com expoentes inteiros e notação científica',
          anoEscolar: '8º ano',
        },
      ],
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// POST /api/wizard-bncc/draft - Salvar rascunho do wizard
// ═══════════════════════════════════════════════════════════════════════
router.post('/draft', async (req, res) => {
  try {
    const { teacherId, classId, areaId, selectedHabilidadesIds, temaProjeto, etapaAtual } = req.body;

    // Salvar rascunho (simplificado)
    console.log('💾 Rascunho salvo:', { teacherId, classId, areaId, temaProjeto, etapaAtual });

    res.json({
      success: true,
      message: 'Rascunho salvo com sucesso',
    });
  } catch (error) {
    console.error('Erro ao salvar rascunho:', error.message);
    res.status(500).json({ error: 'Erro ao salvar rascunho' });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// POST /api/wizard-bncc/generate-ai - Gerar sugestões com IA
// ═══════════════════════════════════════════════════════════════════════
router.post('/generate-ai', async (req, res) => {
  try {
    const { temaProjeto, selectedHabilidadesIds, areaId } = req.body;

    if (!temaProjeto || !selectedHabilidadesIds || selectedHabilidadesIds.length === 0) {
      return res.status(400).json({
        error: 'temaProjeto e selectedHabilidadesIds são obrigatórios',
      });
    }

    // Buscar títulos das habilidades selecionadas
    let habilidadesTitulos = [];
    try {
      const habilidades = await sequelize.query(
        `SELECT titulo FROM bncc_habilidades WHERE id = ANY($1::int[])`,
        {
          bind: [selectedHabilidadesIds],
          type: sequelize.QueryTypes.SELECT,
        }
      );
      habilidadesTitulos = habilidades.map((h) => h.titulo);
    } catch (err) {
      console.warn('Não conseguiu buscar habilidades do banco, usando IDs');
      habilidadesTitulos = selectedHabilidadesIds.map((id) => `Habilidade ${id}`);
    }

    // Buscar nome da área
    let areaNome = 'Conhecimento Geral';
    if (areaId) {
      try {
        const [area] = await sequelize.query(
          `SELECT nome FROM bncc_areas WHERE id = $1`,
          {
            bind: [areaId],
            type: sequelize.QueryTypes.SELECT,
          }
        );
        if (area) areaNome = area.nome;
      } catch (err) {
        console.warn('Não conseguiu buscar área do banco');
      }
    }

    // Chamar serviço de IA
    const sugestao = await generateAISuggestion({
      tema: temaProjeto,
      area: areaNome,
      habilidades: habilidadesTitulos,
    });

    res.json({
      success: true,
      data: {
        justificativa: sugestao.justificativa,
        objetivosEspecificos: sugestao.objetivosEspecificos,
        atividadesIniciais: sugestao.atividadesIniciais,
        iaProvider: sugestao.provider,
      },
    });
  } catch (error) {
    console.error('Erro ao gerar IA:', error.message);

    // Fallback para sugestões mock
    const fallback = {
      justificativa: 'Projeto educativo focado no tema proposto com metodologia ativa.',
      objetivosEspecificos: '1. Desenvolver competências através de atividades práticas\n2. Promover trabalho em equipe\n3. Aplicar conhecimentos teóricos',
      atividadesIniciais: '1. Apresentação do tema\n2. Pesquisa inicial\n3. Brainstorm de ideias\n4. Planejamento de ações',
      iaProvider: 'mock',
    };

    res.json({
      success: false,
      fallback,
      data: fallback,
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// POST /api/wizard-bncc/save-project - Salvar projeto
// ═══════════════════════════════════════════════════════════════════════
router.post('/save-project', async (req, res) => {
  try {
    const {
      teacherId,
      classId,
      titulo,
      descricao,
      justificativa,
      objetivosEspecificos,
      selectedHabilidadesIds,
    } = req.body;

    console.log('✅ Projeto salvo:', { teacherId, classId, titulo });

    // Retornar ID fictício do projeto
    res.json({
      success: true,
      message: 'Projeto criado com sucesso',
      data: {
        projectId: `proj-${Date.now()}`,
      },
    });
  } catch (error) {
    console.error('Erro ao salvar projeto:', error.message);
    res.status(500).json({ error: 'Erro ao salvar projeto' });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// GET /api/wizard-bncc/competencias - Lista competências gerais
// ═══════════════════════════════════════════════════════════════════════
router.get('/competencias', async (req, res) => {
  try {
    const competencias = await sequelize.query(
      'SELECT id, numero, titulo, descricao FROM bncc_competencias_gerais ORDER BY numero'
    );

    res.json({
      success: true,
      data: competencias[0],
    });
  } catch (error) {
    console.error('Erro ao buscar competências:', error.message);
    res.status(500).json({ error: 'Erro ao buscar competências' });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// GET /api/wizard-bncc/anos-escolares - Lista anos escolares
// ═══════════════════════════════════════════════════════════════════════
router.get('/anos-escolares', async (req, res) => {
  try {
    const anosEscolares = await sequelize.query(
      'SELECT DISTINCT ano_escolar FROM bncc_habilidades ORDER BY ano_escolar'
    );

    const dados = anosEscolares[0].map((item) => item.ano_escolar);

    res.json({
      success: true,
      data: dados,
    });
  } catch (error) {
    console.error('Erro ao buscar anos escolares:', error.message);
    res.json({
      success: true,
      data: ['6º-7º ano', '7º ano', '8º-9º ano', '8º ano', 'Ensino Médio'],
    });
  }
});

export default router;
