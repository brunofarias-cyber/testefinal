import { DataTypes } from 'sequelize';

export const TeamMessageModel = (sequelize) => {
  const TeamMessage = sequelize.define('TeamMessage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Teams',
        key: 'id',
      },
      index: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    senderName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.ENUM('text', 'notification', 'system'),
      defaultValue: 'text',
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Extra info: { attachments: [], mentions: [], reactions: {} }',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      index: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'TeamMessages',
    timestamps: true,
    indexes: [
      { fields: ['teamId', 'createdAt'] },
      { fields: ['senderId'] },
      { fields: ['isRead'] },
    ],
  });

  TeamMessage.associate = (models) => {
    TeamMessage.belongsTo(models.Team, { foreignKey: 'teamId' });
    TeamMessage.belongsTo(models.User, { as: 'sender', foreignKey: 'senderId' });
  };

  return TeamMessage;
};
