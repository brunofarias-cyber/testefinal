import db from '../models/index.js';

const { Project, ProjectCollaborator } = db;

/**
 * Middleware para verificar acesso a projetos
 * Versão com campos em PORTUGUÊS
 */
export const verificarAcessoProjeto = async (req, res, next) => {
    try {
        const { projetoId } = req.params;
        const usuarioId = req.user.id;

        // Buscar projeto
        const projeto = await Project.findByPk(projetoId);
        if (!projeto) {
            return res.status(404).json({
                sucesso: false,
                erro: 'Projeto não encontrado'
            });
        }

        // Se é o dono
        if (projeto.teacherId === usuarioId) {
            req.projectRole = 'owner';
            req.projectAccess = true;
            return next();
        }

        // Se é colaborador
        const colaborador = await ProjectCollaborator.findOne({
            where: {
                projetoId: projetoId,
                professorId: usuarioId,
                status: 'ativo'
            }
        });

        if (colaborador) {
            req.projectRole = 'collaborator';
            req.projectAccess = true;
            req.collaboratorPapel = colaborador.papel;
            return next();
        }

        // Nenhum acesso
        return res.status(403).json({
            sucesso: false,
            erro: 'Você não tem permissão para acessar este projeto'
        });
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            erro: error.message
        });
    }
};
