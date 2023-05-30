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
  const options = {
    include: [{ model: models.booking, as: 're_exam_of_booking' }],
    ...pageLimit2Offset(page, limit),
    order: [['date_re_exam', 'desc']],
  };
  const listReExamination = await reExaminationService.findAndCountAllByCondition(options);
  return res.status(httpStatus.OK).json(responseData(paginationFormat(listReExamination, page, limit)));
});

const create = catchAsync(async (req, res) => {
  const newReExamination = await reExaminationService.createReExam(req.body);
  return res.status(httpStatus.OK).json(responseData(newReExamination, 'Create Re-Examination successfully'));
});

const update = catchAsync(async (req, res) => {
  const data = pick(req.body, ['id', 'is_apply', 'date_re_exam']);
  data.id_staff_remind = req.user.id;
  data.date_remind = new Date();
  const updateReExam = await reExaminationService.updateReExam(data);
  return res.status(httpStatus.OK).json(responseData(updateReExam, 'Update Re-Examination successfully'));
});

module.exports = {
  list,
  listForStaff,
  create,
  update,
};