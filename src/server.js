const { loadEnvironment } = require('./config');
loadEnvironment();

require('./config/db');

const app = require('./app');
const { sendCheckInReminders } = require('./modules/notification/notification.service');

const PORT = process.env.PORT || 3000;

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);

  // Run check-in reminders once on startup, then every 24 hours
  sendCheckInReminders().then((count) => {
    if (count > 0) console.log(`Sent ${count} check-in reminder(s)`);
  });

  setInterval(() => {
    sendCheckInReminders().then((count) => {
      if (count > 0) console.log(`Sent ${count} check-in reminder(s)`);
    });
  }, TWENTY_FOUR_HOURS);
});
