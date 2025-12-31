const fs = require('fs');
const path = require('path');

const loadEnvironment = () => {
  const dotenvPath = path.join(process.cwd(), 'node_modules', 'dotenv');

  if (fs.existsSync(dotenvPath)) {
    const dotenv = require('dotenv');
    dotenv.config();
  }
};

module.exports = {
  loadEnvironment,
};
