import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { handleValidationErrors } from '../middleware/validators.js';
import logger from '../utils/logger.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import models from '../models/index.js';
const { TeamMessage, Team, User } = models;

const router = express.Router();

// Aplicar rate limiter
router.use(apiLimiter);

/**
 * GET /api/team-messages/:teamId
 * Get team messages com paginação
 */
router.get(
  '/:teamId',
  param('teamId').isInt().toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('offset').optional().isInt({ min: 0 }).toInt(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { teamId } = req.params;
    const limit = req.query.limit || 50;
    const offset = req.query.offset || 0;

    // Verificar se team existe
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team não encontrado' });
    }

    // Buscar mensagens com paginação
    const { rows: messages, count: total } = await TeamMessage.findAndCountAll({
      where: { teamId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'role', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.json({
      messages: messages.reverse(),
      pagination: {
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit)
      }
    });
  })
);

/**
 * POST /api/team-messages
 * Create team message
 */
router.post(
  '/',
  body('teamId').isInt(),
  body('senderId').isInt(),
  body('message').trim().notEmpty(),
  body('messageType').optional().isIn(['text', 'notification', 'system']),
  body('metadata').optional().isObject(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { teamId, senderId, message, messageType = 'text', metadata } = req.body;

    // Verificar se team existe
    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team não encontrado' });
    }

    // Verificar se user existe
    const sender = await User.findByPk(senderId);
    if (!sender) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Criar mensagem
    const teamMessage = await TeamMessage.create({
      teamId,
      senderId,
      senderName: sender.name,
      message,
      messageType,
      metadata
    });

    // Incluir sender info
    const messageWithSender = await TeamMessage.findByPk(teamMessage.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'email', 'role', 'avatar']
        }
      ]
    });

    logger.info(`📝 Mensagem criada para team ${teamId} de usuário ${senderId}`);
    res.status(201).json(messageWithSender);
  })
);

/**
 * PATCH /api/team-messages/:messageId/read
 * Mark message as read
 */
router.patch(
  '/:messageId/read',
  param('messageId').isInt().toInt(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await TeamMessage.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }

    // Atualizar status de leitura
    await message.update({
      isRead: true,
      readAt: new Date()
    });

    res.json(message);
  })
);

/**
 * DELETE /api/team-messages/:messageId
 * Delete team message
 */
router.delete(
  '/:messageId',
  param('messageId').isInt().toInt(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await TeamMessage.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Mensagem não encontrada' });
    }

    // Só o criador ou admin pode deletar
    // TODO: Adicionar verificação de permissão baseada em req.user

    await message.destroy();
    logger.info(`🗑️ Mensagem ${messageId} deletada`);
    res.json({ success: true });
  })
);

/**
 * GET /api/team-messages/:teamId/unread
 * Get unread message count
 */
router.get(
  '/:teamId/unread',
  param('teamId').isInt().toInt(),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { teamId } = req.params;

    const unreadCount = await TeamMessage.count({
      where: {
        teamId,
        isRead: false
      }
    });

    res.json({ unreadCount });
  })
);

export default router;
