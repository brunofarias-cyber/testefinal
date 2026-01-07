import express from 'express';

const router = express.Router();

// Route expecting params: /stats/:teacherId/:classId
router.get('/stats/:teacherId/:classId', async (req, res) => {
    try {
        const { teacherId, classId } = req.params;

        // Return default mock data for dashboard
        const mockDashboardData = {
            pendingSubmissions: 5,
            averageGrade: 7.8,
            classEngagement: 85,
            completedTasks: 12,
            totalTasks: 15,
            students: 28,
            recentActivity: [
                { id: 1, type: 'submission', description: 'João enviou projeto', time: '2 horas atrás' },
                { id: 2, type: 'grade', description: 'Nota adicionada para Maria', time: '4 horas atrás' },
                { id: 3, type: 'task', description: 'Nova tarefa criada', time: '1 dia atrás' }
            ],
            performance: {
                excellent: 8,
                good: 12,
                average: 6,
                poor: 2
            }
        };

        res.json(mockDashboardData);

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

export default router;
