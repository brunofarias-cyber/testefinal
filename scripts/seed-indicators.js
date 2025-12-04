import {
    Project,
    ProjectSkill,
    SkillIndicator
} from '../models/index.js';

// Indicadores padrão para qualquer habilidade
const DEFAULT_INDICATORS = [
    {
        level: 1,
        levelLabel: 'Não Apresentado',
        description: 'Aluno não consegue realizar a habilidade proposta',
        observableBehavior: 'Abandona a atividade, não tenta, nega-se a participar',
        examples: 'Não inicia a tarefa, diz que não consegue fazer',
        points: 0,
    },
    {
        level: 2,
        levelLabel: 'Iniciante',
        description: 'Realiza a habilidade com muitos erros e ajuda constante',
        observableBehavior: 'Tenta mas erra frequentemente, necessita orientação em cada passo',
        examples: 'Faz com erros recorrentes mesmo com ajuda, demora muito',
        points: 2.5,
    },
    {
        level: 3,
        levelLabel: 'Em Desenvolvimento',
        description: 'Realiza a habilidade com poucos erros e orientação mínima',
        observableBehavior: 'Consegue fazer com apoio ocasional, comete alguns erros',
        examples: 'Faz a maioria correto, precisa de ajuda em detalhes específicos',
        points: 5,
    },
    {
        level: 4,
        levelLabel: 'Desenvolvido',
        description: 'Realiza a habilidade autonomamente e sem erros',
        observableBehavior: 'Faz sozinho corretamente, domina o conceito',
        examples: 'Realiza a tarefa completa e correta sem ajuda',
        points: 7.5,
    },
    {
        level: 5,
        levelLabel: 'Avançado',
        description: 'Domina completamente a habilidade e consegue ensinar outros',
        observableBehavior: 'Propõe soluções alternativas, ensina colegas, vai além do esperado',
        examples: 'Cria sua própria solução, explica para outros, identifica novos usos',
        points: 10,
    },
];

export async function seedIndicators() {
    try {
        console.log('🌱 Iniciando seed de indicadores...');

        // Buscar todos os projetos
        const projects = await Project.findAll();

        if (projects.length === 0) {
            console.log('⚠️  Nenhum projeto encontrado. Crie projetos primeiro!');
            return;
        }

        // Para cada projeto
        for (const project of projects) {
            console.log(`\n📊 Processando projeto: ${project.title}`);

            // Buscar habilidades do projeto
            const projectSkills = await ProjectSkill.findAll({
                where: { projectId: project.id },
            });

            if (projectSkills.length === 0) {
                console.log(`   ⚠️  Sem habilidades vinculadas`);
                continue;
            }

            // Para cada habilidade, criar indicadores
            for (const ps of projectSkills) {
                for (const indicator of DEFAULT_INDICATORS) {
                    const [created, isNew] = await SkillIndicator.findOrCreate({
                        where: {
                            projectId: project.id,
                            skillCode: ps.skillCode,
                            level: indicator.level,
                        },
                        defaults: {
                            projectId: project.id,
                            skillCode: ps.skillCode,
                            level: indicator.level,
                            levelLabel: indicator.levelLabel,
                            description: indicator.description,
                            observableBehavior: indicator.observableBehavior,
                            examples: indicator.examples,
                            points: indicator.points,
                        },
                    });

                    if (isNew) {
                        console.log(`   ✅ Criado: ${ps.skillCode} - Nível ${indicator.level}`);
                    }
                }
            }
        }

        console.log('\n✅ Seed de indicadores completo!');
        console.log(`Total de projetos processados: ${projects.length}`);

    } catch (error) {
        console.error('❌ Erro ao fazer seed:', error);
        throw error;
    }
}

export default seedIndicators;
