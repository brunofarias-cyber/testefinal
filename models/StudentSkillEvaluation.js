import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StudentSkillEvaluation = sequelize.define('StudentSkillEvaluation', {
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
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'student_id',
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
    chosenLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'chosen_level',
    },
    evidence: {
        type: DataTypes.TEXT,
    },
    feedback: {
        type: DataTypes.TEXT,
    },
    points: {
        type: DataTypes.DECIMAL(3, 1),
    },
    evaluatedBy: {
        type: DataTypes.INTEGER,
        field: 'evaluated_by',
    },
    evaluatedAt: {
        type: DataTypes.DATE,
        field: 'evaluated_at',
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'student_skill_evaluations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            name: 'idx_eval_student_project',
            fields: ['student_id', 'project_id']
        },
        {
            name: 'idx_evaluated_at',
            fields: ['evaluated_at']
        },
        {
            name: 'idx_student_skill_evals_skill',
            fields: ['skill_code']
        },
        {
            name: 'idx_student_skill_evals_student',
            fields: ['student_id']
        }
    ]
});

export default StudentSkillEvaluation;
