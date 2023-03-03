const SCHEDULE_STATUS = Object.freeze({
  EMPTY: 'Empty',
  WAITING: 'Waiting',
  BOOKED: 'Booked',
  HIDDEN: 'Hidden',
});

const SCHEDULE_TYPE = Object.freeze({
  ONLINE: 'Online',
  OFFLINE: 'Offline',
});

module.exports = {
  SCHEDULE_STATUS,
  SCHEDULE_TYPE,
};
