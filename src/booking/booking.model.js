const { BOOKING_STATUS } = require('./booking.constant');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'booking',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      id_schedule: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'schedule',
          key: 'id',
        },
      },
      id_user: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      booking_status: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: BOOKING_STATUS.WAITING,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_payment: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      reason: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      id_patient: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'booking',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'booking_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
