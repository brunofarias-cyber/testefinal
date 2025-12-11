import express from 'express';

const router = express.Router();

// Mock database para entregas
let submissionsDatabase = [
    {
        id: 1,
        student_id: 101,
        project_id: 1,
        project_title: 'Horta Sustentável',
        file_name: 'horta_projeto.pdf',
        file_url: '/uploads/horta_projeto.pdf',
        file_size: 2048000, // bytes
        submitted_at: '2024-11-15T18:30:00Z',
        status: 'submitted',
        feedback: null,
        grade: null,
        created_at: new Date('2024-11-15T18:30:00Z')
    },
    {
        id: 2,
        student_id: 101,
        project_id: 2,
        project_title: 'Robótica com Sucata',
        file_name: 'robotica_relatorio.docx',
        file_url: '/uploads/robotica_relatorio.docx',
        file_size: 1536000,
        submitted_at: '2024-10-20T14:45:00Z',
        status: 'graded',
        feedback: 'Excelente relatório! Parabéns.',
        grade: 8.5,
        created_at: new Date('2024-10-20T14:45:00Z')
    }
];

let nextId = 3;

/**
 * GET /api/submissions/student/:studentId
 * Recupera todas as entregas de um aluno
 */
router.get('/student/:studentId', (req, res) => {
    const { studentId } = req.params;
    const studentSubmissions = submissionsDatabase.filter(s => s.student_id === parseInt(studentId));

    console.log(`📤 GET /api/submissions/student/${studentId} - Recuperando entregas`);

    return res.json({
        success: true,
        data: studentSubmissions,
        count: studentSubmissions.length,
        message: `${studentSubmissions.length} entregas encontradas`
    });
});

/**
 * GET /api/submissions/project/:projectId
 * Recupera todas as entregas de um projeto (para professor)
 */
router.get('/project/:projectId', (req, res) => {
    const { projectId } = req.params;
    const projectSubmissions = submissionsDatabase.filter(s => s.project_id === parseInt(projectId));

    console.log(`📤 GET /api/submissions/project/${projectId} - Recuperando entregas do projeto`);

    return res.json({
        success: true,
        data: projectSubmissions,
        count: projectSubmissions.length,
        message: `${projectSubmissions.length} entregas do projeto`
    });
});

/**
 * GET /api/submissions/stats/:studentId
 * Calcula estatísticas de entregas do aluno
 */
router.get('/stats/:studentId', (req, res) => {
    const { studentId } = req.params;
    const studentSubmissions = submissionsDatabase.filter(s => s.student_id === parseInt(studentId));

    const totalSubmissions = studentSubmissions.length;
    const submitted = studentSubmissions.filter(s => s.status === 'submitted').length;
    const graded = studentSubmissions.filter(s => s.status === 'graded').length;
    const feedback = studentSubmissions.filter(s => s.feedback).length;

    const avgGrade = graded > 0 
        ? (studentSubmissions
            .filter(s => s.grade)
            .reduce((sum, s) => sum + s.grade, 0) / graded).toFixed(1)
        : 0;

    console.log(`📊 GET /api/submissions/stats/${studentId} - Calculando estatísticas`);

    return res.json({
        success: true,
        data: {
            studentId: parseInt(studentId),
            totalSubmissions,
            submitted,
            graded,
            withFeedback: feedback,
            averageGrade: parseFloat(avgGrade),
            submissions: studentSubmissions
        },
        message: 'Estatísticas calculadas com sucesso'
    });
});

/**
 * POST /api/submissions/upload
 * Aluno envia uma entrega
 * 
 * Body:
 * {
 *   studentId: number,
 *   projectId: number,
 *   projectTitle: string,
 *   fileName: string,
 *   fileUrl: string,
 *   fileSize: number (em bytes),
 *   comments?: string
 * }
 */
