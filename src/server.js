const { loadEnvironment } = require('./config');
loadEnvironment();

require('./config/db');

const app = require('./app');
const { sendCheckInReminders } = require('./modules/notification/notification.service');
const createLogger = require('./common/helpers/logger');
const log = createLogger('server');

const PORT = process.env.PORT || 3000;

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

app.listen(PORT, () => {
  log.info(`Server listening on port ${PORT}`);

  sendCheckInReminders().then((count) => {
    if (count > 0) log.info(`Sent ${count} check-in reminder(s)`);
  });

  setInterval(() => {
    sendCheckInReminders().then((count) => {
      if (count > 0) log.info(`Sent ${count} check-in reminder(s)`);
    });
  }, TWENTY_FOUR_HOURS);
});
