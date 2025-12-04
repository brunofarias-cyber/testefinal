import express from 'express';
import multer from 'multer';
import db from '../models/index.js';
import { processPdfFile } from '../services/pdfProcessingService.js';
import {
    evaluateStudentWithContext,
    compareEvaluations,
    generateStudentFeedback,
} from '../services/aiEvaluationService.js';
import fs from 'fs';

const router = express.Router();
const uploadDir = 'uploads/pdfs/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
    dest: uploadDir,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Apenas PDFs são aceitos'));
        }
    },
});

// ==========================================
// POST upload e processamento de PDF
// ==========================================
router.post('/references/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        // Processar PDF
        const result = await processPdfFile(req.file.path, req.file.originalname);

        res.json({
            success: true,
            message: 'PDF processado com sucesso',
            referenceId: result.referenceId,
            summary: result.summary,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// GET todas as referências
// ==========================================
router.get('/references', async (req, res) => {
    try {
        const references = await db.TheoreticalReference.findAll({
            where: { processingStatus: 'completed' },
            attributes: [
                'id',
                'title',
                'authors',
                'publicationYear',
                'category',
                'source',
            ],
        });

        res.json({ data: references });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// GET detalhes de uma referência
// ==========================================
router.get('/references/:referenceId', async (req, res) => {
    try {
        const reference = await db.TheoreticalReference.findByPk(
            req.params.referenceId
        );

        if (!reference) {
            return res.status(404).json({ error: 'Referência não encontrada' });
        }

        res.json({ data: reference });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// POST avaliação com contexto IA
// ==========================================
router.post('/evaluate-with-ai', async (req, res) => {
    try {
        const {
            studentId,
            projectId,
            skillCode,
            studentEvidence,
            rubric,
        } = req.body;

        const result = await evaluateStudentWithContext(
            studentId,
            projectId,
            skillCode,
            studentEvidence,
            rubric
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// POST comparar avaliação manual vs IA
// ==========================================
router.post('/compare-evaluations', async (req, res) => {
    try {
        const {
            studentId,
            projectId,
            skillCode,
            manualLevel,
        } = req.body;

        // Buscar avaliação IA
        const aiEval = await db.StudentSkillEvaluation.findOne({
            where: {
                studentId,
                projectId,
                skillCode,
                aiGenerated: true,
            },
            order: [['evaluatedAt', 'DESC']],
        });

        if (!aiEval) {
            return res
                .status(404)
                .json({ error: 'Nenhuma avaliação IA encontrada' });
        }

        const comparison = await compareEvaluations(
            studentId,
            projectId,
            skillCode,
            manualLevel,
            aiEval.chosenLevel
        );

        res.json({ success: true, comparison });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// POST gerar feedback automático
// ==========================================
router.post('/generate-feedback', async (req, res) => {
    try {
        const { studentId, projectId, skillCode } = req.body;

        const result = await generateStudentFeedback(
            studentId,
            projectId,
            skillCode
        );

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// GET avaliações com análise IA
// ==========================================
router.get('/student-evaluations-ai/:projectId/:studentId', async (req, res) => {
    try {
        const { projectId, studentId } = req.params;

        const evaluations = await db.StudentSkillEvaluation.findAll({
            where: {
                projectId,
                studentId,
                aiGenerated: true,
            },
            order: [['evaluatedAt', 'DESC']],
        });

        res.json({ data: evaluations });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
