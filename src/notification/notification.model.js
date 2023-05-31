const { NOTIFICATION_FOR, NOTIFICATION_TYPE } = require('./notification.constant');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'notification',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'staff',
          key: 'id',
        },
      },
      type: {
        type: DataTypes.STRING(50),
        enum: NOTIFICATION_TYPE,
        defaultValue: NOTIFICATION_TYPE.BOOKING,
      },
      notification_for: {
        type: DataTypes.STRING(100),
        enum: NOTIFICATION_FOR,
        defaultValue: NOTIFICATION_FOR.PERSONAL,
      },
      title: {
        type: DataTypes.STRING(512),
        allowNull: false,
        trim: true,
      },
      content: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        trim: true,
      },
      description: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        trim: true,
      },
      id_redirect: {
        type: DataTypes.UUID,
      },
    },
    {
      sequelize,
      tableName: 'notification',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'notification_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
