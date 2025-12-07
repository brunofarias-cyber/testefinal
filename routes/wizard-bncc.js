/*
═══════════════════════════════════════════════════════════════════════
  BACKEND - ROTAS PARA ASSISTENTE INTELIGENTE BNCC
═══════════════════════════════════════════════════════════════════════

Arquivo: routes/wizard-bncc.js

Rotas para:
1. Buscar áreas BNCC
2. Buscar habilidades por área
3. Salvar rascunho do wizard
4. Gerar sugestão com IA
5. Salvar projeto final

Usa: Sequelize ORM + PostgreSQL

═══════════════════════════════════════════════════════════════════════
*/

import express from 'express';
import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';
// import { generateAISuggestion } from '../services/aiService.js';

const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════
// ROTA 1: GET /wizard/areas
// Buscar todas as áreas BNCC
// ═══════════════════════════════════════════════════════════════════════

router.get('/areas', async (req, res) => {
  try {
    const [areas] = await sequelize.query(`
      SELECT * FROM bncc_areas 
      ORDER BY ordem ASC
    `);

    res.json({
      success: true,
      data: areas,
      count: areas.length,
    });
  } catch (error) {
    console.error('Erro ao buscar áreas:', error);
    res.status(500).json({ error: 'Erro ao buscar áreas' });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// ROTA 2: GET /wizard/habilidades?areaId=1&anoEscolar=7º%20ano
// Buscar habilidades por área (com filtro opcional de ano)
// ═══════════════════════════════════════════════════════════════════════

router.get('/habilidades', async (req, res) => {
  try {
    const { areaId, anoEscolar } = req.query;

    if (!areaId) {
      return res.status(400).json({
        error: 'areaId é obrigatório',
      });
    }

    let query = `
      SELECT 
        h.*,
        a.nome as area_nome,
        a.codigo as area_codigo,
        a.icone as area_icone
      FROM bncc_habilidades h
      JOIN bncc_areas a ON h.area_id = a.id
      WHERE h.area_id = $1
    `;

    const params = [parseInt(areaId)];

    if (anoEscolar) {
      query += ` AND h.ano_escolar = $2`;
      params.push(anoEscolar);
    }

    query += ` ORDER BY h.codigo ASC`;

    const [habilidades] = await sequelize.query(query, {
      bind: params,
    });

    res.json({
      success: true,
      data: habilidades,
      count: habilidades.length,
    });
  } catch (error) {
    console.error('Erro ao buscar habilidades:', error);
    res.status(500).json({ error: 'Erro ao buscar habilidades' });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// ROTA 3: GET /wizard/competencias
// Buscar todas as competências gerais BNCC
// ═══════════════════════════════════════════════════════════════════════

router.get('/competencias', async (req, res) => {
  try {
    const [competencias] = await sequelize.query(`
      SELECT * FROM bncc_competencias_gerais 
      ORDER BY numero ASC
    `);

    res.json({
      success: true,
      data: competencias,
      count: competencias.length,
    });
  } catch (error) {
    console.error('Erro ao buscar competências:', error);
    res.status(500).json({ error: 'Erro ao buscar competências' });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// ROTA 4: POST /wizard/draft
// Salvar rascunho do wizard (estado do formulário)
// ═══════════════════════════════════════════════════════════════════════

router.post('/draft', async (req, res) => {
  try {
    const {
      teacherId,
      areaId,
      selectedHabilidadesIds,
      temaProjeto,
      etapaAtual,
      justificativa,
      objetivosEspecificos,
      atividadesIniciais,
    } = req.body;

    if (!teacherId) {
      return res.status(400).json({
        error: 'teacherId é obrigatório',
      });
    }

    // Verificar se já existe rascunho
    const [existingDraft] = await sequelize.query(`
      SELECT * FROM project_wizard_draft 
      WHERE teacher_id = $1 AND status = 'draft'
      LIMIT 1
    `, {
      bind: [teacherId],
    });

    let draft;

    if (existingDraft.length > 0) {
      // Atualizar rascunho existente
      await sequelize.query(`
        UPDATE project_wizard_draft 
        SET 
          area_id = COALESCE($2, area_id),
          selected_habilidades_ids = COALESCE($3, selected_habilidades_ids),
          tema_projeto = COALESCE($4, tema_projeto),
          etapa_atual = COALESCE($5, etapa_atual),
          justificativa = COALESCE($6, justificativa),
          objetivos_especificos = COALESCE($7, objetivos_especificos),
          atividades_iniciais = COALESCE($8, atividades_iniciais),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
      `, {
        bind: [
          existingDraft[0].id,
          areaId,
          selectedHabilidadesIds ? `{${selectedHabilidadesIds.join(',')}}` : null,
          temaProjeto,
          etapaAtual,
          justificativa,
          objetivosEspecificos,
          atividadesIniciais,
        ],
      });

      draft = existingDraft[0];
    } else {
      // Criar novo rascunho
      const [newDraft] = await sequelize.query(`
        INSERT INTO project_wizard_draft (
          teacher_id, area_id, selected_habilidades_ids, tema_projeto, 
          etapa_atual, status, justificativa, objetivos_especificos, atividades_iniciais
        ) 
        VALUES ($1, $2, $3, $4, $5, 'draft', $6, $7, $8)
        RETURNING *
      `, {
        bind: [
          teacherId,
          areaId,
          selectedHabilidadesIds ? `{${selectedHabilidadesIds.join(',')}}` : null,
          temaProjeto,
          etapaAtual || 1,
          justificativa,
          objetivosEspecificos,
          atividadesIniciais,
        ],
      });

      draft = newDraft[0];
    }

    res.json({
      success: true,
      message: 'Rascunho salvo com sucesso',
      data: draft,
    });
  } catch (error) {
    console.error('Erro ao salvar rascunho:', error);
    res.status(500).json({ error: 'Erro ao salvar rascunho' });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// ROTA 5: GET /wizard/draft/:teacherId
// Recuperar rascunho do wizard
// ═══════════════════════════════════════════════════════════════════════

router.get('/draft/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;

    const [drafts] = await sequelize.query(`
      SELECT 
        d.*,
        a.nome as area_nome,
        a.codigo as area_codigo
      FROM project_wizard_draft d
      LEFT JOIN bncc_areas a ON d.area_id = a.id
      WHERE d.teacher_id = $1 AND d.status = 'draft'
      ORDER BY d.updated_at DESC
      LIMIT 1
    `, {
      bind: [parseInt(teacherId)],
    });

    if (drafts.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Nenhum rascunho encontrado',
        data: null,
      });
    }

    res.json({
      success: true,
      data: drafts[0],
    });
  } catch (error) {
    console.error('Erro ao buscar rascunho:', error);
    res.status(500).json({ error: 'Erro ao buscar rascunho' });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// ROTA 6: POST /wizard/generate-ai
// Gerar sugestão de planejamento com IA
// ═══════════════════════════════════════════════════════════════════════

router.post('/generate-ai', async (req, res) => {
  try {
    const { temaProjeto, selectedHabilidadesIds, areaId } = req.body;

    if (!temaProjeto || !selectedHabilidadesIds || selectedHabilidadesIds.length === 0) {
      return res.status(400).json({
        error: 'Tema e habilidades selecionadas são obrigatórios',
      });
    }

    // Buscar habilidades selecionadas (para contexto)
    const [habilidades] = await sequelize.query(`
      SELECT * FROM bncc_habilidades 
      WHERE id = ANY($1::int[])
    `, {
      bind: [`{${selectedHabilidadesIds.join(',')}}`],
    });

    const [areas] = await sequelize.query(`
      SELECT * FROM bncc_areas WHERE id = $1
    `, {
      bind: [areaId],
    });

    const area = areas[0];

    // 🤖 Chamar serviço de IA (por enquanto usando mock)
    // const sugestao = await generateAISuggestion({
    //   tema: temaProjeto,
    //   area: area?.nome || 'Não especificada',
    //   habilidades: habilidades.map((h) => h.titulo),
    // });

    // Por enquanto, usar mock
    const sugestao = generateMockSuggestion(temaProjeto, habilidades, area);

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
    console.error('Erro ao gerar sugestão IA:', error);
    res.status(500).json({
      error: 'Erro ao gerar sugestão com IA',
      fallback: generateMockSuggestion(req.body.temaProjeto, [], {}),
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// ROTA 7: POST /wizard/save-project
// Salvar projeto final (sair do draft)
// ═══════════════════════════════════════════════════════════════════════

router.post('/save-project', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      teacherId,
      titulo,
      descricao,
      selectedHabilidadesIds,
      justificativa,
      objetivosEspecificos,
      category,
      difficulty,
      deadline,
    } = req.body;

    if (!titulo || !descricao) {
      return res.status(400).json({
        error: 'Título e descrição são obrigatórios',
      });
    }

    // 1. Criar projeto
    const [projeto] = await sequelize.query(`
      INSERT INTO projects (
        title, description, category, difficulty, "teacherId", 
        deadline, status, "createdAt", "updatedAt"
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, 'Planejamento', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `, {
      bind: [
        titulo,
        descricao,
        category || 'BNCC',
        difficulty || 'Médio',
        teacherId,
        deadline || null,
      ],
      transaction,
    });

    const projectId = projeto[0].id;

    // 2. Vincular habilidades BNCC
    if (selectedHabilidadesIds && selectedHabilidadesIds.length > 0) {
      const values = selectedHabilidadesIds.map((habilidadeId) =>
        `(${projectId}, ${habilidadeId}, 'Habilidade vinculada ao projeto ${titulo}', CURRENT_TIMESTAMP)`
      ).join(',');

      await sequelize.query(`
        INSERT INTO project_bncc_habilidades 
        (project_id, habilidade_id, descricao_alignment, created_at)
        VALUES ${values}
      `, { transaction });
    }

    // 3. Remover rascunho
    await sequelize.query(`
      DELETE FROM project_wizard_draft 
      WHERE teacher_id = $1 AND status = 'draft'
    `, {
      bind: [teacherId],
      transaction,
    });

    await transaction.commit();

    res.json({
      success: true,
      message: 'Projeto criado com sucesso!',
      data: {
        projectId: projectId,
        titulo: titulo,
        habilidadesCount: selectedHabilidadesIds?.length || 0,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao salvar projeto:', error);
    res.status(500).json({ error: 'Erro ao salvar projeto' });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// ROTA 8: DELETE /wizard/draft/:draftId
// Deletar rascunho
// ═══════════════════════════════════════════════════════════════════════

router.delete('/draft/:draftId', async (req, res) => {
  try {
    const { draftId } = req.params;

    await sequelize.query(`
      DELETE FROM project_wizard_draft WHERE id = $1
    `, {
      bind: [parseInt(draftId)],
    });

    res.json({
      success: true,
      message: 'Rascunho deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar rascunho:', error);
    res.status(500).json({ error: 'Erro ao deletar rascunho' });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// ROTA 9: GET /wizard/anos-escolares
// Buscar anos escolares disponíveis
// ═══════════════════════════════════════════════════════════════════════

router.get('/anos-escolares', async (req, res) => {
  try {
    const [anos] = await sequelize.query(`
      SELECT DISTINCT ano_escolar 
      FROM bncc_habilidades 
      WHERE ano_escolar IS NOT NULL
      ORDER BY ano_escolar ASC
    `);

    res.json({
      success: true,
      data: anos.map(a => a.ano_escolar),
    });
  } catch (error) {
    console.error('Erro ao buscar anos escolares:', error);
    res.status(500).json({ error: 'Erro ao buscar anos escolares' });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// FUNÇÃO: Mock para sugestão quando IA não está disponível
// ═══════════════════════════════════════════════════════════════════════

function generateMockSuggestion(tema, habilidades = [], area = {}) {
  const habilidadesTitulos = habilidades.map(h => `• ${h.titulo}`).join('\n');
  
  return {
    justificativa: `O projeto "${tema}" foi desenvolvido com base nas habilidades BNCC selecionadas da área de ${area.nome || 'conhecimento'}, visando desenvolver competências essenciais dos alunos. Este projeto promove aprendizagem significativa através de experiências práticas e reflexivas, alinhadas às diretrizes da Base Nacional Comum Curricular.

${habilidades.length > 0 ? `\n**Habilidades contempladas:**\n${habilidadesTitulos}` : ''}

A proposta busca contextualizar o conhecimento teórico, tornando-o aplicável à realidade dos estudantes e promovendo o desenvolvimento integral.`,

    objetivosEspecificos: `• Desenvolver habilidades práticas relacionadas ao tema "${tema}"
• Promover trabalho colaborativo e desenvolvimento de competências socioemocionais
• Aplicar conhecimentos teóricos em situações reais e contextualizadas
• Estimular o pensamento crítico e a resolução de problemas
• Avaliar e refletir sobre o processo de aprendizagem
• Integrar diferentes áreas do conhecimento de forma interdisciplinar`,

    atividadesIniciais: `**Etapa 1 - Investigação Inicial (1-2 aulas)**
Os alunos exploram diferentes aspectos do tema "${tema}" através de pesquisa guiada, discussões em grupo e levantamento de conhecimentos prévios.

**Etapa 2 - Brainstorm Colaborativo (1 aula)**
Em grupos, os estudantes levantam ideias, questionamentos e possíveis soluções relacionadas ao tema, utilizando técnicas de design thinking.

**Etapa 3 - Pesquisa Fundamentada (2-3 aulas)**
Busca de fontes confiáveis (artigos, vídeos, entrevistas) para fundamentar o projeto, com orientação sobre metodologia de pesquisa.

**Etapa 4 - Planejamento do Projeto (1-2 aulas)**
Organização das etapas, definição de responsabilidades, cronograma e recursos necessários.

**Etapa 5 - Execução Prática (4-6 aulas)**
Desenvolvimento das atividades planejadas, com acompanhamento contínuo e ajustes quando necessário.

**Etapa 6 - Apresentação e Avaliação (2 aulas)**
Compartilhamento dos resultados com a turma, autoavaliação e feedback coletivo.`,

    provider: 'mock',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// EXPORTAR ROUTER
// ═══════════════════════════════════════════════════════════════════════

export default router;

// ═══════════════════════════════════════════════════════════════════════
// COMO REGISTRAR NO server.js
// ═══════════════════════════════════════════════════════════════════════

/*
import wizardBnccRoutes from './routes/wizard-bncc.js';

app.use('/api/wizard-bncc', wizardBnccRoutes);

// Agora as rotas estarão disponíveis em:
// GET  /api/wizard-bncc/areas
// GET  /api/wizard-bncc/habilidades?areaId=1&anoEscolar=7º%20ano
// GET  /api/wizard-bncc/competencias
// GET  /api/wizard-bncc/anos-escolares
// GET  /api/wizard-bncc/draft/:teacherId
// POST /api/wizard-bncc/draft
// POST /api/wizard-bncc/generate-ai
// POST /api/wizard-bncc/save-project
// DELETE /api/wizard-bncc/draft/:draftId
*/
