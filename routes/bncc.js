import express from 'express';
import { Op } from 'sequelize';
import {
    BnccSkill,
    BnccDiscipline,
    BnccGeneralCompetency,
    ProjectSkill,
    SkillIndicator,
    StudentSkillEvaluation,
    StudentSkillSummary
} from '../models/index.js';

const router = express.Router();

// ==========================================
// 1. GET /api/bncc/skills - Buscar habilidades
// ==========================================
router.get('/skills', async (req, res) => {
    try {
        const { year, discipline, search } = req.query;
        const where = {};

        if (year) where.year = parseInt(year);
        if (discipline) where.disciplineId = discipline;
        if (search) {
            where[Op.or] = [
                { code: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
            ];
        }

        const skills = await BnccSkill.findAll({
            where,
            include: [
                {
                    model: BnccDiscipline,
                    as: 'discipline',
                    attributes: ['id', 'name'],
                },
                {
                    model: BnccGeneralCompetency,
                    as: 'competencies',
                    attributes: ['id', 'code', 'name'],
                    through: { attributes: [] },
                },
            ],
        });

        res.json({ data: skills, count: skills.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 2. GET /api/bncc/disciplines - Listar disciplinas
// ==========================================
router.get('/disciplines', async (req, res) => {
    try {
        const disciplines = await BnccDiscipline.findAll();
        res.json({ data: disciplines });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 3. GET /api/bncc/competencies - Listar competências gerais
// ==========================================
router.get('/competencies', async (req, res) => {
    try {
        const competencies = await BnccGeneralCompetency.findAll();
        res.json({ data: competencies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 4. POST /api/bncc/projects/:projectId/skills - Vincular habilidades a projeto
// ==========================================
router.post('/projects/:projectId/skills', async (req, res) => {
    try {
        const { projectId } = req.params;
        const { skillCodes } = req.body;

        const skills = await BnccSkill.findAll({
            where: { code: { [Op.in]: skillCodes } },
        });

        const projectSkills = skills.map(skill => ({
            projectId: parseInt(projectId),
            skillCode: skill.code,
            disciplineId: skill.disciplineId,
        }));

        const created = await ProjectSkill.bulkCreate(projectSkills, {
            ignoreDuplicates: true,
        });

        res.status(201).json({ data: created, message: 'Habilidades vinculadas ao projeto' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 5. GET /api/bncc/projects/:projectId/skills - Habilidades do projeto
// ==========================================
router.get('/projects/:projectId/skills', async (req, res) => {
    try {
        const { projectId } = req.params;

        const projectSkills = await ProjectSkill.findAll({
            where: { projectId: parseInt(projectId) },
        });

        res.json({ data: projectSkills });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 6. POST /api/bncc/projects/:projectId/indicators - Criar indicadores (Nível 1-5)
// ==========================================
router.post('/projects/:projectId/indicators', async (req, res) => {
    try {
        const { projectId } = req.params;
        const { skillCode, indicators } = req.body;

        const created = indicators.map(ind => ({
            projectId: parseInt(projectId),
            skillCode,
            level: ind.level,
            levelLabel: ind.label,
            points: ind.points,
            description: ind.description,
            observableBehavior: ind.observable,
        }));

        await SkillIndicator.bulkCreate(created, { ignoreDuplicates: true });

        res.status(201).json({ message: 'Indicadores criados' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 7. GET /api/bncc/projects/:projectId/indicators/:skillCode - Indicadores
// ==========================================
router.get('/projects/:projectId/indicators/:skillCode', async (req, res) => {
    try {
        const { projectId, skillCode } = req.params;

        const indicators = await SkillIndicator.findAll({
            where: { projectId: parseInt(projectId), skillCode },
            order: [['level', 'ASC']],
        });

        res.json({ data: indicators });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 8. POST /api/bncc/evaluations - Salvar avaliação de habilidade
// ==========================================
router.post('/evaluations', async (req, res) => {
    try {
        const {
            projectId,
            studentId,
            skillCode,
            chosenLevel,
            evidence,
            feedback,
            evaluatedBy,
        } = req.body;

        const skill = await BnccSkill.findOne({ where: { code: skillCode } });

        if (!skill) {
            return res.status(404).json({ error: 'Habilidade não encontrada' });
        }

        const indicator = await SkillIndicator.findOne({
            where: { projectId: parseInt(projectId), skillCode, level: chosenLevel },
        });

        const evaluation = await StudentSkillEvaluation.create({
            projectId: parseInt(projectId),
            studentId: parseInt(studentId),
            skillCode,
            disciplineId: skill.disciplineId,
            chosenLevel,
            evidence,
            feedback,
            points: indicator?.points || 0,
            evaluatedBy: evaluatedBy ? parseInt(evaluatedBy) : null,
        });

        await recalculateSummary(parseInt(projectId), parseInt(studentId));

        res.status(201).json({ data: evaluation, message: 'Avaliação salva' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 9. GET /api/bncc/evaluations/student/:studentId - Avaliações do aluno
// ==========================================
router.get('/evaluations/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const { projectId } = req.query;

        const where = { studentId: parseInt(studentId) };
        if (projectId) where.projectId = parseInt(projectId);

        const evaluations = await StudentSkillEvaluation.findAll({
            where,
            order: [['evaluatedAt', 'DESC']],
        });

        res.json({ data: evaluations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 10. GET /api/bncc/summary/:projectId/:studentId - Resumo de avaliação
// ==========================================
router.get('/summary/:projectId/:studentId', async (req, res) => {
    try {
        const { projectId, studentId } = req.params;

        const summary = await StudentSkillSummary.findOne({
            where: { projectId: parseInt(projectId), studentId: parseInt(studentId) },
        });

        if (!summary) {
            return res.status(404).json({ error: 'Resumo não encontrado' });
        }

        const evaluations = await StudentSkillEvaluation.findAll({
            where: { projectId: parseInt(projectId), studentId: parseInt(studentId) },
            order: [['skillCode', 'ASC']],
        });

        const byDiscipline = {};
        evaluations.forEach(e => {
            if (!byDiscipline[e.disciplineId]) {
                byDiscipline[e.disciplineId] = [];
            }
            byDiscipline[e.disciplineId].push(e);
        });

        res.json({
            data: {
                summary,
                evaluations,
                byDiscipline,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 11. GET /api/bncc/reports/project/:projectId - Relatório do projeto
// ==========================================
router.get('/reports/project/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        const evaluations = await StudentSkillEvaluation.findAll({
            where: { projectId: parseInt(projectId) },
        });

        if (evaluations.length === 0) {
            return res.json({ error: 'Nenhuma avaliação encontrada' });
        }

        const byStudent = {};
        const bySkill = {};
        const byDiscipline = {};

        evaluations.forEach(e => {
            if (!byStudent[e.studentId]) {
                byStudent[e.studentId] = {
                    total: 0,
                    levels: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                    average: 0,
                };
            }
            byStudent[e.studentId].total += 1;
            byStudent[e.studentId].levels[e.chosenLevel] += 1;

            if (!bySkill[e.skillCode]) {
                bySkill[e.skillCode] = { total: 0, levels: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
            }
            bySkill[e.skillCode].total += 1;
            bySkill[e.skillCode].levels[e.chosenLevel] += 1;

            if (!byDiscipline[e.disciplineId]) {
                byDiscipline[e.disciplineId] = { total: 0, levels: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
            }
            byDiscipline[e.disciplineId].total += 1;
            byDiscipline[e.disciplineId].levels[e.chosenLevel] += 1;
        });

        Object.keys(byStudent).forEach(studentId => {
            const levels = byStudent[studentId].levels;
            const avg = (levels[1] * 1 + levels[2] * 2 + levels[3] * 3 + levels[4] * 4 + levels[5] * 5) / byStudent[studentId].total;
            byStudent[studentId].average = Math.round(avg * 100) / 100;
        });

        res.json({
            data: {
                totalEvaluations: evaluations.length,
                byStudent,
                bySkill,
                byDiscipline,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// FUNÇÃO AUXILIAR: Recalcular Summary
// ==========================================
async function recalculateSummary(projectId, studentId) {
    try {
        const evaluations = await StudentSkillEvaluation.findAll({
            where: { projectId, studentId },
        });

        if (evaluations.length === 0) return;

        const levels = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalPoints = 0;

        evaluations.forEach(e => {
            levels[e.chosenLevel] += 1;
            totalPoints += parseFloat(e.points) || 0;
        });

        const summary = {
            projectId,
            studentId,
            totalSkills: evaluations.length,
            skillsEvaluated: evaluations.length,
            skillsDeveloped45: levels[4] + levels[5],
            skillsInProgress3: levels[3],
            skillsNotPresented12: levels[1] + levels[2],
            averageSkillLevel: (totalPoints / (evaluations.length * 10)).toFixed(2),
            averagePoints: (totalPoints / evaluations.length).toFixed(1),
        };

        await StudentSkillSummary.upsert(summary);
    } catch (error) {
        console.error('Erro ao recalcular summary:', error);
    }
}

export default router;
