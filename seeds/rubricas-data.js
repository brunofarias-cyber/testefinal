import db from '../models/index.js';

const { Rubrica, RubricaCriterio, RubricaNivel } = db;

async function seedRubricas() {
    try {
        console.log('🌱 Iniciando seed de Rubricas...');

        // Verificar se já existem rubricas
        const count = await Rubrica.count();
        if (count > 0) {
            console.log('⚠️ Rubricas já existem. Pulando seed.');
            return;
        }

        // Criar Rubrica
        const rubrica = await Rubrica.create({
            projetoId: 1,
            titulo: 'Rubrica Horta Sustentável',
            descricao: 'Critérios para avaliar o projeto da horta'
        });

        console.log(`✅ Rubrica criada: ${rubrica.titulo}`);

        // Criar Critérios
        const criterios = await Promise.all([
            RubricaCriterio.create({
                rubricaId: rubrica.id,
                nome: 'Investigação Científica',
                descricao: 'Qualidade da pesquisa e coleta de dados',
                peso: 40,
                ordem: 1
            }),
            RubricaCriterio.create({
                rubricaId: rubrica.id,
                nome: 'Trabalho em Equipe',
                descricao: 'Colaboração e divisão de tarefas',
                peso: 30,
                ordem: 2
            }),
            RubricaCriterio.create({
                rubricaId: rubrica.id,
                nome: 'Comunicação Oral',
                descricao: 'Clareza na apresentação',
                peso: 30,
                ordem: 3
            })
        ]);

        console.log(`✅ ${criterios.length} Critérios criados`);

        // Criar Níveis para cada Critério
        const niveis = await Promise.all([
            // Critério 1: Investigação Científica
            RubricaNivel.create({
                criterioId: criterios[0].id,
                nome: 'Insuficiente',
                pontos: 1,
                descricao: 'Não apresentou dados ou dados mínimos',
                ordem: 1
            }),
            RubricaNivel.create({
                criterioId: criterios[0].id,
                nome: 'Básico',
                pontos: 2,
                descricao: 'Dados superficiais, pouca análise',
                ordem: 2
            }),
            RubricaNivel.create({
                criterioId: criterios[0].id,
                nome: 'Proficiente',
                pontos: 3,
                descricao: 'Dados relevantes e bem analisados',
                ordem: 3
            }),
            RubricaNivel.create({
                criterioId: criterios[0].id,
                nome: 'Avançado',
                pontos: 4,
                descricao: 'Análise profunda com fontes extras',
                ordem: 4
            }),

            // Critério 2: Trabalho em Equipe
            RubricaNivel.create({
                criterioId: criterios[1].id,
                nome: 'Insuficiente',
                pontos: 1,
                descricao: 'Conflitos constantes, falta de colaboração',
                ordem: 1
            }),
            RubricaNivel.create({
                criterioId: criterios[1].id,
                nome: 'Básico',
                pontos: 2,
                descricao: 'Colaboração mínima, tarefas não definidas',
                ordem: 2
            }),
            RubricaNivel.create({
                criterioId: criterios[1].id,
                nome: 'Proficiente',
                pontos: 3,
                descricao: 'Boa divisão de tarefas',
                ordem: 3
            }),
            RubricaNivel.create({
                criterioId: criterios[1].id,
                nome: 'Avançado',
                pontos: 4,
                descricao: 'Sinergia e apoio mútuo',
                ordem: 4
            }),

            // Critério 3: Comunicação Oral
            RubricaNivel.create({
                criterioId: criterios[2].id,
                nome: 'Insuficiente',
                pontos: 1,
                descricao: 'Leitura de slides, fala pouco clara',
                ordem: 1
            }),
            RubricaNivel.create({
                criterioId: criterios[2].id,
                nome: 'Básico',
                pontos: 2,
                descricao: 'Fala pouco clara, falta fluência',
                ordem: 2
            }),
            RubricaNivel.create({
                criterioId: criterios[2].id,
                nome: 'Proficiente',
                pontos: 3,
                descricao: 'Boa oratória',
                ordem: 3
            }),
            RubricaNivel.create({
                criterioId: criterios[2].id,
                nome: 'Avançado',
                pontos: 4,
                descricao: 'Apresentação engajadora e profissional',
                ordem: 4
            })
        ]);

        console.log(`✅ ${niveis.length} Níveis criados`);
        console.log('✅ Seed de Rubricas completo!');

    } catch (error) {
        console.error('❌ Erro ao fazer seed de rubricas:', error);
        throw error;
    }
}

export default seedRubricas;
