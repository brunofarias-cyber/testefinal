import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { handleValidationErrors } from '../middleware/validators.js';
import logger from '../utils/logger.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { Grade, User, Project } from '../models/index.js';

const router = express.Router();

// Aplicar rate limiter
router.use(apiLimiter);

/**
 * GET /api/grades/student/:studentId
 * Recupera todas as notas de um aluno
 */
router.get('/student/:studentId', asyncHandler(async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // Buscar notas do aluno no banco de dados
        const studentGrades = await Grade.findAll({
            where: { studentId },
            include: [
                { model: User, as: 'teacher', attributes: ['id', 'name', 'email'] },
                { model: Project, as: 'project', attributes: ['id', 'title'] }
            ],
            order: [['gradedAt', 'DESC']]
        });

        res.status(200).json({ 
            success: true, 
            data: studentGrades,
            count: studentGrades.length
        });
    } catch (error) {
        logger.error('Erro ao recuperar notas do aluno', { error: error.message });
        res.status(500).json({ success: false, error: error.message });
    }
}));

/**
 * POST /api/grades/create
 * Professor cria uma nota para um aluno
 */
router.post('/create', 
  [
    body('studentId').notEmpty().withMessage('ID do aluno é obrigatório'),
    body('projectId').notEmpty().withMessage('ID do projeto é obrigatório'),
    body('finalGrade').isFloat({ min: 0, max: 10 }).withMessage('Nota deve estar entre 0 e 10'),
    body('teacherId').notEmpty().withMessage('ID do professor é obrigatório'),
    body('feedback').optional().isLength({ max: 500 }).withMessage('Feedback não pode exceder 500 caracteres'),
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { 
      studentId, 
      projectId, 
      finalGrade, 
      feedback, 
      rubricBreakdown,
      teacherId
    } = req.body;

    try {
      // Verificar se já existe uma nota para este aluno/projeto
      let grade = await Grade.findOne({
        where: { studentId, projectId }
      });

      if (grade) {
        // Atualizar nota existente
        grade.finalGrade = finalGrade;
        grade.feedback = feedback || grade.feedback;
        grade.rubricBreakdown = rubricBreakdown || grade.rubricBreakdown;
        grade.teacherId = teacherId;
        grade.gradedAt = new Date();
        await grade.save();
        
        logger.info('Nota atualizada com sucesso', { studentId, projectId, finalGrade });
      } else {
        // Criar nova nota
        grade = await Grade.create({
          studentId,
          projectId,
          finalGrade,
          feedback: feedback || '',
          rubricBreakdown: rubricBreakdown || [],
          teacherId,
          gradedAt: new Date()
        });

        logger.info('Nota criada com sucesso', { studentId, projectId, finalGrade });
      }

      // 🔔 Emitir evento via Socket.io se disponível
      if (req.app.io) {
        req.app.io.to(`student-${studentId}`).emit('grade-updated', {
          projectId,
          finalGrade,
          feedback: feedback || '',
          timestamp: new Date()
        });
        logger.info(`Notificação de nota enviada para aluno ${studentId}`);
      }

      res.status(201).json({ 
        success: true, 
        data: grade,
        message: 'Nota criada/atualizada com sucesso'
      });
    } catch (error) {
      logger.error('Erro ao criar/atualizar nota', { error: error.message });
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  })
);

/**
 * PUT /api/grades/:id
 * Professor edita uma nota existente
 */
router.put('/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('ID da nota deve ser um número válido'),
    body('finalGrade').optional().isFloat({ min: 0, max: 10 }).withMessage('Nota deve estar entre 0 e 10'),
    body('feedback').optional().isLength({ max: 500 }).withMessage('Feedback não pode exceder 500 caracteres'),
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { finalGrade, feedback } = req.body;

    try {
      const grade = await Grade.findByPk(id);
      
      if (!grade) {
        logger.warn(`Nota não encontrada: ${id}`);
        return res.status(404).json({ success: false, error: 'Nota não encontrada' });
      }

      if (finalGrade !== undefined) grade.finalGrade = finalGrade;
      if (feedback !== undefined) grade.feedback = feedback;
      grade.gradedAt = new Date();
      
      await grade.save();

      logger.info('Nota atualizada com sucesso', { id, finalGrade });

      // 🔔 Notificar aluno da atualização
      if (req.app.io) {
        req.app.io.to(`student-${grade.studentId}`).emit('grade-updated', {
          projectId: grade.projectId,
          finalGrade: grade.finalGrade,
          feedback: grade.feedback,
          timestamp: new Date()
        });
        logger.info(`Notificação de atualização enviada para aluno ${grade.studentId}`);
      }

      res.status(200).json({ 
        success: true, 
        data: grade,
        message: 'Nota atualizada com sucesso'
      });
    } catch (error) {
      logger.error('Erro ao atualizar nota', { error: error.message });
      res.status(500).json({ success: false, error: error.message });
    }
  })
);

/**
 * DELETE /api/grades/:id
 * Professor deleta uma nota
 */
router.delete('/:id', asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const grade = await Grade.findByPk(id);
        
        if (!grade) {
            return res.status(404).json({ success: false, error: 'Nota não encontrada' });
        }

        await grade.destroy();

        logger.info('Nota deletada com sucesso', { id });

        res.status(200).json({ 
            success: true, 
            message: 'Nota deletada com sucesso'
        });
    } catch (error) {
        logger.error('Erro ao deletar nota', { error: error.message });
        res.status(500).json({ success: false, error: error.message });
    }
}));

/**
 * GET /api/grades/project/:projectId
 * Recupera todas as notas de um projeto
 */
router.get('/project/:projectId', asyncHandler(async (req, res) => {
    try {
        const { projectId } = req.params;
        
        const grades = await Grade.findAll({
            where: { projectId },
            include: [
                { model: User, as: 'student', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'teacher', attributes: ['id', 'name'] }
            ],
            order: [['finalGrade', 'DESC']]
        });

        res.status(200).json({ 
            success: true, 
            data: grades,
            count: grades.length
        });
    } catch (error) {
        logger.error('Erro ao recuperar notas do projeto', { error: error.message });
        res.status(500).json({ success: false, error: error.message });
    }
}));

export default router;
