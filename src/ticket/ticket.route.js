const express = require('express');
const ticketController = require('./ticket.controller');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const ticketValidation = require('./ticket.validation');
const { staffPermission } = require('../middlewares/staffPermission');
const { ALL_STAFF_ROLES } = require('../staff/staff.constant');

const router = express.Router();
router.use(auth());

router.get('/list', validate(ticketValidation.listTicket), ticketController.listTicket);
router.get('/detail/:id', validate(ticketValidation.detailTicket), ticketController.detailTicket);
router.post('/create', validate(ticketValidation.createTicket), ticketController.createTicket);
router.post('/response', validate(ticketValidation.responseTicket), ticketController.responseTicket);
router.put(
  '/update',
  staffPermission(ALL_STAFF_ROLES),
  validate(ticketValidation.updateTicket),
  ticketController.updateTicket
);
module.exports = router;
