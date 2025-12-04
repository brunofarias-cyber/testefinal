import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProjectSkill = sequelize.define('ProjectSkill', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'project_id',
        references: {
            model: 'projects',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    skillCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'skill_code',
    },
    disciplineId: {
        type: DataTypes.STRING(5),
        allowNull: false,
        field: 'discipline_id',
    },
    contextInProject: {
        type: DataTypes.TEXT,
        field: 'context_in_project',
    },
    expectedLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        field: 'expected_level',
    },
}, {
    tableName: 'project_skills',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            name: 'idx_project_id',
            fields: ['project_id']
        },
        {
            unique: true,
            name: 'unique_project_skill',
            fields: ['project_id', 'skill_code']
        }
    ]
});

export default ProjectSkill;
