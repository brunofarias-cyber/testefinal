import { DataTypes } from 'sequelize';

export const ProjectModel = (sequelize) => {
    const Project = sequelize.define('Project', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        category: {
            type: DataTypes.STRING
        },
        difficulty: {
            type: DataTypes.ENUM('Fácil', 'Médio', 'Difícil'),
            defaultValue: 'Médio'
        },
        teacherId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        startDate: {
            type: DataTypes.DATE
        },
        deadline: {
            type: DataTypes.DATE
        },
        status: {
            type: DataTypes.ENUM('Planejamento', 'Em Andamento', 'Para Avaliação', 'Atrasado'),
            defaultValue: 'Planejamento'
        },
        progress: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        rubric: {
            type: DataTypes.JSONB,
            defaultValue: {
                criteria: []
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: true,
        tableName: 'projects'
    });

    return Project;
};
