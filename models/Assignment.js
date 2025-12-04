import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Assignment = sequelize.define('Assignment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        projectId: {
            type: DataTypes.INTEGER,
            field: 'project_id',
        },
        courseId: {
            type: DataTypes.STRING,
            field: 'course_id',
        },
        googleId: {
            type: DataTypes.STRING,
            field: 'google_id',
        },
        dueDate: {
            type: DataTypes.DATE,
            field: 'due_date',
        },
    }, {
        tableName: 'assignments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return Assignment;
};
