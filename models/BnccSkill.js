import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BnccSkill = sequelize.define('BnccSkill', {
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
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    disciplineId: {
        type: DataTypes.STRING(5),
        allowNull: false,
        field: 'discipline_id',
        references: {
            model: 'bncc_disciplines',
            key: 'id',
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    context: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'bncc_skills',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            name: 'idx_code',
            fields: ['code']
        },
        {
            name: 'idx_year_discipline',
            fields: ['year', 'discipline_id']
        }
    ]
});

export default BnccSkill;
