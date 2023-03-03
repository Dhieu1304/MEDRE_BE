const { SCHEDULE_STATUS, SCHEDULE_TYPE } = require('./schedule.constant');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'schedule',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      id_doctor: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      id_time: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'time_schedule',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: SCHEDULE_STATUS.EMPTY,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: SCHEDULE_TYPE.ONLINE,
      },
    },
    {
      sequelize,
      tableName: 'schedule',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'schedule_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
