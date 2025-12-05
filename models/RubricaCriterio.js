import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const RubricaCriterio = sequelize.define('RubricaCriterio', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rubricaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'rubrica_id'
        },
        nome: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        peso: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 1.0
        },
        ordem: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'rubrica_criterios',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: false,
        underscored: false
    });

    RubricaCriterio.associate = (models) => {
        RubricaCriterio.belongsTo(models.Rubrica, {
            foreignKey: 'rubricaId',
            as: 'rubrica',
            onDelete: 'CASCADE'
        });

        RubricaCriterio.hasMany(models.RubricaNivel, {
            foreignKey: 'criterioId',
            as: 'niveis',
            onDelete: 'CASCADE'
        });

        RubricaCriterio.hasMany(models.AvaliacaoCriterio, {
            foreignKey: 'criterioId',
            as: 'avaliacoes',
            onDelete: 'RESTRICT'
        });
    };

    return RubricaCriterio;
};
