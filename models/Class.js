import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Class = sequelize.define('Class', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        googleId: {
            type: DataTypes.STRING,
            field: 'google_id',
            unique: true,
        },
        section: {
            type: DataTypes.STRING,
        },
        room: {
            type: DataTypes.STRING,
        },
        ownerId: {
            type: DataTypes.INTEGER,
            field: 'owner_id',
        },
    }, {
        tableName: 'classes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    return Class;
};
