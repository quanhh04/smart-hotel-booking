const nearbyServiceModel = require('./nearby-service.model');
const { createError } = require('../../common/helpers/error');
const hotelModel = require('./hotel.model');

const getNearbyServices = async (hotelId, { category, limit }) => {
  const hotel = await hotelModel.getHotelById(hotelId);
  if (!hotel) throw createError('Không tìm thấy khách sạn', 404);

  const services = await nearbyServiceModel.getNearbyServices({ hotelId, category, limit });
  const categories = await nearbyServiceModel.getCategories(hotelId);

  return { services, categories };
};

// ─── Admin CRUD ─────────────────────────────────────────────────────────────

const adminGetAll = async ({ hotelId, category, page, limit }) => {
  return nearbyServiceModel.getAllNearbyServices({ hotelId, category, page, limit });
};

const adminCreate = async (data) => {
  const hotel = await hotelModel.getHotelById(data.hotel_id);
  if (!hotel) throw createError('Không tìm thấy khách sạn', 404);
  return nearbyServiceModel.createNearbyService(data);
};

const adminUpdate = async (id, data) => {
  const existing = await nearbyServiceModel.getById(id);
  if (!existing) throw createError('Không tìm thấy dịch vụ', 404);

  if (data.hotel_id && data.hotel_id !== existing.hotel_id) {
    const hotel = await hotelModel.getHotelById(data.hotel_id);
    if (!hotel) throw createError('Không tìm thấy khách sạn', 404);
  }

  return nearbyServiceModel.updateNearbyService(id, data);
};

const adminDelete = async (id) => {
  const existing = await nearbyServiceModel.getById(id);
  if (!existing) throw createError('Không tìm thấy dịch vụ', 404);
  return nearbyServiceModel.deleteNearbyService(id);
};

module.exports = { getNearbyServices, adminGetAll, adminCreate, adminUpdate, adminDelete };
