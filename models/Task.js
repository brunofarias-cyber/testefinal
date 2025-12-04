import { DataTypes } from 'sequelize';

export const TaskModel = (sequelize) => {
    const Task = sequelize.define('Task', {
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
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        },
        assignedToId: {
            type: DataTypes.UUID,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('todo', 'in-progress', 'done'),
            defaultValue: 'todo'
        },
        dueDate: {
            type: DataTypes.DATE
        },
        priority: {
            type: DataTypes.ENUM('low', 'normal', 'high'),
            defaultValue: 'normal'
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
        tableName: 'tasks'
    });

    return Task;
};
