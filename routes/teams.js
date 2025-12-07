import express from 'express';
const router = express.Router();

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ROTAS DE TEAMS (EQUIPES)
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Gerenciamento de equipes para chat e projetos colaborativos.
 * 
 * Features:
 * - Listar equipes do professor
 * - Listar equipes do aluno
 * - Criar nova equipe
 * - Adicionar/remover membros
 * - Vincular equipe a projeto
 * 
 * ═══════════════════════════════════════════════════════════════════════
 */

// ────────────────────────────────────────────────────────────────
// DADOS MOCK (Para desenvolvimento)
// ────────────────────────────────────────────────────────────────

let MOCK_TEAMS = [
    {
        id: 1,
        name: 'Equipe Alpha - Horta Sustentável',
        projectId: 1,
        projectName: 'Horta Sustentável',
        teacherId: 1,
        classId: 1,
        members: [
            { id: 101, name: 'João Silva', email: 'joao.silva@school.com', role: 'leader' },
            { id: 102, name: 'Maria Oliveira', email: 'maria.oliveira@school.com', role: 'member' },
            { id: 103, name: 'Pedro Santos', email: 'pedro.santos@school.com', role: 'member' }
        ],
        createdAt: '2025-01-15T10:00:00Z',
        unreadCount: 2
    },
    {
        id: 2,
        name: 'Equipe Beta - Robótica',
        projectId: 3,
        projectName: 'Robótica Sucata',
        teacherId: 1,
        classId: 1,
        members: [
            { id: 104, name: 'Ana Costa', email: 'ana.costa@school.com', role: 'leader' },
            { id: 105, name: 'Lucas Pereira', email: 'lucas.pereira@school.com', role: 'member' }
        ],
        createdAt: '2025-01-12T11:00:00Z',
        unreadCount: 0
    }
];

let MOCK_MESSAGES = [
    {
        id: 1,
        teamId: 1,
        senderId: 1,
        senderName: 'Profª Ana Silva',
        senderRole: 'teacher',
        text: 'Olá equipe! Como está o andamento do projeto?',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: true
    },
    {
        id: 2,
        teamId: 1,
        senderId: 101,
        senderName: 'João Silva',
        senderRole: 'student',
        text: 'Bom dia! Estamos finalizando a pesquisa sobre o solo.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true
    },
    {
        id: 3,
        teamId: 1,
        senderId: 102,
        senderName: 'Maria Oliveira',
        senderRole: 'student',
        text: 'Já coletamos 5 amostras diferentes!',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        read: false
    }
];

// ════════════════════════════════════════════════════════════════════════
// GET /api/teams/teacher/:teacherId
// ════════════════════════════════════════════════════════════════════════
// Lista todas as equipes do professor
router.get('/teacher/:teacherId', async (req, res) => {
    try {
        const { teacherId } = req.params;
        
        // TODO: Implementar query no banco
        // const teams = await Team.findAll({
        //     where: { teacherId: teacherId },
        //     include: [
        //         { model: Project, as: 'project' },
        //         { model: User, as: 'members' }
        //     ],
        //     order: [['createdAt', 'DESC']]
        // });

        // Mock data
        const teams = MOCK_TEAMS.filter(t => t.teacherId == teacherId);
        
        res.json({
            success: true,
            data: teams,
            count: teams.length
        });
    } catch (error) {
        console.error('❌ Erro ao buscar equipes do professor:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar equipes'
        });
    }
});

// ════════════════════════════════════════════════════════════════════════
// GET /api/teams/student/:studentId
// ════════════════════════════════════════════════════════════════════════
// Lista todas as equipes do aluno
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // TODO: Implementar query no banco
        // const teams = await Team.findAll({
        //     include: [{
        //         model: User,
        //         as: 'members',
        //         where: { id: studentId }
        //     }],
        //     order: [['createdAt', 'DESC']]
        // });

        // Mock data
        const teams = MOCK_TEAMS.filter(t => 
            t.members.some(m => m.id == studentId)
        );
        
        res.json({
            success: true,
            data: teams,
            count: teams.length
        });
    } catch (error) {
        console.error('❌ Erro ao buscar equipes do aluno:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar equipes'
        });
    }
});

