import { DataTypes } from 'sequelize';

export const CollaboratorPermissionModel = (sequelize) => {
    const CollaboratorPermission = sequelize.define('CollaboratorPermission', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        collaboratorId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'collaborator_id',
            references: {
                model: 'project_collaborators',
                key: 'id'
            }
        },
        permission: {
            type: DataTypes.ENUM(
                'view_project',
                'edit_project',
                'evaluate_teams',
                'add_collaborators',
                'manage_rubrics',
                'view_feedback',
                'edit_feedback',
                'export_data',
                'delete_evaluations'
            ),
            allowNull: false
        },
        grantedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'granted_at'
        }
    }, {
        tableName: 'collaborator_permissions',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['collaborator_id', 'permission']
            },
            { fields: ['collaborator_id'] }
        ]
    });

    return CollaboratorPermission;
};
