import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BnccNotification = sequelize.define('BnccNotification', {
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
    type: {
        type: DataTypes.ENUM('warning', 'success', 'info'),
        allowNull: false,
        defaultValue: 'info',
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'bncc_notifications',
    timestamps: true,
    underscored: true,
});

export default BnccNotification;
