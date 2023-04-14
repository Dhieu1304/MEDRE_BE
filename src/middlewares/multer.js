const multer = require('multer');

const options = {
  storage: multer.memoryStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname.trim().toLowerCase().replaceAll(' ', '-'));
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
};

module.exports = multer(options);
