import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/sync/classroom', verifyToken, async (req, res) => {
    // Placeholder: integrar com ClassroomSyncService
    res.status(202).json({ success: true, provider: 'google_classroom', message: 'Sync agendada' });
});

router.post('/sync/teams', verifyToken, async (req, res) => {
    // Placeholder: integrar com TeamsSyncService
    res.status(202).json({ success: true, provider: 'microsoft_teams', message: 'Sync agendada' });
});

export default router;
