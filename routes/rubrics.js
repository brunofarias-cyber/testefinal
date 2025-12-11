import express from 'express';

const router = express.Router();

// Mock Database - Rubricas de Avaliação
let rubricsDatabase = [
    {
        id: 1,
        projectId: 1,
        projectTitle: 'Horta Sustentável',
        criteria: [
            {
                id: 1,
                name: 'Planejamento',
                maxPoints: 25,
                description: 'Qualidade do planejamento do projeto'
            },
            {
                id: 2,
                name: 'Execução',
                maxPoints: 25,
                description: 'Qualidade da execução do projeto'
            },
            {
                id: 3,
                name: 'Documentação',
                maxPoints: 25,
                description: 'Qualidade da documentação e registros'
            },
            {
                id: 4,
                name: 'Apresentação',
                maxPoints: 25,
                description: 'Qualidade da apresentação final'
            }
        ],
        totalMaxPoints: 100,
        createdAt: new Date().toISOString(),
        createdBy: 'Prof. Ana Silva'
    }
];

let rubricScoresDatabase = [
    {
        id: 1,
        rubricId: 1,
        studentId: 101,
        projectId: 1,
        projectTitle: 'Horta Sustentável',
        studentName: 'João Silva',
        scores: [
            { criteriaId: 1, criteriaName: 'Planejamento', points: 23, feedback: 'Excelente planejamento' },
            { criteriaId: 2, criteriaName: 'Execução', points: 24, feedback: 'Executado com precisão' },
            { criteriaId: 3, criteriaName: 'Documentação', points: 22, feedback: 'Bem documentado' },
            { criteriaId: 4, criteriaName: 'Apresentação', points: 23, feedback: 'Apresentação clara' }
        ],
        totalPoints: 92,
        percentage: 92,
        status: 'graded',
        evaluatedAt: new Date().toISOString(),
        evaluatedBy: 'Prof. Ana Silva',
        comments: 'Trabalho excepcional, parabéns!'
    }
];

/**
 * GET /api/rubrics/project/:projectId
 * Obter rúbrica de um projeto
 */
router.get('/project/:projectId', (req, res) => {
    try {
        const { projectId } = req.params;
        const rubric = rubricsDatabase.find(r => r.projectId === parseInt(projectId));

        if (!rubric) {
            return res.status(404).json({
                success: false,
                message: 'Rúbrica não encontrada'
            });
        }

        res.json({
            success: true,
            data: rubric
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar rúbrica',
            error: error.message
        });
    }
});

/**
 * GET /api/rubrics
 * Listar todas as rúbricas
 */
router.get('/', (req, res) => {
    try {
        res.json({
            success: true,
            data: rubricsDatabase,
            total: rubricsDatabase.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao listar rúbricas',
            error: error.message
        });
    }
});

/**
 * POST /api/rubrics/create
 * Criar nova rúbrica
 */
router.post('/create', (req, res) => {
    try {
        const {
            projectId,
            projectTitle,
            criteria,
            createdBy
        } = req.body;

        // Validações
        if (!projectId || !projectTitle) {
            return res.status(400).json({
                success: false,
                message: 'projectId e projectTitle são obrigatórios'
            });
        }

        if (!Array.isArray(criteria) || criteria.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Ao menos 1 critério é obrigatório'
            });
        }

        // Validar critérios
        for (const criterion of criteria) {
            if (!criterion.name || criterion.maxPoints === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Cada critério deve ter name e maxPoints'
                });
            }
            if (criterion.maxPoints < 0 || criterion.maxPoints > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'maxPoints deve estar entre 0 e 100'
                });
            }
        }

        // Calcular total de pontos
        const totalMaxPoints = criteria.reduce((sum, c) => sum + c.maxPoints, 0);

        if (totalMaxPoints !== 100) {
            return res.status(400).json({
                success: false,
                message: 'Total de pontos deve ser exatamente 100',
                currentTotal: totalMaxPoints
            });
        }

        // Adicionar IDs aos critérios
        const criteriaWithIds = criteria.map((c, idx) => ({
            id: idx + 1,
            name: c.name,
            maxPoints: c.maxPoints,
            description: c.description || ''
        }));

        // Criar rúbrica
        const newRubric = {
            id: rubricsDatabase.length + 1,
            projectId,
            projectTitle,
            criteria: criteriaWithIds,
            totalMaxPoints: 100,
            createdAt: new Date().toISOString(),
            createdBy: createdBy || 'Professor'
        };

        rubricsDatabase.push(newRubric);

        // Socket.io emit
        req.app.io.emit('rubric-created', {
            rubricId: newRubric.id,
            projectTitle,
            createdBy,
            createdAt: newRubric.createdAt
        });

        res.status(201).json({
            success: true,
            message: 'Rúbrica criada com sucesso',
            data: newRubric
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao criar rúbrica',
            error: error.message
        });
    }
});

