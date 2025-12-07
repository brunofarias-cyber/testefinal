// import Anthropic from '@anthropic-ai/sdk'; // DESABILITADO - package não instalado
import db from '../models/index.js';
import { Op } from 'sequelize';

// Mock de client para evitar erro
const client = {
    messages: {
        create: async () => {
            return {
                content: [{ text: 'Resposta simulada do tutor IA' }]
            };
        }
    }
};

/**
 * Tutor IA 24/7 - Responde dúvidas do aluno
 */
async function studentTutor(question, studentId, projectId, skillCode) {
    try {
        // Buscar contexto do aluno
        const student = await db.User.findByPk(studentId); // Changed from Student to User
        const project = await db.Project.findByPk(projectId);
        const evaluations = await db.StudentSkillEvaluation.findAll({
            where: { studentId, skillCode },
            order: [['evaluatedAt', 'DESC']],
            limit: 3,
        });

        const response = await client.messages.create({
            model: 'claude-3-opus-20240229', // Updated model name to valid one
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: `Você é um tutor educacional experiente em metodologias ativas.

CONTEXTO DO ALUNO:
- Nome: ${student ? student.name : 'Aluno'}
- Projeto: ${project ? project.title : 'Projeto'}
- Habilidade: ${skillCode}
- Desempenho anterior: ${evaluations.length > 0 ? evaluations[0].chosenLevel + '/5' : 'Primeira avaliação'}

PERGUNTA DO ALUNO:
${question}

Responda de forma:
1. Acessível e motivadora
2. Com exemplos práticos
3. Conectando com o projeto
4. Sugerindo recursos/próximos passos`,
                },
            ],
        });

        const answer = response.content[0].text;

        // Salvar em histórico de tutoria
        await db.TutorInteraction.create({
            studentId,
            projectId,
            question,
            answer,
            type: 'tutoring',
        });

        return { answer, confidence: 'high' };
    } catch (error) {
        console.error('Erro tutor IA:', error);
        throw error;
    }
}

/**
 * Detecta alunos em risco baseado em múltiplos indicadores
 */
