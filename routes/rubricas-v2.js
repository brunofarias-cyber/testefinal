import express from 'express';
import rubricaService from '../services/rubricaService.js';

const router = express.Router();

// Middleware simples de auth (você pode substituir pelo seu authMiddleware)
const authMiddleware = (req, res, next) => {
    // Por enquanto, apenas passa adiante
    // TODO: Implementar verificação de token JWT
    req.user = req.user || { id: 1 }; // Mock user
    next();
};

// ==========================================
// ROTAS ESPECÍFICAS DO FLUXO PROJETO-EQUIPE
// ==========================================

// GET /api/rubricas-v2/projeto/:projetoId
// Buscar rubrica completa de um projeto
router.get('/projeto/:projetoId', authMiddleware, async (req, res) => {
    try {
        const { projetoId } = req.params;
        const rubrica = await rubricaService.buscarRubricaProjeto(parseInt(projetoId));

        res.json({
            sucesso: true,
            dados: rubrica
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// POST /api/rubricas-v2/:projetoId/:equipeId/avaliar
// Professor salva avaliação
router.post('/:projetoId/:equipeId/avaliar', authMiddleware, async (req, res) => {
    try {
        const { projetoId, equipeId } = req.params;
        const { rubricaId, criterios } = req.body;
        const professorId = req.user.id;

        // Validar entrada
        if (!rubricaId || !Array.isArray(criterios) || criterios.length === 0) {
            return res.status(400).json({
                sucesso: false,
                erro: 'rubricaId e array de critérios são obrigatórios'
            });
        }

        const avaliacao = await rubricaService.salvarAvaliacao(
            parseInt(projetoId),
            parseInt(equipeId),
            parseInt(rubricaId),
            professorId,
            criterios
        );

        res.json({
            sucesso: true,
            mensagem: 'Avaliação salva com sucesso',
            dados: avaliacao
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// GET /api/rubricas-v2/:projetoId/:equipeId/avaliacao/:rubricaId
// Aluno/Professor visualiza avaliação específica
router.get('/:projetoId/:equipeId/avaliacao/:rubricaId', authMiddleware, async (req, res) => {
    try {
        const { projetoId, equipeId, rubricaId } = req.params;

        const avaliacao = await rubricaService.buscarAvaliacaoEquipe(
            parseInt(projetoId),
            parseInt(equipeId),
            parseInt(rubricaId)
        );

        // Buscar também a rubrica para referência
        const rubrica = await rubricaService.buscarRubricaProjeto(parseInt(projetoId));

        res.json({
            sucesso: true,
            dados: {
                avaliacao,
                rubrica
            }
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// GET /api/rubricas-v2/:projetoId/avaliacoes
// Buscar todas as avaliações do projeto
router.get('/:projetoId/avaliacoes', authMiddleware, async (req, res) => {
    try {
        const { projetoId } = req.params;

        const avaliacoes = await rubricaService.buscarAvaliacoesProjeto(parseInt(projetoId));

        res.json({
            sucesso: true,
            dados: avaliacoes
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// GET /api/rubricas-v2/:projetoId/:rubricaId/estatisticas
// Retorna média, maior e menor nota
router.get('/:projetoId/:rubricaId/estatisticas', authMiddleware, async (req, res) => {
    try {
        const { projetoId, rubricaId } = req.params;

        const stats = await rubricaService.calcularEstatisticas(
            parseInt(projetoId),
            parseInt(rubricaId)
        );

        res.json({
            sucesso: true,
            dados: stats
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// POST /api/rubricas-v2/projeto/:projetoId/criar
// Criar rubrica completa com critérios e níveis
router.post('/projeto/:projetoId/criar', authMiddleware, async (req, res) => {
    try {
        const { projetoId } = req.params;
        const { titulo, descricao, criterios } = req.body;

        if (!titulo) {
            return res.status(400).json({
                sucesso: false,
                erro: 'Título é obrigatório'
            });
        }

        const rubrica = await rubricaService.criarRubricaCompleta(
            parseInt(projetoId),
            titulo,
            descricao,
            criterios
        );

        res.status(201).json({
            sucesso: true,
            mensagem: 'Rubrica criada com sucesso',
            dados: rubrica
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

export default router;
