const hotelModel = require('./hotel.model');
const { createError } = require('../../common/helpers/error');

const listHotels = async ({ keyword, minPrice, maxPrice, stars, sortBy, sortOrder, page, limit } = {}) =>
  hotelModel.searchHotels({ keyword, minPrice, maxPrice, stars, sortBy, sortOrder, page, limit });

const addHotel = async ({ name, address, description }) =>
  hotelModel.createHotel({ name, address, description });

const getHotelDetail = async (hotelId) => {
  return hotelModel.getHotelDetailById(hotelId);
}

const updateHotel = async (hotelId, data) => {
  const hotel = await hotelModel.getHotelDetailById(hotelId);
  if (!hotel) {
    throw createError('Không tìm thấy khách sạn', 404);
  }
  return hotelModel.updateHotel(hotelId, data);
};

const removeHotel = async (hotelId) => {
  const hotel = await hotelModel.getHotelDetailById(hotelId);
  if (!hotel) {
    throw createError('Không tìm thấy khách sạn', 404);
  }
  const hasActive = await hotelModel.hasActiveBookings(hotelId);
  if (hasActive) {
    throw createError('Không thể xóa khách sạn có booking đang hoạt động', 409);
  }
  await hotelModel.deleteHotel(hotelId);
};

const addImage = async (hotelId, url) => {
  const hotel = await hotelModel.getHotelDetailById(hotelId);
  if (!hotel) {
    throw createError('Không tìm thấy khách sạn', 404);
  }
  return hotelModel.addHotelImage(hotelId, url);
};

const removeImage = async (hotelId, imageId) => {
  const hotel = await hotelModel.getHotelDetailById(hotelId);
  if (!hotel) {
    throw createError('Không tìm thấy khách sạn', 404);
  }
  return hotelModel.deleteHotelImage(hotelId, imageId);
};

const getHotelRooms = async (hotelId, page, limit) => {
  const hotel = await hotelModel.getHotelById(hotelId);
  if (!hotel) {
    throw createError('Không tìm thấy khách sạn', 404);
  }
  return hotelModel.getRoomsByHotelId({ hotelId, page, limit });
};

module.exports = {
  listHotels,
  addHotel,
  getHotelDetail,
  updateHotel,
  removeHotel,
  addImage,
  removeImage,
  getHotelRooms,
};
