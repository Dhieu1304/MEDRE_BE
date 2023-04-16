const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseMessage } = require('../utils/responseFormat');
const { vn_pay } = require('../config');
const querystring = require('qs');
const crypto = require('crypto');
const moment = require('moment');
const logger = require('../config/logger');
const paymentService = require('./payment.service');

const sortObject = (obj) => {
  const sorted = {};
  const str = [];
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (let key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
};

const createPaymentUrl = catchAsync(async (req, res) => {
  const ipAddr = req.ipAddr;
  const { booking_id, language: locale, bankCode } = req.body;

  const date = new Date();
  const orderId = moment(date).format('DDHHmmss');
  const createDate = moment(date).format('YYYYMMDDHHmmss');

  // create booking payment
  await paymentService.checkBookingPayment(booking_id, req.user.id, orderId);

  const amount = '199000';

  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = vn_pay.tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan hoa don dat lich kham benh. So tien 199,000 VND';
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = vn_pay.returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', vn_pay.hashSecret);
  vnp_Params['vnp_SecureHash'] = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  console.log(vnp_Params);

  let vnpUrl = vn_pay.url;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
  logger.info(vnpUrl);

  res.redirect(vnpUrl);
});

const returnData = catchAsync(async (req, res) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);
  const signData = querystring.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', vn_pay.hashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash === signed) {
    await paymentService.handlePaymentSuccess(vnp_Params['vnp_TxnRef']);
    return res.status(httpStatus.OK).json(responseMessage('Payment successfully'));
  }
  return res.status(httpStatus.BAD_REQUEST).json(responseMessage('Invalid payment data'));
});

module.exports = {
  createPaymentUrl,
  returnData,
};
