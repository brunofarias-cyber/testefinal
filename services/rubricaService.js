import db from '../models/index.js';

const { Rubrica, RubricaCriterio, RubricaNivel, AvaliacaoEquipe, AvaliacaoCriterio } = db;

class RubricaService {
    // Buscar rubrica completa de um projeto
    async buscarRubricaProjeto(projetoId) {
        try {
            const rubrica = await Rubrica.findOne({
                where: { projetoId },
                include: [
                    {
                        model: RubricaCriterio,
                        as: 'criterios',
                        include: [
                            {
                                model: RubricaNivel,
                                as: 'niveis',
                                separate: true,
                                order: [['ordem', 'ASC']]
                            }
                        ],
                        separate: true,
                        order: [['ordem', 'ASC']]
                    }
                ]
            });

            if (!rubrica) {
                // Não lançar erro, apenas retornar null, pois pode ser que ainda não exista
                return null;
            }

            return rubrica;
        } catch (error) {
            throw new Error(`Erro ao buscar rubrica: ${error.message}`);
        }
    }

    // Salvar avaliação de equipe
    async salvarAvaliacao(projetoId, equipeId, rubricaId, criadoPorId, criteriosAvaliados) {
        try {
            // ======== VALIDAÇÃO DE ENTRADA (Correção NaN) ========
            if (!projetoId || isNaN(projetoId)) throw new Error('projetoId deve ser um número válido');
            if (!equipeId || isNaN(equipeId)) throw new Error('equipeId deve ser um número válido');
            if (!rubricaId || isNaN(rubricaId)) throw new Error('rubricaId deve ser um número válido');
            if (!criadoPorId || isNaN(criadoPorId)) throw new Error('criadoPorId deve ser um número válido');

            if (!Array.isArray(criteriosAvaliados) || criteriosAvaliados.length === 0) {
                throw new Error('Deve haver pelo menos um critério avaliado');
            }

            // Converter para inteiros para garantir
            const pId = parseInt(projetoId);
            const eId = parseInt(equipeId);
            const rId = parseInt(rubricaId);
            const cpId = parseInt(criadoPorId);

            // Validar cada critério
            for (const crit of criteriosAvaliados) {
                if (!crit.criterioId || isNaN(crit.criterioId)) {
                    throw new Error('Cada critério avaliado deve ter um criterioId válido');
                }
                if (!crit.nivelId || isNaN(crit.nivelId)) {
                    throw new Error('Cada critério avaliado deve ter um nivelId válido (não pode ser nulo)');
                }
            }

            // ====================================================

            // Buscar ou criar avaliação
            let avaliacao = await AvaliacaoEquipe.findOne({
                where: { projetoId: pId, equipeId: eId, rubricaId: rId }
            });

            if (!avaliacao) {
                avaliacao = await AvaliacaoEquipe.create({
                    projetoId: pId,
                    equipeId: eId,
                    rubricaId: rId,
                    criadoPorId: cpId
                });
            } else {
                avaliacao.criadoPorId = cpId;
                await avaliacao.save();
            }

            // Deletar critérios anteriores e salvar novos
            await AvaliacaoCriterio.destroy({ where: { avaliacaoId: avaliacao.id } });

            let totalPontos = 0;
            let totalPesos = 0;

            for (const criterioAvaliado of criteriosAvaliados) {
                const cId = parseInt(criterioAvaliado.criterioId);
                const nId = parseInt(criterioAvaliado.nivelId);

                const nivel = await RubricaNivel.findByPk(nId);
                const criterio = await RubricaCriterio.findByPk(cId);

                if (!nivel) throw new Error(`Nível ${nId} não encontrado`);
                if (!criterio) throw new Error(`Critério ${cId} não encontrado`);

                const pontosObtidos = parseFloat(nivel.pontos);
                const peso = parseFloat(criterio.peso);

                // Validar números
                if (isNaN(pontosObtidos)) throw new Error(`Pontos inválidos (NaN) para nível ${nId}`);
                if (isNaN(peso)) throw new Error(`Peso inválido (NaN) para critério ${cId}`);

                await AvaliacaoCriterio.create({
                    avaliacaoId: avaliacao.id,
                    criterioId: cId,
                    nivelId: nId,
                    pontosObtidos,
                    comentario: criterioAvaliado.comentario || null
                });

                totalPontos += pontosObtidos * peso;
                totalPesos += peso;
            }

            // Calcular nota final (média ponderada em escala 0-10)
            // Se peso total for 0, nota é 0 para evitar divisão por zero
            // A escala original parece ser baseada, por exemplo, em pontos de 0 a 4.
            // Se a soma dos pesos for 100, a média ponderada direta já dá a noção.
            // Mas o código original tinha um fator multiplicador (ex: * 2.5). Vou manter a lógica segura.

            let notaFinal = 0;
            if (totalPesos > 0 && !isNaN(totalPontos)) {
                // Cálculo: (soma(pontos * peso) / soma(pesos)) * fator
                // Assumindo que:
                // Pontos vão de 0 a 4 (ex)
                // Pesos somam 100 (ex)
                // Se o aluno tirar pontuação máxima (4) em tudo:
                // (4 * 100) / 100 = 4. 
                // Para virar 10, multiplicamos por 2.5.

                notaFinal = (totalPontos / totalPesos) * 2.5;

                // Garantir que não passe de 10 nem seja negativo
                if (notaFinal > 10) notaFinal = 10;
                if (notaFinal < 0) notaFinal = 0;
            }

            if (isNaN(notaFinal)) {
                throw new Error('Erro crítico: Nota final calculada resultou em NaN');
            }

            avaliacao.notaFinal = parseFloat(notaFinal.toFixed(2));
            await avaliacao.save();

            return avaliacao;
        } catch (error) {
            throw new Error(`Erro ao salvar avaliação: ${error.message}`);
        }
    }

