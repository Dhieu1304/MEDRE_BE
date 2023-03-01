const logger = require('../config/logger');
const config = require('../config');
const db = require('../config/database');

(async () => {
  try {
    if (config.postgresql.db_sync === 1) {
      console.log('------------------------- SYNC DATABASE -------------------------');

      await db.sync({ force: true });

      console.log('----------------------- END SYNC DATABASE -----------------------');
    }
  } catch (e) {
    logger.error(e.message);
  }
})();
