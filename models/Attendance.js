import { DataTypes } from 'sequelize';

export const AttendanceModel = (sequelize) => {
    const Attendance = sequelize.define('Attendance', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        studentId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        class: {
            type: DataTypes.STRING
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.ENUM('Presente', 'Ausente', 'Atrasado'),
            defaultValue: 'Presente'
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
        tableName: 'attendance'
    });

    return Attendance;
};
