const moment = require('moment/moment');

const regexpRepeatOnFromTo = (from, to) => {
  const range = moment(to).diff(moment(from), 'days');
  if (range < 0) {
    return { status: false, data: 'Invalid date from to' };
  } else if (range < 6) {
    let repeat_on = [];
    for (let i = from; i <= to; i = moment(i).add(1, 'days')) {
      repeat_on.push(moment(i).day());
    }

    // sort repeat_on
    repeat_on = repeat_on.sort((a, b) => {
      return a - b;
    });

    // convert regexp string
    let regexp = '[';
    repeat_on.map((item) => {
      regexp += item + '|';
    });
    regexp = regexp.slice(0, -1) + ']';
    return { status: true, data: regexp };
  }
  return { status: true, data: null };
};

module.exports = regexpRepeatOnFromTo;
module.exports = { regexpRepeatOnFromTo };
