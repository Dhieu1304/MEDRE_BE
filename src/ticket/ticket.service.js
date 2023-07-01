const models = require('../models');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

// data: { id_user, title, content }
const createTicket = async (data) => {
  const transaction = await models.sequelize.transaction();
  try {
    const ticket = await models.ticket.create(
      {
        id: uuidv4(),
        id_user: data.id_user,
        title: data.title,
      },
      { transaction }
    );
    const ticketDetail = await models.ticket_detail.create(
      {
        id: uuidv4(),
        id_user: data.id_user,
        id_ticket: ticket.id,
        content: data.content,
      },
      { transaction }
    );
    await transaction.commit();
    return { ticket, ticketDetail };
  } catch (e) {
    await transaction.rollback();
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
  }
};

const findOneByOption = async (options) => {
  return await models.ticket.findOne(options);
};

const findAllByFilter = async (filter) => {
  return await models.ticket.findAll({ where: filter });
};

const findAndCountAllByCondition = async (condition) => {
  return await models.ticket.findAndCountAll(condition);
};

const createTicketDetail = async (data) => {
  data.id = uuidv4();
  return await models.ticket_detail.create(data);
};

const updateTicket = async (data) => {
  let ticket = await models.ticket.findOne({ where: { id: data.id } });
  if (!ticket) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid ticket');
  }
  ticket = Object.assign(ticket, data);
  return await ticket.save();
};

module.exports = {
  createTicket,
  findOneByOption,
  findAllByFilter,
  findAndCountAllByCondition,
  createTicketDetail,
  updateTicket,
};
