const { SCHEDULE_TYPE, SCHEDULE_SESSION } = require('./schedule.constant');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'schedule',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: uuidv4(),
      },
      id_doctor: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'staff',
          key: 'id',
        },
      },
      session: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: SCHEDULE_SESSION,
        defaultValue: SCHEDULE_SESSION.MORNING,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        enum: SCHEDULE_TYPE,
        defaultValue: SCHEDULE_TYPE.ONLINE,
      },
      id_expertise: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'expertise',
          key: 'id',
        },
      },
      repeat_on: {
        type: DataTypes.STRING,
        allowNull: false,
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
