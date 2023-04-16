const { v4: uuidV4 } = require('uuid');
const { PAYMENT_STATUS } = require('../booking_payment/booking_payment.constant');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'booking_payment',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: uuidV4(),
      },
      id_booking: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'booking',
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
      handle: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: PAYMENT_STATUS.SUCCESS,
      },
      txn_ref: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'booking_payment_txn_ref_key',
      },
      rsp_code: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: 'booking_payment',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'booking_payment_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'booking_payment_txn_ref_key',
          unique: true,
          fields: [{ name: 'txnRef' }],
        },
      ],
    }
  );
};
