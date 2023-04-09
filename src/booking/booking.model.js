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
      id_patient: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'patient',
          key: 'id',
        },
      },
        id_staff_booking: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'staff',
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
        type: DataTypes.STRING(1000),
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
      bookedAt: {
        type: DataTypes.DATE,
      },
      canceledAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: 'booking',
      schema: 'public',
      timestamps: true,
        paranoid: true,
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
