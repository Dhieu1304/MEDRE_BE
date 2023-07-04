module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'ticket_detail',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      id_ticket: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'ticket',
          key: 'id',
        },
      },
      id_user: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      id_staff: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'staff',
          key: 'id',
        },
      },
      content: {
        type: DataTypes.STRING(5000),
      },
    },
    {
      sequelize,
      tableName: 'ticket_detail',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'ticket_detail_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
