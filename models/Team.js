import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Team = sequelize.define('Team', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'teams',
        timestamps: true,
        underscored: true
    });

    Team.associate = (models) => {
        Team.belongsTo(models.Project, {
            foreignKey: 'projectId',
            as: 'project'
        });

        Team.belongsToMany(models.User, {
            through: 'team_members',
            foreignKey: 'teamId',
            otherKey: 'userId',
            as: 'members'
        });

        Team.hasMany(models.AvaliacaoEquipe, {
            foreignKey: 'equipeId',
            as: 'avaliacoes'
        });
    };

    return Team;
};
