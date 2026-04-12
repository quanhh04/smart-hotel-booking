const pool = require('../../config/db');
const inventoryModel = require('./inventory.model');
const { createError } = require('../../common/helpers/error');

const updateRoomTypeQuantity = async ({ roomTypeId, totalQuantity }) => {
  return inventoryModel.updateTotalQuantity({ roomTypeId, totalQuantity });
};

const getHotelInventory = async ({ hotelId, checkIn, checkOut }) => {
  const hotelResult = await pool.query('SELECT id FROM hotel.hotels WHERE id = $1', [hotelId]);
  if (hotelResult.rows.length === 0) throw createError('Khách sạn không tồn tại', 404);
  return inventoryModel.getInventoryByHotelId({ hotelId, checkIn, checkOut });
};

module.exports = { updateRoomTypeQuantity, getHotelInventory };
