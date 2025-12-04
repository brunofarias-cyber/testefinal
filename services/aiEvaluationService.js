import db from '../models/index.js';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Avalia aluno baseado em:
 * 1. Rubrica do projeto
 * 2. Referências teóricas (PDF armazenado)
 * 3. Evidências da avaliação
 */
async function evaluateStudentWithContext(
    studentId,
    projectId,
    skillCode,
    studentEvidence,
    rubric
) {
    try {
        // 1. Buscar referência teórica relevante
        const theoreticalRef = await db.TheoreticalReference.findOne({
            where: {
                category: 'active-methodologies',
                processingStatus: 'completed',
            },
        });

        // 2. Buscar avaliações anteriores (histórico)
        const previousEvals = await db.StudentSkillEvaluation.findAll({
            where: { studentId, skillCode },
            order: [['evaluatedAt', 'DESC']],
            limit: 3,
        });

        // 3. Construir contexto teórico
        const theoryContext = theoreticalRef
            ? `
REFERÊNCIA TEÓRICA:
${theoreticalRef.keyInsights
                .map(insight => JSON.stringify(insight))
                .join('\n')}
      `
            : '';

        // 4. Histórico de desempenho
        const historyContext =
            previousEvals.length > 0
                ? `
HISTÓRICO DE AVALIAÇÕES ANTERIORES:
${previousEvals.map(e => `- Nível: ${e.chosenLevel}/5 | Pontos: ${e.points} | Data: ${e.evaluatedAt}`).join('\n')}
      `
                : 'Primeira avaliação deste aluno nesta habilidade.';

        // 5. Chamar Claude para análise contextualizada
        const aiAnalysis = await client.messages.create({
            model: 'claude-3-opus-20240229', // Updated model name
            max_tokens: 2048,
            messages: [
                {
                    role: 'user',
                    content: `Você é um avaliador educacional especializado em metodologias ativas de ensino.

CONTEXTO TEÓRICO (Fonte: Bacich & Moran - Metodologias Ativas):
${theoryContext}

${historyContext}

TAREFA DE AVALIAÇÃO:
- Habilidade BNCC: ${skillCode}
- Evidência Apresentada: ${studentEvidence}
- Rubrica: ${JSON.stringify(rubric)}

Com base na teoria de metodologias ativas e no contexto do aluno, forneça:

1. **Nível Recomendado**: 1-5 (baseado na rubrica)
2. **Análise Teórica**: Como a evidência se conecta com as metodologias ativas descritas
3. **Justificativa**: Por que esse nível?
4. **Pontos Fortes**: O que o aluno fez bem
5. **Áreas de Melhoria**: O que precisa melhorar
6. **Próximos Passos**: Sugestões para evolução
7. **Confiança**: De 1-10, quão confiante você está nesta avaliação

Responda em JSON estruturado.`,
                },
            ],
        });

        const analysisText = aiAnalysis.content[0].text;
        let analysis;
        try {
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : analysisText;
            analysis = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse AI response", e);
            // Fallback or rethrow
            throw new Error("Failed to parse AI response");
        }

        // 6. Salvar avaliação com análise IA
        const evaluation = await db.StudentSkillEvaluation.create({
            projectId,
            studentId,
            skillCode,
            chosenLevel: analysis['Nível Recomendado'],
            points: (analysis['Nível Recomendado'] * 2).toFixed(1),
            evidence: studentEvidence,
            feedback: analysis['Análise Teórica'],
            aiGenerated: true,
            aiConfidence: analysis['Confiança'],
            aiAnalysis: analysis,
            evaluatedAt: new Date(),
        });

        // 7. Gerar insights automáticos
        const insights = {
            strengths: analysis['Pontos Fortes'],
            improvements: analysis['Áreas de Melhoria'],
            nextSteps: analysis['Próximos Passos'],
            theoreticalConnection: analysis['Análise Teórica'],
        };

        return {
            success: true,
            evaluation: evaluation.toJSON(),
            aiAnalysis: analysis,
            insights,
            referencesUsed: theoreticalRef ? theoreticalRef.title : 'Nenhuma',
        };
    } catch (error) {
        console.error('Erro na avaliação com IA:', error);
        throw error;
    }
}

/**
 * Gera relatório comparativo entre avaliação manual e IA
 */
async function compareEvaluations(
    studentId,
    projectId,
    skillCode,
    manualLevel,
    aiLevel
) {
    const difference = Math.abs(manualLevel - aiLevel);

    let comparisonFeedback = '';

    if (difference === 0) {
        comparisonFeedback =
            '✓ Avaliação manual alinhada com análise IA - decisão confiável';
    } else if (difference <= 1) {
        comparisonFeedback =
            'Pequena divergência entre avaliações - revisar com cuidado';
    } else {
        comparisonFeedback =
            'Divergência significativa - recomenda-se revisão detalhada da rubrica';
    }

    return {
        manualLevel,
        aiLevel,
        difference,
        feedback: comparisonFeedback,
        recommendation:
            aiLevel >= manualLevel
                ? 'Considere avaliar positivamente'
                : 'Solicitar mais evidências',
    };
}

/**
 * Gera sugestões automáticas de feedback para o aluno
 */
async function generateStudentFeedback(studentId, projectId, skillCode) {
    try {
        const evaluation = await db.StudentSkillEvaluation.findOne({
            where: { studentId, projectId, skillCode },
            order: [['evaluatedAt', 'DESC']],
        });

        if (!evaluation) {
            return { error: 'Nenhuma avaliação encontrada' };
        }

        // Check if StudentFeedback model exists before trying to use it
        if (!db.StudentFeedback) {
            console.warn("StudentFeedback model not found. Skipping database save.");
            // Return generated feedback without saving if model is missing
        }

        const theoreticalRef = await db.TheoreticalReference.findOne({
            where: { processingStatus: 'completed' },
        });

        const feedbackPrompt = `Com base na teoria de metodologias ativas (Bacich & Moran), 
crie um feedback construtivo para um aluno que:
- Alcançou nível ${evaluation.chosenLevel}/5
- Habilidade: ${skillCode}
- Evidência: ${evaluation.evidence}

O feedback deve ser motivador, específico e oferecer próximos passos claros.`;

        const response = await client.messages.create({
            model: 'claude-3-opus-20240229',
            max_tokens: 1024,
            messages: [{ role: 'user', content: feedbackPrompt }],
        });

        const feedback = response.content[0].text;

        // Salvar feedback se o model existir
        if (db.StudentFeedback) {
            await db.StudentFeedback.create({
                studentId,
                projectId,
                skillCode,
                feedback,
                generatedBy: 'ai',
                type: 'encouragement',
            });
        }

        return { success: true, feedback };
    } catch (error) {
        console.error('Erro ao gerar feedback:', error);
        throw error;
    }
}


export {
    evaluateStudentWithContext,
    compareEvaluations,
    generateStudentFeedback,
};
