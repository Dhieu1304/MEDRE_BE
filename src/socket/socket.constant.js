const SOCKET_EVENT = Object.freeze({
  JOIN_ROOM: 'JoinRoom',
  SUCCESS: 'Success',
  ERROR: 'Error',
});

const NOTIFICATION_EVENT = Object.freeze({
  NOTIFICATION: 'Notification',
});

module.exports = {
  SOCKET_EVENT,
  NOTIFICATION_EVENT,
};
