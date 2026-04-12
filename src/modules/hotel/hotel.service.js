const hotelModel = require('./hotel.model');
const { createError } = require('../../common/helpers/error');

const listHotels = async (filters) => {
  return hotelModel.searchHotels(filters);
};

const addHotel = async ({ name, address, description }) => {
  return hotelModel.createHotel({ name, address, description });
};

const getHotelDetail = async (hotelId) => {
  return hotelModel.getHotelDetailById(hotelId);
};

const updateHotel = async (hotelId, data) => {
  const hotel = await hotelModel.getHotelDetailById(hotelId);
  if (!hotel) throw createError('Không tìm thấy khách sạn', 404);
  return hotelModel.updateHotel(hotelId, data);
};

const removeHotel = async (hotelId) => {
  const hotel = await hotelModel.getHotelDetailById(hotelId);
  if (!hotel) throw createError('Không tìm thấy khách sạn', 404);

  const hasActive = await hotelModel.hasActiveBookings(hotelId);
  if (hasActive) throw createError('Không thể xóa khách sạn có booking đang hoạt động', 409);

  await hotelModel.deleteHotel(hotelId);
};

const getHotelRooms = async (hotelId, page, limit) => {
  const hotel = await hotelModel.getHotelById(hotelId);
  if (!hotel) throw createError('Không tìm thấy khách sạn', 404);
  return hotelModel.getRoomsByHotelId({ hotelId, page, limit });
};

module.exports = { listHotels, addHotel, getHotelDetail, updateHotel, removeHotel, getHotelRooms };
