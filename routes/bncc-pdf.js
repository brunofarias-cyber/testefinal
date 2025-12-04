import express from 'express';
import PDFDocument from 'pdfkit';
import {
    Project,
    User,
    BnccSkill,
    StudentSkillEvaluation,
    StudentSkillSummary
} from '../models/index.js';

const router = express.Router();

// ==========================================
// GET /api/bncc-pdf/report/:projectId/:studentId
// ==========================================
router.get('/report/:projectId/:studentId', async (req, res) => {
    try {
        const { projectId, studentId } = req.params;

        const project = await Project.findByPk(projectId);
        const student = await User.findByPk(studentId);
        const evaluations = await StudentSkillEvaluation.findAll({
            where: { projectId, studentId },
            order: [['disciplineId', 'ASC']],
        });

        const summary = await StudentSkillSummary.findOne({
            where: { projectId, studentId },
        });

        if (!evaluations.length) {
            return res.status(404).json({ error: 'Nenhuma avaliação encontrada' });
        }

        const doc = new PDFDocument({ margin: 50 });
        const studentName = student?.name || `Aluno_${studentId}`;
        const filename = `relatorio_${studentName.replace(/\s+/g, '_')}_${projectId}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        doc.pipe(res);

        // Header
        doc.fontSize(24).font('Helvetica-Bold').text('RELATÓRIO PEDAGÓGICO', { align: 'center' });
        doc.fontSize(10).text('Baseado em Habilidades BNCC', { align: 'center' });
        doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
        doc.moveDown();

        // Informações básicas
        doc.fontSize(12).font('Helvetica-Bold').text('Informações Básicas', { underline: true });
        doc.fontSize(10).font('Helvetica').text(`Aluno: ${studentName}`);
        doc.text(`Projeto: ${project?.title || 'N/A'}`);
        doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`);
        doc.moveDown();

        // Resumo
        if (summary) {
            doc.fontSize(12).font('Helvetica-Bold').text('Resumo Executivo', { underline: true });
            doc.fontSize(10).font('Helvetica');
            doc.text(`Total de Habilidades Avaliadas: ${summary.totalSkills}`);
            doc.text(`Desenvolvidas (Nível 4-5): ${summary.skillsDeveloped45}`);
            doc.text(`Em Desenvolvimento (Nível 3): ${summary.skillsInProgress3}`);
            doc.text(`Não Apresentadas (Nível 1-2): ${summary.skillsNotPresented12}`);
            doc.text(`Média de Nível: ${summary.averageSkillLevel}/5`);
            doc.text(`Pontuação Média: ${summary.averagePoints}/10`);
            doc.moveDown();
        }

        // Avaliações por habilidade
        doc.fontSize(12).font('Helvetica-Bold').text('Detalhamento por Habilidade', { underline: true });
        doc.moveDown(0.5);

        const byDiscipline = {};
        evaluations.forEach(e => {
            if (!byDiscipline[e.disciplineId]) byDiscipline[e.disciplineId] = [];
            byDiscipline[e.disciplineId].push(e);
        });

        Object.entries(byDiscipline).forEach(([disc, evals]) => {
            doc.fontSize(11).font('Helvetica-Bold').text(`${disc.toUpperCase()}`);
            doc.fontSize(9).font('Helvetica');

            evals.forEach(e => {
                const levelLabel = {
                    1: 'Não Apresentado',
                    2: 'Iniciante',
                    3: 'Em Desenvolvimento',
                    4: 'Desenvolvido',
                    5: 'Avançado',
                }[e.chosenLevel];

                doc.text(`${e.skillCode} - Nível: ${levelLabel} (${e.chosenLevel}/5)`);
                if (e.evidence) {
                    doc.fontSize(8).text(`Evidência: ${e.evidence}`, { width: 450 });
                }
                if (e.feedback) {
                    doc.fontSize(8).text(`Feedback: ${e.feedback}`, { width: 450 });
                }
                doc.moveDown(0.3);
            });
            doc.moveDown(0.5);
        });

        // Recomendações
        doc.addPage();
        doc.fontSize(12).font('Helvetica-Bold').text('Recomendações', { underline: true });
        doc.fontSize(10).font('Helvetica');

        const atRisk = evaluations.filter(e => e.chosenLevel <= 2);
        if (atRisk.length > 0) {
            doc.text(`Habilidades que precisam reforço (${atRisk.length}):`);
            atRisk.forEach(e => {
                doc.fontSize(9).text(`• ${e.skillCode} - Nível ${e.chosenLevel}`);
            });
            doc.moveDown();
        }

        const developed = evaluations.filter(e => e.chosenLevel >= 4);
        if (developed.length > 0) {
            doc.text(`Habilidades bem desenvolvidas (${developed.length}):`);
            developed.forEach(e => {
                doc.fontSize(9).text(`• ${e.skillCode} - Nível ${e.chosenLevel}`);
            });
            doc.moveDown();
        }

        // Footer
        doc.fontSize(8).text('Relatório gerado automaticamente pelo sistema BProjetos', { align: 'center' });
        doc.text(`${new Date().toLocaleString('pt-BR')}`, { align: 'center' });

        doc.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// GET /api/bncc-pdf/class-report/:projectId
// ==========================================
router.get('/class-report/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findByPk(projectId);
        const summaries = await StudentSkillSummary.findAll({
            where: { projectId },
        });

        const doc = new PDFDocument({ margin: 50 });
        const filename = `relatorio_turma_${projectId}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        doc.pipe(res);

        // Header
        doc.fontSize(24).font('Helvetica-Bold').text('RELATÓRIO DA TURMA', { align: 'center' });
        doc.fontSize(14).text(project?.title || 'Projeto', { align: 'center' });
        doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
        doc.moveDown();

        // Estatísticas gerais
        doc.fontSize(12).font('Helvetica-Bold').text('Estatísticas Gerais', { underline: true });
        doc.fontSize(10).font('Helvetica');

        const avgLevel = summaries.length > 0
            ? (summaries.reduce((s, sum) => s + parseFloat(sum.averageSkillLevel || 0), 0) / summaries.length).toFixed(2)
            : 0;

        const avgPoints = summaries.length > 0
            ? (summaries.reduce((s, sum) => s + parseFloat(sum.averagePoints || 0), 0) / summaries.length).toFixed(1)
            : 0;

        doc.text(`Total de Alunos: ${summaries.length}`);
        doc.text(`Média de Nível: ${avgLevel}/5`);
        doc.text(`Média de Pontos: ${avgPoints}/10`);
        doc.moveDown();

        // Tabela de alunos
        doc.fontSize(11).font('Helvetica-Bold').text('Desempenho Individual', { underline: true });
        doc.fontSize(9).font('Helvetica');

        doc.text('Aluno | Avaliações | Desenvolvidas | Nível Médio | Pontos', { underline: true });
        doc.moveDown(0.3);

        summaries.forEach((sum, idx) => {
            const line = `${idx + 1}. | ${sum.totalSkills || 0} | ${sum.skillsDeveloped45 || 0} | ${sum.averageSkillLevel || 0} | ${sum.averagePoints || 0}`;
            doc.text(line);
        });

        doc.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
