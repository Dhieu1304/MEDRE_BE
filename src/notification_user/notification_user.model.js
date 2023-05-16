module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'notification_user',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      id_notification: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'notification',
          key: 'id',
        },
      },
      id_user: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      id_staff: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'staff',
          key: 'id',
        },
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'notification_user',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'notification_user_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
