import express from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import nodemailer from 'nodemailer';
import {
    Project,
    BnccSkill,
    ProjectSkill,
    StudentSkillEvaluation,
    StudentSkillSummary,
    StudentSkillShare,
    BnccNotification,
    User
} from '../models/index.js';

const router = express.Router();

// ==========================================
// 6. GET /api/bncc-advanced/coverage/by-year/:classId/:year
// COBERTURA BNCC - % habilidades cobertas por série/disciplina
// ==========================================
router.get('/coverage/by-year/:classId/:year', async (req, res) => {
    try {
        const { classId, year } = req.params;

        const allSkills = await BnccSkill.findAll({
            where: { year: parseInt(year) },
        });

        const projects = await Project.findAll({
            where: { classId },
        });

        const projectIds = projects.map(p => p.id);

        const linkedSkills = await ProjectSkill.findAll({
            where: { projectId: { [Op.in]: projectIds } },
            attributes: ['skillCode', 'disciplineId'],
            raw: true,
        });

        const evaluatedSkills = await StudentSkillEvaluation.findAll({
            where: { projectId: { [Op.in]: projectIds } },
            attributes: ['skillCode', 'disciplineId'],
            raw: true,
        });

        const coverage = {};
        allSkills.forEach(s => {
            if (!coverage[s.disciplineId]) {
                coverage[s.disciplineId] = { total: 0, linked: 0, evaluated: 0 };
            }
            coverage[s.disciplineId].total += 1;
        });

        linkedSkills.forEach(ls => {
            if (coverage[ls.disciplineId]) coverage[ls.disciplineId].linked += 1;
        });

        evaluatedSkills.forEach(es => {
            if (coverage[es.disciplineId]) coverage[es.disciplineId].evaluated += 1;
        });

        const result = Object.entries(coverage).map(([disc, data]) => ({
            discipline: disc,
            total: data.total,
            linked: data.linked,
            evaluated: data.evaluated,
            coveragePercent: Math.round((data.evaluated / data.total) * 100),
        }));

        res.json({ data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 7. GET /api/bncc-advanced/compare-classes/:schoolId/:year
// COMPARAÇÃO ENTRE TURMAS
// ==========================================
// TEMPORARIAMENTE DESABILITADO - Requer model Class
/*
router.get('/compare-classes/:schoolId/:year', async (req, res) => {
    try {
        const { schoolId, year } = req.params;

        const classes = await Class.findAll({
            where: { schoolId },
        });

        const comparison = await Promise.all(
            classes.map(async (cls) => {
                const projects = await Project.findAll({
                    where: { classId: cls.id },
                });

                const projectIds = projects.map(p => p.id);

                const avgLevel = await StudentSkillEvaluation.findOne({
                    attributes: [[sequelize.fn('AVG', sequelize.col('chosenLevel')), 'avg']],
                    where: { projectId: { [Op.in]: projectIds } },
                    raw: true,
                });

                const avgPoints = await StudentSkillEvaluation.findOne({
                    attributes: [[sequelize.fn('AVG', sequelize.col('points')), 'avg']],
                    where: { projectId: { [Op.in]: projectIds } },
                    raw: true,
                });

                const skillsDeveloped = await StudentSkillEvaluation.count({
                    where: {
                        projectId: { [Op.in]: projectIds },
                        chosenLevel: { [Op.gte]: 4 },
                    },
                });

                return {
                    classId: cls.id,
                    className: cls.name,
                    averageLevel: avgLevel?.avg ? Math.round(parseFloat(avgLevel.avg) * 100) / 100 : 0,
                    averagePoints: avgPoints?.avg ? Math.round(parseFloat(avgPoints.avg) * 100) / 100 : 0,
                    skillsDeveloped,
                };
            })
        );

        res.json({ data: comparison });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
*/

// ==========================================
// 8. POST /api/bncc-advanced/suggestions/:studentId/:projectId
// SUGESTÕES AUTOMÁTICAS
// ==========================================
router.post('/suggestions/:studentId/:projectId', async (req, res) => {
    try {
        const { studentId, projectId } = req.params;

        const evaluations = await StudentSkillEvaluation.findAll({
            where: { projectId, studentId },
        });

        if (evaluations.length === 0) {
            return res.json({ data: [] });
        }

        const suggestions = [];

        const notPresented = evaluations.filter(e => e.chosenLevel <= 1);
        if (notPresented.length > 0) {
            suggestions.push({
                type: 'warning',
                priority: 'high',
                title: `${notPresented.length} habilidade(s) não apresentada(s)`,
                description: 'Aluno não conseguiu demonstrar essas habilidades',
                recommendation: 'Ofereça reforço individual ou aulas extras',
                skillCodes: notPresented.map(e => e.skillCode),
            });
        }

        const byDiscipline = {};
        evaluations.forEach(e => {
            if (!byDiscipline[e.disciplineId]) byDiscipline[e.disciplineId] = [];
            byDiscipline[e.disciplineId].push(e);
        });

        Object.entries(byDiscipline).forEach(([disc, evals]) => {
            const avgLevel = evals.reduce((s, e) => s + e.chosenLevel, 0) / evals.length;
            if (avgLevel < 2.5) {
                suggestions.push({
                    type: 'warning',
                    priority: 'high',
                    title: `Desempenho baixo em ${disc}`,
                    description: `Nível médio: ${avgLevel.toFixed(1)}/5`,
                    recommendation: 'Considere intervenção pedagógica na disciplina',
                    skillCodes: evals.map(e => e.skillCode),
                });
            }
        });

        const developed = evaluations.filter(e => e.chosenLevel >= 4);
        if (developed.length > evaluations.length * 0.7) {
            suggestions.push({
                type: 'success',
                priority: 'low',
                title: 'Excelente desempenho geral',
                description: 'Aluno demonstra domínio em >70% das habilidades',
                recommendation: 'Considere desafios adicionais ou monitoria para colegas',
                skillCodes: developed.map(e => e.skillCode),
            });
        }

        res.json({ data: suggestions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 9. POST /api/bncc-advanced/share/:projectId/:studentId
// COMPARTILHAMENTO
// ==========================================
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

router.post('/share/:projectId/:studentId', async (req, res) => {
    try {
        if (!transporter) {
            return res.status(500).json({ error: 'Email não configurado' });
        }

        const { projectId, studentId } = req.params;
        const { recipientEmail, recipientName } = req.body;

        const summary = await StudentSkillSummary.findOne({
            where: { projectId, studentId },
        });

        if (!summary) {
            return res.status(404).json({ error: 'Resumo não encontrado' });
        }

        const project = await Project.findByPk(projectId);
        const student = await User.findByPk(studentId);

        const htmlEmail = `
      <html>
        <body style="font-family: Arial">
          <h2>Relatório de Desempenho - ${project?.title || 'Projeto'}</h2>
          <p>Prezado(a) ${recipientName},</p>
          <p>Segue abaixo o relatório de desempenho em habilidades BNCC do aluno ${student?.name || 'Aluno'}:</p>
          
          <h3>Resumo:</h3>
          <ul>
            <li>Total de Habilidades: ${summary.totalSkills}</li>
            <li>Desenvolvidas: ${summary.skillsDeveloped45}</li>
            <li>Em Desenvolvimento: ${summary.skillsInProgress3}</li>
            <li>Nível Médio: ${summary.averageSkillLevel}/5</li>
            <li>Pontuação: ${summary.averagePoints}/10</li>
          </ul>

          <p>Para visualizar o relatório completo, clique <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/relatorio/${projectId}/${studentId}">aqui</a></p>
        </body>
      </html>
    `;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: `Relatório de Desempenho - ${project?.title || 'Projeto'}`,
            html: htmlEmail,
        });

        await StudentSkillShare.create({
            projectId,
            studentId,
            sharedWith: recipientEmail,
            sharedAt: new Date(),
        });

        res.json({ message: 'Relatório compartilhado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// 10. NOTIFICAÇÕES
// ==========================================
router.post('/notifications/create', async (req, res) => {
    try {
        const { projectId, studentId, type, message } = req.body;

        const notification = await BnccNotification.create({
            projectId,
            studentId,
            type,
            message,
            read: false,
        });

        res.status(201).json({ data: notification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/notifications/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;

        const notifications = await BnccNotification.findAll({
            where: { studentId },
            order: [['createdAt', 'DESC']],
        });

        res.json({ data: notifications });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/notifications/:id/read', async (req, res) => {
    try {
        const { id } = req.params;

        await BnccNotification.update(
            { read: true },
            { where: { id } }
        );

        res.json({ message: 'Notificação marcada como lida' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