/**
 * POST /api/rubrics/:rubricId/evaluate
 * Avaliar aluno usando rúbrica
 */
router.post('/:rubricId/evaluate', (req, res) => {
    try {
        const { rubricId } = req.params;
        const {
            studentId,
            studentName,
            scores,
            comments,
            evaluatedBy
        } = req.body;

        // Validações
        if (!studentId || !Array.isArray(scores) || scores.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'studentId e scores[] são obrigatórios'
            });
        }

        const rubric = rubricsDatabase.find(r => r.id === parseInt(rubricId));
        if (!rubric) {
            return res.status(404).json({
                success: false,
                message: 'Rúbrica não encontrada'
            });
        }

        // Validar pontos
        let totalPoints = 0;
        const validatedScores = [];

        for (const score of scores) {
            const criterion = rubric.criteria.find(c => c.id === score.criteriaId);
            if (!criterion) {
                return res.status(400).json({
                    success: false,
                    message: `Critério ${score.criteriaId} não encontrado`
                });
            }

            if (score.points < 0 || score.points > criterion.maxPoints) {
                return res.status(400).json({
                    success: false,
                    message: `Pontos de ${criterion.name} devem estar entre 0 e ${criterion.maxPoints}`
                });
            }

            totalPoints += score.points;

            validatedScores.push({
                criteriaId: score.criteriaId,
                criteriaName: criterion.name,
                points: score.points,
                feedback: score.feedback || ''
            });
        }

        const percentage = (totalPoints / rubric.totalMaxPoints) * 100;

        // Criar avaliação
        const newScore = {
            id: rubricScoresDatabase.length + 1,
            rubricId: parseInt(rubricId),
            studentId,
            projectId: rubric.projectId,
            projectTitle: rubric.projectTitle,
            studentName: studentName || `Aluno ${studentId}`,
            scores: validatedScores,
            totalPoints,
            percentage: Math.round(percentage),
            status: 'graded',
            evaluatedAt: new Date().toISOString(),
            evaluatedBy: evaluatedBy || 'Professor',
            comments: comments || ''
        };

        rubricScoresDatabase.push(newScore);

        // Socket.io emit
        req.app.io.to(`student-${studentId}`).emit('rubric-evaluated', {
            rubricId,
            projectTitle: rubric.projectTitle,
            totalPoints,
            percentage: newScore.percentage,
            evaluatedBy,
            evaluatedAt: newScore.evaluatedAt
        });

        res.status(201).json({
            success: true,
            message: 'Avaliação criada com sucesso',
            data: newScore
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao avaliar com rúbrica',
            error: error.message
        });
    }
});

/**
 * GET /api/rubrics/:rubricId/scores/student/:studentId
 * Obter avaliação de um aluno
 */
router.get('/:rubricId/scores/student/:studentId', (req, res) => {
    try {
        const { rubricId, studentId } = req.params;

        const score = rubricScoresDatabase.find(
            s => s.rubricId === parseInt(rubricId) && s.studentId === parseInt(studentId)
        );

        if (!score) {
            return res.status(404).json({
                success: false,
                message: 'Avaliação não encontrada'
            });
        }

        res.json({
            success: true,
            data: score
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar avaliação',
            error: error.message
        });
    }
});

/**
 * GET /api/rubrics/:rubricId/scores
 * Listar todas as avaliações de uma rúbrica
 */
router.get('/:rubricId/scores', (req, res) => {
    try {
        const { rubricId } = req.params;

        const scores = rubricScoresDatabase.filter(
            s => s.rubricId === parseInt(rubricId)
        );

        const rubric = rubricsDatabase.find(r => r.id === parseInt(rubricId));

        res.json({
            success: true,
            rubric: rubric || null,
            scores: scores,
            total: scores.length,
            averagePercentage: scores.length > 0
                ? Math.round(scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length)
                : 0
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao listar avaliações',
            error: error.message
        });
    }
});

/**
 * GET /api/rubrics/:rubricId/scores/class/:classId
 * Listar avaliações de uma turma
 */
