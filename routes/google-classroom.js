import express from 'express';
import db from '../models/index.js';
import {
    authenticateGoogleClassroom,
    syncClassrooms,
    syncStudentsFromClassroom,
    syncAssignments,
    syncSubmissions,
    sendFeedbackToClassroom,
    createAnnouncement,
} from '../services/googleClassroomService.js';

const router = express.Router();

// ==========================================
// POST autenticar Google Classroom
// ==========================================
router.post('/auth/connect', async (req, res) => {
    try {
        const { refreshToken, userId } = req.body;

        // Salvar token do usuário
        await db.User.update({ googleRefreshToken: refreshToken }, { where: { id: userId } });

        res.json({ success: true, message: 'Conectado ao Google Classroom' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// POST sincronizar turmas
// ==========================================
router.post('/sync/classrooms/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await db.User.findByPk(userId);
        if (!user?.googleRefreshToken) {
            return res.status(400).json({ error: 'Usuário não autenticado com Google' });
        }

        const syncedClasses = await syncClassrooms(userId, user.googleRefreshToken);

        res.json({
            success: true,
            classCount: syncedClasses.length,
            classes: syncedClasses,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// POST sincronizar tarefas
// ==========================================
router.post('/sync/assignments', async (req, res) => {
    try {
        const { courseId, projectId, userId } = req.body;

        const user = await db.User.findByPk(userId);
        if (!user?.googleRefreshToken) {
            return res.status(400).json({ error: 'Não autenticado' });
        }

        const auth = await authenticateGoogleClassroom(user.googleRefreshToken);
        await syncAssignments(auth, courseId, projectId);

        res.json({ success: true, message: 'Tarefas sincronizadas' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// POST sincronizar envios
// ==========================================
router.post('/sync/submissions', async (req, res) => {
    try {
        const { courseId, courseWorkId, projectId, userId } = req.body;

        const user = await db.User.findByPk(userId);
        if (!user?.googleRefreshToken) {
            return res.status(400).json({ error: 'Não autenticado' });
        }

        const auth = await authenticateGoogleClassroom(user.googleRefreshToken);
        await syncSubmissions(auth, courseId, courseWorkId, projectId);

        res.json({ success: true, message: 'Envios sincronizados' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// POST enviar feedback para Google Classroom
// ==========================================
router.post('/feedback/send', async (req, res) => {
    try {
        const { courseId, courseWorkId, submissionId, feedback, grade, bprojUserId } = req.body;

        const user = await db.User.findByPk(bprojUserId);
        if (!user?.googleRefreshToken) {
            return res.status(400).json({ error: 'Não autenticado' });
        }

        const auth = await authenticateGoogleClassroom(user.googleRefreshToken);
        await sendFeedbackToClassroom(auth, courseId, courseWorkId, submissionId, feedback, grade);

        res.json({ success: true, message: 'Feedback enviado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// POST criar anúncio
// ==========================================
router.post('/announcement/create', async (req, res) => {
    try {
        const { courseId, title, text, userId } = req.body;

        const user = await db.User.findByPk(userId);
        if (!user?.googleRefreshToken) {
            return res.status(400).json({ error: 'Não autenticado' });
        }

        const auth = await authenticateGoogleClassroom(user.googleRefreshToken);
        const announcement = await createAnnouncement(auth, courseId, title, text);

        res.json({ success: true, announcement });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// GET sincronizações ativas
// ==========================================
router.get('/sync/status/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await db.User.findByPk(userId, {
            attributes: ['id', 'googleRefreshToken', 'lastSyncAt'],
        });

        res.json({
            isConnected: !!user?.googleRefreshToken,
            lastSync: user?.lastSyncAt,
            status: user?.googleRefreshToken ? 'connected' : 'disconnected',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
