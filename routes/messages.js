import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { handleValidationErrors, asyncHandler } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
import { apiLimiter, communicationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Aplicar rate limiter
router.use(communicationLimiter);

/**
 * ═══════════════════════════════════════════════════════════════════════
 * ROTAS DE MENSAGENS PROFESSOR-ALUNO
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * Sistema de chat 1-on-1 entre professores e alunos.
 * 
 * Features:
 * - Persistência de mensagens
 * - Conversas isoladas
 * - Histórico completo
 * - Notificações de mensagens não lidas
 * 
 * ═══════════════════════════════════════════════════════════════════════
 */

// ────────────────────────────────────────────────────────────────
// DADOS MOCK (Para desenvolvimento)
// ────────────────────────────────────────────────────────────────

let MOCK_CONVERSATIONS = [
  {
    id: 1,
    teacherId: 1,
    studentId: 101,
    createdAt: '2025-01-15T10:00:00Z',
    lastMessageAt: '2025-12-07T14:30:00Z'
  },
  {
    id: 2,
    teacherId: 1,
    studentId: 102,
    createdAt: '2025-01-10T09:00:00Z',
    lastMessageAt: '2025-12-06T16:45:00Z'
  },
  {
    id: 3,
    teacherId: 1,
    studentId: 103,
    createdAt: '2025-01-12T11:00:00Z',
    lastMessageAt: '2025-12-05T11:20:00Z'
  }
];

let MOCK_MESSAGES = [
  {
    id: 1,
    conversationId: 1,
    senderId: 101,
    senderRole: 'student',
    message: 'Bom dia, professor! Tudo bem?',
    timestamp: '2025-12-07T09:00:00Z',
    read: true
  },
  {
    id: 2,
    conversationId: 1,
    senderId: 1,
    senderRole: 'teacher',
    message: 'Bom dia, João! Tudo ótimo, e você?',
    timestamp: '2025-12-07T09:15:00Z',
    read: true
  },
  {
    id: 3,
    conversationId: 1,
    senderId: 101,
    senderRole: 'student',
    message: 'Tô bem! Tenho uma dúvida sobre o projeto da horta.',
    timestamp: '2025-12-07T14:20:00Z',
    read: true
  },
  {
    id: 4,
    conversationId: 1,
    senderId: 101,
    senderRole: 'student',
    message: 'Qual é o melhor tipo de solo para cenouras?',
    timestamp: '2025-12-07T14:30:00Z',
    read: false
  },
  {
    id: 5,
    conversationId: 2,
    senderId: 102,
    senderRole: 'student',
    message: 'Professor, não entendi a parte da rubrica sobre trabalho em equipe',
    timestamp: '2025-12-06T15:00:00Z',
    read: true
  },
  {
    id: 6,
    conversationId: 2,
    senderId: 1,
    senderRole: 'teacher',
    message: 'Oi Maria! Vou te explicar. A rubrica avalia...',
    timestamp: '2025-12-06T15:30:00Z',
    read: true
  },
  {
    id: 7,
    conversationId: 2,
    senderId: 102,
    senderRole: 'student',
    message: 'Obrigada pela explicação! Ficou claro agora.',
    timestamp: '2025-12-06T16:45:00Z',
    read: true
  },
  {
    id: 8,
    conversationId: 3,
    senderId: 103,
    senderRole: 'student',
    message: 'Professor, tive um problema e não consegui terminar o relatório',
    timestamp: '2025-12-05T10:00:00Z',
    read: true
  },
  {
    id: 9,
    conversationId: 3,
    senderId: 103,
    senderRole: 'student',
    message: 'Posso entregar amanhã?',
    timestamp: '2025-12-05T11:20:00Z',
    read: false
  }
];

let MOCK_USERS = [
  {
    id: 1,
    name: 'Profª Ana Silva',
    email: 'ana.silva@school.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    role: 'teacher'
  },
  {
    id: 101,
    name: 'João Silva',
    email: 'joao.silva@school.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
    role: 'student'
  },
  {
    id: 102,
    name: 'Maria Oliveira',
    email: 'maria.oliveira@school.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    role: 'student'
  },
  {
    id: 103,
    name: 'Pedro Santos',
    email: 'pedro.santos@school.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
    role: 'student'
  }
];

// ═══════════════════════════════════════════════════════════════════════
// GET /api/messages/teacher/:teacherId/conversations
// Listar conversas do professor
// ═══════════════════════════════════════════════════════════════════════

router.get('/teacher/:teacherId/conversations', async (req, res) => {
  try {
    const { teacherId } = req.params;

    // TODO: Substituir por query real do banco
    /*
    const conversations = await Conversation.findAll({
      where: { teacherId },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'name', 'email', 'avatar', 'role']
        },
        {
          model: Message,
          as: 'lastMessage',
          order: [['timestamp', 'DESC']],
          limit: 1
        }
      ],
      order: [['lastMessageAt', 'DESC']]
    });
    */

    // Mock: Buscar conversas do professor
    const teacherConversations = MOCK_CONVERSATIONS.filter(
      c => c.teacherId === parseInt(teacherId)
    );

    const conversationsWithDetails = teacherConversations.map(conv => {
      const student = MOCK_USERS.find(u => u.id === conv.studentId);
      const conversationMessages = MOCK_MESSAGES.filter(
        m => m.conversationId === conv.id
      );
      const lastMessage = conversationMessages[conversationMessages.length - 1];
      const unreadCount = conversationMessages.filter(
        m => !m.read && m.senderRole === 'student'
      ).length;

      return {
        id: conv.id,
        participant: student,
        lastMessage: lastMessage?.message || 'Sem mensagens',
        timestamp: lastMessage?.timestamp || conv.createdAt,
        unread: unreadCount,
        messages: conversationMessages
      };
    });

    console.log(`✅ GET /api/messages/teacher/${teacherId}/conversations - ${conversationsWithDetails.length} conversas`);

    res.json({
      success: true,
      data: conversationsWithDetails,
      count: conversationsWithDetails.length
    });
  } catch (error) {
    console.error('Erro ao buscar conversas do professor:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// GET /api/messages/student/:studentId/conversations
// Listar conversas do aluno
// ═══════════════════════════════════════════════════════════════════════

router.get('/student/:studentId/conversations', async (req, res) => {
  try {
    const { studentId } = req.params;

    // TODO: Substituir por query real do banco
    const studentConversations = MOCK_CONVERSATIONS.filter(
      c => c.studentId === parseInt(studentId)
    );

    const conversationsWithDetails = studentConversations.map(conv => {
      const teacher = MOCK_USERS.find(u => u.id === conv.teacherId);
      const conversationMessages = MOCK_MESSAGES.filter(
        m => m.conversationId === conv.id
      );
      const lastMessage = conversationMessages[conversationMessages.length - 1];
      const unreadCount = conversationMessages.filter(
        m => !m.read && m.senderRole === 'teacher'
      ).length;

      return {
        id: conv.id,
        participant: teacher,
        lastMessage: lastMessage?.message || 'Sem mensagens',
        timestamp: lastMessage?.timestamp || conv.createdAt,
        unread: unreadCount,
        messages: conversationMessages
      };
    });

    console.log(`✅ GET /api/messages/student/${studentId}/conversations - ${conversationsWithDetails.length} conversas`);

    res.json({
      success: true,
      data: conversationsWithDetails,
      count: conversationsWithDetails.length
    });
  } catch (error) {
    console.error('Erro ao buscar conversas do aluno:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// GET /api/messages/conversation/:conversationId
// Buscar mensagens de uma conversa
// ═══════════════════════════════════════════════════════════════════════

router.get('/conversation/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;

    // TODO: Substituir por query real do banco
    /*
    const messages = await Message.findAll({
      where: { conversationId },
      include: [{ model: User, as: 'sender' }],
      order: [['timestamp', 'ASC']]
    });
    */

    const messages = MOCK_MESSAGES.filter(
      m => m.conversationId === parseInt(conversationId)
    );

    console.log(`✅ GET /api/messages/conversation/${conversationId} - ${messages.length} mensagens`);

    res.json({
      success: true,
      data: messages,
      count: messages.length
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// POST /api/messages/send
// Enviar nova mensagem
// ═══════════════════════════════════════════════════════════════════════

router.post('/send',
  [
    body('conversationId').isInt({ min: 1 }).withMessage('ID da conversa deve ser um número positivo'),
    body('senderId').isInt({ min: 1 }).withMessage('ID do remetente deve ser um número positivo'),
    body('message').trim().notEmpty().isLength({ min: 1, max: 500 }).withMessage('Mensagem é obrigatória (máximo 500 caracteres)'),
    body('senderRole').optional().isIn(['student', 'teacher', 'admin']).withMessage('Role do remetente inválido')
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { conversationId, senderId, recipientId, message, senderRole } = req.body;

    // Mock: Criar mensagem
    const newMessage = {
      id: MOCK_MESSAGES.length + 1,
      conversationId: parseInt(conversationId),
      senderId: parseInt(senderId),
      senderRole: senderRole || 'student',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    MOCK_MESSAGES.push(newMessage);

    // Atualizar lastMessageAt da conversa
    const conversation = MOCK_CONVERSATIONS.find(c => c.id === parseInt(conversationId));
    if (conversation) {
      conversation.lastMessageAt = newMessage.timestamp;
    }

    logger.info(`Mensagem enviada na conversa ${conversationId}`, { senderId, messageLength: message.length });

    // Emitir via Socket.io (se configurado)
    if (req.app.io) {
      req.app.io.to(`conversation-${conversationId}`).emit('new-message', newMessage);
    }

    res.status(201).json({
      success: true,
      message: newMessage,
      info: '✅ Mensagem enviada e salva'
    });
  })
);

// ═══════════════════════════════════════════════════════════════════════
// PUT /api/messages/:messageId/read
// Marcar mensagem como lida
// ═══════════════════════════════════════════════════════════════════════

router.put('/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;

    // TODO: Substituir por update real no banco
    /*
    await Message.update(
      { read: true },
      { where: { id: messageId } }
    );
    */

    // Mock: Marcar como lida
    const message = MOCK_MESSAGES.find(m => m.id === parseInt(messageId));
    if (message) {
      message.read = true;
    }

    console.log(`✅ PUT /api/messages/${messageId}/read`);

    res.json({
      success: true,
      message: 'Mensagem marcada como lida'
    });
  } catch (error) {
    console.error('Erro ao marcar mensagem como lida:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════
// POST /api/messages/conversation/create
// Criar nova conversa entre professor e aluno
// ═══════════════════════════════════════════════════════════════════════

router.post('/conversation/create',
  [
    body('teacherId').isInt({ min: 1 }).withMessage('ID do professor deve ser um número positivo'),
    body('studentId').isInt({ min: 1 }).withMessage('ID do aluno deve ser um número positivo')
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { teacherId, studentId } = req.body;

    // Verificar se já existe conversa
    const existing = MOCK_CONVERSATIONS.find(
      c => c.teacherId === parseInt(teacherId) && c.studentId === parseInt(studentId)
    );

    if (existing) {
      logger.info(`Conversa já existe entre professor ${teacherId} e aluno ${studentId}`, { conversationId: existing.id });
      return res.json({
        success: true,
        conversation: existing,
        message: 'Conversa já existe'
      });
    }

    // Criar nova conversa
    const newConversation = {
      id: MOCK_CONVERSATIONS.length + 1,
      teacherId: parseInt(teacherId),
      studentId: parseInt(studentId),
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString()
    };

    MOCK_CONVERSATIONS.push(newConversation);

    logger.info(`Nova conversa criada entre professor ${teacherId} e aluno ${studentId}`, { conversationId: newConversation.id });

    res.status(201).json({
      success: true,
      conversation: newConversation
    });
  })
);

export default router;
