import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const TheoreticalReference = sequelize.define(
        'TheoreticalReference',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            authors: {
                type: DataTypes.STRING(500),
            },
            publicationYear: {
                type: DataTypes.INTEGER,
            },
            category: {
                type: DataTypes.ENUM(
                    'active-methodologies',
                    'pedagogical-practices',
                    'hybrid-learning',
                    'project-based-learning',
                    'gamification',
                    'team-learning',
                    'critical-thinking',
                    'creativity',
                    'assessment'
                ),
                defaultValue: 'active-methodologies',
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            keyInsights: {
                type: DataTypes.JSON,
                comment: 'Array de insights principais extraídos do texto',
            },
            chapters: {
                type: DataTypes.JSON,
                comment: 'Índice de capítulos e seções',
            },
            embeddings: {
                type: DataTypes.TEXT,
                comment: 'Vector embeddings para busca semântica',
            },
            source: {
                type: DataTypes.STRING(500),
                comment: 'Arquivo de origem (ex: metodologias_ativas_bacich.pdf)',
            },
            processingStatus: {
                type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
                defaultValue: 'pending',
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'theoretical_references',
            timestamps: true,
        }
    );

    return TheoreticalReference;
};
