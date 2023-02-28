const { USER_STATUS, GENDERS } = require('../user/user.constant');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'staff',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
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
      status: {
        type: DataTypes.STRING(10),
        defaultValue: USER_STATUS.OK,
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
      refresh_token: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'staff',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'staff_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
