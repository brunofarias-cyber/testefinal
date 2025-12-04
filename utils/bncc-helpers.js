import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import {
    Project,
    BnccSkill,
    ProjectSkill,
    StudentSkillEvaluation,
    SkillIndicator,
    BnccNotification
} from '../models/index.js';

// ==========================================
// HELPERS PARA DASHBOARD
// ==========================================

/**
 * Calcula estatísticas de um projeto
 */
export async function calculateProjectStats(projectId) {
    try {
        const evaluations = await StudentSkillEvaluation.findAll({
            where: { projectId },
        });

        if (evaluations.length === 0) {
            return {
                totalEvaluations: 0,
                studentsEvaluated: 0,
                averageLevel: 0,
                averagePoints: 0,
                skillsDeveloped: 0,
            };
        }

        const uniqueStudents = new Set(evaluations.map(e => e.studentId));
        const avgLevel = evaluations.reduce((s, e) => s + e.chosenLevel, 0) / evaluations.length;
        const avgPoints = evaluations.reduce((s, e) => s + parseFloat(e.points || 0), 0) / evaluations.length;
        const developed = evaluations.filter(e => e.chosenLevel >= 4).length;

        return {
            totalEvaluations: evaluations.length,
            studentsEvaluated: uniqueStudents.size,
            averageLevel: Math.round(avgLevel * 100) / 100,
            averagePoints: Math.round(avgPoints * 100) / 100,
            skillsDeveloped: developed,
        };
    } catch (error) {
        console.error('Error calculating project stats:', error);
        throw error;
    }
}

/**
 * Obtém alunos em risco (nível médio <= 2.5)
 */
