import express from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import {
    Project,
    ProjectSkill,
    StudentSkillEvaluation
} from '../models/index.js';

const router = express.Router();

// ==========================================
// 1. GET /api/bncc-dashboard/overview - Visão geral
// ==========================================
router.get('/overview/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        const totalEvaluations = await StudentSkillEvaluation.count({
            where: { projectId },
        });

        const studentsEvaluated = await StudentSkillEvaluation.count({
            distinct: true,
            col: 'studentId',
            where: { projectId },
        });

        const levelDistribution = await StudentSkillEvaluation.findAll({
            attributes: [
                'chosenLevel',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
            ],
            where: { projectId },
            group: ['chosenLevel'],
            raw: true,
        });

        const avgPoints = await StudentSkillEvaluation.findOne({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('points')), 'average'],
            ],
            where: { projectId },
            raw: true,
        });

        res.json({
            data: {
                totalEvaluations,
                studentsEvaluated,
                levelDistribution: levelDistribution.map(ld => ({
                    level: ld.chosenLevel,
                    count: parseInt(ld.count),
                })),
                averagePoints: avgPoints?.average ? Math.round(avgPoints.average * 100) / 100 : 0,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 2. GET /api/bncc-dashboard/by-discipline - Por disciplina
// ==========================================
router.get('/by-discipline/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        const data = await StudentSkillEvaluation.findAll({
            attributes: [
                'disciplineId',
                'chosenLevel',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
            ],
            where: { projectId },
            group: ['disciplineId', 'chosenLevel'],
            raw: true,
        });

        const byDiscipline = {};
        data.forEach(d => {
            if (!byDiscipline[d.disciplineId]) {
                byDiscipline[d.disciplineId] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, total: 0 };
            }
            byDiscipline[d.disciplineId][d.chosenLevel] = parseInt(d.count);
            byDiscipline[d.disciplineId].total += parseInt(d.count);
        });

        res.json({ data: byDiscipline });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 3. GET /api/bncc-dashboard/coverage - Cobertura BNCC (%)
// ==========================================
router.get('/coverage/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        const totalSkills = await ProjectSkill.count({
            where: { projectId },
        });

        const evaluatedSkills = await StudentSkillEvaluation.count({
            distinct: true,
            col: 'skillCode',
            where: { projectId },
        });

        const developedSkills = await StudentSkillEvaluation.count({
            distinct: true,
            col: 'skillCode',
            where: {
                projectId,
                chosenLevel: { [Op.gte]: 4 },
            },
        });

        const byDiscipline = await ProjectSkill.findAll({
            attributes: [
                'disciplineId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
            ],
            where: { projectId },
            group: ['disciplineId'],
            raw: true,
        });

        const coverage = {
            total: totalSkills,
            evaluated: evaluatedSkills,
            developed: developedSkills,
            percentageCovered: totalSkills > 0 ? Math.round((evaluatedSkills / totalSkills) * 100) : 0,
            percentageDeveloped: totalSkills > 0 ? Math.round((developedSkills / totalSkills) * 100) : 0,
            byDiscipline: byDiscipline.map(bd => ({
                discipline: bd.disciplineId,
                total: parseInt(bd.total),
            })),
        };

        res.json({ data: coverage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 4. GET /api/bncc-dashboard/top-students - Top performers
// ==========================================
router.get('/top-students/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const { limit = 10 } = req.query;

        const data = await StudentSkillEvaluation.findAll({
            attributes: [
                'studentId',
                [sequelize.fn('AVG', sequelize.col('chosenLevel')), 'avgLevel'],
                [sequelize.fn('AVG', sequelize.col('points')), 'avgPoints'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalEvaluations'],
            ],
            where: { projectId },
            group: ['studentId'],
            order: [[sequelize.fn('AVG', sequelize.col('points')), 'DESC']],
            limit: parseInt(limit),
            raw: true,
        });

        res.json({
            data: data.map(d => ({
                studentId: d.studentId,
                averageLevel: Math.round(parseFloat(d.avgLevel) * 100) / 100,
                averagePoints: Math.round(parseFloat(d.avgPoints) * 100) / 100,
                totalEvaluations: parseInt(d.totalEvaluations),
            })),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 5. GET /api/bncc-dashboard/at-risk - Alunos em risco
// ==========================================
router.get('/at-risk/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        const data = await StudentSkillEvaluation.findAll({
            attributes: [
                'studentId',
                [sequelize.fn('AVG', sequelize.col('chosenLevel')), 'avgLevel'],
                [sequelize.fn('COUNT',
                    sequelize.literal('CASE WHEN chosen_level <= 2 THEN 1 END')
                ), 'lowSkills'],
            ],
            where: { projectId },
            group: ['studentId'],
            having: sequelize.where(
                sequelize.fn('AVG', sequelize.col('chosenLevel')),
                Op.lte,
                2.5
            ),
            raw: true,
        });

        res.json({
            data: data.map(d => ({
                studentId: d.studentId,
                averageLevel: Math.round(parseFloat(d.avgLevel) * 100) / 100,
                skillsAtRisk: parseInt(d.lowSkills) || 0,
            })),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 6. GET /api/bncc-dashboard/skills-performance - Performance por habilidade
// ==========================================
router.get('/skills-performance/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        const data = await StudentSkillEvaluation.findAll({
            attributes: [
                'skillCode',
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalEvaluations'],
                [sequelize.fn('AVG', sequelize.col('chosenLevel')), 'avgLevel'],
                [
                    sequelize.fn(
                        'COUNT',
                        sequelize.literal('CASE WHEN chosen_level >= 4 THEN 1 END')
                    ),
                    'developed',
                ],
            ],
            where: { projectId },
            group: ['skillCode'],
            raw: true,
        });

        res.json({
            data: data.map(d => ({
                skillCode: d.skillCode,
                totalEvaluations: parseInt(d.totalEvaluations),
                averageLevel: Math.round(parseFloat(d.avgLevel) * 100) / 100,
                developed: parseInt(d.developed) || 0,
                developmentPercentage: Math.round((parseInt(d.developed || 0) / parseInt(d.totalEvaluations)) * 100),
            })),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 7. GET /api/bncc-dashboard/class-comparison - Comparar turmas
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

        const stats = await Promise.all(
            projectIds.map(async (projectId) => {
                const project = projects.find(p => p.id === projectId);
                const avgLevel = await StudentSkillEvaluation.findOne({
                    attributes: [
                        [sequelize.fn('AVG', sequelize.col('chosenLevel')), 'avg'],
                    ],
                    where: { projectId },
                    raw: true,
                });

                const developedCount = await StudentSkillEvaluation.count({
                    where: {
                        projectId,
                        chosenLevel: { [Op.gte]: 4 },
                    },
                });

                return {
                    projectId,
                    projectTitle: project.title,
                    averageLevel: avgLevel?.avg ? Math.round(parseFloat(avgLevel.avg) * 100) / 100 : 0,
                    skillsDeveloped: developedCount,
                };
            })
        );

        res.json({ data: stats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
