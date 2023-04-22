const config = require('../config');
const https = require('https');

const data = (Phone) => {
  const postData = JSON.stringify({
    ApiKey: `${config.sms.apiKey}`,
    Content: 'Noi dung sms',
    Phone: `${Phone}`,
    SecretKey: `${config.sms.secretKey}`,
    SmsType: '8',
    SandBox: 0,
  });
  return postData;
};

// const dt = data('0933021021');
// console.log(dt);

const sendSMS = (Phone) => {
  const url = 'rest.esms.vn';
  const options = {
    host: url,
    port: 443,
    path: '/MainService.svc/json/SendMultipleMessage_V4_post_json/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = https.request(options, function (res) {
    res.setEncoding('utf8');
    let body = '';
    res.on('data', function (d) {
      body += d;
    });
    res.on('end', function () {
      let json = JSON.parse(body);
      console.log('Result: ', json);
      // if (json.status == 'success') {
      //     console.log("Send sms success.")
      // }
      // else {
      //     console.log("Send sms failed: " + body);
      // }
    });
  });

  req.on('error', function (e) {
    console.log('Send sms failed: ' + e);
  });
  const dt = data(Phone);
  req.write(dt);
  req.end();
};

module.exports = sendSMS;
