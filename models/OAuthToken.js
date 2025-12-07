import { DataTypes } from 'sequelize';

export const OAuthTokenModel = (sequelize) => {
    const OAuthToken = sequelize.define('OAuthToken', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE'
        },
        provider: {
            type: DataTypes.ENUM('google', 'microsoft'),
            allowNull: false
        },
        accessToken: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        refreshToken: {
            type: DataTypes.TEXT
        },
        expiresAt: {
            type: DataTypes.DATE
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'oauth_tokens',
        indexes: [
            { fields: ['userId', 'provider'] },
            { fields: ['expiresAt'] }
        ]
    });

    return OAuthToken;
};
