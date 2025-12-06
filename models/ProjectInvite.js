import { DataTypes } from 'sequelize';

export const ProjectInviteModel = (sequelize) => {
    const ProjectInvite = sequelize.define('ProjectInvite', {
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
        emailConvidado: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'email_convidado'
        },
        convidadoPorId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'convidado_por_id',
            references: {
                model: 'users',
                key: 'id'
            }
        },
        token: {
            type: DataTypes.STRING(255),
            unique: true,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pendente', 'aceito', 'recusado', 'expirado'),
            defaultValue: 'pendente'
        },
        criadoEm: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'criado_em'
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'expires_at'
        }
    }, {
        tableName: 'project_invites',
        timestamps: false,
        indexes: [
            { fields: ['projeto_id'] },
            { fields: ['email_convidado'] },
            { fields: ['token'] },
            { fields: ['status'] }
        ]
    });

    return ProjectInvite;
};
