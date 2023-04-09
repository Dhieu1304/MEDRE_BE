const { SCHEDULE_TYPE } = require('./schedule.constant');
const moment = require('moment');
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
        references: {
          model: 'staff',
          key: 'id',
        },
      },
      day_of_week: {
        type: DataTypes.INTEGER,
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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: SCHEDULE_TYPE.ONLINE,
      },
      apply_from: {
        type: DataTypes.DATEONLY,
        defaultValue: moment(),
      },
      apply_to: {
        type: DataTypes.DATEONLY,
        defaultValue: moment().add(1, 'years'),
      },
    },
    {
      sequelize,
      tableName: 'schedule',
      schema: 'public',
      timestamps: true,
      paranoid: true,
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
