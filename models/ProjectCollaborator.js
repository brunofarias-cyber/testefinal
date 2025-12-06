import { DataTypes } from 'sequelize';

export const ProjectCollaboratorModel = (sequelize) => {
    const ProjectCollaborator = sequelize.define('ProjectCollaborator', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        projetoId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'projeto_id',
            references: {
                model: 'projects',
                key: 'id'
            }
        },
        professorId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'professor_id',
            references: {
                model: 'users',
                key: 'id'
            }
        },
        adicionadoPorId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'adicionado_por_id',
            references: {
                model: 'users',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('ativo', 'pendente', 'recusado'),
            defaultValue: 'ativo'
        },
        papel: {
            type: DataTypes.ENUM('co-professor', 'avaliador', 'assistente'),
            defaultValue: 'co-professor'
        },
        adicionadoEm: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'adicionado_em'
        }
    }, {
        tableName: 'project_collaborators',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['projeto_id', 'professor_id']
            },
            { fields: ['projeto_id'] },
            { fields: ['professor_id'] },
            { fields: ['status'] }
        ]
    });

    return ProjectCollaborator;
};