    // Buscar avaliação com detalhes
    async buscarAvaliacaoEquipe(projetoId, equipeId, rubricaId) {
        try {
            const avaliacao = await AvaliacaoEquipe.findOne({
                where: { projetoId, equipeId, rubricaId },
                include: [
                    {
                        model: AvaliacaoCriterio,
                        as: 'criterios',
                        include: [
                            { model: RubricaCriterio, as: 'criterio' },
                            { model: RubricaNivel, as: 'nivel' }
                        ]
                    }
                ]
            });

            return avaliacao || null;
        } catch (error) {
            throw new Error(`Erro ao buscar avaliação: ${error.message}`);
        }
    }

    // Buscar todas as avaliações de um projeto
    async buscarAvaliacoesProjeto(projetoId) {
        try {
            const avaliacoes = await AvaliacaoEquipe.findAll({
                where: { projetoId },
                include: [
                    {
                        model: AvaliacaoCriterio,
                        as: 'criterios',
                        include: [
                            { model: RubricaCriterio, as: 'criterio' },
                            { model: RubricaNivel, as: 'nivel' }
                        ]
                    },
                    {
                        model: db.Team, // Supondo que Team esteja disponível via db
                        as: 'equipe'
                    }
                    // Adicione include de 'criadoPor' se necessário e associação existir
                ],
                order: [['updatedAt', 'DESC']]
            });

            return avaliacoes;
        } catch (error) {
            // Se erro for de associação não existente, tenta sem o include extra
            try {
                return await AvaliacaoEquipe.findAll({
                    where: { projetoId },
                    include: [
                        {
                            model: AvaliacaoCriterio,
                            as: 'criterios'
                        }
                    ]
                });
            } catch (err) {
                throw new Error(`Erro ao buscar avaliações do projeto: ${error.message}`);
            }
        }
    }

    // Calcular estatísticas da rubrica
    async calcularEstatisticas(projetoId, rubricaId) {
        try {
            const avaliacoes = await AvaliacaoEquipe.findAll({
                where: { projetoId, rubricaId }
            });

            if (avaliacoes.length === 0) {
                return { media: 0, maiorNota: 0, menorNota: 0, totalAvaliacoes: 0 };
            }

            const notas = avaliacoes
                .filter(a => a.notaFinal !== null && !isNaN(parseFloat(a.notaFinal)))
                .map(a => parseFloat(a.notaFinal));

            if (notas.length === 0) {
                return { media: 0, maiorNota: 0, menorNota: 0, totalAvaliacoes: avaliacoes.length };
            }

            const media = notas.reduce((a, b) => a + b, 0) / notas.length;
            const maiorNota = Math.max(...notas);
            const menorNota = Math.min(...notas);

            return {
                media: parseFloat(media.toFixed(2)),
                maiorNota,
                menorNota,
                totalAvaliacoes: avaliacoes.length
            };
        } catch (error) {
            throw new Error(`Erro ao calcular estatísticas: ${error.message}`);
        }
    }

    // Criar rubrica completa (nova funcionalidade)
    async criarRubricaCompleta(projetoId, titulo, descricao, criterios) {
        try {
            // Criar rubrica
            const rubrica = await Rubrica.create({
                projetoId,
                titulo,
                descricao
            });

            // Criar critérios e níveis
            if (criterios && criterios.length > 0) {
                for (const crit of criterios) {
                    const criterio = await RubricaCriterio.create({
                        rubricaId: rubrica.id,
                        nome: crit.nome,
                        descricao: crit.descricao,
                        peso: crit.peso || 1.0,
                        ordem: crit.ordem || 0
                    });

                    if (crit.niveis && crit.niveis.length > 0) {
                        await Promise.all(
                            crit.niveis.map(nivel =>
                                RubricaNivel.create({
                                    criterioId: criterio.id,
                                    nome: nivel.nome,
                                    pontos: nivel.pontos,
                                    descricao: nivel.descricao,
                                    ordem: nivel.ordem || 0
                                })
                            )
                        );
                    }
                }
            }

            return await this.buscarRubricaProjeto(projetoId);
        } catch (error) {
            throw new Error(`Erro ao criar rubrica: ${error.message}`);
        }
    }
}

export default new RubricaService();
