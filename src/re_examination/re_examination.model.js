module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    're_examination',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      id_booking: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'booking',
          key: 'id',
        },
      },
      is_apply: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      date_re_exam: {
        type: DataTypes.DATEONLY,
      },
      is_remind: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      id_staff_remind: {
        type: DataTypes.UUID,
        references: {
          model: 'staff',
          key: 'id',
        },
      },
      date_remind: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: 're_examination',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 're_examination_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
