const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    skipSuccessfulRequests: true,
});

const rateLimiter = (second, max) => {
    return rateLimit({
        windowMs: second * 1000,
        max,
        skipSuccessfulRequests: false,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Please wait few second...',
    });
};

module.exports = {
    authLimiter,
    rateLimiter,
};
