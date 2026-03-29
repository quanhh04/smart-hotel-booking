const hotelModel = require('./hotel.model');
const { createError } = require('../../common/helpers/error');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('hotel.service');

const listHotels = async ({ keyword, minPrice, maxPrice, stars, sortBy, sortOrder, page, limit } = {}) => {
  log.info('listHotels: searching hotels', { keyword, minPrice, maxPrice, stars, page, limit });
  const result = await hotelModel.searchHotels({ keyword, minPrice, maxPrice, stars, sortBy, sortOrder, page, limit });
  log.info('listHotels: done', { total: result.total });
  return result;
};

const addHotel = async ({ name, address, description }) => {
  log.info('addHotel: creating hotel', { name });
  const hotel = await hotelModel.createHotel({ name, address, description });
  log.info('addHotel: done', { hotelId: hotel.id });
  return hotel;
};

const getHotelDetail = async (hotelId) => {
  log.info('getHotelDetail: fetching', { hotelId });
  const hotel = await hotelModel.getHotelDetailById(hotelId);
  log.info('getHotelDetail: done', { hotelId, found: !!hotel });
  return hotel;
};

const updateHotel = async (hotelId, data) => {
  log.info('updateHotel: checking hotel exists', { hotelId });
  const hotel = await hotelModel.getHotelDetailById(hotelId);
  if (!hotel) {
    throw createError('Không tìm thấy khách sạn', 404);
  }
  log.info('updateHotel: updating hotel', { hotelId });
  const updated = await hotelModel.updateHotel(hotelId, data);
  log.info('updateHotel: done', { hotelId });
  return updated;
};

const removeHotel = async (hotelId) => {
  log.info('removeHotel: checking hotel exists', { hotelId });
  const hotel = await hotelModel.getHotelDetailById(hotelId);
  if (!hotel) {
    throw createError('Không tìm thấy khách sạn', 404);
  }
  log.info('removeHotel: checking active bookings', { hotelId });
  const hasActive = await hotelModel.hasActiveBookings(hotelId);
  if (hasActive) {
    throw createError('Không thể xóa khách sạn có booking đang hoạt động', 409);
  }
  log.info('removeHotel: deleting hotel', { hotelId });
  await hotelModel.deleteHotel(hotelId);
  log.info('removeHotel: done', { hotelId });
};

const addImage = async (hotelId, url) => {
  log.info('addImage: checking hotel exists', { hotelId });
  const hotel = await hotelModel.getHotelDetailById(hotelId);
  if (!hotel) {
    throw createError('Không tìm thấy khách sạn', 404);
  }
  log.info('addImage: adding image', { hotelId });
  const result = await hotelModel.addHotelImage(hotelId, url);
  log.info('addImage: done', { hotelId });
  return result;
};

const removeImage = async (hotelId, imageId) => {
  log.info('removeImage: checking hotel exists', { hotelId });
  const hotel = await hotelModel.getHotelDetailById(hotelId);
  if (!hotel) {
    throw createError('Không tìm thấy khách sạn', 404);
  }
  log.info('removeImage: removing image', { hotelId, imageId });
  const result = await hotelModel.deleteHotelImage(hotelId, imageId);
  log.info('removeImage: done', { hotelId, imageId });
  return result;
};

const getHotelRooms = async (hotelId, page, limit) => {
  log.info('getHotelRooms: checking hotel exists', { hotelId });
  const hotel = await hotelModel.getHotelById(hotelId);
  if (!hotel) {
    throw createError('Không tìm thấy khách sạn', 404);
  }
  log.info('getHotelRooms: fetching rooms', { hotelId, page, limit });
  const result = await hotelModel.getRoomsByHotelId({ hotelId, page, limit });
  log.info('getHotelRooms: done', { hotelId, total: result.total });
  return result;
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
