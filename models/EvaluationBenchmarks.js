import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const EvaluationBenchmarks = sequelize.define('EvaluationBenchmarks', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'project_id',
        },
        skillCode: {
            type: DataTypes.STRING(50),
            field: 'skill_code',
        },
        level: {
            type: DataTypes.INTEGER,
        },
        description: {
            type: DataTypes.TEXT,
        },
        criteria: {
            type: DataTypes.JSON,
        },
        examples: {
            type: DataTypes.TEXT,
        },
        points: {
            type: DataTypes.DECIMAL(5, 2),
        },
    }, {
        tableName: 'evaluation_benchmarks',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                name: 'unique_benchmark',
                fields: ['project_id', 'skill_code', 'level']
            },
            {
                name: 'idx_benchmark_skill',
                fields: ['skill_code']
            }
        ]
    });

    return EvaluationBenchmarks;
};
