import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const AvaliacaoEquipe = sequelize.define('AvaliacaoEquipe', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        projetoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'projeto_id'
        },
        equipeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'equipe_id'
        },
        rubricaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'rubrica_id'
        },
        criadoPorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'criada_por'
        },
        notaFinal: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            field: 'nota_final'
        }
    }, {
        tableName: 'avaliacoes_equipe',
        timestamps: true,
        createdAt: 'avaliada_em',
        updatedAt: 'atualizada_em',
        underscored: false,
        indexes: [
            {
                unique: true,
                fields: ['projeto_id', 'equipe_id', 'rubrica_id']
            },
            {
                fields: ['equipe_id']
            },
            {
                fields: ['projeto_id']
            }
        ]
    });

    AvaliacaoEquipe.associate = (models) => {
        AvaliacaoEquipe.belongsTo(models.Project, {
            foreignKey: 'projetoId',
            as: 'projeto',
            onDelete: 'CASCADE'
        });

        // Assuming we have a Team model
        AvaliacaoEquipe.belongsTo(models.Team, {
            foreignKey: 'equipeId',
            as: 'equipe',
            onDelete: 'CASCADE'
        });

        AvaliacaoEquipe.belongsTo(models.Rubrica, {
            foreignKey: 'rubricaId',
            as: 'rubrica',
            onDelete: 'CASCADE'
        });

        AvaliacaoEquipe.belongsTo(models.User, {
            foreignKey: 'criadoPorId',
            as: 'criadoPor',
            onDelete: 'RESTRICT'
        });

        AvaliacaoEquipe.hasMany(models.AvaliacaoCriterio, {
            foreignKey: 'avaliacaoId',
            as: 'criterios',
            onDelete: 'CASCADE'
        });
    };

    return AvaliacaoEquipe;
};
