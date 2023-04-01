const { USER_STATUS, GENDERS } = require('../user/user.constant');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'patient',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      id_user: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(100),
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
      status: {
        type: DataTypes.STRING(10),
        defaultValue: USER_STATUS.OK,
      },
      health_insurance: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'patient',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'patient_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
