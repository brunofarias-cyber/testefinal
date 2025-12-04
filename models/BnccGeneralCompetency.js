import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BnccGeneralCompetency = sequelize.define('BnccGeneralCompetency', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: 'bncc_general_competencies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
});

export default BnccGeneralCompetency;
