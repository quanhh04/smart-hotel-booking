const cityModel = require('./city.model');
const { createError } = require('../../common/helpers/error');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('city.service');

const listCities = async (opts) => {
  return cityModel.getCities(opts);
};

const getCityDetail = async (id) => {
  const city = await cityModel.getCityById(id);
  if (!city) throw createError('Không tìm thấy thành phố', 404);
  return city;
};

const addCity = async (data) => {
  log.info('addCity', { name: data.name });
  return cityModel.createCity(data);
};

const editCity = async (id, data) => {
  const city = await cityModel.getCityById(id);
  if (!city) throw createError('Không tìm thấy thành phố', 404);
  return cityModel.updateCity(id, data);
};

const removeCity = async (id) => {
  const city = await cityModel.getCityById(id);
  if (!city) throw createError('Không tìm thấy thành phố', 404);
  await cityModel.deleteCity(id);
};

module.exports = { listCities, getCityDetail, addCity, editCity, removeCity };
