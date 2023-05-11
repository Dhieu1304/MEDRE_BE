module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'checkup_package',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      id_expertise: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'expertise',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'checkup_package',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'checkup_package_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