export async function getAtRiskStudents(projectId) {
    try {
        const data = await StudentSkillEvaluation.findAll({
            attributes: [
                'studentId',
                [sequelize.fn('AVG', sequelize.col('chosenLevel')), 'avgLevel'],
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

        return data.map(d => ({
            studentId: d.studentId,
            averageLevel: Math.round(parseFloat(d.avgLevel) * 100) / 100,
        }));
    } catch (error) {
        console.error('Error getting at-risk students:', error);
        throw error;
    }
}

/**
 * Cria notificação automática
 */
export async function createAutoNotification(projectId, studentId, type, message) {
    try {
        return await BnccNotification.create({
            projectId,
            studentId,
            type,
            message,
            read: false,
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
}

/**
 * Gera sugestões baseadas em análise
 */
export function generateSuggestions(evaluations) {
    const suggestions = [];

    // Habilidades não apresentadas
    const notPresented = evaluations.filter(e => e.chosenLevel <= 1);
    if (notPresented.length > 0) {
        suggestions.push({
            type: 'warning',
            priority: 'high',
            title: `${notPresented.length} habilidade(s) não apresentada(s)`,
            description: 'Aluno não conseguiu demonstrar essas habilidades',
            recommendation: 'Ofereça reforço individual ou aulas extras',
        });
    }

    // Média baixa
    const avgLevel = evaluations.reduce((s, e) => s + e.chosenLevel, 0) / evaluations.length;
    if (avgLevel < 2.5) {
        suggestions.push({
            type: 'warning',
            priority: 'high',
            title: 'Desempenho crítico',
            description: `Nível médio: ${avgLevel.toFixed(1)}/5`,
            recommendation: 'Intervenção pedagógica urgente recomendada',
        });
    }

    // Pontos fortes
    const developed = evaluations.filter(e => e.chosenLevel >= 4);
    if (developed.length > evaluations.length * 0.7) {
        suggestions.push({
            type: 'success',
            priority: 'low',
            title: 'Excelente desempenho',
            description: '>70% das habilidades em nível 4-5',
            recommendation: 'Considere desafios adicionais ou mentoria',
        });
    }

    return suggestions;
}

// ==========================================
// HELPERS PARA RUBRICAS
// ==========================================

/**
 * Cria indicadores padrão para uma habilidade
 */
export async function createDefaultIndicators(projectId, skillCode) {
    const levels = [
        {
            level: 1,
            levelLabel: 'Não Apresentado',
            description: 'Aluno não consegue realizar a habilidade',
            observableBehavior: 'Abandona, nega-se a participar',
            examples: 'Não inicia a tarefa',
            points: 0,
        },
        {
            level: 2,
            levelLabel: 'Iniciante',
            description: 'Realiza com muitos erros',
            observableBehavior: 'Tenta mas erra frequentemente',
            examples: 'Faz com erros recorrentes',
            points: 2.5,
        },
        {
            level: 3,
            levelLabel: 'Em Desenvolvimento',
            description: 'Realiza com poucos erros',
            observableBehavior: 'Consegue fazer com apoio',
            examples: 'Faz a maioria correto',
            points: 5,
        },
        {
            level: 4,
            levelLabel: 'Desenvolvido',
            description: 'Realiza autonomamente',
            observableBehavior: 'Faz sozinho corretamente',
            examples: 'Realiza tarefa completa',
            points: 7.5,
        },
        {
            level: 5,
            levelLabel: 'Avançado',
            description: 'Domina completamente',
            observableBehavior: 'Propõe soluções, ensina outros',
            examples: 'Cria sua própria solução',
            points: 10,
        },
    ];

    try {
        return await SkillIndicator.bulkCreate(
            levels.map(l => ({
                projectId,
                skillCode,
                level: l.level,
                levelLabel: l.levelLabel,
                description: l.description,
                observableBehavior: l.observableBehavior,
                examples: l.examples,
                points: l.points,
            })),
            { ignoreDuplicates: true }
        );
    } catch (error) {
        console.error('Error creating default indicators:', error);
        throw error;
    }
}

// ==========================================
// HELPERS PARA HISTÓRICO
// ==========================================

/**
 * Calcula evolução entre dois pontos
 */
export function calculateEvolution(firstLevel, lastLevel) {
    return lastLevel - firstLevel;
}

/**
 * Classifica tendência
 */
export function classifyTrend(evolution) {
    if (evolution > 0) return 'crescente';
    if (evolution < 0) return 'decrescente';
    return 'estável';
}

/**
 * Formata data para relatório
 */
export function formatDatePT(date) {
    return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
}

// ==========================================
// HELPERS PARA EMAIL
// ==========================================

/**
 * Gera template de email
 */
export function generateEmailTemplate(studentName, projectTitle, stats) {
    return `
    <html>
      <body style="font-family: Arial; color: #333;">
        <h2>Relatório de Desempenho</h2>
        <p>Prezado(a),</p>
        
        <p>Segue relatório de <strong>${studentName}</strong> no projeto <strong>${projectTitle}</strong>:</p>
        
        <div style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
          <p><strong>Total de Habilidades:</strong> ${stats.total}</p>
          <p><strong>Desenvolvidas:</strong> ${stats.developed}</p>
          <p><strong>Nível Médio:</strong> ${stats.avgLevel}/5</p>
          <p><strong>Pontuação:</strong> ${stats.avgPoints}/10</p>
        </div>
        
        <p>Para mais detalhes, acesse a plataforma.</p>
        <p>Atenciosamente,<br>Sistema BProjetos</p>
      </body>
    </html>
  `;
}

// ==========================================
// HELPERS PARA ANÁLISE
// ==========================================

/**
 * Calcula cobertura BNCC
 */
export async function calculateCoverage(projectId) {
    try {
        const total = await ProjectSkill.count({ where: { projectId } });

        const evaluated = await StudentSkillEvaluation.count({
            distinct: true,
            col: 'skillCode',
            where: { projectId },
        });

        const developed = await StudentSkillEvaluation.count({
            distinct: true,
            col: 'skillCode',
            where: {
                projectId,
                chosenLevel: { [Op.gte]: 4 },
            },
        });

        return {
            total,
            evaluated,
            developed,
            percentageCovered: total > 0 ? Math.round((evaluated / total) * 100) : 0,
            percentageDeveloped: total > 0 ? Math.round((developed / total) * 100) : 0,
        };
    } catch (error) {
        console.error('Error calculating coverage:', error);
        throw error;
    }
}

/**
 * Compara desempenho entre classes
 */
export async function compareClasses(classIds) {
    try {
        return await Promise.all(
            classIds.map(async (classId) => {
                const projects = await Project.findAll({ where: { classId } });
                const projectIds = projects.map(p => p.id);

                const avgLevel = await StudentSkillEvaluation.findOne({
                    attributes: [[sequelize.fn('AVG', sequelize.col('chosenLevel')), 'avg']],
                    where: { projectId: { [Op.in]: projectIds } },
                    raw: true,
                });

                return {
                    classId,
                    averageLevel: avgLevel?.avg ? Math.round(parseFloat(avgLevel.avg) * 100) / 100 : 0,
                };
            })
        );
    } catch (error) {
        console.error('Error comparing classes:', error);
        throw error;
    }
}

export default {
    calculateProjectStats,
    getAtRiskStudents,
    createAutoNotification,
    generateSuggestions,
    createDefaultIndicators,
    calculateEvolution,
    classifyTrend,
    formatDatePT,
    generateEmailTemplate,
    calculateCoverage,
    compareClasses,
};
