const nearbyServiceService = require('./nearby-service.service');
const { asyncHandler } = require('../../common/helpers/controller');

const getNearbyServices = asyncHandler(async (req, res) => {
  const hotelId = Number(req.params.id);
  const { category, limit } = req.query;

  const result = await nearbyServiceService.getNearbyServices(hotelId, { category, limit });
  return res.status(200).json(result);
});

const adminGetAll = asyncHandler(async (req, res) => {
  const { hotel_id, category, page, limit } = req.query;
  const result = await nearbyServiceService.adminGetAll({ hotelId: hotel_id, category, page, limit });
  return res.status(200).json(result);
});

const adminCreate = asyncHandler(async (req, res) => {
  const service = await nearbyServiceService.adminCreate(req.body);
  return res.status(201).json(service);
});

const adminUpdate = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const service = await nearbyServiceService.adminUpdate(id, req.body);
  return res.status(200).json(service);
});

const adminDelete = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await nearbyServiceService.adminDelete(id);
  return res.status(204).send();
});

module.exports = { getNearbyServices, adminGetAll, adminCreate, adminUpdate, adminDelete };
