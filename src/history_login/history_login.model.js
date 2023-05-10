const { LOGIN_TYPE } = require('./history_login.constant');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'history_login',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
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
      blacklisted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      login_type: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: LOGIN_TYPE,
        defaultValue: LOGIN_TYPE.EMAIL,
      },
      refresh_token: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'history_login',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'history_login_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
