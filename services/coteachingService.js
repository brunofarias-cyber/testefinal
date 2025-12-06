import crypto from 'crypto';
import db from '../models/index.js';

const { ProjectCollaborator, ProjectInvite, Project, User, sequelize } = db;

/**
 * Service de Co-Teaching
 * Versão em PON com campos em português
 */
class CoteachingService {
    // 1. Convidar um professor por email
    async convidarProfessor(projetoId, emailConvidado, professorIdQuemConvida) {
        try {
            // Verificar que o projeto existe
            const projeto = await Project.findByPk(projetoId);
            if (!projeto) {
                throw new Error('Projeto não encontrado');
            }

            // Verificar que quem está convidando é o dono OU colaborador
            if (projeto.teacherId !== professorIdQuemConvida) {
                const colaborador = await ProjectCollaborator.findOne({
                    where: {
                        projetoId: projetoId,
                        professorId: professorIdQuemConvida,
                        status: 'ativo'
                    }
                });

                if (!colaborador) {
                    throw new Error('Apenas o dono ou colaboradores podem convidar');
                }
            }

            // Verificar se o email já é colaborador
            const usuario = await User.findOne({ where: { email: emailConvidado } });
            if (usuario) {
                const jaColaborador = await ProjectCollaborator.findOne({
                    where: {
                        projetoId: projetoId,
                        professorId: usuario.id,
                        status: 'ativo'
                    }
                });

                if (jaColaborador) {
                    throw new Error('Este professor já é colaborador do projeto');
                }
            }

            // Gerar token para o convite
            const token = `invite_${crypto.randomBytes(16).toString('hex')}`;

            // Criar convite
            const convite = await ProjectInvite.create({
                projetoId: projetoId,
                emailConvidado: emailConvidado,
                convidadoPorId: professorIdQuemConvida,
                token: token,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
            });

            return {
                id: convite.id,
                email: emailConvidado,
                token: convite.token,
                expiresAt: convite.expiresAt,
                acceptanceUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/convite/aceitar/${convite.token}`
            };
        } catch (error) {
            throw new Error(`Erro ao convidar professor: ${error.message}`);
        }
    }

    // 2. Aceitar convite
    async aceitarConvite(token, professorId) {
        try {
            const convite = await ProjectInvite.findOne({ where: { token } });

            if (!convite) {
                throw new Error('Convite não encontrado');
            }

            if (convite.status !== 'pendente') {
                throw new Error(`Convite já foi ${convite.status}`);
            }

            if (new Date() > convite.expiresAt) {
                await convite.update({ status: 'expirado' });
                throw new Error('Convite expirou');
            }

            // Buscar usuário
            const usuario = await User.findByPk(professorId);
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            // Verificar se email do convite corresponde ao usuário logado
            if (usuario.email.toLowerCase() !== convite.emailConvidado.toLowerCase()) {
                throw new Error('Este convite não foi enviado para você');
            }

            // Criar colaborador
            const colaborador = await ProjectCollaborator.create({
                projetoId: convite.projetoId,
                professorId: usuario.id,
                adicionadoPorId: convite.convidadoPorId,
                status: 'ativo',
                papel: 'co-professor'
            });

            // Atualizar convite
            await convite.update({ status: 'aceito' });

            return {
                colaborador,
                mensagem: 'Convite aceito com sucesso!'
            };
        } catch (error) {
            throw new Error(`Erro ao aceitar convite: ${error.message}`);
        }
    }

    // 3. Adicionar colaborador diretamente
    async adicionarColaborador(projetoId, professorEmailOuId, professorIdQuemAdiciona, papel = 'co-professor') {
        try {
            const projeto = await Project.findByPk(projetoId);
            if (!projeto) {
                throw new Error('Projeto não encontrado');
            }

            // Verificar permissão
            if (projeto.teacherId !== professorIdQuemAdiciona) {
                throw new Error('Apenas o dono pode adicionar colaboradores diretamente');
            }

            // Buscar professor
            let usuario;
            if (typeof professorEmailOuId === 'string' && professorEmailOuId.includes('@')) {
                usuario = await User.findOne({ where: { email: professorEmailOuId } });
            } else {
                usuario = await User.findByPk(professorEmailOuId);
            }

            if (!usuario) {
                throw new Error('Professor não encontrado. Convide pelo email.');
            }

            // Verificar se já é colaborador
            const jaColaborador = await ProjectCollaborator.findOne({
                where: {
                    projetoId: projetoId,
                    professorId: usuario.id
                }
            });

            if (jaColaborador && jaColaborador.status === 'ativo') {
                throw new Error('Este professor já é colaborador');
            }

            // Reativar ou criar
            if (jaColaborador) {
                await jaColaborador.update({ status: 'ativo' });
                return jaColaborador;
            }

            const colaborador = await ProjectCollaborator.create({
                projetoId: projetoId,
                professorId: usuario.id,
                adicionadoPorId: professorIdQuemAdiciona,
                status: 'ativo',
                papel: papel
            });

            return colaborador;
        } catch (error) {
            throw new Error(`Erro ao adicionar colaborador: ${error.message}`);
        }
    }

    // 4. Listar colaboradores
    async listarColaboradores(projetoId) {
        try {
            const colaboradores = await ProjectCollaborator.findAll({
                where: {
                    projetoId: projetoId,
                    status: 'ativo'
                },
                include: [
                    {
                        model: User,
                        as: 'professor',
                        attributes: ['id', 'name', 'email']
                    }
                ]
            });

            return colaboradores;
        } catch (error) {
            throw new Error(`Erro ao listar colaboradores: ${error.message}`);
        }
    }

    // 5. Remover colaborador
    async removerColaborador(projetoId, professorId, professorIdQuemRemove) {
        try {
            const projeto = await Project.findByPk(projetoId);
            if (!projeto) {
                throw new Error('Projeto não encontrado');
            }

            if (projeto.teacherId !== professorIdQuemRemove) {
                throw new Error('Apenas o dono pode remover colaboradores');
            }

            if (professorId === projeto.teacherId) {
                throw new Error('Não é possível remover o dono do projeto');
            }

            const resultado = await ProjectCollaborator.destroy({
                where: {
                    projetoId: projetoId,
                    professorId: professorId
                }
            });

            if (resultado === 0) {
                throw new Error('Colaborador não encontrado');
            }

            return { mensagem: 'Colaborador removido com sucesso' };
        } catch (error) {
            throw new Error(`Erro ao remover colaborador: ${error.message}`);
        }
    }

    // 6. Verificar acesso
    async verificarAcesso(projetoId, professorId) {
        try {
            const projeto = await Project.findByPk(projetoId);
            if (!projeto) {
                return { acesso: false, motivo: 'Projeto não encontrado' };
            }

            if (projeto.teacherId === professorId) {
                return { acesso: true, role: 'owner' };
            }

            const colaborador = await ProjectCollaborator.findOne({
                where: {
                    projetoId: projetoId,
                    professorId: professorId,
                    status: 'ativo'
                }
            });

            if (colaborador) {
                return {
                    acesso: true,
                    role: 'collaborator',
                    papel: colaborador.papel
                };
            }

            return { acesso: false, motivo: 'Não é colaborador deste projeto' };
        } catch (error) {
            throw new Error(`Erro ao verificar acesso: ${error.message}`);
        }
    }

    // 7. Listar projetos do professor
    async listarProjetosDoProfessor(professorId) {
        try {
            // Projetos que o professor criou
            const projetosOwner = await Project.findAll({
                where: { teacherId: professorId },
                attributes: ['id', 'title', 'description', 'status', 'progress'],
                raw: true
            });

            // Projetos em que é colaborador
            const projetosColaborador = await sequelize.query(`
        SELECT p.id, p.title, p.description, p.status, p.progress
        FROM projects p
        INNER JOIN project_collaborators pc ON p.id = pc.projeto_id
        WHERE pc.professor_id = :professorId
        AND pc.status = 'ativo'
      `, {
                replacements: { professorId },
                type: sequelize.QueryTypes.SELECT
            });

            const todosOsProjetos = [
                ...projetosOwner.map(p => ({ ...p, papel: 'owner' })),
                ...projetosColaborador.map(p => ({ ...p, papel: 'collaborator' }))
            ];

            // Remover duplicatas
            const projetosUnicos = Array.from(
                new Map(todosOsProjetos.map(p => [p.id, p])).values()
            );

            return projetosUnicos;
        } catch (error) {
            throw new Error(`Erro ao listar projetos: ${error.message}`);
        }
    }

    // 8. Listar convites pendentes
    async listarConvitesPendentes(email) {
        try {
            const convites = await ProjectInvite.findAll({
                where: {
                    emailConvidado: email,
                    status: 'pendente'
                },
                include: [
                    {
                        model: Project,
                        attributes: ['id', 'title', 'description']
                    }
                ]
            });

            return convites.filter(c => new Date() <= c.expiresAt);
        } catch (error) {
            throw new Error(`Erro ao listar convites: ${error.message}`);
        }
    }
}

export default new CoteachingService();
