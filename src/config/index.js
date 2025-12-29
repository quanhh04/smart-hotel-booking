const dotenv = require('dotenv');

const loadEnvironment = () => {
  dotenv.config();
};

module.exports = {
  loadEnvironment,
};
