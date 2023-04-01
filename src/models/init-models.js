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
  booking.belongsTo(user, { as: 'patient', foreignKey: 'id_patient' });
  user.hasMany(booking, { as: 'bookings', foreignKey: 'id_patient' });
  booking.belongsTo(user, { as: 'id_user_user', foreignKey: 'id_user' });
  user.hasMany(booking, { as: 'id_user_bookings', foreignKey: 'id_user' });
  schedule.belongsTo(time_schedule, { as: 'time_schedule', foreignKey: 'id_time' });
  time_schedule.hasMany(schedule, { as: 'schedules', foreignKey: 'id_time' });
  schedule.belongsTo(staff, { as: 'id_doctor_staff', foreignKey: 'id_doctor' });
  staff.hasMany(schedule, { as: 'staff_schedules', foreignKey: 'id_doctor' });

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
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
