module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'staff_expertise',
    {
      id_staff: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'staff',
          key: 'id',
        },
      },
      id_expertise: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'expertise',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'staff_expertise',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'staff_expertise_pkey',
          unique: true,
          fields: [{ name: 'id_staff' }, { name: 'id_expertise' }],
        },
      ],
    }
  );
};
