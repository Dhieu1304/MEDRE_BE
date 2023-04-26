const config = require('../config');
const https = require('https');

const sendPushNotification = (data, callback) => {
    const headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic " + config.one_signal.api_key,
    };
    const options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };

    const req = https.request(options, function(res) {
        res.on("data", function(data) {
            console.log(JSON.parse(data));
           return callback(null, JSON.parse(data)); 
        });
    });

    req.on("error", function(e) {
        return callback({message: e});
    });

    req.write(JSON.stringify(data));
    req.end();
}

module.exports = {
    sendPushNotification,
}