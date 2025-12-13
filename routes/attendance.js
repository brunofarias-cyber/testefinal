import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { handleValidationErrors, asyncHandler } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Aplicar rate limiter
router.use(apiLimiter);

// Mock database para presença
let attendanceDatabase = [
    {
        id: 1,
        student_id: 101,
        class_id: 1,
        class_name: 'Biologia - Turma A',
        date: '2024-12-10',
        status: 'presente',
        teacher_name: 'Prof. Ana Silva',
        created_at: new Date()
    },
    {
        id: 2,
        student_id: 101,
        class_id: 1,
        class_name: 'Biologia - Turma A',
        date: '2024-12-09',
        status: 'presente',
        teacher_name: 'Prof. Ana Silva',
        created_at: new Date()
    },
    {
        id: 3,
        student_id: 101,
        class_id: 2,
        class_name: 'Matemática - Turma A',
        date: '2024-12-10',
        status: 'falta',
        teacher_name: 'Prof. Roberto Lima',
        created_at: new Date()
    }
];

let nextId = 4;

/**
 * GET /api/attendance/student/:studentId
 * Recupera o histórico de presença de um aluno
 */
router.get('/student/:studentId',
  param('studentId').isInt({ min: 1 }).withMessage('ID do aluno deve ser um número positivo'),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const studentAttendance = attendanceDatabase.filter(a => a.student_id === parseInt(studentId));
    
    logger.info(`Recuperando presença do aluno ${studentId}`, { count: studentAttendance.length });

    return res.json({
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
  param('classId').isInt({ min: 1 }).withMessage('ID da turma deve ser um número positivo'),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { classId } = req.params;
    const classAttendance = attendanceDatabase.filter(a => a.class_id === parseInt(classId));
    
    logger.info(`Recuperando presença da turma ${classId}`, { count: classAttendance.length });

    return res.json({
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
  param('studentId').isInt({ min: 1 }).withMessage('ID do aluno deve ser um número positivo'),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const studentAttendance = attendanceDatabase.filter(a => a.student_id === parseInt(studentId));
    
    const totalClasses = studentAttendance.length;
    const presences = studentAttendance.filter(a => a.status === 'presente').length;
    const absences = studentAttendance.filter(a => a.status === 'falta').length;
    const delays = studentAttendance.filter(a => a.status === 'atraso').length;
    
    const attendancePercentage = totalClasses > 0 ? ((presences / totalClasses) * 100).toFixed(1) : 0;

    logger.info(`Estatísticas de presença calculadas para aluno ${studentId}`, { 
      totalClasses, 
      attendancePercentage 
    });

    return res.json({
        success: true,
        data: {
            studentId: parseInt(studentId),
            totalClasses,
            presences,
            absences,
            delays,
            attendancePercentage: parseFloat(attendancePercentage),
            records: studentAttendance
        },
        message: 'Estatísticas calculadas com sucesso'
    });
  }));

/**
 * POST /api/attendance/mark
 * Professor marca presença de um aluno
 * 
 * Body:
 * {
 *   studentId: number,
 *   classId: number,
 *   className: string,
 *   status: 'presente' | 'falta' | 'atraso',
 *   teacherName: string,
 *   notes?: string
 * }
 */
router.post('/mark',
  [
    body('studentId').isInt({ min: 1 }).withMessage('ID do aluno deve ser um número positivo'),
    body('classId').isInt({ min: 1 }).withMessage('ID da turma deve ser um número positivo'),
    body('className').trim().notEmpty().withMessage('Nome da turma é obrigatório'),
    body('status').isIn(['presente', 'falta', 'atraso']).withMessage('Status deve ser: presente, falta ou atraso'),
    body('teacherName').trim().notEmpty().withMessage('Nome do professor é obrigatório'),
    body('notes').optional().isLength({ max: 200 }).withMessage('Notas não podem exceder 200 caracteres')
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { studentId, classId, className, status, teacherName, notes } = req.body;

    // Criar novo registro
    const attendanceRecord = {
        id: nextId++,
        student_id: parseInt(studentId),
        class_id: parseInt(classId),
        class_name: className,
        date: new Date().toISOString().split('T')[0],
        status: status,
        teacher_name: teacherName,
        notes: notes || null,
        created_at: new Date()
    };

    attendanceDatabase.push(attendanceRecord);
    logger.info('Presença marcada', { studentId, classId, status });

    // 🔔 Socket.io - Notificar o aluno em tempo real
    if (req.app.io) {
        req.app.io.to(`student-${studentId}`).emit('attendance-marked', {
            classId,
            className,
            status,
            teacher: teacherName,
            notes: notes || null,
            timestamp: new Date()
        });
        logger.info(`Notificação de presença enviada para aluno ${studentId}`);
    }

    return res.status(201).json({
        success: true,
        data: attendanceRecord,
        message: `Presença marcada com sucesso! ${teacherName} registrou ${status} para a aula de ${className}`
    });
  })
);

/**
 * PUT /api/attendance/:attendanceId
 * Atualiza um registro de presença
 */
router.put('/:attendanceId', (req, res) => {
    const { attendanceId } = req.params;
    const { status, notes } = req.body;

    const attendance = attendanceDatabase.find(a => a.id === parseInt(attendanceId));

    if (!attendance) {
        return res.status(404).json({
            success: false,
            error: 'Registro de presença não encontrado'
        });
    }

    if (status && !['presente', 'falta', 'atraso'].includes(status)) {
        return res.status(400).json({
            success: false,
            error: 'Status inválido. Use: presente, falta ou atraso'
        });
    }

    // Atualizar
    if (status) attendance.status = status;
    if (notes !== undefined) attendance.notes = notes;
    attendance.updated_at = new Date();

    console.log(`✏️ PUT /api/attendance/${attendanceId} - Presença atualizada`);

    // 🔔 Socket.io - Notificar
    if (req.app.io) {
        req.app.io.to(`student-${attendance.student_id}`).emit('attendance-updated', {
            classId: attendance.class_id,
            className: attendance.class_name,
            status: attendance.status,
            teacher: attendance.teacher_name,
            timestamp: new Date()
        });
    }

    return res.json({
        success: true,
        data: attendance,
        message: 'Presença atualizada com sucesso'
    });
});

/**
 * DELETE /api/attendance/:attendanceId
 * Deleta um registro de presença
 */
router.delete('/:attendanceId', (req, res) => {
    const { attendanceId } = req.params;
    const index = attendanceDatabase.findIndex(a => a.id === parseInt(attendanceId));

    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Registro de presença não encontrado'
        });
    }

    const deleted = attendanceDatabase.splice(index, 1)[0];

    console.log(`🗑️ DELETE /api/attendance/${attendanceId} - Presença deletada`);

    return res.json({
        success: true,
        data: deleted,
        message: 'Presença deletada com sucesso'
    });
});

export default router;
