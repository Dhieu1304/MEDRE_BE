const models = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { Op } = require('sequelize');
const i18next = require('i18next');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const userService = require('../user/user.service');
const bookingService = require('../booking/booking.service');
const staffService = require('../staff/staff.service');
const expertiseService = require('../expertise/expertise.service');
const scheduleService = require('../schedule/schedule.service');
const { BOOKING_STATUS } = require('../booking/booking.constant');
const { SCHEDULE_TYPE } = require('../schedule/schedule.constant');
const { stack } = require('./analytic.route');

//--------------REVENUE----------------

const getRevenueByWeekDisplayDay = async(from_date, to_date) => {
    let startDate = from_date;
    let sumOfDayInWeek = []; //start Monday, end Sunday
    for (let i = 0; i < 7; i++) {
        let date = from_date.date() + 1;
        startDate.set('date', date);
        startDate.set({
            'hour': 0,
            'minute': 0,
            'second': 0
        });
        endDate = startDate.clone();
        endDate.set({
            'hour': 23,
            'minute': 59,
            'second': 59
        });
        let sum = await getRevenueInRange(startDate, endDate);
        sumOfDayInWeek.push(sum);
    }
    return sumOfDayInWeek;
};

// const getDaysOfEachWeekInMonth = async(from_date, to_date) => {
//     let daysOfEachWeek = [];
//     let count = to_date.date();
//     let startDate;
//     let start = end = 0;
//     while ((end <= count)) {
//         let number = from_date.date() + end;
//         startDate.date(number);
//         endDate = startDate.clone().endOf('isoWeek');
//         start = startDate.isoWeekday();
//         end = endDate.date();
//         //console.log(end);
//         daysOfEachWeek.push(end - start + 1);
//     }
        
//     //console.log(daysOfEachWeek);
//     return daysOfEachWeek;
// }

// const getRevenueByMonthDisplayWeek = async(from_date, to_date) => {
//     // let startDate = from_date;

//     let sumOfWeekInMonth = getDaysOfEachWeekInMonth(from_date, to_date);
//     // for (let i = start; i <= start+7; i++) {
//     //     let date = from_date.date() + 1;
//     //     startDate.set('date', date);
//     //     startDate.set({
//     //         'hour': 0,
//     //         'minute': 0,
//     //         'second': 0
//     //     });
//     //     endDate = startDate.clone();
//     //     endDate.set({
//     //         'hour': 23,
//     //         'minute': 59,
//     //         'second': 59
//     //     });
//     //     let sum = await getRevenueInRange(startDate, endDate);
//     //     sumOfWeekInMonth.push(sum);
//     // }
//     return sumOfWeekInMonth;
// };

const getRevenueByMonthDisplayDay = async(from_date, to_date) => {
    let startDate = from_date;
    start = from_date.date();
    end = to_date.date();
    let date = from_date.date();
    let sumOfDayInMonth = []; //start Monday, end Sunday
    for (let i = start; i <= end; i++) {
        startDate.set('date', date);
        startDate.set({
            'hour': 0,
            'minute': 0,
            'second': 0
        });
        endDate = startDate.clone();
        endDate.set({
            'hour': 23,
            'minute': 59,
            'second': 59
        });
        let sum = await getRevenueInRange(startDate, endDate);
        date += 1;
        sumOfDayInMonth.push(sum);
    }
    return sumOfDayInMonth;
};

const getRevenueByYearDisplayMonth = async(from_date, to_date) => {
    let startDate = from_date;
    let endDate = to_date;
    let month = startDate.month();
    let sumOfMonthInYear = [];
    for (let i = from_date.month(); i <= to_date.month(); i++) {
        let start = end = startDate.clone();
        start.month(month);
        end.month(month);
        start = start.clone().startOf('month');
        end = end.clone().endOf('month');
        start.set({
            'hour': 0,
            'minute': 0,
            'second': 0
        });
        end.set({
            'hour': 23,
            'minute': 59,
            'second': 59
        });
        let sum = await getRevenueInRange(start, end);
        sumOfMonthInYear.push(sum);
        month++;
    }
    return sumOfMonthInYear;
};

const getRevenueInRange = async(from_date, to_date) => {
    let filter = Object.assign({ date: { [Op.between]: [from_date, to_date] } });
    const listBooking = await models.booking.findAll({
        where: {
          date: filter.date,
          booking_status: { [Op.ne]: BOOKING_STATUS.CANCELED },
        },
    });
    let expertises = [];
    for (let i = 0; i < listBooking.length; i++)
    {
        let schedule = await scheduleService.findOneByFilter({id: listBooking[i].id_schedule});
        let detail_expertise = await expertiseService.findOneByFilter({id : schedule.id_expertise});
        let expertise = {
            price_offline: detail_expertise.price_offline,
            price_online: detail_expertise.price_online,
            type: schedule.type,
        }
        expertises.push(expertise);
    }
    let sum = 0;
    for (let i = 0; i < expertises.length; i++)
    {
        if(expertises[i].type === SCHEDULE_TYPE.OFFLINE)
        {
            sum += expertises[i].price_offline;
        }
        else {
            sum += expertises[i].price_online;
        }
    }
    return sum;
};

module.exports = {
    getRevenueInRange,
    getRevenueByWeekDisplayDay,
    getRevenueByMonthDisplayDay,
    //getRevenueByMonthDisplayWeek,
    getRevenueByYearDisplayMonth,
    //getDaysOfEachWeekInMonth,
}