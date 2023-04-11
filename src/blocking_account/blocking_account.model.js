const { ACCOUNT_ROLES, BLOCK_ACCOUNT_TYPE } = require('./blocking_account.constant');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'blocking_account',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      id_staff: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'staff',
          key: 'id',
        },
      },
      id_account: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(50),
        enum: ACCOUNT_ROLES,
        defaultValue: ACCOUNT_ROLES.USER,
      },
      type: {
        type: DataTypes.STRING(10),
        enum: BLOCK_ACCOUNT_TYPE,
        defaultValue: BLOCK_ACCOUNT_TYPE.BLOCK,
      },
      reason: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'blocking_account',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'blocking_account_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
