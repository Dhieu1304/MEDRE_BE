const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { responseData } = require('../utils/responseFormat');
const { vn_pay } = require('../config');
const querystring = require('qs');
const crypto = require('crypto');
const moment = require('moment');
const paymentService = require('./payment.service');
const i18next = require('i18next');
const statusPage = require('../view/statusPage');

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
  const { id_booking, language: locale, bankCode } = req.body;

  const date = new Date();
  const orderId = moment(date).format('DDHHmmss');
  const createDate = moment(date).format('YYYYMMDDHHmmss');

  // create booking payment
  await paymentService.checkBookingPayment(id_booking, req.user.id, orderId);

  const amount = await paymentService.getPriceBooking(id_booking);

  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = vn_pay.tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = `Thanh toan hoa don dat lich kham benh. So tien ${amount.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'VND',
  })}`;
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

  let vnpUrl = vn_pay.url;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

  return res.status(httpStatus.OK).json(responseData(vnpUrl));
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
    const { vnp_TxnRef: txn_ref, vnp_ResponseCode: rsp_code } = vnp_Params;
    if (rsp_code === '00') {
      await paymentService.handlePaymentSuccess(txn_ref);
      // return res.status(httpStatus.OK).json(responseMessage(i18next.t('payment.paymentSuccess')));
      return res.send(statusPage(i18next.t('payment.successTitle'), i18next.t('payment.successMsg')));
    } else {
      await paymentService.handlePaymentFail(txn_ref, rsp_code);
      // return res.status(httpStatus.OK).json(responseMessage(i18next.t(`payment.paymentFail.${rsp_code}`)));
      return res.send(statusPage(i18next.t('payment.failureTitle'), i18next.t('payment.failureMsg'), false));
    }
  }
  // return res.status(httpStatus.BAD_REQUEST).json(responseMessage(i18next.t('payment.invalidSignature'), false));
  return res.send(statusPage(i18next.t('payment.failureTitle'), i18next.t('payment.failureMsg'), false));
});

const cashPayment = catchAsync(async (req, res) => {
  const updateBooking = await paymentService.cashPayment(req.body.id_booking, req.user);
  return res.status(httpStatus.OK).json(responseData(updateBooking));
});

module.exports = {
  createPaymentUrl,
  returnData,
  cashPayment,
};
