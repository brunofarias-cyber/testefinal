import { DataTypes } from 'sequelize';

export const SubmissionModel = (sequelize) => {
    const Submission = sequelize.define('Submission', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        projectId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'projects',
                key: 'id'
            }
        },
        studentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        fileUrl: {
            type: DataTypes.STRING
        },
        link: {
            type: DataTypes.STRING
        },
        comment: {
            type: DataTypes.TEXT
        },
        submittedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        grade: {
            type: DataTypes.FLOAT
        },
        feedback: {
            type: DataTypes.TEXT
        },
        gradedAt: {
            type: DataTypes.DATE
        },
        gradedById: {
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'id'
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
        tableName: 'submissions'
    });

    return Submission;
};
