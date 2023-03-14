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
      id_user: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
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
