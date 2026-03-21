const pool = require('../../config/db');
const inventoryModel = require('./inventory.model');

const updateRoomTypeQuantity = async ({ roomTypeId, totalQuantity }) => {
  if (totalQuantity === undefined || totalQuantity === null) {
    const error = new Error('total_quantity là bắt buộc');
    error.status = 400;
    throw error;
  }

  if (typeof totalQuantity !== 'number' || !Number.isInteger(totalQuantity)) {
    const error = new Error('total_quantity không được âm');
    error.status = 400;
    throw error;
  }

  return inventoryModel.updateTotalQuantity({ roomTypeId, totalQuantity });
};

const getHotelInventory = async ({ hotelId, checkIn, checkOut }) => {
  const hotelResult = await pool.query(
    'SELECT id FROM hotel.hotels WHERE id = $1',
    [hotelId],
  );

  if (hotelResult.rows.length === 0) {
    const error = new Error('Khách sạn không tồn tại');
    error.status = 404;
    throw error;
  }

  return inventoryModel.getInventoryByHotelId({ hotelId, checkIn, checkOut });
};

module.exports = {
  updateRoomTypeQuantity,
  getHotelInventory,
};
