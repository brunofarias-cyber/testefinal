import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const AvaliacaoCriterio = sequelize.define('AvaliacaoCriterio', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        avaliacaoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'avaliacao_id'
        },
        criterioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'criterio_id'
        },
        nivelId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'nivel_id'
        },
        pontosObtidos: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            field: 'pontos_obtidos'
        },
        comentario: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'avaliacoes_criterios',
        timestamps: false,
        underscored: false,
        indexes: [
            {
                unique: true,
                fields: ['avaliacao_id', 'criterio_id']
            },
            {
                fields: ['avaliacao_id']
            }
        ]
    });

    AvaliacaoCriterio.associate = (models) => {
        AvaliacaoCriterio.belongsTo(models.AvaliacaoEquipe, {
            foreignKey: 'avaliacaoId',
            as: 'avaliacao',
            onDelete: 'CASCADE'
        });

        AvaliacaoCriterio.belongsTo(models.RubricaCriterio, {
            foreignKey: 'criterioId',
            as: 'criterio',
            onDelete: 'RESTRICT'
        });

        AvaliacaoCriterio.belongsTo(models.RubricaNivel, {
            foreignKey: 'nivelId',
            as: 'nivel',
            onDelete: 'RESTRICT'
        });
    };

    return AvaliacaoCriterio;
};
