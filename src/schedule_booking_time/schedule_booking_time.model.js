module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'schedule_booking_time',
    {
      id_expertise: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'expertise',
          key: 'id',
        },
        primaryKey: true,
      },
      id_time_schedule: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'time_schedule',
          key: 'id',
        },
        primaryKey: true,
      },
      total_online: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 4,
      },
      total_offline: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 6,
      },
      total_offline_booking_online: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 3,
      },
    },
    {
      sequelize,
      tableName: 'schedule_booking_time',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'schedule_booking_time_pkey',
          unique: true,
          fields: [{ name: 'id_expertise' }, { name: 'id_time_schedule' }],
        },
      ],
    }
  );
};
