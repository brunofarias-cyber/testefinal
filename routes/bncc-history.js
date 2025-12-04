import express from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import {
    Project,
    BnccSkill,
    StudentSkillEvaluation
} from '../models/index.js';

const router = express.Router();

// ==========================================
// GET /api/bncc-history/student-timeline/:studentId
// ==========================================
router.get('/student-timeline/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;

        const evaluations = await StudentSkillEvaluation.findAll({
            where: { studentId },
            order: [['evaluatedAt', 'ASC']],
        });

        if (evaluations.length === 0) {
            return res.json({ data: [] });
        }

        const byProject = {};
        evaluations.forEach(e => {
            if (!byProject[e.projectId]) {
                byProject[e.projectId] = [];
            }
            byProject[e.projectId].push(e);
        });

        const timeline = Object.entries(byProject).map(([projectId, evals]) => {
            const avgLevel = (evals.reduce((s, e) => s + e.chosenLevel, 0) / evals.length).toFixed(2);
            const avgPoints = (evals.reduce((s, e) => s + parseFloat(e.points || 0), 0) / evals.length).toFixed(1);

            return {
                projectId,
                date: evals[0].evaluatedAt,
                evaluations: evals.length,
                averageLevel: parseFloat(avgLevel),
                averagePoints: parseFloat(avgPoints),
                evals: evals.map(e => ({
                    skillCode: e.skillCode,
                    level: e.chosenLevel,
                    points: e.points,
                })),
            };
        });

        res.json({ data: timeline });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// GET /api/bncc-history/skill-evolution/:studentId/:skillCode
// Evolução de uma habilidade específica
// ==========================================
router.get('/skill-evolution/:studentId/:skillCode', async (req, res) => {
    try {
        const { studentId, skillCode } = req.params;

        const evaluations = await StudentSkillEvaluation.findAll({
            where: { studentId, skillCode },
            order: [['evaluatedAt', 'ASC']],
        });

        const evolution = evaluations.map((e, idx) => ({
            index: idx + 1,
            date: e.evaluatedAt,
            level: e.chosenLevel,
            points: e.points,
            projectId: e.projectId,
            evidence: e.evidence,
        }));

        const improvement = evolution.length > 1
            ? evolution[evolution.length - 1].level - evolution[0].level
            : 0;

        res.json({ data: evolution, improvement });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// GET /api/bncc-history/class-comparison/:classId
// Evolução por projeto da turma
// ==========================================
router.get('/class-comparison/:classId', async (req, res) => {
    try {
        const { classId } = req.params;

        const projects = await Project.findAll({
            where: { classId },
        });

        if (projects.length === 0) {
            return res.json({ data: [] });
        }

        const projectIds = projects.map(p => p.id);

        const data = await Promise.all(
            projectIds.map(async (projectId) => {
                const project = projects.find(p => p.id === projectId);

                const avgLevel = await StudentSkillEvaluation.findOne({
                    attributes: [
                        [sequelize.fn('AVG', sequelize.col('chosenLevel')), 'avg'],
                    ],
                    where: { projectId },
                    raw: true,
                });

                const avgPoints = await StudentSkillEvaluation.findOne({
                    attributes: [
                        [sequelize.fn('AVG', sequelize.col('points')), 'avg'],
                    ],
                    where: { projectId },
                    raw: true,
                });

                return {
                    projectId,
                    projectTitle: project.title,
                    date: project.createdAt,
                    averageLevel: avgLevel?.avg ? Math.round(parseFloat(avgLevel.avg) * 100) / 100 : 0,
                    averagePoints: avgPoints?.avg ? Math.round(parseFloat(avgPoints.avg) * 100) / 100 : 0,
                };
            })
        );

        res.json({ data: data.sort((a, b) => new Date(a.date) - new Date(b.date)) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// GET /api/bncc-history/annual-report/:studentId/:year
// Relatório anual do aluno
// ==========================================
router.get('/annual-report/:studentId/:year', async (req, res) => {
    try {
        const { studentId, year } = req.params;

        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);

        const evaluations = await StudentSkillEvaluation.findAll({
            where: {
                studentId,
                evaluatedAt: { [Op.between]: [startDate, endDate] },
            },
            order: [['evaluatedAt', 'ASC']],
        });

        if (evaluations.length === 0) {
            return res.json({ data: { message: 'Sem avaliações neste período' } });
        }

        const byTrimester = { 1: [], 2: [], 3: [], 4: [] };
        evaluations.forEach(e => {
            const month = new Date(e.evaluatedAt).getMonth();
            const trimester = Math.ceil((month + 1) / 3);
            byTrimester[trimester].push(e);
        });

        const trimesters = Object.entries(byTrimester)
            .filter(([_, evals]) => evals.length > 0)
            .map(([trim, evals]) => {
                const avgLevel = (evals.reduce((s, e) => s + e.chosenLevel, 0) / evals.length).toFixed(2);
                const avgPoints = (evals.reduce((s, e) => s + parseFloat(e.points || 0), 0) / evals.length).toFixed(1);
                const developed = evals.filter(e => e.chosenLevel >= 4).length;

                return {
                    trimester: parseInt(trim),
                    evaluations: evals.length,
                    averageLevel: parseFloat(avgLevel),
                    averagePoints: parseFloat(avgPoints),
                    skillsDeveloped: developed,
                };
            });

        const totalEvals = evaluations.length;
        const yearAvgLevel = (evaluations.reduce((s, e) => s + e.chosenLevel, 0) / totalEvals).toFixed(2);
        const yearAvgPoints = (evaluations.reduce((s, e) => s + parseFloat(e.points || 0), 0) / totalEvals).toFixed(1);
        const improvementTrend = trimesters.length > 1
            ? trimesters[trimesters.length - 1].averageLevel - trimesters[0].averageLevel
            : 0;

        res.json({
            data: {
                year,
                totalEvaluations: totalEvals,
                yearAverageLevel: parseFloat(yearAvgLevel),
                yearAveragePoints: parseFloat(yearAvgPoints),
                improvementTrend: parseFloat(improvementTrend.toFixed(2)),
                trimesters,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
