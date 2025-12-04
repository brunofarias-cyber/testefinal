import db from '../models/index.js';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Gera heatmap de dificuldade por habilidade/turma
 */
async function generateDifficultyHeatmap(projectId) {
    try {
        const evaluations = await db.StudentSkillEvaluation.findAll({
            where: { projectId },
            include: [
                {
                    model: db.User, // Changed from Student to User
                    as: 'student',
                    attributes: ['id', 'name'],
                },
            ],
        });

        const heatmapData = {};

        evaluations.forEach(e => {
            const key = `${e.skillCode}`;
            if (!heatmapData[key]) {
                heatmapData[key] = {
                    skillCode: e.skillCode,
                    avgLevel: 0,
                    count: 0,
                    difficulty: 'medium',
                    color: '#fbbf24',
                    students: [],
                };
            }
            heatmapData[key].avgLevel += e.chosenLevel;
            heatmapData[key].count++;
            heatmapData[key].students.push({
                studentId: e.studentId,
                level: e.chosenLevel,
            });
        });

        // Calcular médias e cores
        const heatmap = Object.values(heatmapData).map(item => {
            const avg = item.avgLevel / item.count;

            return {
                skillCode: item.skillCode,
                avgLevel: avg.toFixed(2),
                count: item.count,
                difficulty:
                    avg >= 4
                        ? 'easy'
                        : avg >= 3
                            ? 'medium'
                            : avg >= 2
                                ? 'hard'
                                : 'very-hard',
                color:
                    avg >= 4
                        ? '#10b981'
                        : avg >= 3
                            ? '#fbbf24'
                            : avg >= 2
                                ? '#f97316'
                                : '#dc2626',
                distribution: generateDistribution(item.students),
            };
        });

        return heatmap.sort((a, b) => parseFloat(a.avgLevel) - parseFloat(b.avgLevel));
    } catch (error) {
        console.error('Erro heatmap:', error);
        throw error;
    }
}

function generateDistribution(students) {
    const dist = { level1: 0, level2: 0, level3: 0, level4: 0, level5: 0 };
    students.forEach(s => {
        dist[`level${Math.round(s.level)}`]++;
    });
    return dist;
}

/**
 * Previsão de notas usando tendência + IA
 */
async function predictGrades(projectId, studentId) {
    try {
        // Histórico de notas
        const evaluations = await db.StudentSkillEvaluation.findAll({
            where: { studentId, projectId },
            order: [['evaluatedAt', 'ASC']],
        });

        if (evaluations.length < 2) {
            return { prediction: null, reason: 'Dados insuficientes' };
        }

        // Calcular tendência
        const points = evaluations.map(e => e.points || 0);
        const trend = points[points.length - 1] - points[0];
        const trendPercentage = ((trend / points[0]) * 100).toFixed(1);

        // Regressão simples
        const predicted = predictLinearRegression(points);

        // Usar IA para contexto
        const aiPrediction = await client.messages.create({
            model: 'claude-3-opus-20240229', // Updated model name
            max_tokens: 512,
            messages: [
                {
                    role: 'user',
                    content: `Baseado no histórico de notas de um aluno:
- Notas anteriores: ${points.map(p => p.toFixed(1)).join(', ')}
- Tendência: ${trendPercentage}%
- Previsão linear: ${predicted.toFixed(1)}/10

Qual será a nota final provável e por quê?
Responda em 2-3 linhas.`,
                },
            ],
        });

        return {
            predictedGrade: predicted.toFixed(1),
            trend: trendPercentage,
            trendDirection: trend > 0 ? 'up' : 'down',
            aiInsight: aiPrediction.content[0].text,
            probability: calculateProbability(predicted),
        };
    } catch (error) {
        console.error('Erro previsão:', error);
        throw error;
    }
}

function predictLinearRegression(points) {
    const n = points.length;
    const xMean = (n - 1) / 2;
    const yMean = points.reduce((a, b) => a + b) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
        numerator += (i - xMean) * (points[i] - yMean);
        denominator += (i - xMean) ** 2;
    }

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = yMean - slope * xMean;

    const prediction = slope * (n - 1) + intercept;
    return Math.min(Math.max(prediction, 0), 10);
}

function calculateProbability(grade) {
    if (grade >= 8.5) return { level: 'high', percentage: 85 };
    if (grade >= 7) return { level: 'medium', percentage: 65 };
    if (grade >= 5) return { level: 'low', percentage: 40 };
    return { level: 'very-low', percentage: 10 };
}

