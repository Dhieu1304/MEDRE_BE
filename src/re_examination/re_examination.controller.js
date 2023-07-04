const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, paginationFormat } = require('../utils/responseFormat');
const reExaminationService = require('./re_examination.service');
const models = require('../models');
const pageLimit2Offset = require('../utils/pageLimit2Offset');
const pick = require('../utils/pick');

const list = catchAsync(async (req, res) => {
  const option = {
    include: [{ model: models.booking, as: 're_exam_of_booking', where: { id_user: req.user.id } }],
    order: [['date_re_exam', 'desc']],
  };
  const listReExamination = await reExaminationService.findAllByOption(option);
  return res.status(httpStatus.OK).json(responseData(listReExamination));
});

const listForStaff = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const filter = pick(req.query, ['date_re_exam', 'is_apply', 'order', 'is_remind', 'id_staff_remind', 'date_remind']);
  const order = [];
  if (filter.order) {
    const parts = filter.order.split(':');
    order.push(parts);
    // same date => sort by createdAt
    if (parts[0] === 'date_re_exam') {
      order.push(['createdAt', parts[1]]);
    }
    delete filter.order;
  }

  const options = {
    where: filter,
    include: [
      {
        model: models.booking,
        as: 're_exam_of_booking',
        include: [
          {
            model: models.user,
            as: 'booking_of_user',
            attributes: { exclude: ['password'] },
          },
        ],
      },
    ],
    ...pageLimit2Offset(page, limit),
    order,
  };

  const listReExamination = await reExaminationService.findAndCountAllByCondition(options);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(listReExamination, page, limit)));
});

const create = catchAsync(async (req, res) => {
  const newReExamination = await reExaminationService.createReExam(req.body);
  return res.status(httpStatus.OK).json(responseData(newReExamination, 'Create Re-Examination successfully'));
});

const update = catchAsync(async (req, res) => {
  const data = pick(req.body, ['id', 'is_apply', 'date_re_exam', 'is_remind']);
  if (data.is_remind) {
    data.id_staff_remind = req.user.id;
    data.date_remind = new Date();
  }
  const updateReExam = await reExaminationService.updateReExam(data);
  return res.status(httpStatus.OK).json(responseData(updateReExam, 'Update Re-Examination successfully'));
});

module.exports = {
  list,
  listForStaff,
  create,
  update,
};
