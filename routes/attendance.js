import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { handleValidationErrors } from '../middleware/validators.js';
import logger from '../utils/logger.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import models from '../models/index.js';
const { Attendance, User, Class } = models;

const router = express.Router();

// Aplicar rate limiter
router.use(apiLimiter);

/**
 * GET /api/attendance/student/:studentId
 * Recupera o histórico de presença de um aluno
 */
router.get('/student/:studentId',
  param('studentId').notEmpty().withMessage('ID do aluno é obrigatório'),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    
    const studentAttendance = await Attendance.findAll({
        where: { studentId },
        include: [
            { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
            { model: Class, as: 'class', attributes: ['id', 'name'] }
        ],
        order: [['date', 'DESC']]
    });
    
    logger.info(`Recuperando presença do aluno ${studentId}`, { count: studentAttendance.length });

    res.json({
        success: true,
        data: studentAttendance,
        count: studentAttendance.length,
        message: `${studentAttendance.length} registros de presença encontrados`
    });
  })
);

/**
 * GET /api/attendance/class/:classId
 * Recupera a presença de toda uma turma
 */
router.get('/class/:classId',
  param('classId').notEmpty().withMessage('ID da turma é obrigatório'),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { classId } = req.params;
    
    const classAttendance = await Attendance.findAll({
        where: { classId },
        include: [
            { model: User, as: 'student', attributes: ['id', 'name', 'email'] }
        ],
        order: [['date', 'DESC']]
    });
    
    logger.info(`Recuperando presença da turma ${classId}`, { count: classAttendance.length });

    res.json({
        success: true,
        data: classAttendance,
        count: classAttendance.length,
        message: `${classAttendance.length} registros encontrados para a turma`
    });
  })
);

/**
 * GET /api/attendance/stats/:studentId
 * Calcula estatísticas de presença do aluno
 */
router.get('/stats/:studentId',
  param('studentId').notEmpty().withMessage('ID do aluno é obrigatório'),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    
    const studentAttendance = await Attendance.findAll({
        where: { studentId },
        attributes: ['id', 'status', 'date']
    });
    
    const totalClasses = studentAttendance.length;
    const presences = studentAttendance.filter(a => a.status === 'presente').length;
    const absences = studentAttendance.filter(a => a.status === 'falta').length;
    const delays = studentAttendance.filter(a => a.status === 'atraso').length;
    
    const attendancePercentage = totalClasses > 0 ? ((presences / totalClasses) * 100).toFixed(1) : 0;

    logger.info(`Estatísticas de presença calculadas para aluno ${studentId}`, { 
      totalClasses, 
      attendancePercentage 
    });

    res.json({
        success: true,
        data: {
            studentId,
            totalClasses,
            presences,
            absences,
            delays,
            attendancePercentage: parseFloat(attendancePercentage),
            records: studentAttendance
        },
        message: 'Estatísticas calculadas com sucesso'
    });
  })
);

/**
 * POST /api/attendance/mark
 * Professor marca presença de um aluno
 * 
 * Body:
 * {
 *   studentId: string (UUID),
 *   classId: string (UUID),
 *   status: 'presente' | 'falta' | 'atraso',
 *   notes?: string
 * }
 */
router.post('/mark',
  [
    body('studentId').notEmpty().withMessage('ID do aluno é obrigatório'),
    body('classId').notEmpty().withMessage('ID da turma é obrigatório'),
    body('status').isIn(['presente', 'falta', 'atraso']).withMessage('Status deve ser: presente, falta ou atraso'),
    body('notes').optional().isLength({ max: 200 }).withMessage('Notas não podem exceder 200 caracteres')
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { studentId, classId, status, notes } = req.body;

    try {
      // Verificar se já existe registro para este aluno/turma/data
      const today = new Date().toISOString().split('T')[0];
      
      let attendance = await Attendance.findOne({
        where: { studentId, classId, date: today }
      });

      if (attendance) {
        // Atualizar registro existente
        attendance.status = status;
        attendance.notes = notes || attendance.notes;
        await attendance.save();
        logger.info('Presença atualizada', { studentId, classId, status });
      } else {
        // Criar novo registro
        attendance = await Attendance.create({
          studentId,
          classId,
          status,
          notes: notes || null,
          date: new Date()
        });
        logger.info('Presença marcada', { studentId, classId, status });
      }

      // 🔔 Socket.io - Notificar o aluno em tempo real
      if (req.app.io) {
        req.app.io.to(`student-${studentId}`).emit('attendance-marked', {
          classId,
          status,
          notes: notes || null,
          timestamp: new Date()
        });
        logger.info(`Notificação de presença enviada para aluno ${studentId}`);
      }

      res.status(201).json({
        success: true,
        data: attendance,
        message: `Presença marcada com sucesso como ${status}`
      });
    } catch (error) {
      logger.error('Erro ao marcar presença', { error: error.message });
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  })
);

/**
 * PUT /api/attendance/:id
 * Atualiza um registro de presença
 */
router.put('/:id', 
  [
    body('status').optional().isIn(['presente', 'falta', 'atraso']).withMessage('Status inválido'),
    body('notes').optional().isLength({ max: 200 }).withMessage('Notas não podem exceder 200 caracteres')
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    try {
      const attendance = await Attendance.findByPk(id);

      if (!attendance) {
        return res.status(404).json({
          success: false,
          error: 'Registro de presença não encontrado'
        });
      }

      if (status) attendance.status = status;
      if (notes !== undefined) attendance.notes = notes;
      
      await attendance.save();
      
      logger.info(`Presença atualizada: ${id}`, { status });

      // 🔔 Socket.io - Notificar
      if (req.app.io) {
        req.app.io.to(`student-${attendance.studentId}`).emit('attendance-updated', {
          classId: attendance.classId,
          status: attendance.status,
          timestamp: new Date()
        });
      }

      res.json({
        success: true,
        data: attendance,
        message: 'Presença atualizada com sucesso'
      });
    } catch (error) {
      logger.error('Erro ao atualizar presença', { error: error.message });
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  })
);

/**
 * DELETE /api/attendance/:id
 * Deleta um registro de presença
 */
router.delete('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
      const attendance = await Attendance.findByPk(id);

      if (!attendance) {
        return res.status(404).json({
          success: false,
          error: 'Registro de presença não encontrado'
        });
      }

      await attendance.destroy();
      
      logger.info(`Presença deletada: ${id}`);

      res.json({
        success: true,
        message: 'Presença deletada com sucesso'
      });
    } catch (error) {
      logger.error('Erro ao deletar presença', { error: error.message });
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
}));

export default router;
