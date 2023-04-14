const firebaseAdmin = require('../config/firebaseAdmin');
const logger = require('../config/logger');
const config = require('../config');

const uploadFile = (file, subDir) => {
  return new Promise((resolve, reject) => {
    const name = file.fieldname + '-' + Date.now() + '-' + file.originalname.trim().toLowerCase().replaceAll(' ', '-');
    const blob = firebaseAdmin.bucket.file(`${subDir}/${name}`);
    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    blobWriter.on('error', (err) => {
      logger.error(err.message);
      reject(err.message);
    });
    blobWriter.on('finish', async () => {
      await blob.makePublic();
      resolve(
        `https://firebasestorage.googleapis.com/v0/b/${config.firebaseAdmin.storageBucket}/o/${subDir}%2F${name}?alt=media`
      );
    });
    blobWriter.end(file.buffer);
  });
};

module.exports = {
  uploadFile,
};