router.get('/:rubricId/scores/class/:classId', (req, res) => {
    try {
        const { rubricId, classId } = req.params;

        // Aqui você precisaria ter uma relação de alunos/turma
        // Por enquanto, retorna todas as avaliações da rúbrica
        const scores = rubricScoresDatabase.filter(
            s => s.rubricId === parseInt(rubricId)
        );

        res.json({
            success: true,
            classId,
            scores: scores,
            total: scores.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao listar avaliações da turma',
            error: error.message
        });
    }
});

/**
 * PUT /api/rubrics/:rubricId/scores/:scoreId
 * Atualizar avaliação
 */
router.put('/:rubricId/scores/:scoreId', (req, res) => {
    try {
        const { rubricId, scoreId } = req.params;
        const { scores, comments, evaluatedBy } = req.body;

        const score = rubricScoresDatabase.find(
            s => s.id === parseInt(scoreId) && s.rubricId === parseInt(rubricId)
        );

        if (!score) {
            return res.status(404).json({
                success: false,
                message: 'Avaliação não encontrada'
            });
        }

        const rubric = rubricsDatabase.find(r => r.id === parseInt(rubricId));
        if (!rubric) {
            return res.status(404).json({
                success: false,
                message: 'Rúbrica não encontrada'
            });
        }

        if (scores) {
            let totalPoints = 0;
            const validatedScores = [];

            for (const newScore of scores) {
                const criterion = rubric.criteria.find(c => c.id === newScore.criteriaId);
                if (!criterion) {
                    return res.status(400).json({
                        success: false,
                        message: `Critério ${newScore.criteriaId} não encontrado`
                    });
                }

                if (newScore.points < 0 || newScore.points > criterion.maxPoints) {
                    return res.status(400).json({
                        success: false,
                        message: `Pontos de ${criterion.name} devem estar entre 0 e ${criterion.maxPoints}`
                    });
                }

                totalPoints += newScore.points;

                validatedScores.push({
                    criteriaId: newScore.criteriaId,
                    criteriaName: criterion.name,
                    points: newScore.points,
                    feedback: newScore.feedback || ''
                });
            }

            score.scores = validatedScores;
            score.totalPoints = totalPoints;
            score.percentage = Math.round((totalPoints / rubric.totalMaxPoints) * 100);
        }

        if (comments !== undefined) {
            score.comments = comments;
        }

        if (evaluatedBy) {
            score.evaluatedBy = evaluatedBy;
        }

        score.evaluatedAt = new Date().toISOString();

        // Socket.io emit
        req.app.io.to(`student-${score.studentId}`).emit('rubric-updated', {
            rubricId,
            projectTitle: score.projectTitle,
            totalPoints: score.totalPoints,
            percentage: score.percentage,
            evaluatedBy: score.evaluatedBy,
            updatedAt: score.evaluatedAt
        });

        res.json({
            success: true,
            message: 'Avaliação atualizada com sucesso',
            data: score
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar avaliação',
            error: error.message
        });
    }
});

/**
 * DELETE /api/rubrics/:rubricId
 * Deletar rúbrica
 */
router.delete('/:rubricId', (req, res) => {
    try {
        const { rubricId } = req.params;

        const index = rubricsDatabase.findIndex(r => r.id === parseInt(rubricId));
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Rúbrica não encontrada'
            });
        }

        const deletedRubric = rubricsDatabase.splice(index, 1);

        // Socket.io emit
        req.app.io.emit('rubric-deleted', {
            rubricId,
            projectTitle: deletedRubric[0].projectTitle
        });

        res.json({
            success: true,
            message: 'Rúbrica deletada com sucesso',
            data: deletedRubric[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar rúbrica',
            error: error.message
        });
    }
});

/**
 * DELETE /api/rubrics/:rubricId/scores/:scoreId
 * Deletar avaliação
 */
router.delete('/:rubricId/scores/:scoreId', (req, res) => {
    try {
        const { rubricId, scoreId } = req.params;

        const index = rubricScoresDatabase.findIndex(
            s => s.id === parseInt(scoreId) && s.rubricId === parseInt(rubricId)
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Avaliação não encontrada'
            });
        }

        const deletedScore = rubricScoresDatabase.splice(index, 1);

        // Socket.io emit
        req.app.io.to(`student-${deletedScore[0].studentId}`).emit('rubric-score-deleted', {
            scoreId,
            projectTitle: deletedScore[0].projectTitle
        });

        res.json({
            success: true,
            message: 'Avaliação deletada com sucesso',
            data: deletedScore[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar avaliação',
            error: error.message
        });
    }
});

export default router;
