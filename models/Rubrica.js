import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Rubrica = sequelize.define('Rubrica', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        projetoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            field: 'projeto_id'
        },
        titulo: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'rubricas',
        timestamps: true,
        createdAt: 'criada_em',
        updatedAt: 'atualizada_em',
        underscored: false
    });

    Rubrica.associate = (models) => {
        Rubrica.belongsTo(models.Project, {
            foreignKey: 'projetoId',
            as: 'projeto',
            onDelete: 'CASCADE'
        });

        Rubrica.hasMany(models.RubricaCriterio, {
            foreignKey: 'rubricaId',
            as: 'criterios',
            onDelete: 'CASCADE'
        });

        Rubrica.hasMany(models.AvaliacaoEquipe, {
            foreignKey: 'rubricaId',
            as: 'avaliacoes',
            onDelete: 'CASCADE'
        });
    };

    return Rubrica;
};
