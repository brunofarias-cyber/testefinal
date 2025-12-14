import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { handleValidationErrors } from '../middleware/validators.js';
import logger from '../utils/logger.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Aplicar rate limiter
router.use(apiLimiter);

// Mock data para grades (será substituído por banco de dados)
const gradesDatabase = [];

/**
 * GET /api/grades/student/:studentId
 * Recupera todas as notas de um aluno
 */
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        
        // Buscar notas do aluno no "banco de dados"
        const studentGrades = gradesDatabase.filter(g => 
            g.student_id === parseInt(studentId)
        );

        res.status(200).json({ 
            success: true, 
            data: studentGrades,
            count: studentGrades.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/grades/create
 * Professor cria/atualiza uma nota para um aluno
 */
router.post('/create', 
  [
    body('studentId').isInt({ min: 1 }).withMessage('ID do aluno deve ser um número positivo'),
    body('projectId').isInt({ min: 1 }).withMessage('ID do projeto deve ser um número positivo'),
    body('grade').isFloat({ min: 0, max: 10 }).withMessage('Nota deve estar entre 0 e 10'),
    body('feedback').optional().isLength({ max: 500 }).withMessage('Feedback não pode exceder 500 caracteres'),
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { 
      studentId, 
      projectId, 
      grade, 
      feedback, 
      rubricBreakdown,
      teacherName,
      projectTitle
    } = req.body;

    try {
      // Criar novo registro de nota
      const newGrade = {
        id: gradesDatabase.length + 1,
        student_id: studentId,
        project_id: projectId,
        final_grade: grade,
        feedback: feedback || '',
        rubric_breakdown: rubricBreakdown || [],
        teacher_name: teacherName || 'Professor',
        project_title: projectTitle || 'Projeto',
        created_at: new Date(),
        updated_at: new Date()
      };

      gradesDatabase.push(newGrade);
      
      logger.info('Nota criada com sucesso', { studentId, grade });

      // 🔔 Emitir evento via Socket.io se disponível
      if (req.app.io) {
        req.app.io.to(`student-${studentId}`).emit('grade-updated', {
          projectId,
          projectTitle: projectTitle || 'Projeto',
          grade,
          feedback,
          teacher: teacherName || 'Professor',
          timestamp: new Date()
        });
        logger.info(`Notificação de nota enviada para aluno ${studentId}`);
      }

      return res.status(201).json({ 
        success: true, 
        data: newGrade,
        message: 'Nota criada com sucesso e aluno notificado em tempo real'
      });
    } catch (error) {
      logger.error('Erro ao criar nota', { error: error.message });
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  })
);

/**
 * PUT /api/grades/:gradeId
 * Professor edita uma nota existente
 */
router.put('/:gradeId',
  [
    param('gradeId').isInt({ min: 1 }).withMessage('ID da nota deve ser um número válido'),
    body('grade').optional().isFloat({ min: 0, max: 10 }).withMessage('Nota deve estar entre 0 e 10'),
    body('feedback').optional().isLength({ max: 500 }).withMessage('Feedback não pode exceder 500 caracteres'),
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { gradeId } = req.params;
    const { grade, feedback } = req.body;

    try {
      const gradeIndex = gradesDatabase.findIndex(g => g.id === parseInt(gradeId));
      
      if (gradeIndex === -1) {
        logger.warn(`Nota não encontrada: ${gradeId}`);
        return res.status(404).json({ success: false, error: 'Nota não encontrada' });
      }

      const gradeRecord = gradesDatabase[gradeIndex];
      gradeRecord.final_grade = grade ?? gradeRecord.final_grade;
      gradeRecord.feedback = feedback ?? gradeRecord.feedback;
      gradeRecord.updated_at = new Date();

      logger.info('Nota atualizada com sucesso', { gradeId, newGrade: grade });

      // 🔔 Notificar aluno da atualização
      if (req.app.io) {
        req.app.io.to(`student-${gradeRecord.student_id}`).emit('grade-updated', {
          projectId: gradeRecord.project_id,
          projectTitle: gradeRecord.project_title,
          grade: gradeRecord.final_grade,
          feedback: gradeRecord.feedback,
          teacher: gradeRecord.teacher_name,
          timestamp: new Date()
        });
        logger.info(`Notificação de atualização enviada para aluno ${gradeRecord.student_id}`);
      }

      return res.status(200).json({ 
        success: true, 
        data: gradeRecord,
        message: 'Nota atualizada com sucesso'
      });
    } catch (error) {
      logger.error('Erro ao atualizar nota', { error: error.message });
      return res.status(500).json({ success: false, error: error.message });
    }
  })
);

/**
 * DELETE /api/grades/:gradeId
 * Professor deleta uma nota
 */
router.delete('/:gradeId', async (req, res) => {
    try {
        const { gradeId } = req.params;

        const gradeIndex = gradesDatabase.findIndex(g => g.id === parseInt(gradeId));
        
        if (gradeIndex === -1) {
            return res.status(404).json({ success: false, error: 'Nota não encontrada' });
        }

        const deletedGrade = gradesDatabase.splice(gradeIndex, 1)[0];

        res.status(200).json({ 
            success: true, 
            data: deletedGrade,
            message: 'Nota deletada com sucesso'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
