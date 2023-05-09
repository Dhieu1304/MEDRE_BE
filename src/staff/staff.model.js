const { GENDERS } = require('../user/user.constant');
const { STAFF_ROLES } = require('./staff.constant');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'staff',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: 'staff_username_key',
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: 'staff_phone_number_key',
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: 'staff_email_key',
      },
      password: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
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
      role: {
        type: DataTypes.STRING(50),
        defaultValue: STAFF_ROLES.ADMIN,
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
      description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      education: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      certificate: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'staff',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'staff_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'staff_username_key',
          unique: true,
          fields: [{ name: 'username' }],
        },
        {
          name: 'staff_email_key',
          unique: true,
          fields: [{ name: 'email' }],
        },
        {
          name: 'staff_phone_number_key',
          unique: true,
          fields: [{ name: 'phone_number' }],
        },
      ],
    }
  );
};
