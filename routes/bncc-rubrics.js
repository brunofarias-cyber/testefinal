import express from 'express';
import { SkillIndicator } from '../models/index.js';

const router = express.Router();

// ==========================================
// GET /api/bncc-rubrics/:projectId/:skillCode
// ==========================================
router.get('/:projectId/:skillCode', async (req, res) => {
    try {
        const { projectId, skillCode } = req.params;

        const indicators = await SkillIndicator.findAll({
            where: { projectId, skillCode },
            order: [['level', 'ASC']],
        });

        res.json({ data: indicators });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// PUT /api/bncc-rubrics/:id - Editar indicador
// ==========================================
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description, observableBehavior, examples, points, levelLabel } = req.body;

        const indicator = await SkillIndicator.findByPk(id);
        if (!indicator) {
            return res.status(404).json({ error: 'Indicador não encontrado' });
        }

        await indicator.update({
            description,
            observableBehavior,
            examples,
            points,
            levelLabel,
        });

        res.json({ data: indicator, message: 'Indicador atualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// POST /api/bncc-rubrics/duplicate/:sourceProjectId/:targetProjectId
// Duplicar rubrica de outro projeto
// ==========================================
router.post('/duplicate/:sourceProjectId/:targetProjectId', async (req, res) => {
    try {
        const { sourceProjectId, targetProjectId } = req.params;

        const sourceIndicators = await SkillIndicator.findAll({
            where: { projectId: sourceProjectId },
        });

        const newIndicators = sourceIndicators.map(si => ({
            projectId: targetProjectId,
            skillCode: si.skillCode,
            level: si.level,
            levelLabel: si.levelLabel,
            description: si.description,
            observableBehavior: si.observableBehavior,
            examples: si.examples,
            points: si.points,
        }));

        await SkillIndicator.bulkCreate(newIndicators, { ignoreDuplicates: true });

        res.json({ message: 'Rubricas duplicadas com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
