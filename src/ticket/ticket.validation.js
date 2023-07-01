const Joi = require('joi');
const { TICKET_STATUS } = require('./ticket.constant');

const listTicket = {
  query: Joi.object().keys({
    status: Joi.string().valid(...Object.values(TICKET_STATUS)),
    order: Joi.string().valid('status:asc', 'status:desc', 'createdAt:asc', 'createdAt:desc'),
    page: Joi.number().integer().default(1).min(1),
    limit: Joi.number().integer().default(10).min(1),
  }),
};

const detailTicket = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

const createTicket = {
  body: Joi.object().keys({
    title: Joi.string().required().trim(),
    content: Joi.string().required().trim(),
  }),
};

const responseTicket = {
  body: Joi.object().keys({
    id_ticket: Joi.string().uuid().required(),
    content: Joi.string().required().trim(),
  }),
};

const updateTicket = {
  body: Joi.object().keys({
    id: Joi.string().uuid().required(),
    status: Joi.string().valid(...Object.values(TICKET_STATUS)),
  }),
};

module.exports = {
  listTicket,
  createTicket,
  detailTicket,
  responseTicket,
  updateTicket,
};