// ════════════════════════════════════════════════════════════════════════
// GET /api/teams/:teamId
// ════════════════════════════════════════════════════════════════════════
// Detalhes de uma equipe específica
router.get('/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        
        // TODO: Implementar query no banco
        // const team = await Team.findByPk(teamId, {
        //     include: [
        //         { model: Project, as: 'project' },
        //         { model: User, as: 'members' }
        //     ]
        // });

        // Mock data
        const team = MOCK_TEAMS.find(t => t.id == teamId);
        
        if (!team) {
            return res.status(404).json({
                success: false,
                error: 'Equipe não encontrada'
            });
        }

        res.json({
            success: true,
            data: team
        });
    } catch (error) {
        console.error('❌ Erro ao buscar equipe:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar equipe'
        });
    }
});

// ════════════════════════════════════════════════════════════════════════
// POST /api/teams
// ════════════════════════════════════════════════════════════════════════
// Criar nova equipe
router.post('/', async (req, res) => {
    try {
        const { name, projectId, teacherId, classId, memberIds } = req.body;

        // Validação
        if (!name || !teacherId) {
            return res.status(400).json({
                success: false,
                error: 'Nome e professor são obrigatórios'
            });
        }

        // TODO: Implementar criação no banco
        // const team = await Team.create({
        //     name,
        //     projectId,
        //     teacherId,
        //     classId
        // });
        // 
        // if (memberIds && memberIds.length > 0) {
        //     await team.addMembers(memberIds);
        // }

        // Mock data
        const newTeam = {
            id: MOCK_TEAMS.length + 1,
            name,
            projectId,
            projectName: null,
            teacherId,
            classId,
            members: [],
            createdAt: new Date().toISOString(),
            unreadCount: 0
        };

        MOCK_TEAMS.push(newTeam);

        res.status(201).json({
            success: true,
            data: newTeam,
            message: 'Equipe criada com sucesso'
        });
    } catch (error) {
        console.error('❌ Erro ao criar equipe:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao criar equipe'
        });
    }
});

// ════════════════════════════════════════════════════════════════════════
// PUT /api/teams/:teamId
// ════════════════════════════════════════════════════════════════════════
// Atualizar equipe (nome, projeto, etc)
router.put('/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;
        const { name, projectId } = req.body;

        // TODO: Implementar update no banco
        // const team = await Team.findByPk(teamId);
        // if (!team) {
        //     return res.status(404).json({ success: false, error: 'Equipe não encontrada' });
        // }
        // await team.update({ name, projectId });

        // Mock data
        const teamIndex = MOCK_TEAMS.findIndex(t => t.id == teamId);
        if (teamIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Equipe não encontrada'
            });
        }

        if (name) MOCK_TEAMS[teamIndex].name = name;
        if (projectId) MOCK_TEAMS[teamIndex].projectId = projectId;

        res.json({
            success: true,
            data: MOCK_TEAMS[teamIndex],
            message: 'Equipe atualizada com sucesso'
        });
    } catch (error) {
        console.error('❌ Erro ao atualizar equipe:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao atualizar equipe'
        });
    }
});

// ════════════════════════════════════════════════════════════════════════
// POST /api/teams/:teamId/members
// ════════════════════════════════════════════════════════════════════════
// Adicionar membro à equipe
router.post('/:teamId/members', async (req, res) => {
    try {
        const { teamId } = req.params;
        const { studentId, role = 'member' } = req.body;

        // Validação
        if (!studentId) {
            return res.status(400).json({
                success: false,
                error: 'ID do aluno é obrigatório'
            });
        }

        // TODO: Implementar no banco
        // const team = await Team.findByPk(teamId);
        // const student = await User.findByPk(studentId);
        // await team.addMember(student, { through: { role } });

        // Mock data
        const teamIndex = MOCK_TEAMS.findIndex(t => t.id == teamId);
        if (teamIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Equipe não encontrada'
            });
        }

        const newMember = {
            id: studentId,
            name: `Aluno ${studentId}`,
            email: `aluno${studentId}@school.com`,
            role
        };

        MOCK_TEAMS[teamIndex].members.push(newMember);

        res.json({
            success: true,
            data: MOCK_TEAMS[teamIndex],
            message: 'Membro adicionado com sucesso'
        });
    } catch (error) {
        console.error('❌ Erro ao adicionar membro:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao adicionar membro'
        });
    }
});

