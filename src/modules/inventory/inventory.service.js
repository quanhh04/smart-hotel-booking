const pool = require('../../config/db');
const inventoryModel = require('./inventory.model');
const { createError } = require('../../common/helpers/error');
const createLogger = require('../../common/helpers/logger');
const log = createLogger('inventory.service');

const updateRoomTypeQuantity = async ({ roomTypeId, totalQuantity }) => {
  log.info('updateRoomTypeQuantity: updating', { roomTypeId, totalQuantity });
  const result = await inventoryModel.updateTotalQuantity({ roomTypeId, totalQuantity });
  log.info('updateRoomTypeQuantity: done', { roomTypeId });
  return result;
};

const getHotelInventory = async ({ hotelId, checkIn, checkOut }) => {
  log.info('getHotelInventory: checking hotel exists', { hotelId });
  const hotelResult = await pool.query(
    'SELECT id FROM hotel.hotels WHERE id = $1',
    [hotelId],
  );

  if (hotelResult.rows.length === 0) {
    throw createError('Khách sạn không tồn tại', 404);
  }

  log.info('getHotelInventory: fetching inventory', { hotelId, checkIn, checkOut });
  const result = await inventoryModel.getInventoryByHotelId({ hotelId, checkIn, checkOut });
  log.info('getHotelInventory: done', { hotelId, roomTypes: result.length });
  return result;
};

module.exports = { updateRoomTypeQuantity, getHotelInventory };
