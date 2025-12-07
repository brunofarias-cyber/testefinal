import express from 'express';
const router = express.Router();

// MOCK DATA - Associação de alunos com turmas
const STUDENT_CLASS_MAP = {
    101: 1, // João Silva -> 1º Ano A
    102: 1, // Maria Oliveira -> 1º Ano A
    103: 2, // Pedro Santos -> 2º Ano B
    104: 1, // Ana Costa -> 1º Ano A
    105: 2  // Lucas Pereira -> 2º Ano B
};

// MOCK DATA - Projetos associados às turmas
const MOCK_PROJECTS = [
    {
        id: 1,
        name: "Horta Sustentável",
        classId: 1, // 1º Ano A
        progress: 85,
        dueDate: "2023-12-15",
        grade: 9.0,
        teacher: "Profª Ana Silva",
        status: "completed",
        tasksDone: 3,
        tasksTotal: 4,
        description: "Desenvolver uma horta sustentável na escola"
    },
    {
        id: 2,
        name: "Robótica",
        classId: 1, // 1º Ano A
        progress: 60,
        dueDate: "2023-12-20",
        grade: null,
        teacher: "Prof. Roberto Lima",
        status: "in-progress",
        tasksDone: 2,
        tasksTotal: 4,
        description: "Construir robô com materiais recicláveis"
    },
    {
        id: 3,
        name: "Jornal Digital",
        classId: 2, // 2º Ano B
        progress: 45,
        dueDate: "2023-11-30",
        grade: null,
        teacher: "Prof. Carlos Souza",
        status: "in-progress",
        tasksDone: 2,
        tasksTotal: 4,
        description: "Criar um jornal digital da turma"
    },
    {
        id: 4,
        name: "Teatro Shakespeare",
        classId: 2, // 2º Ano B
        progress: 30,
        dueDate: "2024-01-10",
        grade: null,
        teacher: "Profª Mariana Dias",
        status: "planning",
        tasksDone: 1,
        tasksTotal: 5,
        description: "Montar peça de Shakespeare"
    }
];

// ============================================================================
// GET /api/student-projects/:studentId - Projetos da turma do aluno
// ============================================================================
router.get('/:studentId', (req, res) => {
    try {
        const studentId = parseInt(req.params.studentId);
        
        console.log(`📚 GET /api/student-projects/${studentId} - Buscando projetos do aluno`);

        // Buscar turma do aluno
        const classId = STUDENT_CLASS_MAP[studentId];

        if (!classId) {
            return res.status(404).json({
                success: false,
                error: 'Aluno não está associado a nenhuma turma'
            });
        }

        // Filtrar projetos da turma
        const studentProjects = MOCK_PROJECTS.filter(p => p.classId === classId);

        console.log(`✅ Aluno ${studentId} -> Turma ${classId} -> ${studentProjects.length} projetos`);

        res.json({
            success: true,
            data: {
                studentId,
                classId,
                projects: studentProjects,
                count: studentProjects.length
            }
        });
    } catch (error) {
        console.error('❌ Erro ao buscar projetos do aluno:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar projetos'
        });
    }
});

// ============================================================================
// GET /api/student-projects/:studentId/project/:projectId - Detalhes de um projeto
// ============================================================================
router.get('/:studentId/project/:projectId', (req, res) => {
    try {
        const studentId = parseInt(req.params.studentId);
        const projectId = parseInt(req.params.projectId);
        
        console.log(`📖 GET /api/student-projects/${studentId}/project/${projectId}`);

        // Buscar turma do aluno
        const classId = STUDENT_CLASS_MAP[studentId];

        if (!classId) {
            return res.status(404).json({
                success: false,
                error: 'Aluno não está associado a nenhuma turma'
            });
        }

        // Buscar projeto
        const project = MOCK_PROJECTS.find(p => p.id === projectId && p.classId === classId);

        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Projeto não encontrado ou você não tem acesso a ele'
            });
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('❌ Erro ao buscar detalhes do projeto:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar projeto'
        });
    }
});

// ============================================================================
// GET /api/student-projects/:studentId/stats - Estatísticas do aluno
// ============================================================================
router.get('/:studentId/stats', (req, res) => {
    try {
        const studentId = parseInt(req.params.studentId);
        
        console.log(`📊 GET /api/student-projects/${studentId}/stats`);

        const classId = STUDENT_CLASS_MAP[studentId];

        if (!classId) {
            return res.status(404).json({
                success: false,
                error: 'Aluno não está associado a nenhuma turma'
            });
        }

        const studentProjects = MOCK_PROJECTS.filter(p => p.classId === classId);
        
        // Calcular estatísticas
        const completed = studentProjects.filter(p => p.status === 'completed').length;
        const inProgress = studentProjects.filter(p => p.status === 'in-progress').length;
        const planning = studentProjects.filter(p => p.status === 'planning').length;
        
        const gradesArray = studentProjects
            .filter(p => p.grade !== null)
            .map(p => p.grade);
        
        const average = gradesArray.length > 0 
            ? (gradesArray.reduce((a, b) => a + b, 0) / gradesArray.length).toFixed(1)
            : 0;

        const stats = {
            total: studentProjects.length,
            completed,
            inProgress,
            planning,
            average: parseFloat(average),
            tasksCompleted: studentProjects.reduce((sum, p) => sum + p.tasksDone, 0),
            tasksTotal: studentProjects.reduce((sum, p) => sum + p.tasksTotal, 0)
        };

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

export default router;
