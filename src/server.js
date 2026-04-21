require('dotenv').config();

require('./config/db');

const app = require('./app');
const createLogger = require('./common/helpers/logger');
const log = createLogger('server');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  log.info(`Server listening on port ${PORT}`);
});
