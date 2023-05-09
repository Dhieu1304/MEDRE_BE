const DataTypes = require('sequelize').DataTypes;
const _staff = require('../staff/staff.model');
const _user = require('../user/user.model');
const _expertise = require('../expertise/expertise.model');
const _staff_expertise = require('../staff_expertise/staff_expertise.model');
const _schedule = require('../schedule/schedule.model');
const _patient = require('../patient/patient.model');
const _booking = require('../booking/booking.model');
const _booking_payment = require('../booking_payment/booking_payment.model');
const _time_schedule = require('../time_schedule/time_schedule.model');
const _blocking_account = require('../blocking_account/blocking_account.model');
const _doctor_time_off = require('../doctor_time_off/doctor_time_off.model');
const _history_login = require('../history_login/history_login.model');
const _package = require('../package/package.model');

function initModels(sequelize) {
  const staff = _staff(sequelize, DataTypes);
  const user = _user(sequelize, DataTypes);
  const expertise = _expertise(sequelize, DataTypes);
  const staff_expertise = _staff_expertise(sequelize, DataTypes);
  const time_schedule = _time_schedule(sequelize, DataTypes);
  const schedule = _schedule(sequelize, DataTypes);
  const patient = _patient(sequelize, DataTypes);
  const booking = _booking(sequelize, DataTypes);
  const blocking_account = _blocking_account(sequelize, DataTypes);
  const doctor_time_off = _doctor_time_off(sequelize, DataTypes);
  const booking_payment = _booking_payment(sequelize, DataTypes);
  const history_login = _history_login(sequelize, DataTypes);
  const package = _package(sequelize, DataTypes);

  expertise.belongsToMany(staff, {
    as: 'id_staff_staffs',
    through: staff_expertise,
    foreignKey: 'id_expertise',
    otherKey: 'id_staff',
  });
  staff.belongsToMany(expertise, {
    as: 'expertises',
    through: staff_expertise,
    foreignKey: 'id_staff',
    otherKey: 'id_expertise',
  });
  staff_expertise.belongsTo(expertise, { as: 'id_expertise_expertise', foreignKey: 'id_expertise' });
  expertise.hasMany(staff_expertise, { as: 'staff_expertises', foreignKey: 'id_expertise' });
  staff_expertise.belongsTo(staff, { as: 'id_staff_staff', foreignKey: 'id_staff' });
  staff.hasMany(staff_expertise, { as: 'staff_expertises', foreignKey: 'id_staff' });
  booking.belongsTo(schedule, { as: 'booking_schedule', foreignKey: 'id_schedule' });
  schedule.hasMany(booking, { as: 'bookings', foreignKey: 'id_schedule' });
  booking.belongsTo(user, { as: 'booking_of_user', foreignKey: 'id_user' });
  user.hasMany(booking, { as: 'id_user_bookings', foreignKey: 'id_user' });
  booking.belongsTo(patient, { as: 'booking_of_patient', foreignKey: 'id_patient' });
  patient.hasMany(booking, { as: 'bookings', foreignKey: 'id_patient' });
  schedule.belongsTo(expertise, { as: 'schedule_expertise', foreignKey: 'id_expertise' });
  expertise.hasMany(schedule, { as: 'expertise_schedule', foreignKey: 'id_expertise' });
  schedule.belongsTo(staff, { as: 'schedule_of_staff', foreignKey: 'id_doctor' });
  staff.hasMany(schedule, { as: 'staff_schedules', foreignKey: 'id_doctor' });
  doctor_time_off.belongsTo(staff, { as: 'staff_doctor_time_offs', foreignKey: 'id_doctor' });
  staff.hasMany(doctor_time_off, { as: 'time_offs', foreignKey: 'id_doctor' });
  staff.hasMany(blocking_account, { as: 'blocking_accounts', foreignKey: 'id_staff' });
  blocking_account.belongsTo(staff, { as: 'staff_blocking_account', foreignKey: 'id_staff' });
  booking.hasMany(booking_payment, { as: 'booking_payments', foreignKey: 'id_booking' });
  booking_payment.belongsTo(booking, { as: 'payment_of_booking', foreignKey: 'id_booking' });
  user.hasMany(booking_payment, { as: 'user_payments', foreignKey: 'id_user' });
  booking_payment.belongsTo(user, { as: 'payment_of_user', foreignKey: 'id_user' });
  booking.belongsTo(time_schedule, { as: 'booking_time_schedule', foreignKey: 'id_time' });
  time_schedule.hasMany(booking, { as: 'time_schedule_of_booking', foreignKey: 'id_time' });
  user.hasMany(history_login, { as: 'user_logins', foreignKey: 'id_user' });
  history_login.belongsTo(user, { as: 'login_of_user', foreignKey: 'id_user' });
  staff.hasMany(history_login, { as: 'staff_logins', foreignKey: 'id_staff' });
  history_login.belongsTo(staff, { as: 'login_of_staff', foreignKey: 'id_staff' });

  return {
    sequelize,
    staff,
    user,
    expertise,
    staff_expertise,
    schedule,
    time_schedule,
    blocking_account,
    patient,
    booking,
    doctor_time_off,
    booking_payment,
    history_login,
    package,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
