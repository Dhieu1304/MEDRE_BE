const DataTypes = require('sequelize').DataTypes;
const _staff = require('../staff/staff.model');
const _user = require('../user/user.model');
const _expertise = require('../expertise/expertise.model');
const _staff_expertise = require('../staff_expertise/staff_expertise.model');
const _schedule = require('../schedule/schedule.model');
const _booking = require('../booking/booking.model');
const _time_schedule = require('../time_schedule/time_schedule.model');
const _blocking_account = require('../blocking_account/blocking_account.model');
const _patient = require('../patient/patient.model');
const _history_booking = require('../history_booking/history_booking.model');

function initModels(sequelize) {
  const staff = _staff(sequelize, DataTypes);
  const user = _user(sequelize, DataTypes);
  const expertise = _expertise(sequelize, DataTypes);
  const staff_expertise = _staff_expertise(sequelize, DataTypes);
  const time_schedule = _time_schedule(sequelize, DataTypes);
  const schedule = _schedule(sequelize, DataTypes);
  const booking = _booking(sequelize, DataTypes);
  const blocking_account = _blocking_account(sequelize, DataTypes);
  const patient = _patient(sequelize, DataTypes);
  const history_booking = _history_booking(sequelize, DataTypes);

  expertise.belongsToMany(staff, {
    as: 'id_staff_staffs',
    through: staff_expertise,
    foreignKey: 'id_expertise',
    otherKey: 'id_staff',
  });
  staff.belongsToMany(expertise, {
    as: 'id_expertise_expertises',
    through: staff_expertise,
    foreignKey: 'id_staff',
    otherKey: 'id_expertise',
  });
  staff_expertise.belongsTo(expertise, { as: 'id_expertise_expertise', foreignKey: 'id_expertise' });
  expertise.hasMany(staff_expertise, { as: 'staff_expertises', foreignKey: 'id_expertise' });
  staff_expertise.belongsTo(staff, { as: 'id_staff_staff', foreignKey: 'id_staff' });
  staff.hasMany(staff_expertise, { as: 'staff_expertises', foreignKey: 'id_staff' });
  booking.belongsTo(schedule, { as: 'id_schedule_schedule', foreignKey: 'id_schedule' });
  schedule.hasMany(booking, { as: 'bookings', foreignKey: 'id_schedule' });
  booking.belongsTo(user, { as: 'id_user_user', foreignKey: 'id_user' });
  user.hasMany(booking, { as: 'id_user_bookings', foreignKey: 'id_user' });
  booking.belongsTo(patient, { as: 'id_patient_patient', foreignKey: 'id_patient' });
  patient.hasMany(booking, { as: 'bookings', foreignKey: 'id_patient' });
  schedule.belongsTo(time_schedule, { as: 'time_schedule', foreignKey: 'id_time' });
  time_schedule.hasMany(schedule, { as: 'schedules', foreignKey: 'id_time' });
  schedule.belongsTo(staff, { as: 'id_doctor_staff', foreignKey: 'id_doctor' });
  staff.hasMany(schedule, { as: 'staff_schedules', foreignKey: 'id_doctor' });
  history_booking.belongsTo(schedule, { as: 'id_schedule_schedule', foreignKey: 'id_schedule' });
  schedule.hasMany(history_booking, { as: 'history_bookings', foreignKey: 'id_schedule' });
  history_booking.belongsTo(patient, { as: 'patient', foreignKey: 'id_patient' });
  patient.hasMany(history_booking, { as: 'history_bookings', foreignKey: 'id_patient' });
  history_booking.belongsTo(user, { as: 'id_user_user', foreignKey: 'id_user' });
  user.hasMany(history_booking, { as: 'id_user_history_bookings', foreignKey: 'id_user' });
  history_booking.belongsTo(booking, { as: 'id_booking_booking', foreignKey: 'id_booking' });
  booking.hasOne(history_booking, { as: 'history_bookings', foreignKey: 'id_booking' });

  return {
    staff,
    user,
    expertise,
    staff_expertise,
    schedule,
    booking,
    time_schedule,
    blocking_account,
    patient,
    history_booking,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
