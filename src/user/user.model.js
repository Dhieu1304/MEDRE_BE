const { GENDERS } = require('./user.constant');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: 'user_phone_number_key',
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: 'user_email_key',
      },
      password: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(10),
        defaultValue: GENDERS.OTHER,
      },
      dob: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      phone_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      health_insurance: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      blocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'user',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'user_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'user_email_key',
          unique: true,
          fields: [{ name: 'email' }],
        },
        {
          name: 'user_phone_number_key',
          unique: true,
          fields: [{ name: 'phone_number' }],
        },
      ],
    }
  );
};
