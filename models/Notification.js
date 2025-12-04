import { DataTypes } from 'sequelize';

export const NotificationModel = (sequelize) => {
    const Notification = sequelize.define('Notification', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        recipientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        type: {
            type: DataTypes.ENUM('deadline', 'feedback', 'message', 'achievement', 'announcement'),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING
        },
        message: {
            type: DataTypes.TEXT
        },
        relatedProjectId: {
            type: DataTypes.UUID,
            references: {
                model: 'projects',
                key: 'id'
            }
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
        tableName: 'notifications'
    });

    return Notification;
};
