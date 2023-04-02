const { HISTORY_BOOKING_STATUS } = require('./history_booking.constant');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'history_booking',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      id_booking: {
        type: DataTypes.UUID,
        allowNull: false,
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
        defaultValue: HISTORY_BOOKING_STATUS.BOOKED,
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
      note: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      conclusion: {
        type: DataTypes.STRING(2000),
        allowNull: true,
      },
      id_patient: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'patient',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'history_booking',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'history_booking_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
