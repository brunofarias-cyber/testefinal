import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const TutorInteraction = sequelize.define('TutorInteraction', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'student_id',
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'project_id',
        },
        question: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        answer: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('tutoring', 'feedback', 'alert'),
            defaultValue: 'tutoring',
        },
    }, {
        tableName: 'tutor_interactions',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        indexes: [
            {
                name: 'idx_tutor_student',
                fields: ['student_id']
            },
            {
                name: 'idx_tutor_project',
                fields: ['project_id']
            }
        ]
    });

    return TutorInteraction;
};
