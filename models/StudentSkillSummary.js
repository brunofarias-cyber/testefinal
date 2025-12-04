import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StudentSkillSummary = sequelize.define('StudentSkillSummary', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'project_id',
        references: {
            model: 'projects',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'student_id',
    },
    totalSkills: {
        type: DataTypes.INTEGER,
        field: 'total_skills',
    },
    skillsEvaluated: {
        type: DataTypes.INTEGER,
        field: 'skills_evaluated',
    },
    skillsDeveloped45: {
        type: DataTypes.INTEGER,
        field: 'skills_developed_4_5',
    },
    skillsInProgress3: {
        type: DataTypes.INTEGER,
        field: 'skills_in_progress_3',
    },
    skillsNotPresented12: {
        type: DataTypes.INTEGER,
        field: 'skills_not_presented_1_2',
    },
    averageSkillLevel: {
        type: DataTypes.DECIMAL(3, 2),
        field: 'average_skill_level',
    },
    averagePoints: {
        type: DataTypes.DECIMAL(4, 1),
        field: 'average_points',
    },
    generalCompetenciesData: {
        type: DataTypes.JSON,
        field: 'general_competencies_data',
    },
    completedAt: {
        type: DataTypes.DATE,
        field: 'completed_at',
    },
}, {
    tableName: 'student_skill_summary',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            unique: true,
            name: 'unique_summary',
            fields: ['project_id', 'student_id']
        },
        {
            name: 'idx_student_project',
            fields: ['student_id', 'project_id']
        }
    ]
});

export default StudentSkillSummary;
