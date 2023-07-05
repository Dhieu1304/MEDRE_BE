const models = require('../models');
const { v4: uuidv4 } = require('uuid');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Op } = require('sequelize');
const moment = require('moment');
const { getGlobalSettingByName } = require('../nodeCache/global_setting');
const { GLOBAL_SETTING } = require('../global_setting/global_setting.constant');
const i18next = require('i18next');

const findOneByFilter = async (filter) => {
  return await models.schedule.findOne({ where: filter });
};

const findAllByFilter = async (filter) => {
  return await models.schedule.findAll({ where: filter });
};

const findAllByOption = async (options = {}) => {
  return await models.schedule.findAll(options);
};

// input: { id_doctor, apply_from, apply_to, data: [{id_expertise, type, session, repeat_on: [number]}] }
const createSchedule = async (body) => {
  const { id_doctor, apply_from, apply_to, data } = body;

  const dateCreateAdvance = parseInt(getGlobalSettingByName(GLOBAL_SETTING.CREATE_SCHEDULE_ADVANCE_DAY), 10);
  if (moment().add(dateCreateAdvance, 'days') >= apply_from) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('schedule.createInAdvance', {dateCreateAdvance: `${dateCreateAdvance}`}));
  }

  // check apply_date
  const checkSchedule = await models.schedule.findOne({
    where: { id_doctor, apply_to: { [Op.gte]: apply_from } },
  });
  if (checkSchedule) {
    const date = moment(apply_from).format('DD-MM-YYYY');
    throw new ApiError(httpStatus.BAD_REQUEST,i18next.t('schedule.greater', {date: date}));
  }

  // check data: [{expertise, type, session, repeat_on: [number]}]
  const listExpertiseId = new Set();
  const sessionRepeat = {};
  for (let i = 0; i < data.length; i++) {
    listExpertiseId.add(data[i].id_expertise);

    if (new Set(data[i].repeat_on).size !== data[i].repeat_on.length) {
      throw new ApiError(httpStatus.BAD_REQUEST,  i18next.t('schedule.inappropriate'));
    }
    const checkRepeatOn = data[i].repeat_on.sort((a, b) => {
      return a - b;
    });

    for (let j = 0; j < checkRepeatOn.length; j++) {
      const key = `${data[i].session}_${checkRepeatOn[j]}`;
      const days = [i18next.t('weekDays.sunday'),i18next.t('weekDays.monday'),i18next.t('weekDays.tuesday'),i18next.t('weekDays.wednesday'),i18next.t('weekDays.thursday'),i18next.t('weekDays.friday'),i18next.t('weekDays.saturday')]
      if (Object.prototype.hasOwnProperty.call(sessionRepeat, key)) {
        const day = days[key];
        console.log(day);
        throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('schedule.repeat', {day: `${day}`}));
      } else {
        sessionRepeat[key] = 1;
      }
    }

    // convert array to string
    data[i].repeat_on = checkRepeatOn.toString();
  }

  // check list expertise
  const doctorExpertise = await models.staff_expertise.findAll({
    where: { id_staff: id_doctor, id_expertise: [...listExpertiseId] },
    raw: true,
  });
  if (!doctorExpertise || doctorExpertise.length < listExpertiseId.size) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('schedule.checkExpertise'));
  }
  const schedules = data.map((item) => {
    return {
      id: uuidv4(),
      id_doctor,
      apply_from,
      apply_to,
      type: item.type,
      id_expertise: item.id_expertise,
      session: item.session,
      repeat_on: item.repeat_on,
    };
  });

  return await models.schedule.bulkCreate(schedules);
};

const changeApplyToAllSchedule = async (id_doctor, apply_to) => {
  return await models.schedule.update({ apply_to }, { where: { id_doctor, apply_to: { [Op.gte]: moment() } } });
};

const changeApplyToSchedule = async (id, apply_to) => {
  return await models.schedule.update({ apply_to }, { where: { id } });
};

const deleteSchedule = async (id) => {
  const booking = await models.booking.findOne({ where: { id_schedule: id } });
  if (booking) {
    throw new ApiError(httpStatus.BAD_REQUEST, i18next.t('schedule.cannotDelete'));
  }
  return await models.schedule.destroy({ where: { id } });
};

module.exports = {
  findOneByFilter,
  findAllByFilter,
  findAllByOption,
  createSchedule,
  changeApplyToAllSchedule,
  changeApplyToSchedule,
  deleteSchedule,
};
