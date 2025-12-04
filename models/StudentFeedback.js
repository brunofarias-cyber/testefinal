import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const StudentFeedback = sequelize.define(
        'StudentFeedback',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            studentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            projectId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            skillCode: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            feedback: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            generatedBy: {
                type: DataTypes.ENUM('teacher', 'ai'),
                defaultValue: 'teacher',
            },
            type: {
                type: DataTypes.STRING, // e.g., 'encouragement', 'correction', 'praise'
                defaultValue: 'general',
            },
            readAt: {
                type: DataTypes.DATE,
                field: 'read_at',
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'student_feedbacks',
            timestamps: true,
        }
    );

    return StudentFeedback;
};
