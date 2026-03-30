const cityService = require('./city.service');
const { asyncHandler } = require('../../common/helpers/controller');

const getCities = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const cities = await cityService.listCities({ limit: Number(limit) || 10 });
  return res.status(200).json({ cities });
});

const getCityDetail = asyncHandler(async (req, res) => {
  const city = await cityService.getCityDetail(Number(req.params.id));
  return res.status(200).json(city);
});

const createCity = asyncHandler(async (req, res) => {
  const { name, subtitle, thumbnail_id } = req.body;
  const city = await cityService.addCity({ name, subtitle, thumbnail_id });
  return res.status(201).json(city);
});

const updateCity = asyncHandler(async (req, res) => {
  const { name, subtitle, thumbnail_id } = req.body;
  const city = await cityService.editCity(Number(req.params.id), { name, subtitle, thumbnail_id });
  return res.status(200).json(city);
});

const deleteCity = asyncHandler(async (req, res) => {
  await cityService.removeCity(Number(req.params.id));
  return res.status(204).send();
});

module.exports = { getCities, getCityDetail, createCity, updateCity, deleteCity };