router.post('/upload', (req, res) => {
    const { studentId, projectId, projectTitle, fileName, fileUrl, fileSize, comments } = req.body;

    // Validação
    if (!studentId || !projectId || !projectTitle || !fileName || !fileUrl || fileSize === undefined) {
        return res.status(400).json({
            success: false,
            error: 'Campos obrigatórios: studentId, projectId, projectTitle, fileName, fileUrl, fileSize'
        });
    }

    // Validar tamanho do arquivo (máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB em bytes
    if (fileSize > maxSize) {
        return res.status(400).json({
            success: false,
            error: `Arquivo muito grande. Máximo: 50MB. Seu arquivo: ${(fileSize / 1024 / 1024).toFixed(2)}MB`
        });
    }

    // Criar novo registro de entrega
    const submission = {
        id: nextId++,
        student_id: parseInt(studentId),
        project_id: parseInt(projectId),
        project_title: projectTitle,
        file_name: fileName,
        file_url: fileUrl,
        file_size: fileSize,
        submitted_at: new Date().toISOString(),
        status: 'submitted',
        comments: comments || null,
        feedback: null,
        grade: null,
        created_at: new Date()
    };

    submissionsDatabase.push(submission);

    console.log(`✅ POST /api/submissions/upload - Entrega enviada por aluno ${studentId}`);
    console.log(`   Arquivo: ${fileName} | Tamanho: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);

    // 🔔 Socket.io - Notificar o aluno
    if (req.app.io) {
        req.app.io.to(`student-${studentId}`).emit('submission-uploaded', {
            submissionId: submission.id,
            projectTitle,
            fileName,
            fileSize,
            timestamp: new Date()
        });

        console.log(`📡 Socket.io enviado para student-${studentId}`);
    }

    return res.status(201).json({
        success: true,
        data: submission,
        message: `Entrega enviada com sucesso! ${fileName} foi salvo(a).`
    });
});

/**
 * GET /api/submissions/:submissionId
 * Recupera detalhes de uma entrega específica
 */
router.get('/:submissionId', (req, res) => {
    const { submissionId } = req.params;
    const submission = submissionsDatabase.find(s => s.id === parseInt(submissionId));

    if (!submission) {
        return res.status(404).json({
            success: false,
            error: 'Entrega não encontrada'
        });
    }

    console.log(`📤 GET /api/submissions/${submissionId} - Recuperando entrega`);

    return res.json({
        success: true,
        data: submission,
        message: 'Entrega recuperada com sucesso'
    });
});

/**
 * PUT /api/submissions/:submissionId/feedback
 * Professor adiciona feedback e/ou nota
 * 
 * Body:
 * {
 *   grade?: number (0-10),
 *   feedback?: string,
 *   status?: 'submitted' | 'graded'
 * }
 */
router.put('/:submissionId/feedback', (req, res) => {
    const { submissionId } = req.params;
    const { grade, feedback, status } = req.body;

    const submission = submissionsDatabase.find(s => s.id === parseInt(submissionId));

    if (!submission) {
        return res.status(404).json({
            success: false,
            error: 'Entrega não encontrada'
        });
    }

    // Validações
    if (grade !== undefined) {
        if (grade < 0 || grade > 10) {
            return res.status(400).json({
                success: false,
                error: 'Nota deve estar entre 0 e 10'
            });
        }
        submission.grade = grade;
    }

    if (feedback) {
        if (feedback.length > 1000) {
            return res.status(400).json({
                success: false,
                error: 'Feedback muito longo (máximo 1000 caracteres)'
            });
        }
        submission.feedback = feedback;
    }

    if (status && ['submitted', 'graded'].includes(status)) {
        submission.status = status;
    }

    submission.updated_at = new Date();

    console.log(`✏️ PUT /api/submissions/${submissionId}/feedback - Feedback adicionado`);

    // 🔔 Socket.io - Notificar o aluno
    if (req.app.io) {
        req.app.io.to(`student-${submission.student_id}`).emit('submission-feedback', {
            submissionId: submission.id,
            projectTitle: submission.project_title,
            grade: submission.grade,
            feedback: submission.feedback,
            status: submission.status,
            timestamp: new Date()
        });

        console.log(`📡 Socket.io enviado para student-${submission.student_id}`);
    }

    return res.json({
        success: true,
        data: submission,
        message: 'Feedback adicionado com sucesso'
    });
});

/**
 * DELETE /api/submissions/:submissionId
 * Deleta uma entrega
 */
router.delete('/:submissionId', (req, res) => {
    const { submissionId } = req.params;
    const index = submissionsDatabase.findIndex(s => s.id === parseInt(submissionId));

    if (index === -1) {
        return res.status(404).json({
            success: false,
            error: 'Entrega não encontrada'
        });
    }

    const deleted = submissionsDatabase.splice(index, 1)[0];

    console.log(`🗑️ DELETE /api/submissions/${submissionId} - Entrega deletada`);

    return res.json({
        success: true,
        data: deleted,
        message: 'Entrega deletada com sucesso'
    });
});

/**
 * POST /api/submissions/:submissionId/download
 * Simula download da entrega (em produção, retornaria arquivo binário)
 */
router.post('/:submissionId/download', (req, res) => {
    const { submissionId } = req.params;
    const submission = submissionsDatabase.find(s => s.id === parseInt(submissionId));

    if (!submission) {
        return res.status(404).json({
            success: false,
            error: 'Entrega não encontrada'
        });
    }

    console.log(`⬇️ POST /api/submissions/${submissionId}/download - Download iniciado`);
    console.log(`   Arquivo: ${submission.file_name}`);

    return res.json({
        success: true,
        data: {
            fileName: submission.file_name,
            fileUrl: submission.file_url,
            fileSize: submission.file_size,
            downloadUrl: `${submission.file_url}?download=true`
        },
        message: 'Download iniciado'
    });
});

export default router;
