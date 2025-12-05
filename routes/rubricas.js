import express from 'express';
import db from '../models/index.js';

const router = express.Router();
const { Rubrica, RubricaCriterio, RubricaNivel, AvaliacaoEquipe, AvaliacaoCriterio, Project, Team, User } = db;

// ==========================================
// RUBRICAS - CRUD
// ==========================================

// GET /api/rubricas - Listar todas as rubricas
router.get('/', async (req, res) => {
    try {
        const rubricas = await Rubrica.findAll({
            include: [
                {
                    model: Project,
                    as: 'projeto',
                    attributes: ['id', 'title']
                },
                {
                    model: RubricaCriterio,
                    as: 'criterios',
                    include: [
                        {
                            model: RubricaNivel,
                            as: 'niveis',
                            order: [['ordem', 'ASC']]
                        }
                    ],
                    order: [['ordem', 'ASC']]
                }
            ],
            order: [['criadaEm', 'DESC']]
        });

        res.status(200).json(rubricas);
    } catch (error) {
        console.error('Erro ao buscar rubricas:', error);
        res.status(500).json({ error: 'Erro ao buscar rubricas' });
    }
});

// GET /api/rubricas/:id - Buscar rubrica por ID
router.get('/:id', async (req, res) => {
    try {
        const rubrica = await Rubrica.findByPk(req.params.id, {
            include: [
                {
                    model: Project,
                    as: 'projeto',
                    attributes: ['id', 'title']
                },
                {
                    model: RubricaCriterio,
                    as: 'criterios',
                    include: [
                        {
                            model: RubricaNivel,
                            as: 'niveis',
                            order: [['ordem', 'ASC']]
                        }
                    ],
                    order: [['ordem', 'ASC']]
                }
            ]
        });

        if (!rubrica) {
            return res.status(404).json({ error: 'Rubrica não encontrada' });
        }

        res.status(200).json(rubrica);
    } catch (error) {
        console.error('Erro ao buscar rubrica:', error);
        res.status(500).json({ error: 'Erro ao buscar rubrica' });
    }
});

// GET /api/rubricas/projeto/:projectId - Buscar rubrica por projeto
router.get('/projeto/:projectId', async (req, res) => {
    try {
        const rubrica = await Rubrica.findOne({
            where: { projetoId: req.params.projectId },
            include: [
                {
                    model: Project,
                    as: 'projeto',
                    attributes: ['id', 'title']
                },
                {
                    model: RubricaCriterio,
                    as: 'criterios',
                    include: [
                        {
                            model: RubricaNivel,
                            as: 'niveis',
                            order: [['ordem', 'ASC']]
                        }
                    ],
                    order: [['ordem', 'ASC']]
                }
            ]
        });

        if (!rubrica) {
            return res.status(404).json({ error: 'Rubrica não encontrada para este projeto' });
        }

        res.status(200).json(rubrica);
    } catch (error) {
        console.error('Erro ao buscar rubrica:', error);
        res.status(500).json({ error: 'Erro ao buscar rubrica' });
    }
});

// POST /api/rubricas - Criar nova rubrica
router.post('/', async (req, res) => {
    try {
        const { projetoId, titulo, descricao, criterios } = req.body;

        // Criar rubrica
        const rubrica = await Rubrica.create({
            projetoId,
            titulo,
            descricao
        });

        // Criar critérios se fornecidos
        if (criterios && criterios.length > 0) {
            for (const criterio of criterios) {
                const novoCriterio = await RubricaCriterio.create({
                    rubricaId: rubrica.id,
                    nome: criterio.nome,
                    descricao: criterio.descricao,
                    peso: criterio.peso || 1.0,
                    ordem: criterio.ordem || 0
                });

                // Criar níveis se fornecidos
                if (criterio.niveis && criterio.niveis.length > 0) {
                    await Promise.all(criterio.niveis.map(nivel =>
                        RubricaNivel.create({
                            criterioId: novoCriterio.id,
                            nome: nivel.nome,
                            pontos: nivel.pontos,
                            descricao: nivel.descricao,
                            ordem: nivel.ordem || 0
                        })
                    ));
                }
            }
        }

        // Buscar rubrica completa
        const rubricaCompleta = await Rubrica.findByPk(rubrica.id, {
            include: [
                {
                    model: RubricaCriterio,
                    as: 'criterios',
                    include: [
                        {
                            model: RubricaNivel,
                            as: 'niveis'
                        }
                    ]
                }
            ]
        });

        res.status(201).json(rubricaCompleta);
    } catch (error) {
        console.error('Erro ao criar rubrica:', error);
        res.status(500).json({ error: 'Erro ao criar rubrica' });
    }
});

