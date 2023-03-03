module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'expertise',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: 'expertise_name_key',
      },
    },
    {
      sequelize,
      tableName: 'expertise',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'expertise_name_key',
          unique: true,
          fields: [{ name: 'name' }],
        },
        {
          name: 'expertise_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
