import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SkillGeneralCompetency = sequelize.define('SkillGeneralCompetency', {
    skillId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'skill_id',
        references: {
            model: 'bncc_skills',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    competencyId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'competency_id',
        references: {
            model: 'bncc_general_competencies',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'skill_general_competencies',
    timestamps: false,
});

export default SkillGeneralCompetency;