// PUT /api/rubricas/:id - Atualizar rubrica
router.put('/:id', async (req, res) => {
    try {
        const { titulo, descricao } = req.body;
        const rubrica = await Rubrica.findByPk(req.params.id);

        if (!rubrica) {
            return res.status(404).json({ error: 'Rubrica não encontrada' });
        }

        await rubrica.update({ titulo, descricao });

        const rubricaAtualizada = await Rubrica.findByPk(rubrica.id, {
            include: [
                {
                    model: RubricaCriterio,
                    as: 'criterios',
                    include: [
                        {
                            model: RubricaNivel,
                            as: 'niveis'
                        }
                    ]
                }
            ]
        });

        res.status(200).json(rubricaAtualizada);
    } catch (error) {
        console.error('Erro ao atualizar rubrica:', error);
        res.status(500).json({ error: 'Erro ao atualizar rubrica' });
    }
});

// DELETE /api/rubricas/:id - Deletar rubrica
router.delete('/:id', async (req, res) => {
    try {
        const rubrica = await Rubrica.findByPk(req.params.id);

        if (!rubrica) {
            return res.status(404).json({ error: 'Rubrica não encontrada' });
        }

        await rubrica.destroy();
        res.status(200).json({ message: 'Rubrica deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar rubrica:', error);
        res.status(500).json({ error: 'Erro ao deletar rubrica' });
    }
});

// ==========================================
// AVALIAÇÕES - CRUD
// ==========================================

// POST /api/rubricas/avaliar - Criar avaliação de equipe
router.post('/avaliar', async (req, res) => {
    try {
        const { projetoId, equipeId, rubricaId, criadoPorId, criterios } = req.body;

        // Criar avaliação
        const avaliacao = await AvaliacaoEquipe.create({
            projetoId,
            equipeId,
            rubricaId,
            criadoPorId
        });

        // Criar avaliações de critérios
        let somaTotal = 0;
        let somaPesos = 0;

        for (const crit of criterios) {
            const nivel = await RubricaNivel.findByPk(crit.nivelId);
            const criterio = await RubricaCriterio.findByPk(crit.criterioId);

            const pontosObtidos = parseFloat(nivel.pontos) * parseFloat(criterio.peso);
            somaTotal += pontosObtidos;
            somaPesos += parseFloat(criterio.peso);

            await AvaliacaoCriterio.create({
                avaliacaoId: avaliacao.id,
                criterioId: crit.criterioId,
                nivelId: crit.nivelId,
                pontosObtidos,
                comentario: crit.comentario || null
            });
        }

        // Calcular nota final
        const notaFinal = somaPesos > 0 ? (somaTotal / somaPesos) : 0;
        await avaliacao.update({ notaFinal });

        // Buscar avaliação completa
        const avaliacaoCompleta = await AvaliacaoEquipe.findByPk(avaliacao.id, {
            include: [
                {
                    model: AvaliacaoCriterio,
                    as: 'criterios',
                    include: [
                        {
                            model: RubricaCriterio,
                            as: 'criterio'
                        },
                        {
                            model: RubricaNivel,
                            as: 'nivel'
                        }
                    ]
                },
                {
                    model: Team,
                    as: 'equipe'
                },
                {
                    model: User,
                    as: 'criadoPor',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        res.status(201).json(avaliacaoCompleta);
    } catch (error) {
        console.error('Erro ao criar avaliação:', error);
        res.status(500).json({ error: 'Erro ao criar avaliação' });
    }
});

// GET /api/rubricas/avaliacoes/:projectId - Listar avaliações de um projeto
router.get('/avaliacoes/:projectId', async (req, res) => {
    try {
        const avaliacoes = await AvaliacaoEquipe.findAll({
            where: { projetoId: req.params.projectId },
            include: [
                {
                    model: Team,
                    as: 'equipe'
                },
                {
                    model: Rubrica,
                    as: 'rubrica'
                },
                {
                    model: User,
                    as: 'criadoPor',
                    attributes: ['id', 'name']
                },
                {
                    model: AvaliacaoCriterio,
                    as: 'criterios',
                    include: [
                        {
                            model: RubricaCriterio,
                            as: 'criterio'
                        },
                        {
                            model: RubricaNivel,
                            as: 'nivel'
                        }
                    ]
                }
            ],
            order: [['avaliadaEm', 'DESC']]
        });

        res.status(200).json(avaliacoes);
    } catch (error) {
        console.error('Erro ao buscar avaliações:', error);
        res.status(500).json({ error: 'Erro ao buscar avaliações' });
    }
});

export default router;
