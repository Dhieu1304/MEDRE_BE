module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'global_setting',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      desc_name: {
        type: DataTypes.STRING(512),
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'global_setting',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'global_setting_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
