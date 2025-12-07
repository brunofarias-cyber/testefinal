import express from 'express';
const router = express.Router();

// ═══════════════════════════════════════════════════════════════════════
// ROTAS DE CHAT ISOLADO POR EQUIPE
// ═══════════════════════════════════════════════════════════════════════
// 
// SEGURANÇA CRÍTICA:
// - SEMPRE verificar se o usuário pertence à equipe
// - NUNCA confiar apenas no teamId enviado pelo cliente
// - Validar permissões em TODAS as rotas
// 
// ═══════════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────────
// DADOS MOCK (Para desenvolvimento)
// ────────────────────────────────────────────────────────────────

let MOCK_MESSAGES = [
  {
    id: 1,
    team_id: 1,
    sender_id: 101,
    sender_name: 'João Silva',
    sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
    sender_role: 'student',
    message: 'Pesquisei sobre hortas e encontrei informações interessantes!',
    timestamp: '2025-01-20T10:30:00',
    read: true
  },
  {
    id: 2,
    team_id: 1,
    sender_id: 1,
    sender_name: 'Profª Ana Silva',
    sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    sender_role: 'teacher',
    message: 'Ótimo, João! Podem compartilhar as fontes com o grupo?',
    timestamp: '2025-01-20T10:35:00',
    read: true
  },
  {
    id: 3,
    team_id: 1,
    sender_id: 102,
    sender_name: 'Maria Santos',
    sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    sender_role: 'student',
    message: 'Eu posso fazer um resumo das fontes para compartilhar',
    timestamp: '2025-01-20T10:40:00',
    read: false
  },
  {
    id: 4,
    team_id: 2,
    sender_id: 201,
    sender_name: 'Carlos Lima',
    sender_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    sender_role: 'student',
    message: 'Mensagem da Equipe 2 (isolada)',
    timestamp: '2025-01-20T11:00:00',
    read: true
  }
];

let MOCK_TEAM_MEMBERS = [
  { team_id: 1, user_id: 101, role: 'student' },
  { team_id: 1, user_id: 102, role: 'student' },
  { team_id: 1, user_id: 1, role: 'teacher' },
  { team_id: 2, user_id: 201, role: 'student' },
  { team_id: 2, user_id: 1, role: 'teacher' }
];

// ────────────────────────────────────────────────────────────────
// HELPER: Verificar permissão de acesso à equipe
// ────────────────────────────────────────────────────────────────

const checkTeamAccess = async (teamId, userId) => {
  // TODO: Substituir por query real do banco
  // const member = await TeamMember.findOne({
  //   where: { team_id: teamId, user_id: userId }
  // });
  // return member !== null;

  // Mock: Verificar se usuário está na equipe
  const isMember = MOCK_TEAM_MEMBERS.some(
    m => m.team_id === parseInt(teamId) && m.user_id === parseInt(userId)
  );
  
  return isMember;
};

// ────────────────────────────────────────────────────────────────
// MIDDLEWARE: Verificar acesso à equipe
// ────────────────────────────────────────────────────────────────

const verifyTeamAccess = async (req, res, next) => {
  const { teamId } = req.params;
  const userId = req.headers['user-id'] || req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: 'Autenticação necessária'
    });
  }

  const hasAccess = await checkTeamAccess(teamId, userId);

  if (!hasAccess) {
    return res.status(403).json({
      success: false,
      error: '🔒 Acesso negado: Você não pertence a esta equipe'
    });
  }

  req.userId = userId;
  next();
};

// ═══════════════════════════════════════════════════════════════════════
// ROTAS
// ═══════════════════════════════════════════════════════════════════════

// ────────────────────────────────────────────────────────────────
// GET /api/teams/:teamId/messages
// Buscar mensagens de uma equipe (COM VERIFICAÇÃO DE PERMISSÃO)
// ────────────────────────────────────────────────────────────────

router.get('/:teamId/messages', verifyTeamAccess, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    // TODO: Substituir por query real do banco
    /*
    const messages = await Message.findAll({
      where: { team_id: teamId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'avatar', 'role']
        }
      ],
      order: [['timestamp', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    */

    // Mock: Filtrar apenas mensagens da equipe
    const teamMessages = MOCK_MESSAGES
      .filter(m => m.team_id === parseInt(teamId))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    console.log(`📨 GET /api/teams/${teamId}/messages - ${teamMessages.length} mensagens`);

    res.json({
      success: true,
      data: teamMessages,
      count: teamMessages.length,
      teamId: parseInt(teamId),
      isolation: '🔒 Mensagens isoladas por equipe'
    });
  } catch (error) {
    console.error('❌ Erro ao buscar mensagens:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar mensagens'
    });
  }
});

