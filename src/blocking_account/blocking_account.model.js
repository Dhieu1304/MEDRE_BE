const { ACCOUNT_ROLES } = require('./blocking_account.constant');

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
        type: DataTypes.STRING(10),
        defaultValue: ACCOUNT_ROLES.USER,
      },
      type: {
        type: DataTypes.STRING(10),
      },
      reason: {
        type: DataTypes.STRING(200),
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
