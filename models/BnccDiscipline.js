import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BnccDiscipline = sequelize.define('BnccDiscipline', {
    id: {
        type: DataTypes.STRING(5),
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    area: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    tableName: 'bncc_disciplines',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

export default BnccDiscipline;
