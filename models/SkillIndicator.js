import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SkillIndicator = sequelize.define('SkillIndicator', {
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
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    levelLabel: {
        type: DataTypes.STRING(50),
        field: 'level_label',
    },
    description: {
        type: DataTypes.TEXT,
    },
    observableBehavior: {
        type: DataTypes.TEXT,
        field: 'observable_behavior',
    },
    examples: {
        type: DataTypes.TEXT,
    },
    points: {
        type: DataTypes.DECIMAL(3, 1),
    },
}, {
    tableName: 'skill_indicators',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            unique: true,
            name: 'unique_indicator',
            fields: ['project_id', 'skill_code', 'level']
        },
        {
            name: 'idx_project_skill',
            fields: ['project_id', 'skill_code']
        }
    ]
});

export default SkillIndicator;
