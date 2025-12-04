import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StudentSkillShare = sequelize.define('StudentSkillShare', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'project_id',
    },
    studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'student_id',
    },
    sharedWith: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'shared_with',
    },
    sharedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'shared_at',
    },
}, {
    tableName: 'student_skill_shares',
    timestamps: true,
    underscored: true,
});

export default StudentSkillShare;
