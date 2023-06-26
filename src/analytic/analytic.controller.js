const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData, responseMessage, paginationFormat } = require('../utils/responseFormat');
const pick = require('../utils/pick');
const bookingService = require('../booking/booking.service');
const { Op } = require('sequelize');
const pageLimit2Offset = require('../utils/pageLimit2Offset');
const models = require('../models');
const i18next = require('i18next');
const analyticService = require('./analytic.service');
const moment = require('moment');
const scheduleService = require('../schedule/schedule.service');
const logger = require('../config/logger');

//--------------REVENUE----------------

const getRevenueByDate = catchAsync(async (req, res) => {
    const date = new Date();
    const startedDate = date.setHours(0,0,0,0);
    const endDate = date.setHours(23,59,59,59);
    const rs = await analyticService.getRevenueInRange(startedDate, endDate);
    return res.status(httpStatus.OK).json(responseData(rs));
    
});

const getRevenueByWeekDisplayDay = catchAsync(async (req, res) => {
    //"2023-05-12 00:00:00"
    const inputDate = moment();
    let startOfWeek = inputDate.clone().startOf('isoWeek');     
    let endOfWeek = inputDate.clone().endOf('isoWeek');
    const sumOfDayInWeek = await analyticService.getRevenueByWeekDisplayDay(startOfWeek, endOfWeek);
    return res.status(httpStatus.OK).json(responseData(sumOfDayInWeek));
    
});

const getRevenueByMonthDisplayDay = catchAsync(async (req, res) => {
    const inputDate = moment();
    let startOfMonth = inputDate.clone().startOf('month');     
    let endOfMonth = inputDate.clone().endOf('month');
    const sumOfDayInMonth = await analyticService.getRevenueByMonthDisplayDay(startOfMonth, endOfMonth);
    return res.status(httpStatus.OK).json(responseData(sumOfDayInMonth));
});

const getRevenueByMonthDisplayWeek = catchAsync(async (req, res) => {
    const inputDate = moment('2023-06-12');
    let startOfMonth = inputDate.clone().startOf('month');     
    let endOfMonth = inputDate.clone().endOf('month');
    const sumOfWeekInMonth = await analyticService.getRevenueByMonthDisplayWeek(startOfMonth, endOfMonth);
    return res.status(httpStatus.OK).json(responseData(sumOfWeekInMonth));
    
});

const getRevenueByYearDisplayMonth = catchAsync(async (req, res) => {
    const inputDate = moment('2023-06-12');
    let startDate = inputDate.clone().startOf('year');     
    let endDate = inputDate.clone().endOf('year');
    const sumOfMonthInYear = await analyticService.getRevenueByYearDisplayMonth(startDate, endDate);
    return res.status(httpStatus.OK).json(responseData(sumOfMonthInYear));
    
});

const getRevenueInRange = catchAsync(async (req, res) => {
    const date = moment();
    const startedDate = new Date("2023-05-12 00:00:00");
    const endDate = new Date("2023-06-20 00:00:00");
    //console.log(from_date, to_date);
    const rs = await analyticService.getRevenueInRange(startedDate, endDate);
    return res.status(httpStatus.OK).json(responseData(rs));
    
});

module.exports = {
    getRevenueByDate,
    getRevenueByWeekDisplayDay,
    getRevenueByMonthDisplayDay,
    getRevenueByMonthDisplayWeek, 
    getRevenueByYearDisplayMonth,
    getRevenueInRange,
}