// ────────────────────────────────────────────────────────────────
// POST /api/teams/:teamId/messages
// Enviar mensagem para uma equipe (COM VERIFICAÇÃO)
// ────────────────────────────────────────────────────────────────

router.post('/:teamId/messages', verifyTeamAccess, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { senderId, message, senderName, senderAvatar, senderRole } = req.body;

    // Validação
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Mensagem não pode estar vazia'
      });
    }

    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Mensagem muito longa (máximo 500 caracteres)'
      });
    }

    // Verificar se o senderId é o mesmo do usuário autenticado
    if (parseInt(senderId) !== parseInt(req.userId)) {
      return res.status(403).json({
        success: false,
        error: 'Você não pode enviar mensagens como outro usuário'
      });
    }

    // TODO: Substituir por criação real no banco
    /*
    const newMessage = await Message.create({
      team_id: teamId,
      sender_id: senderId,
      message: message.trim(),
      timestamp: new Date()
    });

    const messageWithSender = await Message.findByPk(newMessage.id, {
      include: [{ model: User, as: 'sender' }]
    });
    */

    // Mock: Criar mensagem
    const newMessage = {
      id: MOCK_MESSAGES.length + 1,
      team_id: parseInt(teamId),
      sender_id: parseInt(senderId),
      sender_name: senderName || 'Usuário',
      sender_avatar: senderAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
      sender_role: senderRole || 'student',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    MOCK_MESSAGES.push(newMessage);

    console.log(`✅ POST /api/teams/${teamId}/messages - Nova mensagem de ${senderName}`);

    // Emitir via Socket.io para todos da equipe (se configurado)
    if (req.app.io) {
      req.app.io.to(`team-${teamId}`).emit(`team-${teamId}-message`, newMessage);
      console.log(`📡 Mensagem emitida via Socket.io para sala: team-${teamId}`);
    }

    res.status(201).json({
      success: true,
      message: newMessage,
      info: '✅ Mensagem salva e enviada para a equipe'
    });
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao enviar mensagem'
    });
  }
});

// ────────────────────────────────────────────────────────────────
// PUT /api/teams/:teamId/messages/:messageId/read
// Marcar mensagem como lida
// ────────────────────────────────────────────────────────────────

router.put('/:teamId/messages/:messageId/read', verifyTeamAccess, async (req, res) => {
  try {
    const { teamId, messageId } = req.params;

    // TODO: Substituir por update real no banco
    /*
    await Message.update(
      { read: true },
      { where: { id: messageId, team_id: teamId } }
    );
    */

    // Mock: Atualizar status de leitura
    const messageIndex = MOCK_MESSAGES.findIndex(
      m => m.id === parseInt(messageId) && m.team_id === parseInt(teamId)
    );

    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Mensagem não encontrada'
      });
    }

    MOCK_MESSAGES[messageIndex].read = true;

    console.log(`👁️ PUT /api/teams/${teamId}/messages/${messageId}/read`);

    res.json({
      success: true,
      message: 'Mensagem marcada como lida'
    });
  } catch (error) {
    console.error('❌ Erro ao marcar como lida:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar mensagem'
    });
  }
});

// ────────────────────────────────────────────────────────────────
// DELETE /api/teams/:teamId/messages/:messageId
// Deletar mensagem (apenas autor ou professor)
// ────────────────────────────────────────────────────────────────

