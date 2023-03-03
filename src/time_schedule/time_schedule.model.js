module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'time_schedule',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
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
      tableName: 'time_schedule',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'time_schedule_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
