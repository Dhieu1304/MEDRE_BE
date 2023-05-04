const { SCHEDULE_SESSION } = require('../schedule/schedule.constant');

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
      from: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      to: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      session: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: SCHEDULE_SESSION,
        defaultValue: SCHEDULE_SESSION.WHOLE_DAY,
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