router.delete('/:teamId/messages/:messageId', verifyTeamAccess, async (req, res) => {
  try {
    const { teamId, messageId } = req.params;
    const userId = req.userId;

    // Buscar mensagem
    const message = MOCK_MESSAGES.find(
      m => m.id === parseInt(messageId) && m.team_id === parseInt(teamId)
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Mensagem não encontrada'
      });
    }

    // Verificar permissão: apenas autor ou professor
    const member = MOCK_TEAM_MEMBERS.find(
      m => m.team_id === parseInt(teamId) && m.user_id === parseInt(userId)
    );

    const isAuthor = message.sender_id === parseInt(userId);
    const isTeacher = member?.role === 'teacher';

    if (!isAuthor && !isTeacher) {
      return res.status(403).json({
        success: false,
        error: '🔒 Você não tem permissão para deletar esta mensagem'
      });
    }

    // TODO: Substituir por delete real no banco
    /*
    await Message.destroy({
      where: { id: messageId, team_id: teamId }
    });
    */

    // Mock: Remover mensagem
    const index = MOCK_MESSAGES.findIndex(m => m.id === parseInt(messageId));
    MOCK_MESSAGES.splice(index, 1);

    console.log(`🗑️ DELETE /api/teams/${teamId}/messages/${messageId}`);

    // Emitir via Socket.io
    if (req.app.io) {
      req.app.io.to(`team-${teamId}`).emit(`team-${teamId}-message-deleted`, {
        messageId: parseInt(messageId)
      });
    }

    res.json({
      success: true,
      message: 'Mensagem deletada com sucesso'
    });
  } catch (error) {
    console.error('❌ Erro ao deletar mensagem:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar mensagem'
    });
  }
});

// ────────────────────────────────────────────────────────────────
// GET /api/teams/:teamId/members
// Listar membros da equipe
// ────────────────────────────────────────────────────────────────

router.get('/:teamId/members', verifyTeamAccess, async (req, res) => {
  try {
    const { teamId } = req.params;

    // TODO: Substituir por query real do banco
    /*
    const members = await TeamMember.findAll({
      where: { team_id: teamId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email', 'avatar', 'role']
        }
      ]
    });
    */

    // Mock: Filtrar membros da equipe
    const teamMembers = MOCK_TEAM_MEMBERS.filter(
      m => m.team_id === parseInt(teamId)
    );

    console.log(`👥 GET /api/teams/${teamId}/members - ${teamMembers.length} membros`);

    res.json({
      success: true,
      data: teamMembers,
      count: teamMembers.length
    });
  } catch (error) {
    console.error('❌ Erro ao buscar membros:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar membros'
    });
  }
});

// ────────────────────────────────────────────────────────────────
// GET /api/teams/:teamId/stats
// Estatísticas do chat da equipe
// ────────────────────────────────────────────────────────────────

router.get('/:teamId/stats', verifyTeamAccess, async (req, res) => {
  try {
    const { teamId } = req.params;

    const teamMessages = MOCK_MESSAGES.filter(
      m => m.team_id === parseInt(teamId)
    );

    const unreadCount = teamMessages.filter(m => !m.read).length;
    const members = MOCK_TEAM_MEMBERS.filter(
      m => m.team_id === parseInt(teamId)
    );

    const stats = {
      totalMessages: teamMessages.length,
      unreadMessages: unreadCount,
      totalMembers: members.length,
      lastMessage: teamMessages[teamMessages.length - 1] || null,
      isolation: '🔒 Chat isolado por equipe'
    };

    console.log(`📊 GET /api/teams/${teamId}/stats`);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas'
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// SQL QUERIES PARA BANCO DE DADOS (Comentadas para referência)
// ═══════════════════════════════════════════════════════════════════════

/*
-- Verificar se usuário é membro da equipe
SELECT COUNT(*) as is_member
FROM team_members
WHERE team_id = ? AND user_id = ?;

-- Buscar mensagens de uma equipe (com permissão)
SELECT m.*, u.name as sender_name, u.avatar as sender_avatar, u.role as sender_role
FROM messages m
INNER JOIN users u ON m.sender_id = u.id
WHERE m.team_id = ?
  AND EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.team_id = m.team_id AND tm.user_id = ?
  )
ORDER BY m.timestamp ASC
LIMIT ? OFFSET ?;

-- Salvar mensagem (com verificação de permissão)
INSERT INTO messages (team_id, sender_id, message, timestamp)
SELECT ?, ?, ?, NOW()
WHERE EXISTS (
  SELECT 1 FROM team_members
  WHERE team_id = ? AND user_id = ?
);

-- Deletar mensagem (com permissão: autor ou professor)
DELETE FROM messages
WHERE id = ?
  AND team_id = ?
  AND (
    sender_id = ? OR
    ? IN (
      SELECT user_id FROM team_members
      WHERE team_id = ? AND role = 'teacher'
    )
  );

-- Marcar mensagens como lidas
UPDATE messages
SET read = TRUE
WHERE id = ? AND team_id = ?;

-- Buscar membros da equipe
SELECT tm.*, u.name, u.email, u.avatar, u.role
FROM team_members tm
INNER JOIN users u ON tm.user_id = u.id
WHERE tm.team_id = ?;
*/

export default router;
