import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const RubricaNivel = sequelize.define('RubricaNivel', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        criterioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'criterio_id'
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        pontos: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ordem: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'rubrica_niveis',
        timestamps: false,
        underscored: false
    });

    RubricaNivel.associate = (models) => {
        RubricaNivel.belongsTo(models.RubricaCriterio, {
            foreignKey: 'criterioId',
            as: 'criterio',
            onDelete: 'CASCADE'
        });

        RubricaNivel.hasMany(models.AvaliacaoCriterio, {
            foreignKey: 'nivelId',
            as: 'avaliacoes',
            onDelete: 'RESTRICT'
        });
    };

    return RubricaNivel;
};