// ════════════════════════════════════════════════════════════════════════
// DELETE /api/teams/:teamId/members/:studentId
// ════════════════════════════════════════════════════════════════════════
// Remover membro da equipe
router.delete('/:teamId/members/:studentId', async (req, res) => {
    try {
        const { teamId, studentId } = req.params;

        // TODO: Implementar no banco
        // const team = await Team.findByPk(teamId);
        // await team.removeMember(studentId);

        // Mock data
        const teamIndex = MOCK_TEAMS.findIndex(t => t.id == teamId);
        if (teamIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Equipe não encontrada'
            });
        }

        MOCK_TEAMS[teamIndex].members = MOCK_TEAMS[teamIndex].members.filter(
            m => m.id != studentId
        );

        res.json({
            success: true,
            data: MOCK_TEAMS[teamIndex],
            message: 'Membro removido com sucesso'
        });
    } catch (error) {
        console.error('❌ Erro ao remover membro:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao remover membro'
        });
    }
});

// ════════════════════════════════════════════════════════════════════════
// DELETE /api/teams/:teamId
// ════════════════════════════════════════════════════════════════════════
// Deletar equipe
router.delete('/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;

        // TODO: Implementar no banco
        // const team = await Team.findByPk(teamId);
        // await team.destroy();

        // Mock data
        const teamIndex = MOCK_TEAMS.findIndex(t => t.id == teamId);
        if (teamIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Equipe não encontrada'
            });
        }

        MOCK_TEAMS.splice(teamIndex, 1);

        res.json({
            success: true,
            message: 'Equipe deletada com sucesso'
        });
    } catch (error) {
        console.error('❌ Erro ao deletar equipe:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao deletar equipe'
        });
    }
});

// ════════════════════════════════════════════════════════════════════════
// ROTAS DE MENSAGENS (Team-based)
// ════════════════════════════════════════════════════════════════════════

// GET /api/messages/team/:teamId - Buscar mensagens da equipe
router.get('/messages/team/:teamId', async (req, res) => {
    try {
        const { teamId } = req.params;

        // TODO: Implementar query no banco
        // const messages = await Message.findAll({
        //     where: { teamId },
        //     order: [['timestamp', 'ASC']]
        // });

        // Mock data
        const messages = MOCK_MESSAGES.filter(m => m.teamId == teamId);

        res.json({
            success: true,
            data: messages,
            count: messages.length
        });
    } catch (error) {
        console.error('❌ Erro ao buscar mensagens:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar mensagens'
        });
    }
});

// POST /api/messages/send - Enviar mensagem (fallback REST)
router.post('/messages/send', async (req, res) => {
    try {
        const { teamId, senderId, senderName, senderRole, text } = req.body;

        // Validação
        if (!teamId || !senderId || !text) {
            return res.status(400).json({
                success: false,
                error: 'teamId, senderId e text são obrigatórios'
            });
        }

        // TODO: Implementar no banco
        // const message = await Message.create({
        //     teamId,
        //     senderId,
        //     senderName,
        //     senderRole,
        //     text,
        //     timestamp: new Date()
        // });

        // Mock data
        const newMessage = {
            id: MOCK_MESSAGES.length + 1,
            teamId,
            senderId,
            senderName: senderName || `User ${senderId}`,
            senderRole: senderRole || 'student',
            text,
            timestamp: new Date().toISOString(),
            read: false
        };

        MOCK_MESSAGES.push(newMessage);

        res.status(201).json({
            success: true,
            data: newMessage,
            message: 'Mensagem enviada com sucesso'
        });
    } catch (error) {
        console.error('❌ Erro ao enviar mensagem:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao enviar mensagem'
        });
    }
});

export default router;
