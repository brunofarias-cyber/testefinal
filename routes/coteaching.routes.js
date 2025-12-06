import express from 'express';
import coteachingService from '../services/coteachingService.js';
import { verifyToken } from '../server.js';
import { verificarAcessoProjeto } from '../middleware/projectAccess.js';

const router = express.Router();

/**
 * Rotas de Co-Teaching
 * Versão em PORTUGUÊS
 */

// 1. CONVIDAR professor por email
router.post('/projetos/:projetoId/convidar', verifyToken, verificarAcessoProjeto, async (req, res) => {
    try {
        const { projetoId } = req.params;
        const { emailProfessor, papel } = req.body;
        const professorId = req.user.id;

        if (!emailProfessor) {
            return res.status(400).json({
                sucesso: false,
                erro: 'Email do professor é obrigatório'
            });
        }

        const convite = await coteachingService.convidarProfessor(
            projetoId,
            emailProfessor.toLowerCase(),
            professorId
        );

        res.json({
            sucesso: true,
            mensagem: `Convite enviado para ${emailProfessor}`,
            dados: convite
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// 2. ACEITAR convite (por token)
router.post('/convites/aceitar/:token', verifyToken, async (req, res) => {
    try {
        const { token } = req.params;
        const professorId = req.user.id;

        const resultado = await coteachingService.aceitarConvite(token, professorId);

        res.json({
            sucesso: true,
            dados: resultado
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// 3. ADICIONAR colaborador direto
router.post('/projetos/:projetoId/colaboradores', verifyToken, verificarAcessoProjeto, async (req, res) => {
    try {
        const { projetoId } = req.params;
        const { professorEmailOuId, papel } = req.body;
        const professorId = req.user.id;

        const colaborador = await coteachingService.adicionarColaborador(
            projetoId,
            professorEmailOuId,
            professorId,
            papel || 'co-professor'
        );

        res.json({
            sucesso: true,
            mensagem: 'Colaborador adicionado com sucesso',
            dados: colaborador
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// 4. LISTAR colaboradores
router.get('/projetos/:projetoId/colaboradores', verifyToken, verificarAcessoProjeto, async (req, res) => {
    try {
        const { projetoId } = req.params;

        const colaboradores = await coteachingService.listarColaboradores(projetoId);

        res.json({
            sucesso: true,
            dados: colaboradores
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// 5. REMOVER colaborador
router.delete('/projetos/:projetoId/colaboradores/:professorId', verifyToken, verificarAcessoProjeto, async (req, res) => {
    try {
        const { projetoId, professorId } = req.params;
        const usuarioId = req.user.id;

        const resultado = await coteachingService.removerColaborador(
            projetoId,
            professorId,
            usuarioId
        );

        res.json({
            sucesso: true,
            dados: resultado
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// 6. VERIFICAR acesso
router.get('/projetos/:projetoId/acesso', verifyToken, async (req, res) => {
    try {
        const { projetoId } = req.params;
        const usuarioId = req.user.id;

        const acesso = await coteachingService.verificarAcesso(
            projetoId,
            usuarioId
        );

        res.json({
            sucesso: true,
            dados: acesso
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// 7. LISTAR meus projetos (owner + collaborator)
router.get('/meus-projetos', verifyToken, async (req, res) => {
    try {
        const usuarioId = req.user.id;

        const projetos = await coteachingService.listarProjetosDoProfessor(usuarioId);

        res.json({
            sucesso: true,
            dados: projetos
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

// 8. LISTAR convites pendentes
router.get('/convites/pendentes', verifyToken, async (req, res) => {
    try {
        const email = req.user.email;

        const convites = await coteachingService.listarConvitesPendentes(email);

        res.json({
            sucesso: true,
            dados: convites
        });
    } catch (error) {
        res.status(400).json({
            sucesso: false,
            erro: error.message
        });
    }
});

export default router;
