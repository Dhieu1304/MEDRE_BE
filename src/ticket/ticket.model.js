const { TICKET_STATUS } = require('./ticket.constant');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'ticket',
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      id_user: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: TICKET_STATUS.OPEN,
      },
    },
    {
      sequelize,
      tableName: 'ticket',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          name: 'ticket_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
