import express from 'express';

const router = express.Router();

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
router.post('/create', async (req, res) => {
    try {
        const { 
            studentId, 
            projectId, 
            grade, 
            feedback, 
            rubricBreakdown,
            teacherName,
            projectTitle
        } = req.body;

        // Validação básica
        if (!studentId || !projectId || grade === undefined) {
            return res.status(400).json({ 
                success: false, 
                error: 'studentId, projectId e grade são obrigatórios' 
            });
        }

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
            console.log(`✅ Notificação de nota enviada para aluno ${studentId}`);
        }

        res.status(201).json({ 
            success: true, 
            data: newGrade,
            message: 'Nota criada com sucesso e aluno notificado em tempo real'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * PUT /api/grades/:gradeId
 * Professor edita uma nota existente
 */
router.put('/:gradeId', async (req, res) => {
    try {
        const { gradeId } = req.params;
        const { grade, feedback } = req.body;

        const gradeIndex = gradesDatabase.findIndex(g => g.id === parseInt(gradeId));
        
        if (gradeIndex === -1) {
            return res.status(404).json({ success: false, error: 'Nota não encontrada' });
        }

        const gradeRecord = gradesDatabase[gradeIndex];
        gradeRecord.final_grade = grade ?? gradeRecord.final_grade;
        gradeRecord.feedback = feedback ?? gradeRecord.feedback;
        gradeRecord.updated_at = new Date();

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
        }

        res.status(200).json({ 
            success: true, 
            data: gradeRecord,
            message: 'Nota atualizada com sucesso'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

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