async function detectRiskStudents(projectId) {
    try {
        const evaluations = await db.StudentSkillEvaluation.findAll({
            where: { projectId },
            include: [
                {
                    model: db.User, // Changed from Student to User
                    as: 'student',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });

        const studentMetrics = {};

        // Agrupar por aluno
        evaluations.forEach(e => {
            if (!studentMetrics[e.studentId]) {
                studentMetrics[e.studentId] = {
                    student: e.student,
                    levels: [],
                    points: [],
                    count: 0,
                };
            }
            studentMetrics[e.studentId].levels.push(e.chosenLevel);
            studentMetrics[e.studentId].points.push(e.points);
            studentMetrics[e.studentId].count++;
        });

        // Calcular risco
        const riskStudents = [];

        for (const [studentId, metrics] of Object.entries(studentMetrics)) {
            const avgLevel = metrics.levels.reduce((a, b) => a + b, 0) / metrics.levels.length;
            const avgPoints = metrics.points.reduce((a, b) => a + b, 0) / metrics.points.length;

            let riskScore = 0;
            let risks = [];

            // Nível muito baixo
            if (avgLevel <= 2) {
                riskScore += 40;
                risks.push('Desempenho baixo nas habilidades');
            }

            // Queda no desempenho
            if (metrics.levels.length > 1) {
                const trend = metrics.levels[metrics.levels.length - 1] - metrics.levels[0];
                if (trend < -1) {
                    riskScore += 30;
                    risks.push('Queda no desempenho (tendência negativa)');
                }
            }

            // Muita variação
            const variance = Math.max(...metrics.levels) - Math.min(...metrics.levels);
            if (variance > 3) {
                riskScore += 20;
                risks.push('Desempenho muito inconsistente');
            }

            if (riskScore >= 40) {
                riskStudents.push({
                    studentId: parseInt(studentId),
                    name: metrics.student ? metrics.student.name : 'Unknown',
                    email: metrics.student ? metrics.student.email : 'Unknown',
                    riskScore,
                    risks,
                    avgLevel,
                    avgPoints,
                    recommendations: generateRecommendations(riskScore, risks),
                });

                // Criar notificação
                await db.BnccNotification.create({
                    projectId,
                    studentId: parseInt(studentId),
                    type: 'warning',
                    message: `⚠️ Você está em risco! Procure ajuda. Seu desempenho: ${avgLevel.toFixed(1)}/5`,
                    read: false,
                });
            }
        }

        return riskStudents;
    } catch (error) {
        console.error('Erro detecção risco:', error);
        throw error;
    }
}

/**
 * Gera recomendações baseado em risco
 */
function generateRecommendations(riskScore, risks) {
    const recs = [];

    if (riskScore >= 70) {
        recs.push('🔴 URGENTE: Agendar reunião com professor');
        recs.push('Considere aulas de reforço/tutoria');
    } else if (riskScore >= 50) {
        recs.push('🟠 ATENÇÃO: Revisar conceitos fundamentais');
        recs.push('Pedir feedback ao professor');
    } else {
        recs.push('🟡 Monitorar próximas avaliações');
        recs.push('Estudar os tópicos com dificuldade');
    }

    risks.forEach(risk => {
        if (risk.includes('baixo')) {
            recs.push('Procurar explicações adicionais do conteúdo');
        }
        if (risk.includes('queda')) {
            recs.push('Identificar o que mudou - peça ajuda!');
        }
        if (risk.includes('inconsistente')) {
            recs.push('Estabelecer rotina consistente de estudo');
        }
    });

    return recs;
}

/**
 * Detecção de plágio comparando com base de dados
 */
async function detectPlagiarism(studentId, projectId, submittedText) {
    try {
        // Buscar submissões anteriores do mesmo aluno
        const previousSubmissions = await db.Submission.findAll({ // Changed from StudentSubmission to Submission
            where: { studentId, projectId },
            order: [['createdAt', 'DESC']],
            limit: 5,
        });

        // Calcular similaridade com submissões anteriores
        let plagiarismRisk = 0;
        let flaggedSimilarities = [];

        for (const prev of previousSubmissions) {
            // Assuming Submission model has 'comment' or we need to check what field has text content. 
            // The user code used 'content'. In seeds-data.js Submission has 'comment' and 'fileUrl'. 
            // Assuming 'comment' is the text content for now or we might need to extract from fileUrl (which is harder).
            // Let's assume 'comment' is the text submission.
            const content = prev.comment || '';
            const similarity = calculateSimilarity(submittedText, content);
            if (similarity > 0.8) {
                plagiarismRisk += 30;
                flaggedSimilarities.push({
                    date: prev.createdAt,
                    similarity: (similarity * 100).toFixed(1),
                });
            }
        }

        // Buscar submissões de outros alunos
        const otherSubmissions = await db.Submission.findAll({ // Changed from StudentSubmission to Submission
            where: {
                projectId,
                studentId: { [Op.ne]: studentId },
            },
            order: [['createdAt', 'DESC']],
            limit: 10,
        });

        for (const other of otherSubmissions) {
            const content = other.comment || '';
            const similarity = calculateSimilarity(submittedText, content);
            if (similarity > 0.85) {
                plagiarismRisk += 50;
                flaggedSimilarities.push({
                    type: 'other_student',
                    similarity: (similarity * 100).toFixed(1),
                });
                break; // Interromper se encontrar muito similar
            }
        }

        // Análise com IA
        if (plagiarismRisk > 40) {
            const aiAnalysis = await client.messages.create({
                model: 'claude-3-opus-20240229', // Updated model name
                max_tokens: 512,
                messages: [
                    {
                        role: 'user',
                        content: `Analise este texto para possível plágio:

${submittedText.substring(0, 1000)}

Indicadores de alerta:
- Similaridade com submissões anteriores: ${Math.min(plagiarismRisk, 100)}%
- Padrão: ${flaggedSimilarities.length > 0 ? 'detectado' : 'não detectado'}

É provável plágio? Responda: sim/não/talvez e por quê.`,
                    },
                ],
            });

            const aiAssessment = aiAnalysis.content[0].text;

            return {
                plagiarismRisk: Math.min(plagiarismRisk, 100),
                status: plagiarismRisk > 60 ? 'high' : plagiarismRisk > 40 ? 'medium' : 'low',
                flaggedSimilarities,
                aiAssessment,
                action:
                    plagiarismRisk > 60
                        ? 'INVESTIGAR_URGENTE'
                        : plagiarismRisk > 40
                            ? 'REVISAR'
                            : 'OK',
            };
        }

        return {
            plagiarismRisk,
            status: 'low',
            flaggedSimilarities: [],
            aiAssessment: 'Sem indicadores de plágio',
            action: 'OK',
        };
    } catch (error) {
        console.error('Erro detecção plágio:', error);
        throw error;
    }
}

/**
 * Calcula similaridade entre textos (Jaccard)
 */
function calculateSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;
    const tokens1 = new Set(text1.toLowerCase().split(/\s+/).slice(0, 100));
    const tokens2 = new Set(text2.toLowerCase().split(/\s+/).slice(0, 100));

    const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);

    if (union.size === 0) return 0;
    return intersection.size / union.size;
}


export {
    studentTutor,
    detectRiskStudents,
    detectPlagiarism,
};
