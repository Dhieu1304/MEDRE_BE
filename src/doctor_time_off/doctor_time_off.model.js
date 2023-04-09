module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'doctor_time_off',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      id_doctor: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'staff',
          key: 'id',
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time_start: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      time_end: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'doctor_time_off',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'doctor_time_off_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
