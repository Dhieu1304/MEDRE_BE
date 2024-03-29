const { SCHEDULE_TYPE, SCHEDULE_SESSION } = require('./schedule.constant');

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
      },
      apply_to: {
        type: DataTypes.DATEONLY,
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
