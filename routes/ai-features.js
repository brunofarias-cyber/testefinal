import express from 'express';
import db from '../models/index.js';
import { studentTutor, detectRiskStudents, detectPlagiarism } from '../services/aiTutorService.js';
import {
    generateDifficultyHeatmap,
    predictGrades,
    generatePerformanceReport,
    compareClasses,
} from '../services/analyticsService.js';

const router = express.Router();

// ==========================================
// TUTORIA IA
// ==========================================
router.post('/tutor/ask', async (req, res) => {
    try {
        const { question, studentId, projectId, skillCode } = req.body;

        const result = await studentTutor(question, studentId, projectId, skillCode);

        res.json({
            success: true,
            answer: result.answer,
            confidence: result.confidence,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/tutor/history/:studentId', async (req, res) => {
    try {
        const history = await db.TutorInteraction.findAll({
            where: { studentId: req.params.studentId },
            order: [['createdAt', 'DESC']],
            limit: 20,
        });

        res.json({ data: history });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// DETECÇÃO DE RISCO
// ==========================================
router.post('/risk/detect/:projectId', async (req, res) => {
    try {
        const riskStudents = await detectRiskStudents(req.params.projectId);

        res.json({
            success: true,
            riskCount: riskStudents.length,
            students: riskStudents,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/risk/:projectId/:studentId', async (req, res) => {
    try {
        const { projectId, studentId } = req.params;

        const evaluations = await db.StudentSkillEvaluation.findAll({
            where: { projectId, studentId },
        });

        const avgLevel = evaluations.length
            ? evaluations.reduce((s, e) => s + e.chosenLevel, 0) / evaluations.length
            : 0;

        const riskLevel =
            avgLevel <= 2 ? 'high' : avgLevel <= 3 ? 'medium' : avgLevel <= 4 ? 'low' : 'none';

        res.json({
            riskLevel,
            avgLevel: avgLevel.toFixed(1),
            evaluationCount: evaluations.length,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// DETECÇÃO DE PLÁGIO
// ==========================================
router.post('/plagiarism/check', async (req, res) => {
    try {
        const { studentId, projectId, text } = req.body;

        const result = await detectPlagiarism(studentId, projectId, text);

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// ANALYTICS
// ==========================================
router.get('/heatmap/:projectId', async (req, res) => {
    try {
        const heatmap = await generateDifficultyHeatmap(req.params.projectId);

        res.json({ data: heatmap });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/predict-grades', async (req, res) => {
    try {
        const { projectId, studentId } = req.body;

        const prediction = await predictGrades(projectId, studentId);

        res.json(prediction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/report', async (req, res) => {
    try {
        const { projectId, classId } = req.body;

        const report = await generatePerformanceReport(projectId, classId);

        res.json({ success: true, report });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/compare-classes', async (req, res) => {
    try {
        const { projectId, classIds } = req.body;

        const comparison = await compareClasses(projectId, classIds);

        res.json({ data: comparison });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