/**
 * Relatório automático de desempenho
 */
async function generatePerformanceReport(projectId, classId) {
    try {
        // Note: classId field may not exist in User model - this might need adjustment
        const students = await db.User.findAll({
            where: { role: 'student' }, // Simplified - may need class filtering logic
        });

        const evaluations = await db.StudentSkillEvaluation.findAll({
            where: { projectId },
            include: [
                {
                    model: db.User,
                    as: 'student',
                    where: { role: 'student' },
                },
            ],
        });

        // Agregar dados
        const stats = {
            totalStudents: students.length,
            avgGrade: 0,
            passRate: 0,
            topPerformers: [],
            needsSupport: [],
            skillsWithDifficulty: [],
        };

        const studentGrades = {};

        evaluations.forEach(e => {
            if (!studentGrades[e.studentId]) {
                studentGrades[e.studentId] = [];
            }
            studentGrades[e.studentId].push(e.points);
        });

        // Calcular médias
        let totalGrade = 0;
        let passCount = 0;

        for (const [studentId, grades] of Object.entries(studentGrades)) {
            const avg = grades.reduce((a, b) => a + b) / grades.length;
            totalGrade += avg;

            if (avg >= 6) passCount++;

            const student = students.find(s => s.id === parseInt(studentId));

            if (avg >= 8.5) {
                stats.topPerformers.push({
                    name: student?.name,
                    grade: avg.toFixed(1),
                });
            } else if (avg < 5) {
                stats.needsSupport.push({
                    name: student?.name,
                    grade: avg.toFixed(1),
                });
            }
        }

        stats.avgGrade = (totalGrade / Object.keys(studentGrades).length).toFixed(1);
        stats.passRate = ((passCount / students.length) * 100).toFixed(1);

        // Skills com dificuldade
        const skillStats = {};
        evaluations.forEach(e => {
            if (!skillStats[e.skillCode]) {
                skillStats[e.skillCode] = { sum: 0, count: 0 };
            }
            skillStats[e.skillCode].sum += e.chosenLevel;
            skillStats[e.skillCode].count++;
        });

        for (const [skill, data] of Object.entries(skillStats)) {
            const avg = data.sum / data.count;
            if (avg < 3) {
                stats.skillsWithDifficulty.push({
                    skillCode: skill,
                    avgLevel: avg.toFixed(1),
                });
            }
        }

        // Gerar insights com IA
        const reportPrompt = `Gere um relatório executivo para o projeto baseado em:
- Média geral: ${stats.avgGrade}/10
- Taxa de aprovação: ${stats.passRate}%
- Alunos em risco: ${stats.needsSupport.length}
- Alunos excelentes: ${stats.topPerformers.length}
- Habilidades com dificuldade: ${stats.skillsWithDifficulty.length}

Forneça 3-4 recomendações práticas.`;

        const aiReport = await client.messages.create({
            model: 'claude-3-opus-20240229', // Updated model name
            max_tokens: 1024,
            messages: [{ role: 'user', content: reportPrompt }],
        });

        stats.aiInsights = aiReport.content[0].text;

        return stats;
    } catch (error) {
        console.error('Erro relatório:', error);
        throw error;
    }
}

/**
 * Comparação de turmas
 */
async function compareClasses(projectId, classIds) {
    try {
        const comparison = {};

        for (const classId of classIds) {
            const evaluations = await db.StudentSkillEvaluation.findAll({
                where: { projectId },
                include: [
                    {
                        model: db.User,
                        as: 'student',
                        where: { role: 'student' }, // Simplified - may need class filtering
                        attributes: ['id', 'name'],
                    },
                ],
            });

            const grades = evaluations.map(e => e.points || 0);
            const avgGrade = grades.reduce((a, b) => a + b, 0) / grades.length || 0;

            comparison[classId] = {
                className: `Turma ${classId}`,
                avgGrade: avgGrade.toFixed(1),
                studentCount: new Set(evaluations.map(e => e.studentId)).size,
                evaluationCount: evaluations.length,
            };
        }

        return comparison;
    } catch (error) {
        console.error('Erro comparação:', error);
        throw error;
    }
}


export {
    generateDifficultyHeatmap,
    predictGrades,
    generatePerformanceReport,
    compareClasses,
};
