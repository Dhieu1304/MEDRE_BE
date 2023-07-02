/*global _io*/
/*eslint no-undef: "error"*/

const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, paginationFormat } = require('../utils/responseFormat');
const ticketService = require('./ticket.service');
const pick = require('../utils/pick');
const pageLimit2Offset = require('../utils/pageLimit2Offset');
const models = require('../models');
const { NOTIFICATION_FOR } = require('../notification/notification.constant');
const { NOTIFICATION_EVENT } = require('../socket/socket.constant');

const listTicket = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const filter = pick(req.query, ['status', 'order']);
  if (req.user.role === 'User') {
    filter.id_user = req.user.id;
  }

  const order = [];
  if (filter.order) {
    order.push(filter.order.split(':'));
    delete filter.order;
  }

  const condition = {
    where: filter,
    ...pageLimit2Offset(page, limit),
    order,
  };

  const tickets = await ticketService.findAndCountAllByCondition(condition);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(tickets, page, limit)));
});

const createTicket = catchAsync(async (req, res) => {
  const data = pick(req.body, ['title', 'content']);
  data.id_user = req.user.id;

  let { ticket, ticketDetail } = await ticketService.createTicket(data);
  ticket = ticket.toJSON();
  ticketDetail = ticketDetail.toJSON();
  ticket.ticket_details = [ticketDetail];

  const payload = {
    notification: {
      title: 'Hỗ trợ',
      body: 'Vừa có 1 yêu cầu hỗ trợ mới',
    },
  };
  _io.in(NOTIFICATION_FOR.CUSTOMER_SERVICE).emit(NOTIFICATION_EVENT.NOTIFICATION, payload);
  _io.in(NOTIFICATION_FOR.NURSE).emit(NOTIFICATION_EVENT.NOTIFICATION, payload);

  return res.status(httpStatus.OK).json(responseData(ticket));
});

const detailTicket = catchAsync(async (req, res) => {
  const filter = pick(req.params, ['id']);
  if (req.user.role === 'User') {
    filter.id_user = req.user.id;
  }

  const condition = {
    where: filter,
    include: [{ model: models.ticket_detail, as: 'ticket_details' }],
    order: [[{ model: models.ticket_detail, as: 'ticket_details' }, 'createdAt', 'asc']],
  };

  const ticket = await ticketService.findOneByOption(condition);
  return res.status(httpStatus.OK).json(responseData(ticket));
});

const responseTicket = catchAsync(async (req, res) => {
  const data = pick(req.body, ['id_ticket', 'content']);
  if (req.user.role === 'User') {
    data.id_user = req.user.id;
  } else {
    data.id_staff = req.user.id;
  }

  const ticketDetail = await ticketService.createTicketDetail(data);

  if (req.user.role === 'User') {
    const payload = {
      notification: {
        title: 'Hỗ trợ',
        body: 'Vừa có 1 phản hồi yêu cầu hỗ trợ mới',
      },
    };

    _io.in(NOTIFICATION_FOR.CUSTOMER_SERVICE).emit(NOTIFICATION_EVENT.NOTIFICATION, payload);
    _io.in(NOTIFICATION_FOR.NURSE).emit(NOTIFICATION_EVENT.NOTIFICATION, payload);
  }

  return res.status(httpStatus.OK).json(responseData(ticketDetail));
});

const updateTicket = catchAsync(async (req, res) => {
  const data = pick(req.body, ['id', 'status']);

  const updateTicket = await ticketService.updateTicket(data);
  return res.status(httpStatus.OK).json(responseData(updateTicket));
});

module.exports = {
  listTicket,
  createTicket,
  detailTicket,
  responseTicket,
  updateTicket,
};
